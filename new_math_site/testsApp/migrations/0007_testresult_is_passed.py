# Generated by Django 3.2.7 on 2022-05-11 13:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('testsApp', '0006_testresult_chosen_answers'),
    ]

    operations = [
        migrations.AddField(
            model_name='testresult',
            name='is_passed',
            field=models.BooleanField(default=False),
        ),
    ]
