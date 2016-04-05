from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect, render

def create_user(strategy, details, user=None, *args, **kwargs):
    if user:
        return {'is_new': False}


    fields = {"email" : details["email"],"name" : details["fullname"]}

    return {
        'is_new': True,
        'user': strategy.create_user(**fields)
    }



def authenticate_user(strategy, details, user=None, is_new=False, *args, **kwargs):
    if user:
        print "AUTHENTICATE USER"
        try:
            code = kwargs['request']['code'][:255]
            user.auth_code = code
            user.save()
            return redirect('/user/login?email='+user.email+'code='+code)
        except:
            print 'cant authenticate social user' 