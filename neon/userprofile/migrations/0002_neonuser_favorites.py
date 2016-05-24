# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('show', '__first__'),
        ('userprofile', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='neonuser',
            name='favorites',
            field=models.ManyToManyField(related_name='show_set', to='show.Show', blank=True),
        ),
    ]
