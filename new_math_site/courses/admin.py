from django.contrib import admin
from .models import Course, Lesson, TrainingDirections


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'created']
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ['title', 'created']
    filter_horizontal = ('students_on_course', )
    list_per_page = 10


@admin.register(Lesson)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ['lesson_name', 'theme']
    prepopulated_fields = {'lesson_slug': ('lesson_name', )}
    search_fields = ['theme', 'lesson_name']


@admin.register(TrainingDirections)
class TrainingDirectionsAdmin(admin.ModelAdmin):
    list_display = ['direction_code', 'direction_name']
    search_fields = ['direction_code', 'direction_name']
