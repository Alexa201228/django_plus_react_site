from ckeditor.fields import RichTextField
from django.db import models
from courses.models import Course, Lesson
from accounts.models import User


"""
Three models for tests:
1) Test model (contains foreign keys to course and lesson
ps: not both at the same time!)
2) Question model (connected with test by foreign key)
3) Answer model (connected with question by foreign key)
"""
class Test(models.Model):
    title = models.CharField(
        max_length=100,
        verbose_name='Название теста'
    )
    lesson = models.ForeignKey(
        Lesson, 
        on_delete=models.CASCADE,
        verbose_name='Тест к уроку',
        related_name='module_test',
        null=True,
        blank=True
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        verbose_name='Тест к курсу',
        related_name='course_test',
        null=True,
        blank=True
    )
    students = models.ManyToManyField(
        User,
        related_name='succeded_students',
        verbose_name='Студенты, прошедшие тест',
        blank=True
    )

    class Meta:
        verbose_name = 'Тесты'
        verbose_name_plural = 'Тесты'

    def __str__(self) -> str:
        return self.title
    

class Question(models.Model):
    test = models.ForeignKey(
        Test,
        on_delete=models.CASCADE,
        verbose_name='Вопросы для теста',
        related_name='questions_on_test'
    )
    question_body = RichTextField(
        config_name='tests_config',
        verbose_name='Текст вопроса')

    def get_correct_answers(self):
        correct_answers = list(self.answers_to_question.filter(is_correct=True))
        return correct_answers

    def __str__(self):
        return f'{self.question_body[:50]}...'

class Answer(models.Model):
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        verbose_name='Вариант ответа к вопросу',
        related_name='answer_to_question'
    )
    answer_body = RichTextField(
        config_name='tests_config',
        verbose_name='Текст ответа')
    is_correct = models.BooleanField(verbose_name='Правильный ответ')
