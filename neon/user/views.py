from django.http import HttpResponse

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication


class User(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (AllowAny,)

	def get(self, request, id=None):
		return HttpResponse("user list")


class UserActions(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (AllowAny,)

	def get(self, request, action=None):
		return HttpResponse("user actions: " + action)