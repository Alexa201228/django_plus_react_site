from django.db import models
from django.core.validators import MinValueValidator
from ckeditor.fields import RichTextField

class Course(models.Model):
    title = models.CharField(max_length = 200, verbose_name='Название курса')
    slug = models.SlugField(max_length = 50)
    created = models.DateTimeField(auto_now=True)
    description = RichTextField(verbose_name='Описание курса')
    num_of_modules = models.IntegerField(default=0, \
                    validators=[MinValueValidator(1)],
                    verbose_name='Количество модулей')
    
    def __str__(self):
        return self.title


    class Meta:
        verbose_name_plural = 'Курсы'


class Module(models.Model):
    course_id = models.ForeignKey(Course,\
                                    related_name='course_modules',
                                    on_delete=models.CASCADE)
    module_name = models.CharField(max_length=200, verbose_name='Название')
    body = RichTextField(verbose_name='Контент модуля')
    slug = models.SlugField(max_length=50)
    
    def __str__(self):
        return self.module_name

    class Meta:
        verbose_name_plural = 'Модули курсов'

# Create your models here.
