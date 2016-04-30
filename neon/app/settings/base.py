# Admins for bug reports
ADMINS = ( 
    ('Davis Hunt', 'info@showgrid.com'),
)

from auth import *;
#Show image min dimentions




ECHONEST_MAX_BIO = 3 # (maximum amount of artist bios to pull)
ECHONEST_MAX_ARTICLES = 5 # (maxiumum amount of articles to pull)
ECHONEST_ARTICLES_NEWS_ONLY = False #this will mix artist blogs with news.
ECHONEST_BIO_WIKI_LASTFM_ONLY = False #this will only pull bio from websites wikipedia and last.fm


MANAGERS = ADMINS

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'America/Chicago'


# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'



SITE_ID = 1


# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True


# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True


# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True


# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)



# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)


MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'user.middleware.NeonUserMiddleware',
)




CORS_ORIGIN_ALLOW_ALL = True


ROOT_URLCONF = 'app.urls'


# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'app.wsgi.application'




INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Uncomment the next line to enable the admin:
    'suit',
    'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    'django.contrib.admindocs',
    
    'corsheaders',
 
    'colorful',
    'haystack',

    'app',
    'cal',
    'magazine',
    'newsletter',
    'show',
    'user',
    'venue',
    'contest',
    'rest_framework',
    'meta',
    'tinymce',
    'social.apps.django_app.default',
)




TINYMCE_DEFAULT_CONFIG = {
    'theme': "advanced",
}



REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
}



import os
HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.whoosh_backend.WhooshEngine',
        'PATH': os.path.join(os.path.dirname(__file__), 'whoosh_index'),
    },
}



SESSION_SERIALIZER = 'django.contrib.sessions.serializers.JSONSerializer'
