from django.conf.urls import include, url

from app import views
from app.settings import dev as settings
from rest_framework.authtoken import views as auth_views

from django.contrib import admin
admin.autodiscover()

from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views import static


urlpatterns = [

	## version/ping
    # url(r'^version/','server.views.version',name='version'),

    ## Standard Django admin endpoints for a crude CMS
    url(r'^admin/', include(admin.site.urls)),
    
    url(r'^$', views.Index.as_view(), name='index'),

    url(r'^api/v1/', include('api.urls'), name='api'),
    
    url(r'^search/', views.Search.as_view(), name='search'),

    url(r'^calendar/', include('cal.urls'), name='calendar'),
    url(r'^newsletter/', include('newsletter.urls'), name='newsletter'),
    url(r'^venue/', include('venue.urls'), name='venue'),
    url(r'^show/', include('show.urls'), name='show'),
    url(r'^user/', include('user.urls'), name='user'),
    url(r'^mag/', include('magazine.urls'), name='magazine'),

    url(r'^media/(?P<path>.*)$', static.serve,
        {'document_root': settings.MEDIA_ROOT, 'show_indexes': True }
    ),

] +  staticfiles_urlpatterns()