from django.contrib import admin

import nested_admin

from .models import Test, Question, Answer


class AnswerInline(nested_admin.NestedStackedInline):
    model = Answer
    extra = 1


class QuestionInline(nested_admin.NestedStackedInline):
    model = Question
    extra = 1
    inlines = [AnswerInline]


@admin.register(Test)
class TestsAdmin(nested_admin.NestedModelAdmin):
    list_display = ('title', )
    autocomplete_fields = ['lesson', 'course', 'students']
    readonly_fields = ['students']
    inlines = [QuestionInline]
# Register your models here.
