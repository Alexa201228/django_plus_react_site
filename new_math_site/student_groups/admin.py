from django.contrib import admin
from .models import StudentGroup, StudentBookNumber


@admin.register(StudentGroup)
class StudentGroupAdmin(admin.ModelAdmin):
    list_display = ['group_name']
    search_fields = ('group_name', )
    filter_horizontal = ('group_mentors',)


@admin.register(StudentBookNumber)
class StudentBookNumberAdmin(admin.ModelAdmin):
    list_display = ['student_book_number']
    search_fields = ('student_book_number', )
