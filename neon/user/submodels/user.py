from django.contrib.auth.models import *
from django.db import models
from django.db.models import Q
from django.template.loader import get_template
from django.db.models.signals import post_save, post_delete, pre_save, pre_delete
from django.utils.translation import ugettext as _
from django.conf import settings
from show.models import Show
from django.core.validators import RegexValidator
from django.contrib.auth.backends import ModelBackend 
from random import randint
import hashlib

from twiliohandle import MessageClient
Sender = MessageClient()


class AuthBackend(ModelBackend):
    def authenticate(self, email=None, password=None):
    	print 'get '+email
    	user = NeonUser.objects.get(email=email)
    	print user
    	if user.check_password(password):
    		return user
    	else:
    		print 'CHECK FAILED'
    		return None
    def get_user(self,id):
    	try:
    		return NeonUser.objects.get(id=id)
    	except:
    		return None


class NeonUserManager(BaseUserManager):

	def _create_user(self, email, password, is_active, is_staff, is_superuser, **extra_fields):
		"""
		Creates and saves a User with the given email and password.
		"""
		now = timezone.now()

		if not email:
			raise ValueError('The given email must be set')

		email = NeonUserManager.normalize_email(email)
		user = self.model(email=email, username=email, is_active=is_active,
						is_superuser=is_superuser, is_staff=is_staff, 
						last_login=now, date_joined=now, **extra_fields)

		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_user(self, email, password=None, **extra_fields):
		return self._create_user(email, password, False, False, False, **extra_fields)

	def create_superuser(self, email, password, **extra_fields):
		return self._create_user(email, password, True, True, True, **extra_fields)


class NeonUser(AbstractBaseUser):
	name = models.CharField(max_length=30,blank=True)
	username = models.CharField(_('username'), max_length=30, blank=True)
	email = models.EmailField(_('email address'), unique=True)
	phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
	phone = models.CharField(unique=True,validators=[phone_regex], blank=True, null=True,max_length=255) # validators should be a list
	phone_verified = models.BooleanField(default=False,blank=False)
	pin_hash  = models.TextField(blank=True)
	pin_sent =  models.BooleanField(default=False,blank=False)
	
	is_active = models.BooleanField(_('active'), default=False)
	is_admin = models.BooleanField(_('admin'), default=False)
	is_staff = models.BooleanField(_('staff'), default=False)

	date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

	objects = NeonUserManager()
	
	USERNAME_FIELD = 'email'


	# Favorites
	favorites = models.ManyToManyField(Show, related_name='show_set', blank=True)



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
		msg = 'Your pin is ' + pin
		Sender.send_message(msg,self.phone)



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
