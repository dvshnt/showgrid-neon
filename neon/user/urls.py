from django.conf.urls import include, url
from user import views


urlpatterns = [
    url(r'^$', views.User.as_view(), name='user detail'),
    url(r'^(?P<id>[0-9]+)$', views.User.as_view(), name='user detail'),

    url(r'^(?P<action>\w+)$', views.UserActions.as_view(), name='user actions'),
]