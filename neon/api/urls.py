from django.conf.urls import include, url
from api import views


urlpatterns = [
	url(r'^$', views.version, name='version'),

    url(r'^(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/(?P<day>[0-9]{2})/$', views.API.as_view(), name='calendar ymd api'),
]