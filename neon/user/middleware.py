from serializer import UserSerializer
class NeonUserMiddleware(object):
	def process_request(self, request):
		if request.user.is_authenticated():
			request.user.user_json = UserSerializer(request.user,many=False).data
		return None