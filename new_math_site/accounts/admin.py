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
        (_('Important dates'), {'fields': ('date_joined', )}),
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
class MentorAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'patronymic')
    search_fields = ('first_name', 'last_name', 'patronymic')
    filter_horizontal = ('mentor_courses', 'mentors_qroups', 'user_permissions')
    ordering = ('last_name', )
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'patronymic',
                                         'mentor_courses', 'mentors_qroups')}))


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'patronymic', 'student_group')
    search_fields = ('first_name', 'last_name', 'patronymic', 'student_group')

