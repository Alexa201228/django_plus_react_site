# Generated by Django 3.2.4 on 2021-08-08 10:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0005_auto_20210806_1503'),
    ]

    operations = [
        migrations.RenameField(
            model_name='lesson',
            old_name='module_name',
            new_name='lesson_name',
        ),
        migrations.AlterField(
            model_name='lesson',
            name='course_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='course_lessons', to='courses.course'),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='slug',
            field=models.SlugField(max_length=150),
        ),
    ]
