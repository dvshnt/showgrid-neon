import pytz
import datetime

from django import template
from django.utils.html import escape
from django.utils.safestring import mark_safe

register = template.Library()


@register.filter(name='date_mobile')
def date_mobile(value):
    return "TODAY"


@register.filter(name='if_show_today')
def if_show_today(value, day):
	date = value.date

	if date.date() == day.date():
		return value.headliners

	return ""


register.filter('date_mobile', date_mobile)
register.filter('if_show_today', if_show_today)