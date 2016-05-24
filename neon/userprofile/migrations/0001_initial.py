# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone
from django.conf import settings
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('show', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='NeonUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(null=True, verbose_name='last login', blank=True)),
                ('name', models.CharField(max_length=30, blank=True)),
                ('username', models.CharField(max_length=30, verbose_name='username', blank=True)),
                ('email', models.EmailField(unique=True, max_length=254, verbose_name='email address')),
                ('pic', models.ImageField(default=b'', upload_to=b'user/', blank=True)),
                ('bio', models.CharField(default=b'', max_length=200, verbose_name='bio', blank=True)),
                ('newsletter', models.BooleanField(default=False)),
                ('phone', models.CharField(blank=True, max_length=200, unique=True, null=True, validators=[django.core.validators.RegexValidator(regex=b'^\\+?1?\\d{9,15}$', message=b"Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")])),
                ('phone_verified', models.BooleanField(default=False)),
                ('email_verified', models.BooleanField(default=False)),
                ('show_profile_alerts', models.BooleanField(default=True)),
                ('link_facebook', models.BooleanField(default=True)),
                ('pin_hash', models.TextField(max_length=200, blank=True)),
                ('pin_sent', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=False, verbose_name='active')),
                ('is_admin', models.BooleanField(default=False, verbose_name='admin')),
                ('auth_code', models.CharField(max_length=255, null=True, verbose_name='auth code', blank=True)),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
            },
        ),
        migrations.CreateModel(
            name='Alert',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('is_active', models.BooleanField(default=True)),
                ('sent', models.PositiveSmallIntegerField(default=0)),
                ('which', models.PositiveSmallIntegerField(default=0)),
                ('sale', models.BooleanField(default=False)),
                ('show', models.ForeignKey(related_name='show_alerts', to='show.Show')),
                ('user', models.ForeignKey(related_name='user_alerts', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
