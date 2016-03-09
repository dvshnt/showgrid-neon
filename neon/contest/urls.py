from django.conf.urls import include, url
from contest import views


urlpatterns = [
    url(r'^(?P<id>\d+)/signup$', views.contest_signup, name='contest signup'),
    url(r'^(?P<id>\d+)$', views.contest_view, name='contest page'),
    url(r'^$', views.contest_view, name='contest archive'),
]