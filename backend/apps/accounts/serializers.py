from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction
from apps.school.models import School


User = get_user_model()


class RegisterSerializer(serializers.Serializer):

    username = serializers.CharField(
        max_length=150
    )

    password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    school_name = serializers.CharField(
        max_length=200
    )

    def validate_username(self, value):

        value = value.strip()

        if not value:

            raise serializers.ValidationError(
                'Name is required.'
            )

        if User.objects.filter(
            username=value
        ).exists():

            raise serializers.ValidationError(
                'This name is already registered.'
            )

        return value

    def validate_school_name(self, value):

        value = value.strip()

        if not value:

            raise serializers.ValidationError(
                'School name is required.'
            )

        if School.objects.filter(
            name=value
        ).exists():

            raise serializers.ValidationError(
                'This school already exists.'
            )

        return value

    def create(self, validated_data):

        with transaction.atomic():

            school = School.objects.create(
                name=validated_data['school_name']
            )

            user = User.objects.create_user(
                username=validated_data['username'],
                password=validated_data['password'],
                school=school
            )

        return user

class LoginSerializer(serializers.Serializer):

    username = serializers.CharField()

    password = serializers.CharField(
        write_only=True
    )


class UserSerializer(serializers.Serializer):

    id = serializers.IntegerField(
        read_only=True
    )

    username = serializers.CharField(
        read_only=True
    )

    email = serializers.EmailField(
        read_only=True
    )

    school = serializers.SerializerMethodField()

    def get_school(self, obj):

        if obj.school is None:
            return None

        return {
            'id': obj.school.id,
            'name': obj.school.name,
        }