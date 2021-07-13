import re

from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


class CustomValidator:

    def __init__(self, min_length=9):
        self.min_length = min_length

    def validate(self, password, user=None):
        """
        Customize password validation

        Password min_length can be configured in settings.py
        (AUTH_PASSWORD_VALIDATORS section)

        Password should have at least one capital letter,
        one lowercase letter, one digit and one special character
        """
        if len(password) < self.min_length:
            raise ValidationError(
                _(f'Password length should be at least {self.min_length} characters'))
        if not re.findall('\d', password):
            raise ValidationError(
                _('Password should contain at least one digit'))

    def get_help_text(self):
        return ""
