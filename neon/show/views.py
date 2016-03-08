from django.http import HttpResponse

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication


class Show(APIView):
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
			

			venues = Show.objects.filter(featured=True)
			venues = sorted(venues, key=attrgetter('alphabetical_title'), reverse=False)

			data = {
				'days': days,
				'venues': serializer.data
			}

			return render(request, "show/featured.html", data)

		return HttpResponse("Show shortcut")

