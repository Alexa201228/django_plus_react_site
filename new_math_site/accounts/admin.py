from django.contrib import admin
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Student, Mentor


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified',
                                       'user_permissions')}),
        (_('Important dates'), {'fields': ('date_joined', )}),
    )
    add_fieldsets = (
        (None, {
            'fields': ('email', 'password'),
        }),
    )
    list_display = ('email', 'is_active', 'is_staff',
                    'is_superuser', 'is_verified')
    search_fields = ('email', 'is_active', 'is_staff',
                     'is_superuser', 'is_verified')
    ordering = ('email',)


@admin.register(Mentor)
class MentorAdmin(admin.ModelAdmin):
    list_display = ('login', 'first_name', 'last_name', 'patronymic')
    search_fields = ('login', 'first_name', 'last_name', 'patronymic')
    filter_horizontal = ('mentor_courses', 'mentors_qroups')
    ordering = ('login', )


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'patronymic', 'student_group')
    search_fields = ('first_name', 'last_name', 'patronymic', 'student_group')

