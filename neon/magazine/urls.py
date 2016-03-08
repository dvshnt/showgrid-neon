from django.conf.urls import include, url
from magazine import views


urlpatterns = [
	url(r'^$', views.Magazine.as_view(), name='magazine archive'),

    url(r'^(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/(?P<day>[0-9]{2})/$', views.Magazine.as_view(), name='magazine ymd'),
    url(r'^(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/(?P<day>[0-9]{2})/(?P<id>[0-9]+)/$', views.Magazine.as_view(), name='magazine ymd title'),

    url(r'^(?P<label>\w+)/$', views.MagazineLabel.as_view(), name='magazine label'),
]