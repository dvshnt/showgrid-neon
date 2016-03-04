import re
import urllib
import datetime

from django.db import models
from django.utils import timezone
from django.core.files import File

from django.conf import settings

from app.util.color_log import *


class Biography(models.Model):
	def __unicode__ (self):
		return self.a_name

	a_name =  models.CharField(max_length=255, blank=False)
	text = models.TextField(default="No description", blank=False)
	source = models.CharField(max_length=255, blank=True)
	url = models.CharField(max_length=255, blank=True)


class Genre(models.Model):
	def __unicode__ (self):
		return self.name

	name = models.CharField(max_length=255, blank=False)


class Track(models.Model):
	def __unicode__ (self):
		return self.name

	name = models.CharField(max_length=255, blank=False)
	url = models.CharField(max_length=255, blank=False)
	source = models.CharField(max_length=255, blank=True)


class Image(models.Model):
	def __unicode__ (self):
		try:
			return self.local.url
		except:
			return self.url
	
	width = models.PositiveSmallIntegerField(default=0, blank=True)
	height = models.PositiveSmallIntegerField(default=0, blank=True)

	name = models.CharField(default='image',max_length=255)

	downloading = models.BooleanField(default=False)
	downloaded = models.BooleanField(default=False)
	valid = models.BooleanField(default=False, blank=True)

	url = models.CharField(max_length=255,blank=False)
	local = models.ImageField (upload_to='showgrid/img/artists/',blank=True)


	def download(self):
		content = urllib.urlretrieve(self.url)
		match = re.match('image\/(\w+)', content[1]['Content-Type'])
		
		if match != None:
			file_type = match.group(1)
		else:
			self.valid = False
			self.save()
			return

		file_name = self.name + '_' + str(self.id) + '.' + file_type
		self.name = file_name

		self.local.save(file_name, File(open(content[0])), save=False)

		self.downloading = False
		self.downloaded = True
		self.valid = True

		self.save()

		prGreen('downloaded image: '+self.local.url)


class Article(models.Model):
	def __unicode__ (self):
		return self.title

	title = models.CharField(max_length=255, blank=False)
	published_date = models.DateTimeField(default=timezone.now)

	summary = models.TextField(default="No description")

	external_url = models.CharField( max_length=255, blank=True)

	active =  models.BooleanField(default=True)


	def json_max(self):
		return {
			'title': self.title,
			'external_url':self.external_url,
			'summary':self.summary,
			'published_date':self.published_date,
			'active':self.active
		}