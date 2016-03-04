import datetime
from pytz import timezone

from datetime import timedelta, date

from django import template
from django.utils.html import escape
from django.utils.safestring import mark_safe
from django.template.loader import render_to_string

register = template.Library()


@register.filter(name='if_show_today')
def if_show_today(value, day):
	central = timezone('US/Central')

	show_day = datetime.datetime.strptime(value['date'], "%Y-%m-%dT%H:%M:%SZ")
	current_day = datetime.datetime(day.year, day.month, day.day)

	if show_day.date() == current_day.date():
		html = render_to_string('calendar/calendar_row_day_show.html', {'show': value, 'show_date': show_day})
		return mark_safe(html)

	return ""


register.filter('if_show_today', if_show_today)