from django.conf.urls import include, url
from show import views


urlpatterns = [
    url(r'^(?P<id>[0-9]+)/$', views.ShowView.as_view(), name='show detail'),

	url(r'^$', views.ShowList.as_view(), name='show list'),
    url(r'^(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/(?P<day>[0-9]{2})/$', views.ShowList.as_view(), name='show list date'),

    url(r'^(?P<shortcut>\w+)/$', views.ShowShortcut.as_view(), name='show shortcut'),
]