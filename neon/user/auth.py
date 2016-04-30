from django.shortcuts import redirect

from social.pipeline.partial import partial
from user.models import NeonUser


@partial
def require_email(strategy, details, user=None, is_new=False, *args, **kwargs):
    if kwargs.get('ajax') or user and user.email:
        return
    elif is_new and not details.get('email'):
        email = strategy.request_data().get('email')
        if email:
            details['email'] = email
        else:
            return redirect('require_email')

@partial
def social_user(backend, uid, user=None, *args, **kwargs):
    provider = backend.name
    social = backend.strategy.storage.user.get_social_auth(provider, uid)
    if social:
    	

        if user and social.user != user:
            msg = 'This {0} account is already in use.'.format(provider)
            raise AuthAlreadyAssociated(backend, msg)
        elif not user:
            user = social.user
        print "GOT SOCIAL USER",user, social
        print user.is_authenticated()
    return {'social': social,
            'user': user,
            'is_new': user is None,
            'new_association': False}


@partial
def create_user(strategy, details, user=None, *args, **kwargs):
    if user:
        return {'is_new': False}
    print details
    
    fields = {
    	"name": details.get("fullname",False),
    	"email": details.get("email",False),
        "password": None,
    }

  
    if not fields:
        return

    print fields
    return {
        'is_new': True,
        'user': NeonUser.objects.create_user(**fields)
    }