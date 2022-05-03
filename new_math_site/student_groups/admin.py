from django.contrib import admin
from .models import StudentGroup


@admin.register(StudentGroup)
class StudentGroupAdmin(admin.ModelAdmin):
    list_display = ['group_name']
    search_fields = ('group_name', )
    filter_horizontal = ('mentors',)
