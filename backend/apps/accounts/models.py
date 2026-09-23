from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):

    school = models.ForeignKey('school.School',on_delete=models.CASCADE,null=True,blank=True, related_name='users')

    def __str__(self):
        return self.username