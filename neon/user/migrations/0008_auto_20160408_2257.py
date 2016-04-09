# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0007_neonuser_auth_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='neonuser',
            name='email_verified',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='neonuser',
            name='link_facebook',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='neonuser',
            name='show_profile_alerts',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='neonuser',
            name='show_profile_upcoming',
            field=models.BooleanField(default=True),
        ),
    ]
