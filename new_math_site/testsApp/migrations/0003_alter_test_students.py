# Generated by Django 3.2.4 on 2021-08-07 10:28

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('testsApp', '0002_auto_20210807_1325'),
    ]

    operations = [
        migrations.AlterField(
            model_name='test',
            name='students',
            field=models.ManyToManyField(blank=True, related_name='succeded_students', to=settings.AUTH_USER_MODEL, verbose_name='Студенты, прошедшие тест'),
        ),
    ]
