import pytz

from django.db import models

from show.models import Venue

from tinymce.models import HTMLField

from app.util.color_log import *


class Newsletter(models.Model):
	def __unicode__ (self):
		return self.tag or u''
	
	intro = HTMLField(default="")

	tag = models.CharField(max_length=255,blank=False,default='Issue')

	spotify_embed = models.CharField(max_length=255,blank=True,null=True)
	spotify_url = models.URLField(blank=True,null=True)

	banner = models.ImageField(upload_to='showgrid/img/newsletters/',blank=True)

	start_date = models.DateTimeField(blank=False)
	end_date = models.DateTimeField(blank=False)

	shows_count = models.PositiveSmallIntegerField(default=0)

	sent = models.BooleanField(default=False)
	active = models.BooleanField(default=False)

	timezone =  models.CharField(max_length=255,default='US/Central')
	

	def sync_shows(self):
		existing_shows = Show.objects.filter(issue=self)
		for show in existing_shows:
			show.issue = None
			show.save()

		issue_shows = Show.objects.filter(Q(date__gt = self.start_date) & Q(date__lt = self.end_date)).filter(star=True)
		for show in issue_shows:
			show.issue = self
			show.save()
		self.shows_count = len(issue_shows)
		self.save()


	def render(self,template,sub):
		issue_shows = []
		shows = Show.objects.filter(issue=self).order_by('date')

		last_date = None

		dates = []

		date = None

		for show in shows:
			localtz = pytz.timezone(self.timezone)
			s_date = show.date.astimezone(localtz)

			show_data = {
				"show_time": s_date.strftime('%-I:%M %p'),
				"age_string": render_age(show.age),

				"venue_name": show.venue.name,
				"venue_primary": show.venue.primary_color,
				"venue_secondary": show.venue.secondary_color,
				
				"show_link": show.website,
				"venue_link": HOST + "/venue/" + str(show.venue.id),

				"title": show.title,
				"headliners": show.headliners,
				"openers": show.openers,

				"link": show.website,
			}

			if date == None or last_date != s_date.day:
				date = {
					"date_day": s_date.strftime('%a'),
					"date_number": s_date.day,
					"date_month": s_date.strftime('%b'), 
					"shows": []
				}
				dates.append(date)
			
			date["shows"].append(show_data)
			last_date = s_date.day

		if sub != None:
			unsub_link = HOST + "/newsletter/unsubscribe/" + sub.hash_name
		else:
			unsub_link = None

		html = template.render({
			"id": self.id,

			"start_date": self.start_date,
			"end_date": self.end_date,
			"dates": dates,

			"intro": self.intro,
			"spotify_embed": self.spotify_embed,
			"spotify_url": self.spotify_url,

			"issue_link": HOST + "/newsletter/" + str(self.id),
			"unsub_link": unsub_link,
			
			"tag": self.tag,
			"banner": self.banner
		})

		return html
	

	#mail issue to all users.
	# def mail(self,test):
	# 	if self.sent == True:
	# 		print('issue ',self.index,' already sent, please override sent boolean in database to False manually')
	# 		return
	# 	else:
	# 		subscribers = Subscriber.objects.all()
	# 		for sub in subscribers:
	# 			if test == True and sub.is_tester == True:
	# 				sub.sendIssue(self)
	# 			elif test == False:
	# 				sub.sendIssue(self)

	# 		if test == False:
	# 			self.sent = True
	# 			self.save()