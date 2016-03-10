from show.models import Artist

from rest_framework import serializers
from datetime import timedelta, date, datetime

from django.utils import timezone


class ArtistSerializer(serializers.ModelSerializer):
	class Meta:
		model = Artist
		# ADD BACK ADDRESS INFO LATER
		fields = (
			'id', 'name', 
			# 'twitter_url', 'facebook_url', 'bios', 'articles', 
			# 'genres', 'tracks', 'images', 'spotify_link'
		)


	# bios = serializers.SerializerMethodField('get_artist_bio')
	# genres = serializers.SerializerMethodField('get_artist_genre')
	# tracks = serializers.SerializerMethodField('get_artist_tracks')
	# images = serializers.SerializerMethodField('get_artist_images')
	# articles = serializers.SerializerMethodField('get_artist_articles')



