from django.conf.urls import include, url
from newsletter import views


urlpatterns = [
    url(r'^$', views.NewsletterView.as_view(), name='issues'),
    url(r'^(?P<id>[0-9]+)$', views.NewsletterView.as_view(), name='issues'),

    # url(r'^unsubscribe/(?P<hash>\w+)$', views.IssueUnsubscribe, name='issue unsubscribe'),
]