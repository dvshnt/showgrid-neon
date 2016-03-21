from django.http import HttpResponse, HttpResponseServerError
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view

from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from models import *

import inspect, itertools, json
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect, render
from show.models import Show


import dateutil
import dateutil.parser



from serializer import UserSerializer, AlertSerializer




@api_view(['GET'])
def Profile(request):
	if request.user.is_authenticated() == False:
		return redirect('/')
	else:
		return render(request, "profile.html")


@api_view(['GET'])
def Logout(request):
	logout(request)
	return redirect('/')


@api_view(['POST'])
def Login(request):
	try:
		body = json.loads(request.body)
		email = body['email']
		password = body['password']
		user = authenticate(email=email, password=password)
		if user is not None:
			print 'LOGGING IN '+user.email
			login(request,user)
			return Response({"status":"good"},status=status.HTTP_200_OK)
		else:
			return Response({"status":"bad_params"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	except:
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




class UserActions(APIView):
	authentication_classes = (SessionAuthentication, BasicAuthentication)
	permission_classes = (IsAuthenticated,)


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
			
			body = json.loads(request.body.decode('utf-8'))
			alert = body['alert']
			date = body['date']
			which = body['which']

			try:
				alert = Alert.objects.get(id=alert)
				alert.date = date
				alert.which = which
				alert.save()
			except:
				return  Response({ 'status': '' })

			return  Response({ 'status': 'alert_updated', 'id': alert.id, 'which': alert.which })



	def get(self, request, action=None):
		user = request.user
		
		#return false if phone is not verified
		if action == 'phone_status':
			if user.phone == None:
				return Response({'status':'no_phone_added'})
			return Response({'status':user.phone_verified})



	def delete(self, request, action=None):
		user = request.user

		if action == 'favorite':
			body_unicode = request.body.decode('utf-8')
			body = json.loads(body_unicode)
			show = self.get_show(body['show'])
			if show != None:
				if show in user.favorites.all():
					user.favorites.remove(show)
					status = ""

				user.save()

			 	return Response({ 'status': "success", 'show': show.id })
			return Response({ 'status': "failure", 'show': show.id })


		#clear user alert
		if action == 'alert':
			body_unicode = request.body.decode('utf-8')
			body = json.loads(body_unicode)
			alert = body['alert']

			try:
				user_alert = Alert.objects.get(id=alert)
				user_alert.delete()
			except:
				return  Response({ 'status': 'failure', 'alert': alert })

			return  Response({ 'status': 'success', 'alert': alert })


		#clear all user alerts
		if action == 'alerts':
			user_alerts = Alert.objects.filter(user=user)
			for alert in user_alerts:
				alert.delete()
			return  Response({ 'status': 'alerts_cleared' })



	def post(self, request, action=None):
		user = request.user

		if action == 'favorite':
			body_unicode = request.body.decode('utf-8')
			body = json.loads(body_unicode)
			show = body['show']

			show = self.get_show(int(show))
			if show != None:
				if show not in user.favorites.all():
					user.favorites.add(show)
					status = "active"

				user.save()

			 	return Response({ 'status': "success", 'show': show.id })
			return Response({ 'status': "failure", 'show': show.id })




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
			date = body['date']
			show = body['show']
			which = body['which']
			sale = ( body['sale'] or False )
			show_id = show
			show = self.get_show(int(show))

			if show == None:
				return  Response({ 'status': 'no such show' })

			user_show_alerts = Alert.objects.filter(user=user,show=show,sale=sale)

			if user_show_alerts:
				return  Response({ 'status': 'alert_already_set' })
			else:
				if date == None:
					return  Response({ 'status': 'bad date' })
				

				date = dateutil.parser.parse(date)
				alert = Alert(is_active=True, show=show, date=date,user=user,which=which,sale=sale)
				alert.save()
				data = AlertSerializer(alert)
				return  Response( data.data )


		#get user alert count
		if action == 'alert_count':
			user_show_alerts = Alert.objects.filter(user=user)
			return  Response({ 'status': len(user_show_alerts) })

		return  Response({ 'status': 'bad_query' })




