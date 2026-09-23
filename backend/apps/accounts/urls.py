from django.urls import path
from .views import *

urlpatterns = [

    path(
        'login/',
        login_api,
        name='login',
    ),

    path(
        'logout/',
        logout_api,
        name='logout',
    ),

    path(
        'me/',
        me_api,
        name='me',
    ),

    path(
        'csrf/',
        csrf_api,
        name='csrf',
    ),
        path(
        'register/',
        register,
        name='register'
    ),


]