import datetime
from dateutil import tz

from haystack import indexes

from show.models import Show
from venue.models import Venue


class ShowIndex(indexes.SearchIndex, indexes.Indexable):
	text = indexes.CharField(document=True, use_template=True)

	title = indexes.CharField(model_attr='title')
	headliners = indexes.CharField(model_attr='headliners')
	openers = indexes.CharField(model_attr='openers')

	date = indexes.DateTimeField(model_attr='date')

	price = indexes.IntegerField(model_attr='price')
	ticket = indexes.CharField(model_attr='ticket')
	soldout = indexes.BooleanField(model_attr='soldout', default=False)
	onsale = indexes.DateTimeField(model_attr='onsale', default=datetime.datetime.now())

	website = indexes.CharField(model_attr='website')
	venue = indexes.CharField(model_attr='venue')

	def get_model(self):
		return Show

	def index_queryset(self, using=None):
		return self.get_model().objects.filter(date__gte=datetime.datetime.now())


	def prepare_venue(self, obj):
		return obj.venue.name


	def prepare_soldout(self, obj):
		if obj.soldout == False:
			return ''
		return obj.soldout