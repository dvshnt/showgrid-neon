# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0005_neonuser_bio'),
    ]

    operations = [
        migrations.AddField(
            model_name='neonuser',
            name='newsletter',
            field=models.BooleanField(default=False),
        ),
    ]
