# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_remove_neonuser_pic'),
    ]

    operations = [
        migrations.AddField(
            model_name='neonuser',
            name='pic',
            field=models.ImageField(default=b'', upload_to=b'user/', blank=True),
        ),
    ]
