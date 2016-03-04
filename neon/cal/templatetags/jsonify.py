import simplejson

from django.core.serializers import serialize
from django.utils.safestring import mark_safe
from django.db.models.query import QuerySet
from django.template import Library

register = Library()

def jsonify(object):
    if isinstance(object, QuerySet):
        return mark_safe(serialize('json', object))
    return mark_safe(simplejson.dumps(object))

register.filter('jsonify', jsonify)