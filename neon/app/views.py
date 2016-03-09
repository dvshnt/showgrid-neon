from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication

#authentication
from django.contrib.auth import authenticate,logout


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