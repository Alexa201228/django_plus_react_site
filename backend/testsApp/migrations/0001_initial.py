# Generated by Django 3.2.4 on 2021-08-06 12:03

import ckeditor.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('courses', '0005_auto_20210806_1503'),
    ]

    operations = [
        migrations.CreateModel(
            name='Test',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100, verbose_name='Название теста')),
                ('course', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='course_test', to='courses.course', verbose_name='Тест к курсу')),
                ('lesson', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='module_test', to='courses.lesson', verbose_name='Тест к уроку')),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question_body', ckeditor.fields.RichTextField(verbose_name='Текст вопроса')),
                ('test', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questions_on_test', to='testsApp.test', verbose_name='Вопросы для теста')),
            ],
        ),
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answer_body', ckeditor.fields.RichTextField(verbose_name='Текст ответа')),
                ('is_correct', models.BooleanField(verbose_name='Правильный ответ')),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answer_to_question', to='testsApp.question', verbose_name='Вариант ответа к вопросу')),
            ],
        ),
    ]
