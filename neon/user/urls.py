from django.conf.urls import include, url
from user import views

urlpatterns = [
	url(r'^profile$', views.Profile, name='profile'),
	url(r'^login$',views.Login,name='login'),
	url(r'^logout$',views.Logout,name='logout'),
	url(r'^signup$',views.Signup,name='signup'),
	url(r'^rest/(?P<action>\w+)$', views.UserActions.as_view(), name='user actions'),
	url(r'^auth/',include('social.apps.django_app.urls', namespace='social')),
]

