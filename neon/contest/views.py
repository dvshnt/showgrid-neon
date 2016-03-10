from datetime import date

from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist

from contest.models import Contest
from serializer import ShowListSerializer, ShowDetailSerializer

from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication


#signup for contest
@api_view(['POST'])
def contest_signup(request,id):
	email = request.POST['email']	

	try:	
		user = Subscriber.objects.get(email=email)
		if user.contest != None:
			print user.contest
			return Response({"msg": "user_entered"}, status=status.HTTP_409_CONFLICT)
		contest = Contest.objects.get(id=id)
		tr = Thread(target=send_share_letter_thread,args=(contest,user,))
		tr.start()
		user.contest = contest
		user.contest_points = 1
		user.save()
		return Response()
	except:
		return Response({"msg": "user_nonexist"}, status=status.HTTP_400_BAD_REQUEST)
	

#contest page
@api_view(['GET'])
def contest_view(request, id=None):
	if id == None:
		contests = Contest.objects.filter(active=True)
		return render(request, 'contest/contest_archive.html', { 'contests': contests })

	try:
		contest = Contest.objects.get(id=id)
		return render(request, 'contest/contest_page.html', { 'contest': contest })
	except ObjectDoesNotExist:
		return HttpResponseNotFound()