from django.contrib import admin
from .models import Course, Lesson


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'created']
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ['title', 'created']
    filter_horizontal = ('students_on_course', )
    list_per_page = 10


@admin.register(Lesson)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ['module_name', 'theme']
    prepopulated_fields = {'slug': ('module_name', )}
    search_fields = ['theme', 'module_name']

