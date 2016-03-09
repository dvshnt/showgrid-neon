import random
import requests

from show.models import *
from venue.models import *
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


def extract_artists_from_shows_action_noupdate(modeladmin, request, queryset):
	queryset.update(extract_queued=True)
	selected = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)	
	tr = Thread(target=extract_artists_data,args=(queryset,False))
	tr.start()
	return HttpResponseRedirect('/admin/show/show/extractstatus/?ids=%s' % (",".join(selected)) );
extract_artists_from_shows_action_noupdate.short_description = "Extract artists with IDs only"


def extract_artists_from_shows_action(modeladmin, request, queryset):
	queryset.update(extract_queued=True)
	selected = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)	
	tr = Thread(target=extract_artists_data,args=(queryset,True))
	tr.start()
	return HttpResponseRedirect('/admin/show/show/extractstatus/?ids=%s' % (",".join(selected)) );
extract_artists_from_shows_action.short_description = "Extract artists with full data"


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
		show.star = True
		show.save()
pull_artist_data_action.short_description = "Star Shows"


def unstar_shows(modeladmin, request, queryset):
	shows = list(queryset)
	for show in shows:
		show.star = False
		show.save()
pull_artist_data_action.short_description = "Unstar Shows"



class ShowAdmin(admin.ModelAdmin):
	search_fields = ['headliners', 'openers', 'title']
	list_display = ('date', 'headliners', 'openers','star','venue')
	actions = [extract_artists_from_shows_action,extract_artists_from_shows_action_noupdate,star_shows,unstar_shows]
	list_filter =  ('venue',)


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
	list_display = ['url', 'source']
	search_fields = ['source']


class ArticleAdmin(admin.ModelAdmin):
	list_display = ['title', 'published_date','external_url']
	search_fields = ['title','external_url']


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
	list_display = ['artist_name','local','downloaded','downloading','valid']
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


admin.site.register(Address)
admin.site.register(Venue)
admin.site.register(Show, ShowAdmin)
admin.site.register(Artist, ArtistAdmin)
admin.site.register(Article, ArticleAdmin)
admin.site.register(Biography,BioAdmin)
admin.site.register(Track,TrackAdmin)
admin.site.register(Genre)
admin.site.register(Image,ImageAdmin)
admin.site.register(Newsletter,NewsletterAdmin)
