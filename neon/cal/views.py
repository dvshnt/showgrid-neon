import datetime
from datetime import timedelta, date
from operator import attrgetter

from venue.models import Venue

from serializer import VenueSerializer

from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication


class Calendar(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (AllowAny,)

	def get(self, request, year=None, month=None, day=None):
		calRange = request.GET.get('range', 7) 

		# Get the start date
		if year == None and month == None and day == None:
			d1 = date.today()
		else:
			d1 = date(int(year), int(month), int(day))
		
		# Use range to determine extent of view
		d2 = d1 + timedelta(days=calRange)

		venues = Venue.objects.filter(opened=True)
		venues = sorted(venues, key=attrgetter('alphabetical_title'), reverse=False)
		serializer = VenueSerializer(venues, many=True, context={ 'start': d1, 'end': d2 })

		days = [d1 + datetime.timedelta(days=x) for x in range(0, calRange)]
		days = [day.isoformat() for day in days]

		data = {
			'days': days,
			'venues': serializer.data
		}

		return render(request, "calendar/calendar.html", data)