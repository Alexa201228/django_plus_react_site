# Generated by Django 3.2.7 on 2022-05-29 09:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student_groups', '0006_studentbooknumber_student_group'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentgroup',
            name='start_year',
            field=models.IntegerField(default=2022, verbose_name='Год образования группы'),
            preserve_default=False,
        ),
    ]
