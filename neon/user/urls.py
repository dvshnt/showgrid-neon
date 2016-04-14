from django.conf.urls import include, url
from user import views, auth
from django.contrib import admin
from social.apps.django_app.utils import psa

admin.autodiscover()
urlpatterns = [

	url(r'^profile/(?P<id>\d+)$$', views.public_profile, name='profile'),
	url(r'^profile$', views.private_profile, name='profile'),
	url(r'^update/?$',views.update_profile,name='update_profile'),

	
	url(r'^rest/(?P<action>\w+)$', views.UserActions.as_view(), name='user actions'),
    # url(r'^ajax-auth/(?P<backend>[^/]+)/$', views.ajax_auth,
    #     name='ajax-auth'),
  
    url(r'^login/?$',views.Login,name='login'),
    url(r'^logout/?$',views.Logout,name='logout'),
	url(r'^signup/?$',views.Signup,name='signup'),

	url(r'', include('social.apps.django_app.urls', namespace='social')),
]