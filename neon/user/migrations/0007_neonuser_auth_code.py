# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0006_neonuser_newsletter'),
    ]

    operations = [
        migrations.AddField(
            model_name='neonuser',
            name='auth_code',
            field=models.CharField(max_length=255, null=True, verbose_name='auth code', blank=True),
        ),
    ]
