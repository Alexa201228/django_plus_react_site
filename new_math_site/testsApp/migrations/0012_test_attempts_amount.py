# Generated by Django 3.2.7 on 2022-05-28 14:17

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('testsApp', '0011_testresult_test_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='test',
            name='attempts_amount',
            field=models.IntegerField(default=1, validators=[django.core.validators.MinValueValidator(1)]),
        ),
    ]
