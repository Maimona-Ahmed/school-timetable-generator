from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet

from .models import (
    TimeSlot,
    TimeTableSlot,
)

from .serializers import (
    TimeSlotSerializer,
    TimetableSlotSerializer,
)

from .csp import generate_timetable,validate_timetable


class TimeSlotViewSet(ModelViewSet):

    serializer_class = TimeSlotSerializer
    def get_queryset(self):

        return TimeSlot.objects.filter(
            school=self.request.user.school
        )

    def perform_create(self, serializer):

        serializer.save(
            school=self.request.user.school
        )



class TimetableSlotViewSet(ModelViewSet):

    serializer_class = TimetableSlotSerializer
    def get_queryset(self):

        return TimeTableSlot.objects.filter(
            time_slot__school=
                self.request.user.school
        )



@api_view(['POST'])
def generate_timetable_api(request):

    school = request.user.school

    if school is None:

        return Response(
            {
                'detail':
                    'User is not assigned to a school.'
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    solution = generate_timetable(
        school
    )

    if solution is None:

        return Response(
            {
                'detail':
                    'No valid timetable could be generated.'
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    is_valid, message = validate_timetable(
        school
    )

    if not is_valid:

        return Response(
            {
                'detail': message
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response(
        {
            'detail':
                'Timetable generated successfully.',

            'count':
                len(solution),

            'validation':
                message,
        },
        status=status.HTTP_200_OK,
    )
