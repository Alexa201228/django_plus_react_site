# Generated by Django 3.2.4 on 2021-08-06 12:03

import ckeditor.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0004_auto_20210721_1510'),
    ]

    operations = [
        migrations.CreateModel(
            name='Lesson',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('module_name', models.CharField(max_length=200, verbose_name='Название урока')),
                ('theme', models.CharField(blank=True, max_length=250, null=True)),
                ('body', ckeditor.fields.RichTextField(verbose_name='Содержание урока')),
                ('slug', models.SlugField()),
                ('course_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='course_modules', to='courses.course')),
            ],
            options={
                'verbose_name_plural': 'Уроки курсов',
            },
        ),
        migrations.DeleteModel(
            name='Module',
        ),
    ]
