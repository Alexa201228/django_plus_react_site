from django.db import models
from django.contrib.auth.models import (BaseUserManager,
                                        AbstractBaseUser, PermissionsMixin)
from django.utils import timezone

from rest_framework_simplejwt.tokens import RefreshToken


class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **additional_fields):
        """
        Create and return a 'User' with an email and password
        """
        if not email:
            raise ValueError('Users must have a valid email address')
        if not password:
            raise ValueError('Users must have a password')

        user = self.model(
            email=self.normalize_email(email),
            **additional_fields

        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **additional_fields):
        if not email:
            raise ValueError('Superusers must have a valid email address')
        if not password:
            raise ValueError('Superusers must have a password')
        user = self.create_user(email, password, **additional_fields)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user


class User(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30, null=True, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)
    student_courses = models.ManyToManyField(
        to='courses.Course',
        related_name='accounts',
        blank=True
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self) -> str:
        return f'{self.email}'

    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


# Create your models here.
