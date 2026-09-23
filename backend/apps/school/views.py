from rest_framework.viewsets import ModelViewSet
from .models import *

from .serializers import *
from apps.scheduling.models import *

from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout
from django.views.decorators.csrf import ensure_csrf_cookie

from rest_framework.decorators import (
    api_view,
    permission_classes,
)

from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)

from rest_framework.response import Response
from rest_framework.decorators import api_view

from rest_framework import status

class TeacherViewSet(ModelViewSet):
    serializer_class = TeacherSerializer
    def get_queryset(self):

        return Teacher.objects.filter(
            school=self.request.user.school
        )


    def perform_create(self, serializer):

        serializer.save(
            school=self.request.user.school
        )



class SubjectViewSet(ModelViewSet):
    serializer_class = SubjectSerializer
    def get_queryset(self):

        return Subject.objects.filter(
            school=self.request.user.school
        )


    def perform_create(self, serializer):

        serializer.save(
            school=self.request.user.school
        )



class SchoolClassViewSet(ModelViewSet):
    serializer_class = SchoolClassSerializer
    def get_queryset(self):

        return SchoolClass.objects.filter(
            school=self.request.user.school
        )


    def perform_create(self, serializer):

        serializer.save(
            school=self.request.user.school
        )


class TeachingAssignmentViewSet(ModelViewSet):
    serializer_class = TeachingAssignmentSerializer
    def get_queryset(self):

        return TeachingAssignment.objects.filter(
            school_class__school=
                self.request.user.school
        )


    def perform_create(self, serializer):

        serializer.save()


@api_view(['GET'])
def dashboard(request):

    school = request.user.school

    if school is None:

        return Response(
            {
                'detail':
                    'User is not assigned to a school.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    teachers = Teacher.objects.filter(
        school=school
    ).count()


    subjects = Subject.objects.filter(
        school=school
    ).count()


    classes = SchoolClass.objects.filter(
        school=school
    ).count()


    assignments = TeachingAssignment.objects.filter(
        school_class__school=school
    ).count()


    time_slots = TimeSlot.objects.filter(
        school=school
    ).count()


    timetable_slots = TimeTableSlot.objects.filter(
        time_slot__school=school
    ).count()


    return Response({

        'school': {
            'id':
                school.id,

            'name':
                school.name,
        },

        'statistics': {

            'teachers':
                teachers,

            'subjects':
                subjects,

            'classes':
                classes,

            'assignments':
                assignments,

            'time_slots':
                time_slots,

            'timetable_slots':
                timetable_slots,

        },

    })




