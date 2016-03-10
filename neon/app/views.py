from datetime import date, timedelta, datetime

from django.db.models import Q
from django.shortcuts import render

from show.models import Show
from newsletter.models import Newsletter

from serializer import ShowListSerializer

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication


#authentication
from django.contrib.auth import authenticate,logout
from haystack.query import SearchQuerySet

class Index(APIView):
	permission_classes = (AllowAny,)

	def get(self, request, id=None):

		



		shows = Show.objects.filter(date__gte=date.today())
		shows = shows.filter(venue__opened=True)

		featured = shows.filter(star=True)
		featured = featured.filter(date__range=[ date.today(), date.today() + timedelta(days=1) ])
		featured = featured.order_by('date')
		featured = ShowListSerializer(featured, many=True)

		today = datetime.today()
		newsletter = Newsletter.objects.filter(active=True)
		newsletter = newsletter.filter(Q(start_date__lte=today) & Q(end_date__gte=today))

		playlist = newsletter[0].spotify_embed

		print playlist

		data = {
			'featured': featured.data,
			'playlist': playlist
		}

		return render(request, "index.html", data)


class Search(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (AllowAny,)

	def get(self, request, id=None):
		return render(request, "search.html")

	def post(self, request):
		data = {}

		query = request.POST.get("query", "")
		
		if query != "":
			querySet = SearchQuerySet().filter(text=query).order_by('date')
			shows = [ Show.objects.get(id=show.pk) for show in querySet ]
			serializer = ShowListSerializer(shows, many=True)
			data["shows"] = serializer.data

		data["query"] = query

		return render(request, "search.html", data)

