
from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout
from django.views.decorators.csrf import ensure_csrf_cookie
from .serializers import *
from rest_framework.decorators import (
    api_view,
    permission_classes,
)

from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)

from rest_framework.response import Response

from rest_framework import status
from .serializers import RegisterSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def login_api(request):

    serializer = LoginSerializer(
        data=request.data
    )

    serializer.is_valid(
        raise_exception=True
    )

    username = serializer.validated_data[
        'username'
    ]

    password = serializer.validated_data[
        'password'
    ]

    user = authenticate(
        request,
        username=username,
        password=password,
    )

    if user is None:

        return Response(
            {
                'detail':
                    'Invalid username or password.'
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not user.is_active:

        return Response(
            {
                'detail':
                    'User account is disabled.'
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    if user.school is None:

        return Response(
            {
                'detail':
                    'User is not assigned to a school.'
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    login(
        request,
        user,
    )

    return Response(
        {
            'detail':
                'Login successful.',

            'user':
                UserSerializer(user).data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_api(request):

    logout(request)

    return Response(
        {
            'detail':
                'Logout successful.'
        },
        status=status.HTTP_200_OK,
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_api(request):

    return Response(
        UserSerializer(request.user).data,
        status=status.HTTP_200_OK,
    )


@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def csrf_api(request):

    return Response(
        {
            'detail':
                'CSRF cookie set.'
        }
    )

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):

    serializer = RegisterSerializer(
        data=request.data
    )

    if not serializer.is_valid():

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    user = serializer.save()

    login(
        request,
        user
    )

    return Response(
        {
            'detail':
                'Account created successfully.',

            'user': {
                'id':
                    user.id,

                'username':
                    user.username,

                'school': {
                    'id':
                        user.school.id,

                    'name':
                        user.school.name,
                },
            },
        },
        status=status.HTTP_201_CREATED
    )

