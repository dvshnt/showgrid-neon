# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0008_auto_20160408_2257'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='alert',
            name='date',
        ),
        migrations.RemoveField(
            model_name='neonuser',
            name='show_profile_upcoming',
        ),
    ]
