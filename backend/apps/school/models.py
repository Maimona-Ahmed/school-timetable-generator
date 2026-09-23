from django.db import models

class School(models.Model):

    name = models.CharField(max_length=200,unique=True)

    def __str__(self):
        return self.name

class Teacher(models.Model):
    name = models.CharField(max_length=100)
    school = models.ForeignKey(School,on_delete=models.CASCADE,null=True,blank=True, related_name='teachers')
    def __str__(self):
        return self.name

class Subject(models.Model):
    name = models.CharField(max_length=100)
    school = models.ForeignKey(School,on_delete=models.CASCADE,null=True,blank=True, related_name='subjects')
    def __str__(self):
        return self.name

class SchoolClass(models.Model):
    school = models.ForeignKey(School,on_delete=models.CASCADE,null=True,blank=True, related_name='classses')
    name = models.CharField(max_length=50)
    room = models.CharField(max_length=50)
    def __str__(self):
        return self.name

class TeachingAssignment(models.Model):
    teacher = models.ForeignKey(Teacher,on_delete=models.CASCADE,related_name="assignments")
    subject = models.ForeignKey(Subject,on_delete=models.CASCADE,related_name="assignments")
    school_class = models.ForeignKey(SchoolClass,on_delete=models.CASCADE,related_name="assignments")
    weekly_lessons = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.teacher} - {self.subject} - {self.school_class}"
    


