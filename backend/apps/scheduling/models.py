from django.db import models

class TimeSlot(models.Model):
    DAY_CHOICES = [
        ('Saturday','Saturday'),
        ('Sunday','Sunday'),
        ('Monday','Monday'),
        ('Tuesday','Tuesday'),
        ('Wednesday','Wedensday')
    ]
    school = models.ForeignKey('school.School',on_delete=models.CASCADE,null=True,blank=True, related_name='time_slots')

    day = models.CharField(max_length=10,choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f"{self.day} {self.start_time} - {self.end_time}"


class TimeTableSlot(models.Model):
    assignment =models.ForeignKey("school.TeachingAssignment",on_delete=models.CASCADE)
    time_slot = models.ForeignKey(TimeSlot,on_delete=models.CASCADE)
    class Meta:
        ordering = [
            "assignment__school_class__id",
            "time_slot__day",
            "time_slot__start_time"
        ]
    def __str__(self):
        return f"{self.assignment} - {self.time_slot}"

    
