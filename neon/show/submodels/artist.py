import re
import requests
import datetime

from os import path

from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext as _

from django.conf import settings

from extra import *
from app.util.color_log import *

from util import SpotifyArtistParser, EchonestArtistParser


class Artist(models.Model):
	def __unicode__ (self):
		return self.name

	name = models.CharField(_("name"), max_length=128)
	
	#pull meta data
	pulled = models.BooleanField(default=False)
	queued = models.BooleanField(default=False)
	pulled_date = models.DateTimeField(default=datetime.date(1999, 12, 5))
	pulled_spotify = models.BooleanField(default=False)
	pulled_echonest =  models.BooleanField(default=False)

	# if we have id's we can update by id
	echonest_id = models.CharField(_("echonest_id"), max_length=255,blank=True)
	spotify_id = models.CharField(_("spotify_id"), max_length=255,blank=True)

	#extra links?
	twitter_url =  models.CharField(max_length=255,blank=True)
	facebook_url =  models.CharField(max_length=255,blank=True)

	#pulled data
	bios = models.ManyToManyField(Biography, related_name='artist',blank=True)
	articles = models.ManyToManyField(Article, related_name='artist',blank=True)
	popularity = models.PositiveSmallIntegerField(default=0, blank=True)
	
	genres = models.ManyToManyField(Genre, related_name='artist', blank=True)
	tracks = models.ManyToManyField(Track, related_name='artist', blank=True)
	images = models.ManyToManyField(Image, related_name='artist', blank=True)

	spotify_link = models.CharField(max_length=255,blank=True)


	def download_images(self):
		images = self.images.all()

		for img in images:
			if not img.downloaded:
				img.name = self.name
				img.save()
				img.download()

		self.queued = False
		self.save()
		

	#search echonest for artist.
	def pull_echonest(self):
		payload = {
			'api_key': settings.ECHONEST_KEY, 
			'format': 'json', 
			'results': 1, 
			'name': re.sub(' +',' ',self.name)
		}

		r = requests.get(path.join(settings.ECHONEST_API, 'artist/search'), params=payload)
		data = r.json()

		if data['response'] and data['response']['status']['code'] != 0 or len(data['response']['artists']) == 0 :
			return

		self.echonest_id = data['response']['artists'][0]['id']
		self.save()

		self.update_echonest()



	#already have id, update artist with already existing id.
	def update_echonest(self):
		prGreen("UPDATE ECHONEST " + self.name)

		if self.echonest_id == None or self.echonest_id == "":
			prRed('Cant update Artist with no echonest id: ' + self.name) 
			return


		#artist data
		payload = {
			'api_key': settings.ECHONEST_KEY, 
			'format': 'json', 
			'id': self.echonest_id,
			'bucket': [
				'id:spotify', 'biographies', 'hotttnesss', 
				'images', 'blogs', 'news', 'songs', 'genre'
			]
		}		

		r = requests.get(path.join(settings.ECHONEST_API, 'artist/profile/'), params=payload)
		
		prLightPurple(r.url)

		data = r.json();

		#artist track data
		payload_tracks = {
			'api_key': settings.ECHONEST_KEY, 
			'format': 'json', 
			'artist': self.name,
			'bucket' : [ 
				'id:spotify','tracks'
			],
			'limit': 'true'
		}

		r_tracks = requests.get(path.join(settings.ECHONEST_API, 'song/search'), params=payload_tracks)

		prPurple(r_tracks.url)

		data_tracks = r_tracks.json();

		if not 'response' in data and not 'response' in data_tracks:
			return False

		#combine tracks response data with artist response data
		if 'response' in data and 'response' in data_tracks and 'songs' in data_tracks['response']:
			data['response']['songs'] = []
			for song in data_tracks['response']['songs']:
				if len(song['tracks']):
					song['tracks'][0]['name'] = song['title']
					data['response']['songs'].append(song['tracks'][0])
		elif 'response' in data_tracks and 'songs' in data_tracks['response']:
			data['response'] = {'songs':[]}
			if len(song['tracks']):
				song['tracks'][0]['name'] = song['title']
				data['response']['songs'].append(song['tracks'][0])
		
		artist = None

		if 'artist' in data['response']:
			artist = data['response']['artist']
		else:
			prRed("ARTIST NOT FOUND :( " + self.name)


		#spotify id
		if artist != None:
			if self.spotify_id == None or self.spotify_id == "":
				if 'foreign_ids' in artist:
					for source in artist['foreign_ids']:
						if source['catalog'] == 'spotify':
							r_match = re.match('spotify:artist:(.+)',source['foreign_id'])
							if r_match != None:
								self.spotify_id = r_match.group(1)
				
		EchonestArtistParser(self,data)
		self.pulled_echonest = True

		prGreen('saving echonest: '+self.name)
		self.save()


	#already have spotify id update artist with already existing id
	def update_spotify(self):
		#we dont have the id?
		if self.spotify_id == None or self.spotify_id == "":
		 	prRed('Cant update Artist with no spotify id: ' + self.name) 
			return
		
		#pull
		r = requests.get(path.join(settings.SPOTIFY_API, 'artists', self.spotify_id))
		prCyan(r.url)
		data = r.json();

		if data != None and 'id' in data:
			SpotifyArtistParser(self,data)
			self.pulled_spotify = True
			prGreen('saving spotify: '+self.name)
			self.save()


	def pull_all(self):
		#reset meta
		self.queued=True
		self.pulled_spotify=False
		self.pulled_echonest=False
		self.save()

		#search/update endpoints
		self.pull_echonest()
		if self.spotify_id != None:
			self.update_spotify()

		#done
		self.pulled = True
		self.pulled_date = timezone.now()
		self.queued = False
		self.save()
		prGreen('SAVE')


	def update_all(self):
		#reset meta
		self.queued=True
		self.pulled_spotify=False
		self.pulled_echonest=False
		self.save()

		#update endpoints
		self.update_echonest()
		self.update_spotify()
		
		#done
		self.pulled = True
		self.pulled_date = timezone.now()
		self.queued = False
		self.save()