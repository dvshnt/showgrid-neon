# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import tinymce.models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Newsletter',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('intro', tinymce.models.HTMLField(default=b'')),
                ('tag', models.CharField(default=b'Issue', max_length=255)),
                ('spotify_embed', models.CharField(max_length=255, null=True, blank=True)),
                ('spotify_url', models.URLField(null=True, blank=True)),
                ('banner', models.ImageField(upload_to=b'showgrid/img/newsletters/', blank=True)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('shows_count', models.PositiveSmallIntegerField(default=0)),
                ('sent', models.BooleanField(default=False)),
                ('active', models.BooleanField(default=False)),
                ('timezone', models.CharField(default=b'US/Central', max_length=255)),
            ],
        ),
    ]
