from django.db import models
from django.utils import timezone


class Semester(models.Model):
    semester_id = models.AutoField(
        verbose_name='semester_id',
        primary_key=True
    )
    semester_name = models.CharField(
        verbose_name='semester_name',
        max_length=32,
    )
    start_day = models.DateField(
        verbose_name='start_day',
    )
    end_day = models.DateField(
        verbose_name='end_day',
    )
    user_id = models.ForeignKey(
        'accounts.User',
        verbose_name='user_id',
        on_delete=models.CASCADE
    )
    objects = models.Manager

    def create(self):
        self.save()

    def __str__(self):
        return self.semester_name


class Class(models.Model):
    class_id = models.AutoField(
        verbose_name='class_id',
        primary_key=True,
    )
    class_name = models.CharField(
        verbose_name='class_name',
        max_length=128,
    )
    professor = models.CharField(
        verbose_name='professor',
        max_length=33,
    )
    credit = models.IntegerField(verbose_name='credit')
    homepage = models.CharField(
        verbose_name='homepage',
        max_length=512,
        null=True
    )
    semester_id = models.ForeignKey(
        'main.Semester',
        verbose_name='semester_id',
        on_delete=models.CASCADE,
    )
    objects = models.Manager

    def create(self):
        self.save()

    def __str__(self):
        return self.class_name


class ClassTime(models.Model):
    classtime_id = models.AutoField(
        verbose_name='classtime_id',
        primary_key=True
    )
    weekday = models.IntegerField(verbose_name='weekday')
    start_time = models.TimeField(verbose_name='start_time')
    end_time = models.TimeField(verbose_name='end_time')
    location = models.CharField(
        verbose_name='location',
        max_length=128
    )
    class_id = models.ForeignKey(
        'main.Class',
        verbose_name='class_id',
        on_delete=models.CASCADE
    )
    objects = models.Manager

    def create(self):
        self.save()

    def __str__(self):
        return self.class_id + " " + self.start_time


class Calendar(models.Model):
    calendar_id = models.AutoField(
        verbose_name='calendar_id',
        primary_key=True
    )
    user_id = models.ForeignKey(
        'accounts.User',
        verbose_name='user_id',
        on_delete=models.CASCADE
    )
    date = models.DateField(verbose_name='date')
    title = models.CharField(
        verbose_name='title',
        max_length=256,
        null=False
    )
    text = models.TextField(verbose_name='text')
    place = models.CharField(
        verbose_name='place',
        max_length=127,
    )
    start_time = models.TimeField(verbose_name='start_time')
    end_time = models.TimeField(verbose_name='end_time')
    objects = models.Manager
    class_id = models.IntegerField(
        verbose_name='class_id',
        null=True,
    )

    def create(self):
        self.save()

    def __str__(self):
        return self.title
