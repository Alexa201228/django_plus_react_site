from django.contrib.auth import models
from django.db.models import fields
from rest_framework import serializers
from ..models import User
from django.contrib.auth import authenticate


class RegisterSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', "nick_name"]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
