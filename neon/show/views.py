from datetime import date

from django.http import HttpResponse
from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist

from show.models import Show
from serializer import ShowListSerializer, ShowDetailSerializer

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication


class ShowView(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (AllowAny,)

	def get(self, request, id=None):
		if id != None:
			try:
				show = Show.objects.get(id=id)
				serializer = ShowDetailSerializer(show, many=False)
			except ObjectDoesNotExist: 
				raise Http404("Show does not exist")
			return render(request, "show/show.html", { 'show': serializer.data })
		else:
			return render(request, "show/show.html", {})


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
			shows = Show.objects.filter(featured=True)
			shows = shows.filter(date__gte=date.today())
			shows = shows.order_by('date')
			serializer = ShowListSerializer(shows, many=True)

			data = {
				'shows': serializer.data
			}

			return render(request, "show/featured.html", data)

		return HttpResponse("Show shortcut")

