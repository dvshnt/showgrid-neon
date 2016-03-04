from django.conf.urls import include, url
from cal import views


urlpatterns = [
	url(r'^$', views.Calendar.as_view(), name='calendar'),
	
    url(r'^today/$', views.Calendar.as_view(), name='calendar today'),

    url(r'^(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/(?P<day>[0-9]{2})/$', views.Calendar.as_view(), name='calendar ymd'),
]