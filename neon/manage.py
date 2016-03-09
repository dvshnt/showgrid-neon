#!/usr/bin/env python
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings.dev")
import sys

import django
django.setup()

if __name__ == "__main__":
    

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
