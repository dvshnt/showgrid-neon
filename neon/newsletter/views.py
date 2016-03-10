from django.http import HttpResponse, HttpResponseNotFound
from django.template.loader import get_template

from models import Newsletter

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication


class NewsletterView(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (AllowAny,)

	def get(self, request, id=None):
		if id == None:
			archive = get_template('newsletter/archive.html')
			issues = Newsletter.objects.filter(active=True).order_by('-end_date')
			issues = { 'issues': issues }

			return HttpResponse(archive.render(issues, request))
		
		else:
			print id
			try:
				issue = Newsletter.objects.get(id=id)
				issue_template = get_template('newsletter/live.html')
				return HttpResponse(issue.render(issue_template,None))
			except Exception:
				raise
				return HttpResponseNotFound("<h3>this issue does not exist!</h3>")