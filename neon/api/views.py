VERSION = 'v1'

import datetime
from datetime import timedelta, date
from operator import attrgetter

from show.models import Show
from venue.models import Venue

from serializer import VenueListSerializer
from serializer import ShowListSerializer

from django.utils import dateparse
from django.http import HttpResponse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication


def version(request):
	return HttpResponse(VERSION)


class CalendarAPI(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (AllowAny,)

	def get(self, request, year=None, month=None, day=None):
		calRange = int(request.GET.get('range', 7))

		# Get the start date
		if year == None and month == None and day == None:
			d1 = date.today()
		else:
			d1 = date(int(year), int(month), int(day))
		
		# Use range to determine extent of view
		d2 = d1 + timedelta(days=calRange)

		venues = Venue.objects.filter(opened=True)
		venues = sorted(venues, key=attrgetter('alphabetical_title'), reverse=False)
		serializer = VenueListSerializer(venues, many=True, context={ 'start': d1, 'end': d2 })

		days = [d1 + datetime.timedelta(days=x) for x in range(0, calRange)]
		days = [day.isoformat() for day in days]

		data = {
			'days': days,
			'venues': serializer.data
		}

		return Response(data)


class ShowAPI(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (AllowAny,)

	def get(self, request, id=None):
		if id != None:
			try:
				show = Show.objects.get(id=id)
			except ObjectDoesNotExist:
				return  Response({ 'status': 'bad_query' })

			serializer = ShowListSerializer(show)
			return Response(serializer.data)


		query = request.GET.get('q', None)
		venue = request.GET.get('venue', None)
		limit = request.GET.get('limit', 100)
		featured = request.GET.get('featured', None)
		orderby = request.GET.get('orderby', 'date').split(",")
		soldout = request.GET.get('soldout', None)
		onsale = request.GET.get('onsale', None)
		start = request.GET.get('start', None)
		end = request.GET.get('end', None)


		# Search has a different branch as it utilizes Haystack
		if query != None:
			querySet = SearchQuerySet().filter(text=query).order_by('date')
			shows = [ Show.objects.get(id=show.pk) for show in querySet ]
			serializer = ShowListSerializer(shows, many=True)
			return Response(serializer.data)



		if start != None and end != None:
			d1 = dateparse.parse_datetime(start)
			d2 = dateparse.parse_datetime(end)

			#d3 = d2 + timedelta(hours=11.99)
			#print d1.date(), d2.date()
			shows = Show.objects.filter(date__range=[d1.date(), d2.date()])
		else:
			shows = Show.objects.filter(date__gte=date.today())


		if venue != None:
			shows = shows.filter(venue=venue)

		if featured != None:
			shows = shows.filter(star=featured)

		if soldout != None:
			shows = shows.filter(soldout=soldout)

		if onsale != None:
			shows = shows.filter(onsale__gte=date.today())


		# ORDER BY
		shows = shows.order_by(*orderby)


		paginator = Paginator(shows, limit)

		page = request.GET.get('page', 1)
		try:
			shows = paginator.page(page)
		except PageNotAnInteger:
			shows = paginator.page(1)
		except EmptyPage:
			response = Response()
			response.data = {"status": "last_page"}
			return response

		serializer = ShowListSerializer(shows, many=True)

		return Response(serializer.data)