import re
import requests

from os import path

from django.db import models
from django.utils import timezone

from django.conf import settings

from artist import Artist
from venue.models import Venue

from app.util.color_log import *



class Show(models.Model):
	def __unicode__ (self):
		return self.headliners
		
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	## Textual informatio about show including artists and sponsors
	title = models.CharField(max_length=100, blank=True)
	headliners = models.CharField(max_length=300, blank=False)
	openers = models.CharField(max_length=400, blank=True)

	## Artists playing in show
	artists = models.ManyToManyField(Artist, related_name='shows_artists', blank=True)
	
	date = models.DateTimeField(blank=False)
	venue = models.ForeignKey(Venue, related_name='shows')

	## Is show featured?
	featured = models.BooleanField(default=False)

	## Image banner to use at top of list page and in list item (rec: 1200px x 640px)
	banner = models.ImageField(upload_to='showgrid/banners/', default='', blank=True)
	review = models.FileField(upload_to='showgrid/reviews/', default='', blank=True)
	
	website = models.URLField(blank=True)

	ticket = models.URLField(blank=True)
	price = models.SmallIntegerField(default=-1, blank=True)

	cancelled = models.BooleanField(default=False)
	soldout = models.BooleanField(default=False)
	onsale = models.DateTimeField(auto_now=True, blank=True)

	#issue = models.ForeignKey('Issue', null=True, blank=True)

	#extract metadata
	extract_queued = models.BooleanField(default=False)
	

	def extract_artists_from_name(self, update):
		self.extract_queued = True
		self.save()

		artists = []

		## Artist request
		payload = {
			'api_key': settings.ECHONEST_KEY, 
			'format': 'json', 
			'results': 10, 
			'text': re.sub(' +', ' ', self.headliners) + ' +' + re.sub(' +',' ',self.openers)
		}

		r = requests.get(path.join(settings.ECHONEST_API, 'artist/extract'), params=payload)
		artist_data = r.json()

	
		if 'response' in artist_data and 'status' in artist_data['response'] and artist_data['response']['status']['code'] != 0:
			prRed(artist_data)


		#extract headliners
		if 'response' in artist_data and 'artists' in artist_data['response']:
			for artist in artist_data['response']['artists']:

				#if we already have an artist like that.
				try:
					self.artists.get(echonest_id=artist['id'])
				except:
					#is the artist in the database?
					try:
						found_artist = Artist.objects.get(echonest_id=artist['id'])
						self.artists.add(found_artist)

					#create new artist and sync later
					except:
						new_artist = Artist.objects.create(name=artist['name'], echonest_id=artist['id'])
						if update == True:
							new_artist.queued=True
						new_artist.save()

						artists.append(new_artist)
						self.artists.add(new_artist)
						self.save()


		if update == True:
			for a in artists:
				a.update_all()


		self.extract_queued = False
		self.save()