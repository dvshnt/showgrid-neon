import re
import datetime

from django.db import models
from django.utils import timezone

from django.conf import settings

from app.util.color_log import *

from show import *
from extra import *
from artist import *


# ISSUES_DIR =  settings.ISSUES_DIR
MAX_BIO = settings.ECHONEST_MAX_BIO
MAX_ARTICLES = settings.ECHONEST_MAX_ARTICLES
EMAIL_HOST_USER = settings.EMAIL_HOST_USER


#Analyze spotify data and sync it with passed artist.
def SpotifyArtistParser(artist, data):
	# 1000x1000 images
	if 'images' in data:
		for img in data['images']:
			bad_source_match = re.findall('userserve-ak.last.fm',img['url'])
			if  len(bad_source_match) > 0:
				print prRed('bad image from spotify: '+img['url'])
				continue


			try:
				artist.images.get(url=img['url'])
			except:
				try:
					image = Image.objects.get(url=img['url'])
					artist.images.add(image)
				except:
					new_image = Image.objects.create(url=img['url'])
					new_image.save()
					artist.images.add(new_image)

	if 'external_urls' in data and 'spotify' in data['external_urls']:
		artist.spotify_link = data['external_urls']['spotify']

	#follow count??
	if 'followers' in data and 'total' in data['followers']:
		artist.spotify_followers = data['followers']['total']


	#genres
	if 'genre' in data:				
		for g in data['genres']:
			try:
				artist.genres.get(name=g)
			except:
				try:
					genre = Genre.objects.get(name=g)
					artist.genres.add(genre)
				except:
					new_genre = Genre.objects.create(name=g)
					new_genre.save()
					artist.genres.add(new_genre)




#Analyze echonest data and sync it with passed artist.
def EchonestArtistParser(artist, data):
	a_json = t_list = None


	if 'artist' in data['response']:
		a_json = data['response']['artist']
	
	if 'songs' in data['response']:
		t_list = data['response']['songs']

	

	if a_json != None:
		#genres
	
		if 'genres' in a_json:
			for g in a_json['genres']:
				try:
					artist.genres.get(name=g['name'])
				except:
					try:
						genre = Genre.objects.get(name=g['name'])
						artist.genres.add(genre)
					except:
						new_genre = Genre.objects.create(name=g['name'])
						new_genre.save()
						artist.genres.add(new_genre)

		#biography
		bio_count = 0
		if 'biographies' in a_json:
			for b in a_json['biographies']:
				if settings.ECHONEST_BIO_WIKI_LASTFM_ONLY == True and b['site'] != 'wikipedia' and b['site'] != 'last.fm':
					continue
				bio_count += 1
				if bio_count > MAX_BIO:
					break
				try:
					artist.bios.get(url=b['url'])
				except:
					try:
						bio = Biography.objects.get(url=b['url'])
						artist.bios.add(bio)
					except:
						new_bio = Biography.objects.create(url=b['url'],text=b['text'],source=b['site'],a_name=artist.name)
						new_bio.save()
						artist.bios.add(new_bio)
				
			

		#articles
		if settings.ECHONEST_ARTICLES_NEWS_ONLY:
			articles = a_json['news']
			articles = a_json['news'][:settings.ECHONEST_MAX_ARTICLES]
		else:
			articles = a_json['news']+a_json['blogs']
			articles = articles[:settings.ECHONEST_MAX_ARTICLES]
			# random.shuffle(articles)

			print artist.name+' article count: ' + str(len(articles)) + 'news:' + str(len(a_json['news'])) + 'blogs:' + str(len(a_json['blogs']))

		for blog in articles :
			try:
				artist.articles.get(external_url=blog['url'])
			except:
				
				new_title = blog['name']
				new_summary = blog['summary']
				new_external_url = blog['url']
				new_article = Article.objects.create(summary=new_summary,title=new_title,external_url=new_external_url)
				
				if 'date_posted' in blog :
					new_article.published_date = blog['date_posted']
				elif 'date_found' in blog :
					new_article.published_date = blog['date_found']

				new_article.save()
				artist.articles.add(new_article)				


		#images
		for i in a_json['images']:
			bad_source_match = re.findall('userserve-ak.last.fm',i['url'])
			if len(bad_source_match) > 0:
				print prRed('bad image from echonest: '+i['url'])
				continue
			try:
				artist.images.get(url=i['url'])
			except:
				try:
					image = Image.objects.get(url=i['url'])
					artist.images.add(image)
				except:
					new_image = Image.objects.create(url=i['url'])
					new_image.save()
					artist.images.add(new_image)

		artist.popularity = a_json['hotttnesss']
	
	#tracks
	if t_list != None and len(t_list) > 0:

		for t in t_list:
			try:
				artist.tracks.get(url=t['foreign_id'])
			except:
				try:
					track = Track.objects.get(url=t['foreign_id'])
					artist.tracks.add(track)
				except:
					new_track = Track.objects.create(url=t['foreign_id'],source=t['catalog'],name=t['name'])
					new_track.save()
					artist.tracks.add(new_track)