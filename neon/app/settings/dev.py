import os
from base import *


# Make this unique, and don't share it with anybody.
SECRET_KEY = 'nl_tg!$q)=7^x*9fr2+gfg9$=z=$#l3yxnu2_xt(lun+i=ne&t'


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


MEDIA_URL = '/media/'

MEDIA_ROOT = '/Users/vdh3/Documents/Showgrid/nashvilleneon/neon/media/'


STATIC_URL = '/static/'

STATICFILES_DIRS = ( os.path.join('static'), )
STATIC_ROOT = '/Users/vdh3/Documents/Showgrid/nashvilleneon/neon/temp/'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            '/Users/vdh3/Documents/Showgrid/nashvilleneon/neon/templates/',
            '/Users/vdh3/Documents/Showgrid/nashvilleneon/neon/cal/templates/',
            '/Users/vdh3/Documents/Showgrid/nashvilleneon/neon/magazine/templates/',
            '/Users/vdh3/Documents/Showgrid/nashvilleneon/neon/newsletter/templates/',
            '/Users/vdh3/Documents/Showgrid/nashvilleneon/neon/show/templates/',
            '/Users/vdh3/Documents/Showgrid/nashvilleneon/neon/user/templates/',
            '/Users/vdh3/Documents/Showgrid/nashvilleneon/neon/venue/templates/',
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