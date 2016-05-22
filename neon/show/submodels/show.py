import re
import requests
from datetime import datetime

from os import path

from django.db import models
from django.utils import timezone

from django.conf import settings

from artist import Artist
from venue.models import Venue
from newsletter.models import Newsletter

from app.util.color_log import *

from app.settings.base import IMAGE_MIN_WIDTH, IMAGE_MIN_HEIGHT

from extra import Image
from itertools import chain
from django.db.models.signals import pre_save
from django.dispatch import receiver



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
	related_artists = models.ManyToManyField(Artist, related_name='artist_related_show', blank=True)
	artists = models.ManyToManyField(Artist, related_name='artist_shows', blank=True)

	date = models.DateTimeField(blank=False)
	venue = models.ForeignKey(Venue, related_name='shows')

	## Is show featured?
	featured = models.BooleanField(default=False)

	## Image banner to use at top of list page and in list item (rec: 1200px x 640px)
	# images = models.ManyToManyField(Image, related_name='show_image', blank=True)
	banner = models.ForeignKey(Image,blank=True,related_name='show_banner',null=True)
	
	custom_banner = models.ForeignKey(Image,blank=True,related_name='show_banner_custom',null=True)
	# when this field is set, it will overwrite the banner field when it is set.
	# banner_override = models.ForeignKey(Image,blank = True,related_name='show_banner_override',null=True)

	review = models.FileField(upload_to='showgrid/reviews/', default='', blank=True)

	website = models.URLField(blank=True)

	ticket = models.URLField(blank=True)
	price = models.SmallIntegerField(default=-1, blank=True)

	cancelled = models.BooleanField(default=False)
	soldout = models.BooleanField(default=False)
	onsale = models.DateTimeField(default=datetime.now,blank=True)

	age = models.PositiveSmallIntegerField(default=0, blank=True)

	issue = models.ForeignKey(Newsletter, null=True, blank=True)

	#extract metadata
	extract_queued = models.BooleanField(default=False)


	# def __setattr__(self, name, value):
	# 	if name != "banner_override":
	# 		object.__setattr__(self, name, value)
	# 	else:
	# 		if self.banner_override != value:
	# 			object.__setattr__(self, name, value) # use base class setter
	# 			# oldstate = self.state
	# 			# object.__setattr__(self, name, value) # use base class setter
	# 			# if oldstate == 'S' and value == 'A':
	# 			# 	self.started = datetime.now()
	# 			# create units, etc.


	# def set_banner_(self, newstate):
	# 	if self.state != newstate:
	# 		oldstate = self.state
	# 		self.state = newstate
	# 		if oldstate == 'S' and newstate == 'A':
	# 			self.started = datetime.now()






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
					new_artist = self.related_artists.get(echonest_id=artist['id'])
				except:
					#is the artist in the database?
					try:
						new_artist = Artist.objects.get(echonest_id=artist['id'])
						self.related_artists.add(new_artist)


					#create new artist and sync later
					except:
						new_artist = Artist.objects.create(name=artist['name'], echonest_id=artist['id'])
						new_artist.queued=True
						new_artist.save()

						artists.append(new_artist)
						self.related_artists.add(new_artist)
						self.save()



		# update artists data and link artist images to show images.
		for a in artists:
			a.update_all()

		self.artists = self.related_artists.all()

		self.extract_queued = False
		self.save()




#update banner adding_banner to not display in other queries.
@receiver(pre_save, sender=Show, dispatch_uid="update_show_banner")
def update_stock(sender, instance, **kwargs):
	if instance.custom_banner != None and instance.banner != instance.custom_banner:
		instance.banner = instance.custom_banner
