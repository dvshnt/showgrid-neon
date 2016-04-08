# Admins for bug reports
ADMINS = ( 
    ('Davis Hunt', 'info@showgrid.com'),
)


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}



#Show image min dimentions

from auth import *

# Twilio API keys and number
TWILIO_ACCOUNT_SID = 'AC537898c0aaf67d677d93716130df421b'
TWILIO_AUTH_TOKEN = '262857a0147e5f5a85719b47cf1a5edc'
TWILIO_NUMBER = '+1 931-444-6735'

IMAGE_MIN_WIDTH = 100
IMAGE_MIN_HEIGHT = 100


EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
ACCOUNT_ACTIVATION_DAYS = 3
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'davis@showgrid.com'
EMAIL_HOST_PASSWORD = '!woodle212'
EMAIL_PORT = 465
EMAIL_USE_SSL = True


SPOTIFY_KEY = ''
SPOTIFY_API = 'https://api.spotify.com/v1/'
ECHONEST_API = 'http://developer.echonest.com/api/v4/'
ECHONEST_KEY = 'ZOP6OTHBMGEZHVHTF'



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
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)


CORS_ORIGIN_ALLOW_ALL = True


ROOT_URLCONF = 'app.urls'


# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'app.wsgi.application'


from django.conf.global_settings import TEMPLATE_CONTEXT_PROCESSORS as TCP
TEMPLATE_CONTEXT_PROCESSORS = TCP + (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.contrib.messages.context_processors.messages',
    'social.apps.django_app.context_processors.backends',
)




INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.admin',
    'django.contrib.admindocs',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',

   
    'social.apps.django_app.default',

    'suit',

    'corsheaders',
    'rest_framework',
    'rest_auth',
    'meta',
    'tinymce',

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

   
   
)


TINYMCE_DEFAULT_CONFIG = {
    'theme': "advanced",
}


AUTH_USER_MODEL = 'user.NeonUser'
# AUTHENTICATION_BACKENDS = ( 'user.models.AuthBackend', )


# REST_AUTH_SERIALIZERS = {
#     'USER_DETAILS_SERIALIZER': 'app.serializers.ShowgridUserSerializer'
# }


REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    )
}




import os
HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.whoosh_backend.WhooshEngine',
        'PATH': os.path.join(os.path.dirname(__file__), 'whoosh_index'),
    },
}


SESSION_SERIALIZER = 'django.contrib.sessions.serializers.PickleSerializer'