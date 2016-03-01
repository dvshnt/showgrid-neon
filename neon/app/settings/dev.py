import os

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'nl_tg!$q)=7^x*9fr2+gfg9$=z=$#l3yxnu2_xt(lun+i=ne&t'

from base import *


DEBUG=True


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'sgdb',                      # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': 'root',
        'PASSWORD': 'showgrid',
        'HOST': '',                      # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '',                      # Set to empty string for default.
    }
}


MEDIA_ROOT = ''
MEDIA_URL = ''


STATIC_ROOT = ''
STATIC_URL = '/static/'


STATICFILES_DIRS = ( os.path.join('static'), )


TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    '/Users/vdh3/Documents/Shwgrid/nashvilleneon/neon/templates/',
    #os.path.join(BASE_DIR, 'client', 'views')
)