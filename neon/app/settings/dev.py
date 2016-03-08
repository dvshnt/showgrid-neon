import os
from base import *


# Make this unique, and don't share it with anybody.
SECRET_KEY = 'nl_tg!$q)=7^x*9fr2+gfg9$=z=$#l3yxnu2_xt(lun+i=ne&t'


DEBUG=True


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'neon', # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': 'root',
        'PASSWORD': '',
        'HOST': 'localhost',                      # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '',                      # Set to empty string for default.
    }
}

MEDIA_URL = '/media/'

MEDIA_ROOT = '/Users/arxii/Documents/neon/neon/media/'
STATIC_URL = '/static/'

STATICFILES_DIRS = ( os.path.join('static'), )
STATIC_ROOT = '/Users/arxii/Documents/neon/neon/temp/'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            '/Users/arxii/Documents/neon/neon/templates/',
            '/Users/arxii/Documents/neon/neon/cal/templates/',
            '/Users/arxii/Documents/neon/neon/magazine/templates/',
            '/Users/arxii/Documents/neon/neon/newsletter/templates/',
            '/Users/arxii/Documents/neon/neon/show/templates/',
            '/Users/arxii/Documents/neon/neon/user/templates/',
            '/Users/arxii/Documents/neon/neon/venue/templates/',
        ],
        'OPTIONS': { 
            'loaders': [
                'django.template.loaders.filesystem.Loader',
                'django.template.loaders.app_directories.Loader',
            ],
            'debug': True,
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

