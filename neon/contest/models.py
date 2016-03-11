import re
import requests

from django.db import models
from django.template.loader import get_template

from tinymce.models import HTMLField

from app.util.color_log import *


class Contest(models.Model):
	def __unicode__ (self):
		return self.title

	banner = models.ImageField(upload_to='showgrid/img/contest/',blank=True)
	ogimage = models.ImageField(upload_to='showgrid/img/contest/',blank=True)
	
	description = HTMLField(default="")

	title = models.CharField(max_length=255,blank=True,null=True)
	short_title = models.CharField(max_length=100,blank=True,null=True)
	template_folder = models.CharField(max_length=255,blank=False,default='share4ticket')

	signup_subject = models.CharField(max_length=255,blank=False,default='thanks for joining the contest!')
	signup_body = HTMLField(default='')
	ended_subject = models.CharField(max_length=255,blank=False,default='contest has ended!')

	share_email_subject = models.CharField(max_length=255,blank=False,default='thanks for joining the contest!')
	share_email_body = models.TextField(default='')
	share_text_body = models.CharField(max_length=255,blank=False,default='thanks for joining the contest!')

	# winner = models.ForeignKey('Subscriber',related_name= 'contest_won', blank = True,null = True)
	active = models.BooleanField(default=False)

	def __init__(self, *args, **kwargs):
		super(Contest, self).__init__(*args, **kwargs)
		self.signup_templ = get_template('contest/mail_signup.html')
		self.ended_templ = get_template('contest/mail_ended.html')

	# def decideWinner(self):
	# 	parts = Subscriber.objects.filter(contest=self)
	# 	if parts == None or len(parts) == 0:
	# 		prRed('cannot decide winner with not participants.')
	# 		return False

	# 	choices = []
	# 	for p in parts:
	# 		for i in range(0,p.contest_points):
	# 			choices.append(p)
	# 	winner = random.choice(choices)
	# 	print choices
	# 	self.winner = winner
	# 	self.save()
	# 	return


	# def mailWinLetter(self):
	# 	if self.winner == None:
	# 		prRed('cannot mail win letter because no winner')
	# 		return False
	# 	if self.active == False:
	# 		prRed('cannot send win letter contest not active.')
	# 		return False
	# 	participants = Subscriber.objects.filter(contest=self)
	# 	title = self.ended_subject
	# 	text_alt =  self.ended_subject
	# 	html_ended_content = self.ended_templ.render({
	# 		'contest': self,
	# 	})

	# 	for p in participants:
	# 		msg = mail.EmailMultiAlternatives(title,text_alt,EMAIL_HOST_USER,[p.email])
	# 		msg.attach_alternative(html_ended_content,'text/html')
	# 		msg.send()
	# 	prRed('CONTEST '+self.title+' IS OVER')
	# 	self.active = False
	# 	self.save()


	def mailShareLetter(self,sub):
		mail_template = get_template('issues/issue_mail.html')
		if self.active == False:
			prRed('cannot send share letter contest not active.')
			return False

		if sub.email == None:
			email = sub.user.email
		else:
			email = sub.email

		title = self.signup_subject
		text_alt = 'Share this link http://showgrid.com/issue?ref='+sub.hash_name
		html_signup_content = self.signup_templ.render({
			'link': 'http://showgrid.com/issue?ref=' + sub.hash_name,
			'contest': self,
			'sub': sub
		})

		msg = mail.EmailMultiAlternatives(title,text_alt,EMAIL_HOST_USER,[email])
		msg.attach_alternative(html_signup_content , "text/html")
		msg.send()
		prGreen(sub.email+' has entered the contest!')
		self.save()