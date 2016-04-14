from django.http import HttpResponse, HttpResponseServerError
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from rest_framework import permissions, status
from rest_framework.response import Response

from models import *

import inspect, itertools, json
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect, render
from show.models import Show


import dateutil
import dateutil.parser


from django.contrib.auth.decorators import login_required

from social.backends.oauth import BaseOAuth1, BaseOAuth2
from social.backends.google import GooglePlusAuth
from social.backends.utils import load_backends
from social.apps.django_app.utils import psa

from django.views.decorators.csrf import ensure_csrf_cookie

from serializer import UserSerializer, AlertSerializer

from  django.core.files.images import ImageFile
from django.core.files import File
from django.core.files.base import ContentFile


def require_email(request):
    backend = request.session['partial_pipeline']['backend']
    return context(email_required=True, backend=backend)










@api_view(['GET'])
def private_profile(request):
	if request.user.is_authenticated() == False:
		return redirect('/?q=profile')
	else:
		return render(request, "profile-private.html")




@api_view(['GET'])
def public_profile(request,id):
	try:
		user = NeonUser.objects.get(id=id)
		return render(request, "profile-public.html",{'profile':UserSerializer(user).data})
	except:
		return redirect('/?q=profile')


@api_view(['POST'])
def update_profile(request):
	user = request.user
	bio = request.POST.get('bio',False)
	pic = request.FILES.get('pic',False)
	name = request.POST.get('name',False)
	email = request.POST.get('email',False)
	if pic:
		img = ImageFile(pic)
		if img.size > 500000:
			return Response({"status":"image is too big"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		request.user.pic.save('user_'+str(user.id)+'_pic',img, save=False)
	
	if ( bio == "" or request.user.bio == bio ) and pic == False and (user.name == name or name == "") and (user.email == email or email == ""):
		return Response({"status":"nothing to save"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	user.bio = bio or user.bio
	user.name = name or user.name
	
	user.email = email or user.email
	if email:
		logout(request)
	user.save()
	return Response({"status":"good"},status=status.HTTP_200_OK)



@api_view(['GET'])
def Logout(request):
	logout(request)
	return redirect('/')


@api_view(['POST'])
def Login(request):
	if request.user.is_authenticated():
		return redirect('/user/profile')


	email = request.GET.get('email',False) 
	password = request.GET.get('password',False) 
	user = authenticate(email=email, password=password)
	if user is not None:
		login(request,user)
		# return redirect('/')
		return Response({"status":"good"},status=status.HTTP_200_OK)
	else:
		return Response({"status":"bad_params"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['POST'])
def Signup(request):
	body = json.loads(request.body)
	email = body['email']
	password = body['password']
	
	#500 invalid parameters
	if email == None or password == None:
		return Response({"status":"bad_params"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	users = NeonUser.objects.filter(email=email)

	#500 user with same email exists.
	if len(users) > 0:
		return Response({"status":"user_exists"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	user = NeonUser.objects.create_user(email, password)
	user.is_active=True
	user.save()

	user = authenticate(email=email, password=password)
	if user is not None:
		login(request,user)
		return Response({"status":"good"},status=status.HTTP_200_OK)
	else:
		return Response({"status":"bad_params"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@permission_classes((IsAuthenticated, ))
class UserActions(APIView):
	def get_show(self, pk):
		try:
			return Show.objects.get(id=pk)
		except ObjectDoesNotExist:
			return None



	def put(self, request, action=None):
		user = request.user

		# Update users profile
		if action == 'profile':
			body = json.loads(request.body.decode('utf-8'))

			# Change email
			if(body['email'] != "None" and body['email'] != "" and body['email'] != None ):
				user.email = body['email']
				user.username = body['email']

			# Change name
			if(body['name'] != "None" and body['name'] != "" and body['name'] != None):
				user.name = body['name']

			# Change bio
			if(body['bio'] != "None" and body['bio'] != "" and body['bio'] != None):
				user.bio = body['bio']

			# Change pic
			if(body['pic'] != "None" and body['pic'] != "" and body['pic'] != None):
				user.pic = body['pic']

			# Change password
			if(body['old_pass'] != 'None' and body['pass'] != "None" and body['pass'] != "" and body['pass'] != None):
				if user.check_password(body['old_pass']) == True :
					user.set_password(body['pass'])
				else:
					return HttpResponseServerError()

			user.save()
			return Response(UserSerializer(user).data)


		# Edit alert
		elif action == 'alert':
			

			try:
				body = json.loads(request.body.decode('utf-8'))
				alert = body['alert']
				which = body['which']

				alert = Alert.objects.get(id=alert)
				# alert.date = date
				alert.which = which
				alert.save()
				return Response({ 'status': 'alert_updated', 'id': alert.id, 'which': alert.which })
			except:
				return  Response({ 'status': 'bad_params' })



	def get(self, request, action=None):
		user = request.user
		
		#return false if phone is not verified
		if action == 'phone_status':
			if user.phone == None:
				return Response({'status':'no_phone_added'})
			return Response({'status':user.phone_verified})



	def delete(self, request, action=None):
		user = request.user

		if action == 'newsletter':
			user.newsletter = False;
			user.save()
			return Response({'status':'good'})
		if action == 'favorite':
			id = request.GET.get('id',False)
			if id != None:
				show = self.get_show(id)	
				user.favorites.remove(show)
				return Response({'status':'good'})
			

		if action == 'alerts':
			alerts_q = Alert.objects.filter(user=user)
			for alert in alerts_q:
				alert.delete()
			return Response({'status':'good'})

		#clear user alert
		if action == 'alert':
			
			
			try:
				alert_id = request.GET.get('id',False) 
				user_alert = Alert.objects.get(id=alert_id)
				user_alert.delete()
				return Response({'status':'good'})
			except:
				return Response({"status":"bad_params"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	
			
	
			


		#clear all user alerts
		if action == 'alerts':
			user_alerts = Alert.objects.filter(user=user)
			for alert in user_alerts:
				alert.delete()
			return  Response({ 'status': 'alerts_cleared' })



	def post(self, request, action=None):
		user = request.user
		
		if action == 'newsletter':
			user.newsletter = True;
			user.save()
			return Response({'status':'good'})

		if action == 'favorite':
			id = request.GET.get('id',False)
			if id != None:
				show = self.get_show(id)
				try:
					user.favorites.add(show)
					return Response({'status':'good'})
				except:
					return Response({"status":"bad_params"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

		

		#set user phone
		if action == 'phone_set':
			body_unicode = request.body.decode('utf-8')
			body = json.loads(body_unicode)
			phone = body['phone']
			
			if phone == None:
				return Response({'status':'bad_query'})
			
			if user.phone == None:
				user.phone_verified = False
				user.phone = phone
				user.save()
				user.send_pin(user.generate_pin())
				user.save()
				return Response({'status':'phone_set','phone':user.phone})
			
			elif user.phone_verified == False:
				user.phone = phone
				user.save()
				user.send_pin(user.generate_pin())
				user.save()
				return Response({'status':'phone_set','phone':user.phone})
			
			else:
				alerts = Alert.objects.filter(user=user)
				for alert in alerts:
					alert.delete()
				user.phone_verified = False
				user.phone = None
				if(phone == user.phone):
					return Response({'status':'phone_same','phone':user.phone})
				user.phone = phone
				user.save()
				user.send_pin(user.generate_pin())
				user.save()
				return Response({'status':'phone_set_alerts_cleared','phone':user.phone})

			return Response({'status':'something_fucked'})


		#send pin to user phone
		if action == 'pin_send':
			# if user.is_authenticated() == False:
			# 	return Response({'status':'not_authenticated'})

			if user.phone == None:
				return Response({'status':'no_phone_added'})

			if user.phone_verified:
				return Response({'status': 'pin_verified'})

			if user.pin_sent:
				return Response({'status': 'pin_sent_timeout'})

		
			user.send_pin(user.generate_pin())
			user.save()
			return Response({'status': 'pin_sent'})




		#check user pin
		if action == 'pin_check':
			body_unicode = request.body.decode('utf-8')
			body = json.loads(body_unicode)
			pin = body['pin']
			
			if pin == None:
				return Response({'status':'bad_query'})
			if user.phone_verified:
				return Response({'status': 'pin_verified'})
			if user.check_pin(pin):
				user.phone_verified = True
				user.save()
				return Response({'status': 'pin_verified'})
			else:
				return Response({'status': 'bad_pin','phone': user.phone})

		#toggle alert
		if action == 'alert':
			if user.phone_verified == False:
				return  Response({ 'status': 'phone_not_verified' })

	
			body_unicode = request.body.decode('utf-8')
			body = json.loads(body_unicode)
			show = body['show']
			which = body['which']
			sale = ( body['sale'] or False )
			show_id = show
			show = self.get_show(int(show))

			if show == None:
				return  Response({ 'status': 'no such show' })

			user_show_alerts = Alert.objects.filter( user=user,show=show,sale=sale )

			if user_show_alerts:
				return  Response({ 'status':'alert_already_set' })
			else:
				alert = Alert( is_active=True,show=show,user=user,which=which,sale=sale )
				alert.save()
				data = AlertSerializer( alert )
				return  Response( data.data )
			

		#get user alert count
		if action == 'alert_count':
			user_show_alerts = Alert.objects.filter(user=user)
			return  Response({ 'status': len(user_show_alerts) })

		return  Response({ 'status': 'bad_query' })



