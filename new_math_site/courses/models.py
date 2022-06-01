from django.db import models
from ckeditor.fields import RichTextField
from django.db.models.fields.related import ManyToManyField


class Course(models.Model):
    title = models.CharField(max_length=200, verbose_name='Название курса')
    slug = models.SlugField(max_length=50)
    created = models.DateTimeField(auto_now=True)
    description = RichTextField(verbose_name='Описание курса')
    students_on_course = ManyToManyField(
        to='accounts.User',
        related_name='courses',
        blank=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = 'Курсы'


class Lesson(models.Model):
    course_id = models.ForeignKey(Course,
                                  related_name='course_lessons',
                                  on_delete=models.CASCADE)
    lesson_name = models.CharField(
        max_length=200, verbose_name='Название урока')
    theme = models.CharField(max_length=250, blank=True, null=True)
    body = RichTextField(verbose_name='Содержание урока')
    lesson_slug = models.SlugField(max_length=150)

    def __str__(self):
        return self.lesson_name

    class Meta:
        verbose_name_plural = 'Уроки курсов'


class TrainingDirections(models.Model):

    direction_code = models.CharField(max_length=8, verbose_name='Код направления')
    direction_name = models.CharField(max_length=100, verbose_name='Название направления подготовки')

    def __str__(self):
        return f'{self.direction_code} {self.direction_name}'

    class Meta:
        verbose_name = 'Направление подготовки'
        verbose_name_plural = 'Направления подготовки'

