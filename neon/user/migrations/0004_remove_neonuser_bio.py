# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_neonuser_pic'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='neonuser',
            name='bio',
        ),
    ]
