from __future__ import unicode_literals

from twilio.rest import TwilioRestClient
from django.core.exceptions import MiddlewareNotUsed
import os
import logging
import json
from django.conf import settings

logger = logging.getLogger(__name__)

MESSAGE = """[This is a test] ALERT! It appears the server is having issues.
Exception: %s. Go to: http://newrelic.com for more details."""

NOT_CONFIGURED_MESSAGE = """Cannot initialize Twilio notification
middleware. Required enviroment variables TWILIO_ACCOUNT_SID, or
TWILIO_AUTH_TOKEN or TWILIO_NUMBER missing"""


def load_admins_file():
    with open(os.path.join(__location__,'admins.json')) as adminsFile:
        admins = json.load(adminsFile)
        return admins


def load_twilio_config():
    twilio_account_sid = settings.TWILIO_ACCOUNT_SID
    twilio_auth_token = settings.TWILIO_AUTH_TOKEN
    twilio_number = settings.TWILIO_NUMBER

    if not all([twilio_account_sid, twilio_auth_token, twilio_number]):
        logger.error(NOT_CONFIGURED_MESSAGE)
        raise MiddlewareNotUsed

    return (twilio_number, twilio_account_sid, twilio_auth_token)


class MessageClient(object):
    def __init__(self):
        (twilio_number, twilio_account_sid,
         twilio_auth_token) = load_twilio_config()

        self.twilio_number = twilio_number
        self.twilio_client = TwilioRestClient(twilio_account_sid,
                                              twilio_auth_token)

    def send_message(self, body, to):
        self.twilio_client.messages.create(body=body, to=to,
                                           from_=self.twilio_number,
                                           # media_url=['https://demo.twilio.com/owl.png'])
                                           )


class TwilioNotificationsMiddleware(object):
    def __init__(self):
        self.administrators = load_admins_file()
        self.client = MessageClient()

    def process_exception(self, request, exception):
        exception_message = str(exception)
        message_to_send = MESSAGE % exception_message

        for admin in self.administrators:
            self.client.send_message(message_to_send, admin['phone_number'])

        logger.info('Administrators notified')

        return None