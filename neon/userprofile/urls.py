from django.conf.urls import include, url
from userprofile import views, auth
from django.contrib import admin
from social.apps.django_app.utils import psa

admin.autodiscover()
urlpatterns = [
	url(r'^$', views.private_profile, name='profile'),
	url(r'^profile/(?P<id>\d+)$', views.public_profile, name='profile'),
	url(r'^profile$', views.private_profile, name='profile'),

	url(r'^update/?$',views.update_profile,name='update_profile'),
	url(r'^update_pass/?$',views.update_profile_password,name='update_profile'),


	
	url(r'^rest/(?P<action>\w+)$', views.UserActions.as_view(), name='user actions'),


    url(r'^login/?$',views.login,name='login'),
    url(r'^logout/?$',views.logout,name='logout'),
	url(r'^signup/?$',views.signup,name='signup'),

	url(r'', include('social.apps.django_app.urls', namespace='social')),
]