from django.shortcuts import render

from show.models import Show

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


		
		user = None
		if request.user.is_authenticated():
			print 'LOGGED IN '+request.user.username
			user = request.user

		return render(request, "base.html",{
			"user": user
		})


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

