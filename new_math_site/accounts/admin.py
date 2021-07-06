from django.contrib import admin
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


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
    list_display = ('email', 'is_active', 'is_staff', 'is_superuser',)
    search_fields = ('email', 'is_active', 'is_staff', 'is_superuser',)
    ordering = ('email',)
