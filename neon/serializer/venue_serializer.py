from show.models import Show
from venue.models import Venue

from serializer import ShowSerializer

from rest_framework import serializers
from datetime import timedelta, date, datetime

from django.utils import timezone


class VenueSerializer(serializers.ModelSerializer):
	class Meta:
		model = Venue
		# ADD BACK ADDRESS INFO LATER
		fields = (
			'description','phone','facebook_url','twitter_url',
			'id', 'name', 'image', 'website', 'address',
			'primary_color', 'secondary_color', 'accent_color', 
			'opened', 'autofill', 'age', 'gradient'
		)


	address = serializers.SerializerMethodField('get_venue_address')
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

	def get_venue_address(self, obj):
		return {
			'street': obj.address.street,
			'state': obj.address.state,
			'city': obj.address.city,
			'zip_code': obj.address.zip_code
		}


class VenueListSerializer(serializers.ModelSerializer):
	class Meta:
		model = Venue
		# ADD BACK ADDRESS INFO LATER
		fields = (
			'description','phone','facebook_url','twitter_url',
			'id', 'name', 'image', 'website', 'address',
			'primary_color', 'secondary_color', 'accent_color', 
			'opened', 'autofill', 'age', 'shows', 'gradient'
		)


	shows = serializers.SerializerMethodField('get_shows_in_range')
	address = serializers.SerializerMethodField('get_venue_address')
	gradient = serializers.SerializerMethodField('get_venue_gradient')


	def get_shows_in_range(self, obj):
		start = self.context.get("start")
		end = self.context.get("end")

		if start is not None and end is not None:
			start = start.strftime("%Y-%m-%d")
			end = end.strftime("%Y-%m-%d")
		else:
			start = date.today()
			end = date.today() + timedelta(days=365)

		data = Show.objects.filter(venue=obj.id)
		data = data.filter(date__range=[ start, end ])
		data = data.order_by('date')
		
		serializer = ShowSerializer(data, many=True)

		return serializer.data


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

	def get_venue_address(self, obj):
		return {
			'street': obj.address.street,
			'state': obj.address.state,
			'city': obj.address.city,
			'zip_code': obj.address.zip_code
		}