from django.contrib.auth.models import *
from django.db import models
from django.db.models import Q
from django.utils.http import urlquote
from django.template.loader import get_template
from django.db.models.signals import post_save, post_delete, pre_save, pre_delete
from django.utils.translation import ugettext as _
# from django.conf import settings
from show.models import Show
from django.core.validators import RegexValidator
from django.contrib.auth.backends import ModelBackend 
from random import randint
import hashlib
import inspect, itertools, json
from twiliohandle import MessageClient
Sender = MessageClient()
from alert import Alert
# from python-social-auth import



class NeonUserManager(BaseUserManager):
    def _create_user(self, username, email, password,
                     is_staff, is_superuser, **extra_fields):
        """
        Creates and saves a User with the given username, email and password.
        """
        now = timezone.now()     
        email = self.normalize_email(email)
        user = self.model(username=email, email=email,
                          is_staff=is_staff, is_active=True, last_login=now,
                          date_joined=now, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username=None, email=None, password=None, **extra_fields):
        return self._create_user(username, email, password, False, False,
                                 **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        return self._create_user(None, email, password, True, True,
                                 **extra_fields)



class NeonUser(AbstractBaseUser):
	name = models.CharField(max_length=30,blank=True)
	username = models.CharField(_('username'), max_length=30, blank=True)
	email = models.EmailField(_('email address'), unique=True)

	pic = models.ImageField(upload_to='user/', blank=True, default='')
	bio = models.CharField(_('bio'), max_length=200, blank=True, default='')

	newsletter = models.BooleanField(default=False)

	phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
	phone = models.CharField(unique=True,validators=[phone_regex], blank=True, null=True,max_length=200) # validators should be a list
	phone_verified = models.BooleanField(default=False,blank=False)
	email_verified =  models.BooleanField(default=False,blank=False)

	show_profile_alerts = models.BooleanField(default=True,blank=False)
	# show_profile_upcoming = models.BooleanField(default=True,blank=False)

	link_facebook = models.BooleanField(default=True,blank=False)

	pin_hash  = models.TextField(max_length=200,blank=True)
	pin_sent =  models.BooleanField(default=False,blank=False)
	
	is_active = models.BooleanField(_('active'), default=False)
	is_admin = models.BooleanField(_('admin'), default=False)
	is_staff = models.BooleanField(_('staff'), default=False)
	auth_code = models.CharField(_('auth code'), max_length=255, blank=True,null=True)
	date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

	objects = NeonUserManager()
	
	USERNAME_FIELD = 'email'




	# Favorites
	favorites = models.ManyToManyField(Show, related_name='show_set', blank=True)

	def image_url(self):
		"""
		Returns the URL of the image associated with this Object.
		If an image hasn't been uploaded yet, it returns a stock image

		:returns: str -- the image url

		"""
		if self.pic and hasattr(self.pic, 'url'):
			return self.pic.url
		else:
			return '/static/showgrid/img/profile-default.jpg'

	def getAlerts(self):
		alerts = []
		alerts_q = Alert.objects.filter(user=self)
		for alert in alerts_q:
			alerts.append({
				"id": 				alert.id,
				"show_id": 			alert.show.id,
				"sale": 			alert.sale,
				"which": 			alert.which,
				"show_date": 		alert.show.date.isoformat(),
				"show_headliners": 	alert.show.headliners,
				"show_openers" : 	alert.show.openers,
				"show_venue_name": 	alert.show.venue.name
			})
		return json.dumps(alerts)

		
	def getFaves(self):
		faves_q = self.favorites.all()
		faves = []
		for fav in faves_q:
			faves.append({
				"show_id": 			fav.id,
				"show_date": 		fav.date.isoformat(),
				"show_headliners": 	fav.headliners,
				"show_openers" : 	fav.openers,
				"show_venue_name":	fav.venue.name
			})

		return json.dumps(faves)



	def generate_pin(self):
		new_pin = ''
		for x in range(0,4):
			new_pin += str(randint(0,9))

		self.pin_hash = hashlib.md5(new_pin).hexdigest()
		return new_pin

	def check_pin(self,pin):
		#try_hash = str(hashlib.md5(str(pin)).hexdigest())
		try_hash = hashlib.md5(pin).hexdigest()
		if try_hash == self.pin_hash:
			self.phone_verified = True
			return True
		else:
			return False

	def send_pin(self,pin):
		print "SEND PIN to "+self.phone
		msg = 'Your pin is ' + pin
		Sender.send_message(msg,self.phone)

	def send_validation(strategy, backend, code):
	    url = '{0}?verification_code={1}'.format(
	        reverse('social:complete', args=(backend.name,)),
	        code.code
	    )
	    url = strategy.request.build_absolute_uri(url)
	    send_mail('Validate your account', 'Validate your account {0}'.format(url),
	              settings.EMAIL_FROM, [code.email], fail_silently=False)

	class Meta:
		verbose_name = _('user')
		verbose_name_plural = _('users')

	def get_absolute_url(self):
		return "/user/%s/" % urlquote(self.pk)

	def get_full_name(self):
		"""
		Returns the first_name plus the last_name, with a space in between.
		"""
		return self.email

	def get_short_name(self):
		"Returns the short name for the user."
		return self.email
	
	@property
	def is_superuser(self):
		return self.is_admin

	@property
	def is_staff(self):
		return self.is_admin

	def has_perm(self, perm, obj=None):
		return self.is_admin

	def has_module_perms(self, app_label):
		return self.is_admin
