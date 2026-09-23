from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import path

router = DefaultRouter()

router.register('time-slots',TimeSlotViewSet,basename="time-slot")
router.register('timetable',TimetableSlotViewSet,basename="timetable-slot")
urlpatterns = router.urls + [

    path(
        'generate/',
        generate_timetable_api,
        name='generate-timetable'
    ),

]
