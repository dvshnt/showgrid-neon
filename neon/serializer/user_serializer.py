
from user.models import Alert, NeonUser
from show.models import Show

from rest_framework import serializers
from datetime import timedelta, date, datetime

from django.utils import timezone

from serializer import ShowSerializer


class AlertSerializer(serializers.ModelSerializer):
	class Meta:
		model = Alert
		fields = ( 'id' , 'date' , 'sale' , 'which', 'show')

	show = serializers.SerializerMethodField('get_alert_show') 

	def get_alert_show(self,obj):
		return ShowSerializer(obj.show).data




class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = NeonUser
		# ADD BACK ADDRESS INFO LATER
		fields = (
			'name', 'email', 'phone', 'alerts','favorites', 'pic', 'bio'
		)

	alerts = serializers.SerializerMethodField('get_user_alerts')
	favorites = serializers.SerializerMethodField('get_user_favorites')

	def get_user_alerts(self, obj):
		def make(a):
			return AlertSerializer(a).data
		return map(make, Alert.objects.filter(user=obj, show__date__gte=date.today()))
		

	def get_user_favorites(self,obj):
		def make(show):
			return ShowSerializer(show).data
		return map(make,obj.favorites.all())

