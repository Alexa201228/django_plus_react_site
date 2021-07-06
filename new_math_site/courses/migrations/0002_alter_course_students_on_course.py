# Generated by Django 3.2.4 on 2021-07-05 10:52

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('courses', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='students_on_course',
            field=models.ManyToManyField(blank=True, null=True, related_name='courses', to=settings.AUTH_USER_MODEL),
        ),
    ]
