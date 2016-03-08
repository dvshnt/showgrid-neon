from show.models import Show
from venue.models import Venue

from rest_framework import serializers
from datetime import timedelta, date, datetime

from django.utils import timezone


class VenueListSerializer(serializers.ModelSerializer):
	class Meta:
		model = Venue
		# ADD BACK ADDRESS INFO LATER
		fields = (
			'name', 'primary_color', 'secondary_color', 'accent_color','id'
		)


class ShowListSerializer(serializers.ModelSerializer):
	class Meta:
		model = Show
		# ADD BACK CANCELLED
		fields = (
			'id', 'created_at', 'title', 'headliners', 'openers', 'website', 
			'star', 'review', 'date', 'ticket', 'price', 'soldout', 
			'onsale', 'venue', 'banner'
		)


	venue = serializers.SerializerMethodField('get_shows_venue')
	review = serializers.SerializerMethodField('get_shows_review')


	def get_shows_venue(self, obj):
		serializer = VenueListSerializer(obj.venue)
		return serializer.data

	def get_shows_review(self, obj):
		if obj.review:
			return obj.review.read().decode('utf-8')
		return ""



class ShowSerializer(serializers.ModelSerializer):
	class Meta:
		model = Show
		# ADD BACK CANCELLED
		fields = (
			'id', 'created_at', 'title', 'headliners', 'openers', 'website', 
			'star', 'review', 'date', 'ticket', 'price', 'soldout', 
			'onsale', 'venue', 'banner'
		)


	venue = serializers.SerializerMethodField('get_show_venue')
	review = serializers.SerializerMethodField('get_shows_review')


	def get_shows_review(self, obj):
		if obj.review:
			return obj.review.read().decode('utf-8')
		return ""

	def get_show_venue(self, obj):
		data = Venue.objects.get(id=str(obj.venue.id))
		serializer = VenueListSerializer(data)
		return serializer.data