from django.conf.urls import include, url
from newsletter import views


urlpatterns = [
	url(r'^$', views.Newsletter.as_view(), name='newsletter archive'),

    url(r'^current/$', views.Newsletter.as_view(), name='newsletter current'),
    url(r'^unsubscribe/$', views.Newsletter.as_view(), name='newsletter unsubscribe'),
    
    url(r'^(?P<id>[0-9]+)/$', views.Newsletter.as_view(), name='newsletter detail'),
]