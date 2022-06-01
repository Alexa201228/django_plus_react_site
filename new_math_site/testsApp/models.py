from ckeditor.fields import RichTextField
from django.core.validators import MinValueValidator
from django.db import models
from courses.models import Course, Lesson
from accounts.models import Student

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
        Student,
        related_name='succeeded_students',
        verbose_name='Студенты, прошедшие тест',
        blank=True
    )

    attempts_amount = models.IntegerField(default=1, validators=[MinValueValidator(1)])

    class Meta:
        verbose_name = 'Тест'
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
        answers_ids = []
        for i in correct_answers:
            answers_ids.append(i.id)
        return answers_ids

    def __str__(self):
        return f'{self.question_body[:50]}...'


class Answer(models.Model):
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        verbose_name='Вариант ответа к вопросу',
        related_name='answers_to_question'
    )
    answer_body = RichTextField(
        config_name='tests_config',
        verbose_name='Текст ответа')
    is_correct = models.BooleanField(verbose_name='Правильный ответ')


class TestResult(models.Model):
    """
    Model of user test results
    """
    test_id = models.ForeignKey(
        to='testsApp.Test',
        related_name='tests_results',
        on_delete=models.CASCADE
    )
    user_id = models.ForeignKey(
        to='accounts.Student',
        related_name='tests_results',
        on_delete=models.CASCADE
    )
    test_questions = models.ManyToManyField(
        to='testsApp.Question',
        related_name='tests_results',
        verbose_name='Вопросы теста'
    )
    chosen_answers = models.ManyToManyField(
        to='testsApp.Answer',
        related_name='tests_results',
        verbose_name='Ответы учащегося'
    )

    test_time = models.IntegerField(default=0)
    is_passed = models.BooleanField(default=False)
    test_mark = models.IntegerField(
        verbose_name='Оценка за тест',
        default=2
    )
