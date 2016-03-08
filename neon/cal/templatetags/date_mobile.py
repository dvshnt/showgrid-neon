from django import template
register = template.Library()


@register.filter(name='date_mobile')
def date_mobile(value):
    return "TODAY"


register.filter('date_mobile', date_mobile)