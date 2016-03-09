from datetime import date

from django.http import HttpResponse
from django.shortcuts import render

from show.models import Show
from serializer import ShowListSerializer

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication


class ShowView(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (AllowAny,)

	def get(self, request, id=None):
		return HttpResponse("Show")


class ShowList(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (AllowAny,)

	def get(self, request, year=None, month=None, day=None):
		return HttpResponse("Show list")


class ShowShortcut(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (AllowAny,)

	def get(self, request, shortcut=None):
		if shortcut == "featured":
			shows = Show.objects.filter(star=True)
			shows = shows.filter(date__gte=date.today())
			shows = shows.order_by('date')
			serializer = ShowListSerializer(shows, many=True)

			data = {
				'day': 'Today',
				'shows': serializer.data
			}

			return render(request, "show/featured.html", data)

		return HttpResponse("Show shortcut")

