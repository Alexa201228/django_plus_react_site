from django.contrib import admin
from .models import Course, Module


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'created']
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ['title', 'created']
    summernote_fields = ('description', )
    filter_horizontal = ('students_on_course', )
    list_per_page = 10


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ['module_name']
    prepopulated_fields = {'slug': ('module_name', )}
    summernote_fields = ('body', )
