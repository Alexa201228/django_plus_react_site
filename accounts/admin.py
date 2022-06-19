from django.contrib import admin
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Student, Mentor


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'user_permissions')}),
        (_('Important dates'), {'fields': ('date_joined',)}),
    )
    add_fieldsets = (
        (None, {
            'fields': ('email', 'password'),
        }),
    )
    list_display = ('email', 'is_active', 'is_staff',
                    'is_superuser')
    search_fields = ('email', 'is_active', 'is_staff',
                     'is_superuser')
    ordering = ('email',)


@admin.register(Mentor)
class MentorAdmin(BaseUserAdmin):
    list_display = ('id', 'first_name', 'last_name', 'patronymic')
    search_fields = ('first_name', 'last_name', 'patronymic')
    filter_horizontal = (
    'mentor_courses', 'mentors_groups', 'mentor_training_directions')
    ordering = ('last_name',)
    add_fieldsets = (
        (None, {'fields': ('email', 'password1', 'password2')}),
        (
        _('Personal info'), {'fields': ('first_name', 'last_name', 'patronymic',
                                        'mentor_courses', 'mentors_groups',
                                        'mentor_training_directions')}))

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (
        _('Personal info'), {'fields': ('first_name', 'last_name', 'patronymic',
                                        'mentor_courses', 'mentors_groups',
                                        'mentor_training_directions')}))


@admin.register(Student)
class StudentAdmin(BaseUserAdmin):
    list_display = ('first_name', 'last_name', 'patronymic', 'student_group')
    search_fields = ('first_name', 'last_name', 'patronymic', 'student_group')
    filter_horizontal = ('student_courses',)
    readonly_fields = ('student_tests',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (
        _('Personal info'), {'fields': ('first_name', 'last_name', 'patronymic',
                                        'student_courses', 'student_group',
                                        'student_tests',
                                        'student_book_number')}))
    ordering = ('last_name',)
