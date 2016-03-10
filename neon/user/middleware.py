class NeonUserMiddleware(object):
	def process_request(self, request):
		if request.user.is_authenticated():
			request.user.json_alerts = request.user.getAlerts()
			request.user.json_favorites = request.user.getFaves()
		return None