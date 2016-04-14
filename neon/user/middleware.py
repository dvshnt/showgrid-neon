from serializer import UserSerializer
from rest_framework.authtoken.models import Token


class NeonUserMiddleware(object):
	def process_request(self, request):
		if request.user.is_authenticated():
			request.user.user_json = UserSerializer(request.user,many=False).data
			# request.user.user_json.token = request.auth.token
		return None