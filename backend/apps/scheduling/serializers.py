from rest_framework import serializers
from .models import *

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ['id','day','start_time','end_time']

class TimetableSlotSerializer(serializers.ModelSerializer):

    teacher = serializers.CharField(
        source='assignment.teacher.name',
        read_only=True
    )

    subject = serializers.CharField(
        source='assignment.subject.name',
        read_only=True
    )

    school_class = serializers.CharField(
        source='assignment.school_class.name',
        read_only=True
    )

    room = serializers.CharField(
        source='assignment.school_class.room',
        read_only=True
    )

    day = serializers.CharField(
        source='time_slot.day',
        read_only=True
    )

    start_time = serializers.TimeField(
        source='time_slot.start_time',
        read_only=True
    )

    end_time = serializers.TimeField(
        source='time_slot.end_time',
        read_only=True
    )

    class Meta:
        model = TimeTableSlot

        fields = ['id','teacher','subject','school_class','room','day','start_time','end_time',]
