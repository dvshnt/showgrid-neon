
# social auth
SOCIAL_AUTH_FACEBOOK_KEY = '868089599911045'
SOCIAL_AUTH_FACEBOOK_SECRET = '02801ae29d77605a491125911a47e4b8'
SOCIAL_AUTH_FACEBOOK_SCOPE = ['email']
SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS = {
  'locale': 'en_US',
  'fields': 'name, email, age_range'
}

AUTH_USER_MODEL = 'user.NeonUser'
SOCIAL_AUTH_USER_MODEL = 'user.NeonUser'

AUTHENTICATION_BACKENDS = (
   'social.backends.facebook.FacebookOAuth2',
   'django.contrib.auth.backends.ModelBackend',
)

SOCIAL_AUTH_LOGIN_REDIRECT_URL = '/'
SOCIAL_AUTH_LOGIN_URL = '/user/login/'

SOCIAL_AUTH_PIPELINE = (
  'social.pipeline.social_auth.social_details',
  'social.pipeline.social_auth.social_uid',
  'social.pipeline.social_auth.auth_allowed',
  'user.auth.social_user',
  'social.pipeline.social_auth.associate_by_email',  # <--- enable this one
  'user.auth.create_user',
  'social.pipeline.social_auth.associate_user',
  'social.pipeline.social_auth.load_extra_data',
  'social.pipeline.user.user_details',
)


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
