from django.utils.translation import ugettext as _
from django.db import models
from django.conf import settings
import os
import logging
import json


from show.models import Show
from user import User

DEFAULT_USER_ID = 1 #for migration 
DEFAULT_SHOW_ID = 1 #for migration
alert_leeway = 30 # if alert time distance :30 seconds away from time of check

logger = logging.getLogger(__name__)

from twiliohandle import MessageClient
Sender = MessageClient()








class Alert(models.Model):
	is_active = models.BooleanField(default=True)
	user = models.ForeignKey(User,related_name='user alerts')
	date = models.DateTimeField(blank=False)
	show = models.ForeignKey(Show,related_name='show alerts')
	sent = models.PositiveSmallIntegerField(default=0)
	which = models.PositiveSmallIntegerField(default=0)
	sale = models.BooleanField(default=False)

	def check_send(self):

		def get_show_time_from_now(which, date):
			if which == 0: return "right now"
			if which == 1: return "in 30 minutes"
			if which == 2: return "in an hour"
			if which == 3: return "in 2 hours"
			if which == 4: return "tomorrow"
			if which == 5: return "in 2 days"
			if which == 6: return "in a week"

			return date.strftime('%a, %b %d at %I:%M %p')

		def construct_sale_message(alert):
			show = Show.objects.get(id=alert.show.id)
			venue = Venue.objects.get(id=show.venue.id)

			headliner = show.headliners
			venue = venue.name

			if show.ticket:
				ticket = "Get your tickets here: %s" % show.ticket
			else:
				ticket = ""

			when = get_show_time_from_now(alert.which, show.date)

			msg = "Tickets for %s at %s are on sale %s! %s" % (headliner, venue, when, ticket)

			return msg			

		def construct_text_message(alert):
			show = Show.objects.get(id=alert.show.id)
			venue = Venue.objects.get(id=show.venue.id)

			headliner = show.headliners
			venue = venue.name

			if show.ticket:
				ticket = "Get your tickets here: %s" % show.ticket
			else:
				ticket = ""

			when = get_show_time_from_now(alert.which, show.date)

			msg = "Showgrid here reminding you that %s plays at %s %s.\n\n %s" % (headliner, venue, when, ticket,)

			return msg

		now_time = timezone.now()
		alert_time = self.date

		time_diff = alert_time - now_time

		if time_diff.total_seconds() < alert_leeway and self.sent < 1:

			if self.sale:
				msg = construct_sale_message(self)
			else:
				msg = construct_text_message(self)
			print colored('sending alert to '+self.user.phone+' ( is sale ? : ' + str(self.sale) + ' ) ', 'green')
			Sender.send_message(msg,self.user.phone)
			self.sent += 1
			self.save()
			return True
		return False



DEFAULT_USER_ID = 1 #for migration 
DEFAULT_SHOW_ID = 1 #for migration
alert_leeway = 30 # if alert time distance :30 seconds away from time of check

class Alert(models.Model):
	is_active = models.BooleanField(default=True)
	user = models.ForeignKey(settings.AUTH_USER_MODEL,default=DEFAULT_USER_ID,related_name='alerts')
	date = models.DateTimeField(blank=False)
	show = models.ForeignKey(Show,default=DEFAULT_SHOW_ID,related_name='alerts')
	sent = models.PositiveSmallIntegerField(default=0)
	which = models.PositiveSmallIntegerField(default=0)
	sale = models.BooleanField(default=False)

	def check_send(self):

		def get_show_time_from_now(which, date):
			if which == 0: return "right now"
			if which == 1: return "in 30 minutes"
			if which == 2: return "in an hour"
			if which == 3: return "in 2 hours"
			if which == 4: return "tomorrow"
			if which == 5: return "in 2 days"
			if which == 6: return "in a week"

			return date.strftime('%a, %b %d at %I:%M %p')

		def construct_sale_message(alert):
			show = Show.objects.get(id=alert.show.id)
			venue = Venue.objects.get(id=show.venue.id)

			headliner = show.headliners
			venue = venue.name

			if show.ticket:
				ticket = "Get your tickets here: %s" % show.ticket
			else:
				ticket = ""

			when = get_show_time_from_now(alert.which, show.date)

			msg = "Tickets for %s at %s are on sale %s! %s" % (headliner, venue, when, ticket)

			return msg			

		def construct_text_message(alert):
			show = Show.objects.get(id=alert.show.id)
			venue = Venue.objects.get(id=show.venue.id)

			headliner = show.headliners
			venue = venue.name

			if show.ticket:
				ticket = "Get your tickets here: %s" % show.ticket
			else:
				ticket = ""

			when = get_show_time_from_now(alert.which, show.date)

			msg = "Showgrid here reminding you that %s plays at %s %s.\n\n %s" % (headliner, venue, when, ticket,)

			return msg

		now_time = timezone.now()
		alert_time = self.date

		time_diff = alert_time - now_time

		if time_diff.total_seconds() < alert_leeway and self.sent < 1:

			if self.sale:
				msg = construct_sale_message(self)
			else:
				msg = construct_text_message(self)
			print colored('sending alert to '+self.user.phone+' ( is sale ? : ' + str(self.sale) + ' ) ', 'green')
			Sender.send_message(msg,self.user.phone)
			self.sent += 1
			self.save()
			return True
		return False

