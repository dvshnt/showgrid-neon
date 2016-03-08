from django.contrib.auth.models import *
from django.db import models
from django.db.models import Q
from django.template.loader import get_template
from django.db.models.signals import post_save, post_delete, pre_save, pre_delete
from django.utils.translation import ugettext as _
from django.conf import settings
from twillio_handle import MessageClient






class UserManager(BaseUserManager):

	def _create_user(self, email, password, is_active, is_staff, is_superuser, **extra_fields):
		"""
		Creates and saves a User with the given email and password.
		"""
		now = timezone.now()

		if not email:
			raise ValueError('The given email must be set')

		email = UserManager.normalize_email(email)
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


from django.core.validators import RegexValidator


class User(AbstractBaseUser):
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

	objects = UserManager()
	
	USERNAME_FIELD = 'email'


	# Favorites
	favorites = models.ManyToManyField('Show', related_name='show_set', blank=True)



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


DEFAULT_USER_ID = 1 #for migration 
DEFAULT_SHOW_ID = 1 #for migration
alert_leeway = 30 # if alert time distance :30 seconds away from time of check


Sender = MessageClient()

class Alert(models.Model):
	is_active = models.BooleanField(default=True)
	user = models.ForeignKey(settings.AUTH_USER_MODEL,default=DEFAULT_USER_ID,related_name='alerts')
	date = models.DateTimeField(blank=False)
	show = models.ForeignKey('Show',default=DEFAULT_SHOW_ID,related_name='alerts')
	sent = models.PositiveSmallIntegerField(default=0)
	which = models.PositiveSmallIntegerField(default=0)
	sale = models.BooleanField(default=False)

	def check_send(self):

		def get_show_time_from_now(which, date):
			if which == 0: return "right now"
			if which == 1: return "in 30 minutes"
			if which == 2: return "in an hour"
			if which == 3: return "in 2 hours"
			if which == 4: return "tomorrow"
			if which == 5: return "in 2 days"
			if which == 6: return "in a week"

			return date.strftime('%a, %b %d at %I:%M %p')

		def construct_sale_message(alert):
			show = Show.objects.get(id=alert.show.id)
			venue = Venue.objects.get(id=show.venue.id)

			headliner = show.headliners
			venue = venue.name

			if show.ticket:
				ticket = "Get your tickets here: %s" % show.ticket
			else:
				ticket = ""

			when = get_show_time_from_now(alert.which, show.date)

			msg = "Tickets for %s at %s are on sale %s! %s" % (headliner, venue, when, ticket)

			return msg			

		def construct_text_message(alert):
			show = Show.objects.get(id=alert.show.id)
			venue = Venue.objects.get(id=show.venue.id)

			headliner = show.headliners
			venue = venue.name

			if show.ticket:
				ticket = "Get your tickets here: %s" % show.ticket
			else:
				ticket = ""

			when = get_show_time_from_now(alert.which, show.date)

			msg = "Showgrid here reminding you that %s plays at %s %s.\n\n %s" % (headliner, venue, when, ticket,)

			return msg

		now_time = timezone.now()
		alert_time = self.date

		time_diff = alert_time - now_time

		if time_diff.total_seconds() < alert_leeway and self.sent < 1:

			if self.sale:
				msg = construct_sale_message(self)
			else:
				msg = construct_text_message(self)
			print colored('sending alert to '+self.user.phone+' ( is sale ? : ' + str(self.sale) + ' ) ', 'green')
			Sender.send_message(msg,self.user.phone)
			self.sent += 1
			self.save()
			return True
		return False



DEFAULT_USER_ID = 1 #for migration 
DEFAULT_SHOW_ID = 1 #for migration
alert_leeway = 30 # if alert time distance :30 seconds away from time of check

class Alert(models.Model):
	is_active = models.BooleanField(default=True)
	user = models.ForeignKey(settings.AUTH_USER_MODEL,default=DEFAULT_USER_ID,related_name='alerts')
	date = models.DateTimeField(blank=False)
	show = models.ForeignKey('Show',default=DEFAULT_SHOW_ID,related_name='alerts')
	sent = models.PositiveSmallIntegerField(default=0)
	which = models.PositiveSmallIntegerField(default=0)
	sale = models.BooleanField(default=False)

	def check_send(self):

		def get_show_time_from_now(which, date):
			if which == 0: return "right now"
			if which == 1: return "in 30 minutes"
			if which == 2: return "in an hour"
			if which == 3: return "in 2 hours"
			if which == 4: return "tomorrow"
			if which == 5: return "in 2 days"
			if which == 6: return "in a week"

			return date.strftime('%a, %b %d at %I:%M %p')

		def construct_sale_message(alert):
			show = Show.objects.get(id=alert.show.id)
			venue = Venue.objects.get(id=show.venue.id)

			headliner = show.headliners
			venue = venue.name

			if show.ticket:
				ticket = "Get your tickets here: %s" % show.ticket
			else:
				ticket = ""

			when = get_show_time_from_now(alert.which, show.date)

			msg = "Tickets for %s at %s are on sale %s! %s" % (headliner, venue, when, ticket)

			return msg			

		def construct_text_message(alert):
			show = Show.objects.get(id=alert.show.id)
			venue = Venue.objects.get(id=show.venue.id)

			headliner = show.headliners
			venue = venue.name

			if show.ticket:
				ticket = "Get your tickets here: %s" % show.ticket
			else:
				ticket = ""

			when = get_show_time_from_now(alert.which, show.date)

			msg = "Showgrid here reminding you that %s plays at %s %s.\n\n %s" % (headliner, venue, when, ticket,)

			return msg

		now_time = timezone.now()
		alert_time = self.date

		time_diff = alert_time - now_time

		if time_diff.total_seconds() < alert_leeway and self.sent < 1:

			if self.sale:
				msg = construct_sale_message(self)
			else:
				msg = construct_text_message(self)
			print colored('sending alert to '+self.user.phone+' ( is sale ? : ' + str(self.sale) + ' ) ', 'green')
			Sender.send_message(msg,self.user.phone)
			self.sent += 1
			self.save()
			return True
		return False








