from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import *


router = DefaultRouter()

router.register('teachers',TeacherViewSet,basename="teacher")
router.register('subjects',SubjectViewSet,basename="subject")
router.register('classes',SchoolClassViewSet,basename="school-class")
router.register('assignments',TeachingAssignmentViewSet,basename="teaching-assignment")
urlpatterns = [

    path(
        'dashboard/',
        dashboard,
        name='dashboard'
    ),

]



urlpatterns += router.urls



