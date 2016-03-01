from django.conf.urls import include, url
from venue import views


urlpatterns = [
    url(r'^$', views.Venue.as_view(), name='venue list'),
    url(r'^(?P<id>[0-9]+)/$', views.Venue.as_view(), name='venue detail'),
]