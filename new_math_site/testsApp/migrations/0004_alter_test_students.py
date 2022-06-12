# Generated by Django 3.2.7 on 2022-05-09 06:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0013_auto_20220509_0934'),
        ('testsApp', '0003_alter_test_students'),
    ]

    operations = [
        migrations.AlterField(
            model_name='test',
            name='students',
            field=models.ManyToManyField(blank=True, related_name='succeeded_students', to='accounts.Student', verbose_name='Студенты, прошедшие тест'),
        ),
    ]
