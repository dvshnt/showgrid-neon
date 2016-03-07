from django.http import Http404
from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist

from serializer import VenueSerializer

from venue.models import Venue

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication


class VenueView(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (AllowAny,)

	def get(self, request, id=None):
		if id != None:
			try:
				venue = Venue.objects.get(id=id)
				serializer = VenueSerializer(venue, many=False)
			except ObjectDoesNotExist: 
				raise Http404("Venue does not exist")
			return render(request, "venue/venue.html", { 'venue':serializer.data })
		else:
			return render(request, "venue/venue.html", {})