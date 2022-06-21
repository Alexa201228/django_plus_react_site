# Generated by Django 3.2.4 on 2021-07-05 10:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0002_alter_course_students_on_course'),
        ('accounts', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='student_courses',
            field=models.ManyToManyField(blank=True, null=True, related_name='accounts', to='courses.Course'),
        ),
    ]