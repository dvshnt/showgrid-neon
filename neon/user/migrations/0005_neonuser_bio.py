# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0004_remove_neonuser_bio'),
    ]

    operations = [
        migrations.AddField(
            model_name='neonuser',
            name='bio',
            field=models.CharField(default=b'', max_length=200, verbose_name='bio', blank=True),
        ),
    ]
