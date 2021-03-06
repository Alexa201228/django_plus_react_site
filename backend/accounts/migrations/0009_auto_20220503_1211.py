# Generated by Django 3.2.7 on 2022-05-03 09:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student_groups', '0001_initial'),
        ('courses', '0007_rename_slug_lesson_lesson_slug'),
        ('accounts', '0008_auto_20220503_1031'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mentor',
            name='mentor_courses',
            field=models.ManyToManyField(blank=True, related_name='mentors', to='courses.Course', verbose_name='Преподаваемые дисциплины'),
        ),
        migrations.AlterField(
            model_name='mentor',
            name='mentors_qroups',
            field=models.ManyToManyField(blank=True, related_name='mentors', to='student_groups.StudentGroup', verbose_name='Группы обучающихся'),
        ),
    ]
