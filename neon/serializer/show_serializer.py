import pytz

from show.models import Show, Artist
from venue.models import Venue

from rest_framework import serializers
from datetime import timedelta, date, datetime

from django.utils import timezone


class VenueListSerializer(serializers.ModelSerializer):
	class Meta:
		model = Venue
		# ADD BACK ADDRESS INFO LATER
		fields = (
			'name', 'primary_color', 'secondary_color', 'accent_color','gradient', 'id'
		)
	

	gradient = serializers.SerializerMethodField('get_venue_gradient')


	def get_venue_gradient(self, obj):
		if not obj.primary_color:
			r = "0"
			g = "0"
			b = "0"
		else:
			hex_val = obj.primary_color.replace('#','')
			r = str(int(hex_val[0:2], 16))
			g = str(int(hex_val[2:4], 16))
			b = str(int(hex_val[4:6], 16))

		if not r: r = "0"
		if not g: g = "0"
		if not b: b = "0"

		gradient = "background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 5%,rgba("+r+","+g+","+b+",1) 50%,rgba("+r+","+g+","+b+",1) 100%), rgba("+r+","+g+","+b+",0.3);"
		gradient += "background: -moz-linear-gradient(top, rgba("+r+","+g+","+b+",1) 0%, rgba("+r+","+g+","+b+",0.9) 6%, rgba("+r+","+g+","+b+",0.1) 42%, rgba("+r+","+g+","+b+",0.1) 60%, rgba("+r+","+g+","+b+",1) 100%);"
		gradient += "background: -webkit-linear-gradient(top, rgba("+r+","+g+","+b+",1) 0%,rgba("+r+","+g+","+b+",0.9) 6%,rgba("+r+","+g+","+b+",0.1) 42%,rgba("+r+","+g+","+b+",0.1) 60%,rgba("+r+","+g+","+b+",1) 100%);"
		gradient += "background: linear-gradient(to bottom, rgba("+r+","+g+","+b+",1) 0%,rgba("+r+","+g+","+b+",0.9) 6%,rgba("+r+","+g+","+b+",0.1) 42%,rgba("+r+","+g+","+b+",0.1) 60%,rgba("+r+","+g+","+b+",1) 100%);"
		return gradient


class ShowListSerializer(serializers.ModelSerializer):
	class Meta:
		model = Show
		# ADD BACK CANCELLED
		fields = (
			'id', 'created_at', 'title', 'headliners', 'openers', 'website', 
			'featured', 'review', 'date', 'ticket', 'price', 'soldout', 
			'onsale', 'venue', 'banner', 'raw_date'
		)

	raw_date = serializers.SerializerMethodField('get_show_date')
	venue = serializers.SerializerMethodField('get_shows_venue')
	review = serializers.SerializerMethodField('get_shows_review')
	banner = serializers.SerializerMethodField('get_banner_url')

	def get_banner_url(self,obj):
		if obj.banner:
			return obj.banner.url
		else:
			return ""
	
	def get_show_date(self,obj):
		return obj.date.isoformat()
	
	def get_shows_venue(self, obj):
		serializer = VenueListSerializer(obj.venue)
		return serializer.data

	def get_shows_review(self, obj):
		if obj.review:
			return obj.review.read().decode('utf-8')
		return ""


class ShowDetailSerializer(serializers.ModelSerializer):
	class Meta:
		model = Show
		fields = (
			'id', 'created_at', 'title', 'headliners', 'openers', 'website', 
			'featured', 'review', 'date', 'ticket', 'price', 'soldout', 
			'onsale', 'venue', 'banner', 'cancelled', 'artists', 'raw_date'
		)


	date = serializers.SerializerMethodField('get_show_date_format')
	artists = serializers.SerializerMethodField('get_show_artists')
	venue = serializers.SerializerMethodField('get_show_venue')
	review = serializers.SerializerMethodField('get_shows_review')
	raw_date = serializers.SerializerMethodField('get_show_date')
	banner = serializers.SerializerMethodField('get_banner_url')

	def get_banner_url(self,obj):
		if obj.banner:
			return obj.banner.url
		else:
			return ""

	def get_show_date(self,obj):
		return obj.date.isoformat()

	def get_show_date_format(self, obj):
		from datetime import datetime

		central = pytz.timezone('America/Chicago')
		offset = obj.date.replace(tzinfo=central).utcoffset()
		date = obj.date + offset

		def suffix(d):
		    return 'th' if 11<=d<=13 else {1:'st',2:'nd',3:'rd'}.get(d%10, 'th')

		def custom_strftime(format, t):
		    return t.strftime(format).replace('{S}', str(t.day) + suffix(t.day))

		return custom_strftime('%A, %B {S} at %-I %p', date)

	def get_shows_review(self, obj):
		if obj.review:
			return obj.review.read().decode('utf-8')
		return ""

	def get_show_venue(self, obj):
		data = Venue.objects.get(id=str(obj.venue.id))
		serializer = VenueListSerializer(data)
		return serializer.data

	def get_show_artists(self, obj):
		result = []

		for artist in obj.artists.all():
			data = Artist.objects.get(id=artist.id)
			data = {
				"id": data.id,
				"name": data.name,
				"spotify_link": data.spotify_link,
				"twitter_url": data.twitter_url,
				"facebook_url": data.facebook_url
			}
			result.append(data)

		return result



class ShowSerializer(serializers.ModelSerializer):
	class Meta:
		model = Show
		# ADD BACK CANCELLED
		fields = (
			'id', 'created_at', 'title', 'headliners', 'openers', 'website', 
			'featured', 'review', 'date', 'ticket', 'price', 'soldout', 
			'onsale', 'venue', 'banner', 'cancelled','raw_date'
		)


	venue = serializers.SerializerMethodField('get_show_venue')
	review = serializers.SerializerMethodField('get_shows_review')
	raw_date = serializers.SerializerMethodField('get_show_date')
	banner = serializers.SerializerMethodField('get_banner_url')

	def get_banner_url(self,obj):
		if obj.banner:
			return obj.banner.url
		else:
			return ""

	def get_show_date(self,obj):
		return obj.date.isoformat()

	def get_shows_review(self, obj):
		if obj.review:
			return obj.review.read().decode('utf-8')
		return ""

	def get_show_venue(self, obj):
		data = Venue.objects.get(id=str(obj.venue.id))
		serializer = VenueListSerializer(data)
		return serializer.data