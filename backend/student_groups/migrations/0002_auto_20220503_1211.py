# Generated by Django 3.2.7 on 2022-05-03 09:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0009_auto_20220503_1211'),
        ('student_groups', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studentgroup',
            name='group_mentors',
            field=models.ManyToManyField(blank=True, related_name='student_groups', to='accounts.Mentor', verbose_name='Преаодаватели группы'),
        ),
        migrations.AlterField(
            model_name='studentgroup',
            name='group_name',
            field=models.CharField(max_length=20, unique=True, verbose_name='Название группы'),
        ),
    ]
