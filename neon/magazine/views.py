from django.http import HttpResponse

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication


class Magazine(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (AllowAny,)

	def get(self, request, year=None, month=None, day=None, id=None):
		return HttpResponse("magazine list")


class MagazineLabel(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (AllowAny,)

	def get(self, request, label=None):
		return HttpResponse("magazine label: " + label)