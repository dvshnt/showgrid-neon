import random
import requests

from datetime import date

from user.models import *
from show.models import *
from venue.models import *
from contest.models import *
from newsletter.models import *

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import ugettext_lazy as _

from django.contrib.contenttypes.models import ContentType
from django.conf.urls import patterns, include, url

from django.http import HttpResponse, HttpResponseRedirect 
from django.template.response import TemplateResponse

from threading import Thread
from itertools import chain

from app.util.color_log import *


def extract_artists_data(queryset,update):
	shows = queryset.all()
	for show in shows:
		show.extract_artists_from_name(update)


def get_artists_images(queryset):
	artists = list(queryset)
	for artist in artists:
		artist.download_images()


def update_artists_data(queryset):
	artists = list(queryset)
	for artist in artists:
		artist.update_all()


def get_artists_data(queryset):
	artists = list(queryset)
	for artist in artists:
		artist.pull_all()

def download_image(queryset):
	images = list(queryset)
	for img in images:
		img.download()	


def download_image_action(modeladmin, request, queryset):
	queryset.update(downloading=True)
	tr = Thread(target=download_image,args=(queryset,))
	tr.start()
download_image_action.short_description = "Download"


# def extract_artists_from_shows_action_noupdate(modeladmin, request, queryset):
# 	queryset.update(extract_queued=True)
# 	selected = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)	
# 	tr = Thread(target=extract_artists_data,args=(queryset,False))
# 	tr.start()
# 	return HttpResponseRedirect('/admin/show/show/extractstatus/?ids=%s' % (",".join(selected)) );
# extract_artists_from_shows_action_noupdate.short_description = "Extract artists with IDs only"


def extract_artists_from_shows_action(modeladmin, request, queryset):
	queryset.update(extract_queued=True)
	selected = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)	
	tr = Thread(target=extract_artists_data,args=(queryset,True))
	tr.start()
	return HttpResponseRedirect('/admin/show/show/extractstatus/?ids=%s' % (",".join(selected)) );
extract_artists_from_shows_action.short_description = "UPDATE SHOW DATA"


#only update thos
def update_artist_data_action(modeladmin, request, queryset):
	queryset.update(queued=True,pulled_spotify=False,pulled_echonest=False)
	ct = ContentType.objects.get_for_model(queryset.model)
	selected = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)
	#que artist for update
	#start thread
	tr = Thread(target=update_artists_data,args=(queryset,))
	tr.start()
	return HttpResponseRedirect('/admin/show/artist/pullstatus/?ids=%s' % (",".join(selected)) );
update_artist_data_action.short_description = "Update artist data"


def download_artist_images_action(modeladmin, request, queryset):
	queryset.update(queued=True)

	ct = ContentType.objects.get_for_model(queryset.model)
	selected = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)
	
	#start thread
	tr = Thread(target=get_artists_images,args=(queryset,))
	tr.start()
download_artist_images_action.short_description = "Download Artist Images"


def pull_artist_data_action(modeladmin, request, queryset):
	queryset.update(queued=True,pulled_spotify=False,pulled_echonest=False)
	
	ct = ContentType.objects.get_for_model(queryset.model)
	selected = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)

	#start thread
	tr = Thread(target=get_artists_data,args=(queryset,))
	tr.start()

	#redirect to update view status
	return HttpResponseRedirect('/admin/show/artist/pullstatus/?ids=%s' % (",".join(selected)) );
pull_artist_data_action.short_description = "Pull artist data"


def star_shows(modeladmin, request, queryset):
	shows = list(queryset)
	for show in shows:
		show.featured = True
		show.save()
pull_artist_data_action.short_description = "Star Shows"


def unstar_shows(modeladmin, request, queryset):
	shows = list(queryset)
	for show in shows:
		show.featured = False
		show.save()
pull_artist_data_action.short_description = "Unstar Shows"
















from django import forms
# from django.utils.translation import ugettext as _
from django.utils.safestring import mark_safe
from django.utils.encoding import smart_unicode
from django.forms.util import flatatt
from django.contrib import admin
from django.forms import ModelForm
# from django.contrib.admin.widgets import AdminFileWidget
from django.forms.widgets import RadioSelect

# class AdminImageWidget(RadioSelect):
# 	__init__(self,*args,**kwargs):
# 		super(RadioSelect, self).__init__(*args, **kwargs)
# 		self

# 	def render(self, name, value, attrs=None, choices=()):
# 		output = []
# 		self.choices = []
# 		images = self.form_instance.instance.images.all()
# 		for img in images:
# 			# append image to selection.
			
		

			
# 			if getattr(img,"local",None):
# 				image_url = img.local.url
# 				file_name = img.local
# 				img_info = u'<p><b>width : </b>%s<br/> <b>height : </b> %s<br/><b>path : </b>%s<br/><b>name : </b>%s</p>' % (img.width,img.height,file_name,img.name)
# 				output.append(u' <div style = "background:#E9E9E9; margin: 5px;"><a href="%s" target="_blank"><img style="height:150px; width:auto;" src="%s"/></a><div style="float:right;background:#fff;border-radius:2px;margin: 10px; padding: 10px;">%s</div></div>' % \
# 					(image_url, image_url,img_info))
# 				output.append(options)
# 				self.choices.append((img.id,))

# 			else:
# 				output.append(u'<span>image not downloaded</span>')
# 		final_attrs = self.build_attrs(attrs, name=name)


# 		output.append(u'<select%s>' % flatatt(final_attrs))
# 		options = self.render_options(choices, [value])

# 		if len(images) == 0:
# 			output.append(u'<span>show has no images, have you extracted the artists ?</span>')
		
# 		return mark_safe(u'\n'.join(output))


class ShowForm(ModelForm):
	def __init__(self, *args, **kwargs):
		super(ShowForm, self).__init__(*args, **kwargs)
		# self.fields['banner'].widget.form_instance = self
		# self.fields['banner'].queryset = self.instance.images
		choices = []
		print "SHOW FORM"

		if self.instance.pk is None: 
			print "BAD INSTANCE PK"
			self.fields['banner'].choices = []
			return



		#image query.
		image_query = None
		artists = self.instance.artists.all()
		for artist in artists:
			if image_query == None:
				image_query = artist.images
			else:
				image_query = image_query | artist.images

		images = image_query.all()
		print "IMAGES LENGTH ",len(images)
		for img in images:
			output = []

			
			if getattr(img,"local",None):
				print img.local
				image_url = img.local.url
				file_name = img.local

				img_info = u'<p><b>width : </b>%s<br/> <b>height : </b> %s<br/><b>path : </b>%s<br/><b>name : </b>%s</p>' % \
					(img.width,img.height,file_name,img.name)

				output.append(u' <div style = " background:#B6E9B5; margin: 5px; margin-bottom: 15px; margin-top:5px;"><a href="%s" target="_blank"><img style="height:150px; width:auto;" src="%s"/></a><div style="float:right;background:#fff;border-radius:2px;margin: 10px; padding: 10px;">%s</div></div><hr/>' % \
					(image_url, image_url,img_info))
			else:
				print "TEST"
				img_info = u'<p><b>width : </b><span id = "%s"></span><br/> <b>height :</b> <span id = "%s"></span><br/> %s<br/></p>' % \
					("image_width_"+str(img.id),"image_height_"+str(img.id),'<b>image not downloaded</b>')
				output.append(u' <div style = " background:#E9E9E9; margin: 5px; margin-bottom: 15px; margin-top:5px;"><a  href="%s" target="_blank"><img class = "%s" data-id="%s" style="height:150px; width:auto;" src="%s"/></a><div style="float:right;background:#fff;border-radius:2px;margin: 10px; padding: 10px;">%s</div></div><hr/>' % \
					(img.url,"show_image",img.id, img.url,img_info))
				output.append(u'')

			choices.append((img.id,mark_safe(u'\n'.join(output))))

		self.fields['banner'].choices = choices



	banner = forms.ModelChoiceField(Image.objects,
		label="Show Banner", 
		widget = RadioSelect,
		required=False
	)



	class Meta:
		model = Show
		fields = ('banner',)

def download_banners(modeladmin, request, queryset):
	shows = list(queryset)
	for show in shows:
		show.banner.download()

download_banners.short_description = "Download Show Banners"



class ShowAdmin(admin.ModelAdmin):
	search_fields = ['headliners','openers','title']

	list_display = ('date', 'headliners', 'openers','featured','venue')
	actions = [extract_artists_from_shows_action,star_shows,unstar_shows,download_banners]

	list_filter =  ('venue',)
	form = ShowForm
	fieldsets = (
		('Artist Info', {
			'fields': ('title', 'headliners','openers','artists','website')
		}),
		('Time and Place', {
			'fields': ('date','venue')
		}),
		('Featured Info', {
			'fields': ('featured','review','issue')
		}),
		('Banner', {
			'fields': ('banner',)
		}),
		('Ticket Info', {
			'fields': (('ticket','price'),'onsale')
		}),
		('Show Status', {
			'fields': ('cancelled','soldout',)
		}),
	)
	class Media:
		js = ('/static/showgrid/js/bundle.js','/static/showgrid/js/show_admin.js',)


	def get_urls(self):
		urls = super(ShowAdmin, self).get_urls()
		my_urls = [
			url(r'^extractstatus/$', self.extract_view),
		]
		return my_urls + urls

	def extract_view(self, request):
		ids = request.GET['ids'].split(',')
		shows = []
		done = 0
		done_artists = total_artists = 0

		for i in ids:
			show = Show.objects.get(id=i)
			if show.extract_queued == False:
				# print show.extract_queued
				done += 1
				done_artists = total_artists = show.artists.count()
			else:
				artists = show.artists.all()
				total_artists = done_artists = 0
				for a in artists:
					total_artists += 1
					if a.queued == False:
						done_artists += 1

			shows.append({'name':show.headliners,'done_all':False if show.extract_queued else True,'artist_count':str(done_artists)+'/'+str(total_artists)})

		context = dict(
			self.admin_site.each_context(request),
			done = True if len(shows) <= done else False,
			count = str(done)+'/'+str(len(shows)),
			shows = shows
		)

		return TemplateResponse(request, "admin/show_extract_status.html", context)




class BioAdmin(admin.ModelAdmin):
	list_display = ['artist_name','text','source']
	search_fields = ['source']

	def artist_name(self, obj):
		try:
			return Artist.objects.filter(bios__id=obj.id)[0].name
		except:
			obj.delete()


class ArticleAdmin(admin.ModelAdmin):
	list_display = ['title','artist_name','published_date','external_url']
	search_fields = ['title','external_url']

	def artist_name(self, obj):
		try:
			return Artist.objects.filter(articles__id=obj.id)[0].name
		except:
			obj.delete()


class ArtistAdmin(admin.ModelAdmin):
	list_display = ['name','queued','pulled','pulled_date']
	ordering = ['name','pulled_date','pulled','queued']
	fields = ('name','articles','genres','images','tracks','bios','echonest_id','spotify_id','facebook_url','twitter_url','spotify_link')
	actions = [pull_artist_data_action,update_artist_data_action,download_artist_images_action]


	def get_urls(self):
		urls = super(ArtistAdmin, self).get_urls()
		my_urls = [
			url(r'^pullstatus/$', self.status_view),
		]
		return my_urls + urls

	def status_done_view(self, request):
		ids = request.GET['ids'].split(',')

	def status_view(self, request):
		ids = request.GET['ids'].split(',')
		artists = []
		done = 0

		for i in ids:
			artist = Artist.objects.get(id=i)
			if artist.queued == False:
				done += 1
			artists.append({'id':i,'name':artist.name,'done_all':False if artist.queued else True,'done_spotify':artist.pulled_spotify,'done_echonest':artist.pulled_echonest})

		context = dict(
			self.admin_site.each_context(request),
			done = True if len(artists) <= done else False,
			count = str(done)+'/'+str(len(artists)),
			artists = artists
		)

		return TemplateResponse(request, "admin/artist_pull_status.html", context)


class ImageAdmin(admin.ModelAdmin):
	list_display = ['artist_name', 'local','downloaded','downloading','valid']
	ordering = ['downloaded','name']
	fields = ('downloaded','url','local')
	actions = [download_image_action]

	def artist_name(self, obj):
		return Artist.objects.filter(images__id=obj.id)[0].name


def mail_issues(queryset,test):
	issues = list(queryset)
	for issue in issues:
		if issue.sent == True:
			print prRed('issue already mailed, override sent field manually :'+str(issue.id))
		else:
			issue.mail(test)
		
def mail_issues_action(modeladmin, request, queryset):
	tr = Thread(target=mail_issues,args=(queryset,False,))
	tr.start()
mail_issues_action.short_description = "Mail Issues To All"


def mail_issues_action_test(modeladmin, request, queryset):
	tr = Thread(target=mail_issues,args=(queryset,True,))
	tr.start()
mail_issues_action_test.short_description = "Mail Issues To Testers"

def make_issue_active(modeladmin, request, queryset):
	issues = list(queryset)
	for issue in issues:
		issue.active = True
		issue.save()
make_issue_active.short_description = "Make Issues Active"

def make_issue_inactive(modeladmin, request, queryset):
	issues = list(queryset)
	for issue in issues:
		issue.active = False
		issue.save()
make_issue_inactive.short_description = "Make Issues Inactive"

def sync_issue_shows(queryset):
	issues = list(queryset)
	for issue in issues:
		issue.sync_shows()

def sync_issue_shows_action(modeladmin, request, queryset):
	tr = Thread(target=sync_issue_shows,args=(queryset,))
	tr.start()
sync_issue_shows_action.short_description = "Sync Shows to Issue"

class NewsletterAdmin(admin.ModelAdmin):
	list_display = ['id','tag','shows_count','sent','active','start_date','end_date']
	ordering = ['sent','start_date','end_date']
	fields = ('timezone','banner','spotify_embed','spotify_url','tag','start_date','end_date','intro','sent','active')
	list_filter =  ('sent',)
	actions = [mail_issues_action,sync_issue_shows_action,make_issue_active,make_issue_inactive,mail_issues_action_test]



class TrackAdmin(admin.ModelAdmin):
	list_display = ['name','artist_name','source']

	def artist_name(self, obj):
		return Artist.objects.filter(tracks__id=obj.id)[0].name



class VenueAdmin(admin.ModelAdmin):
	list_display = ['name','active_shows','opened']
	fieldsets = (
		('Basic Info', {
			'fields': ('name', 'address')
		}),
		('Visial Info', {
			'fields': ('description', 'image')
		}),
		('Contact Info', {
			'fields': ('phone', ('website','twitter_url', 'facebook_url'))
		}),
		('Colors', {
			'fields': (('primary_color', 'secondary_color', 'accent_color'),)
		}),
		('Secondary Info', {
			'fields': (('age', 'autofill'),)
		}),
		('Status', {
			'fields': ('opened',)
		}),
	)

	def active_shows(self, obj):
		return len(Show.objects.filter(venue=obj).filter(date__gte=date.today()))


class ContestAdmin(admin.ModelAdmin):
	list_display = ['title','active']
	fieldsets = (
		('Basic Info', {
			'fields': (('title', 'short_title'), 'description', ('banner','ogimage'),)
		}),
		('Signup Email', {
			'fields': ('signup_subject', 'signup_body',)
		}),
		('Share Email', {
			'fields': ('share_email_subject', 'share_email_body', 'share_text_body',)
		}),
		('Ended Contest Email', {
			'fields': ('ended_subject',)
		}),
		('Status', {
			'fields': ('active',)
		}),
	)

	def participants(self, obj):
		return len(Show.objects.filter(venue=obj).filter(date__gte=date.today()))



admin.site.register(NeonUser)
admin.site.register(Address)
admin.site.register(Venue, VenueAdmin)
admin.site.register(Contest, ContestAdmin)
admin.site.register(Show, ShowAdmin)
admin.site.register(Artist, ArtistAdmin)
admin.site.register(Article, ArticleAdmin)
admin.site.register(Biography,BioAdmin)
admin.site.register(Track,TrackAdmin)
admin.site.register(Genre)
admin.site.register(Image,ImageAdmin)
admin.site.register(Newsletter,NewsletterAdmin)
