import schedule
import time
from server.models import *
from termcolor import colored



def check_alerts():
	
	alerts = Alert.objects.all()
	print colored('checking alerts #'+ str(len(alerts))+'...','green')
	
	for alert in alerts:
		if alert.check_send() == True:
			alert.delete()


def clear_pin_sent_timeouts():
	
	users = ShowgridUser.objects.all()
	print colored('clearing pin sent timeouts #'+ str(len(users))+'...','green')
	
	for user in users:
		user.pin_sent = False
		user.save()


def clear_unverified_phones():
	
	users = ShowgridUser.objects.all()
	print colored('clearing unverified phones #'+ str(len(users))+'...','green')
	
	for user in users:
		if user.phone_verified == False:
			user.phone_number = None
			user.save()



#incase of errors and slerts didnt get sent. (up to 2 retries depending on schedule and alert_leeway)
#normally alerts will be deleted after they are sent.
def clear_alert_send_timeout():
	
	alerts = Alert.objects.all()
	print colored('setting all alerts sent to 0 incase some failed to send #'+ str(len(alerts))+'...','green')
	
	for alert in alerts:
		alert.sent = 0
		alert.save()



from django.core.management.base import NoArgsCommand


class Command(NoArgsCommand):
	help = "check alerts, clear pin timouts, clear phones, clear alert send timeouts"
	def handle_noargs(self, **options):

		
		#start all
		check_alerts()
		clear_pin_sent_timeouts()
		clear_unverified_phones()
		clear_alert_send_timeout()

		print colored('WAITING...','yellow')
		schedule.every(2).minutes.do(check_alerts)
		schedule.every(1).minutes.do(clear_pin_sent_timeouts)
		schedule.every(10).minutes.do(clear_unverified_phones)
		schedule.every(5).minutes.do(clear_alert_send_timeout)


		while True:
			schedule.run_pending()
			time.sleep(1)
