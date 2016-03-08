from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
from django.utils.translation import ugettext as _

from django.conf import settings

from colorful.fields import RGBColorField


class Address(models.Model):
	def __unicode__ (self):
		return self.street

	street = models.CharField(_("street"), max_length=128)
	city = models.CharField(_("city"), max_length=64)
	state = models.CharField(_("state"), max_length=2)
	zip_code = models.CharField(_("zip code"), max_length=10)


class Venue(models.Model):
	def __unicode__ (self):
		return self.name

	name = models.CharField(max_length=200)
	
	address = models.ForeignKey(Address)
	
	image = models.ImageField (upload_to='showgrid/img/venues/')
	website = models.URLField()
	description = models.TextField(default="This is a description")
	
	twitter_url = models.CharField(max_length=200, default=None)
	facebook_url = models.CharField(max_length=200, default=None)
	
	phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
	phone = models.CharField(validators=[phone_regex], blank=True, null=True,max_length=255) # validators should be a list

	primary_color = RGBColorField()
	secondary_color = RGBColorField()
	accent_color = RGBColorField()
	
	# Sign-post for if venue is open or not
	opened = models.BooleanField(default=True)

	# Auto-fill URL for calendars without unique links
	autofill = models.CharField(max_length=200, blank=True)
	age = models.PositiveSmallIntegerField(null=True, blank=True)


	@property
	def alphabetical_title(self):
		name = self.name
		starts_with_flags = ['the ', 'an ', 'a ']

		for flag in starts_with_flags:
			if name.lower().startswith(flag):
				return "%s, %s" % (name[len(flag):], name[:len(flag)-1])
		else:
			pass
		
		return self.name