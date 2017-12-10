from django.db import models
from django.utils import timezone


# Create your models here.
class Semester(models.Model):
    semester_id = models.AutoField(
        verbose_name='semester_id',
        primary_key=True
    )
    semester_name = models.CharField(
        verbose_name='semester_name',
        max_length=32,
        unique=True
    )
    start_day = models.DateField(
        verbose_name='start_day'
    )
    end_day = models.DateField(
        verbose_name='end_day'
    )
    user_id = models.ForeignKey(
        'accounts.User',
        verbose_name='user_id',
        on_delete=models.CASCADE
    )

    def create(self):
        self.save()

    def __str__(self):
        return self.semester_name


class Class(models.Model):
    class_id = models.AutoField(
        verbose_name='class_id',
        primary_key=True
    )
    class_name = models.CharField(
        verbose_name='class_name',
        max_length=128,
    )
    professor = models.CharField(
        verbose_name='professor',
        max_length=32,
    )
    credit = models.IntegerField(verbose_name='credit')
    semester_id = models.ForeignKey(
        'main.Semester',
        verbose_name='semester_id',
        on_delete=models.CASCADE
    )

    def create(self):
        self.save()

    def __str__(self):
        return self.class_name


class ClassTime(models.Model):
    classtime_id = models.AutoField(
        verbose_name='classtime_id',
        primary_key=True
    )
    start_time = models.TimeField(verbose_name='start_time')
    end_time = models.TimeField(verbose_name='end_time')
    class_id = models.ForeignKey(
        'main.Class',
        verbose_name='class_id',
        on_delete=models.CASCADE
    )

    def create(self):
        self.save()

    def __str__(self):
        return self.class_id + " " + self.start_time


class Period(models.Model):
    period_id = models.AutoField(
        verbose_name='period_id',
        primary_key=True
    )
    year = models.IntegerField(verbose_name='year')
    start_month = models.IntegerField(verbose_name='start_month')
    week = models.IntegerField(verbose_name='week')
    start_day = models.IntegerField(verbose_name='start_day')
    end_day = models.IntegerField(verbose_name='end_day')

    def create(self):
        self.save()

    def __str__(self):
        return self.year + "년 " + self.start_month + "월 " + self.week + "째주 "


class Calendar(models.Model):
    calendar_id = models.AutoField(
        verbose_name='calendar_id',
        primary_key=True
    )
    class_id = models.ForeignKey(
        'main.Class',
        verbose_name='class_id',
        on_delete=models.CASCADE
    )
    period_id = models.ForeignKey(
        'main.Period',
        verbose_name='period_id',
        on_delete=models.CASCADE
    )
    date = models.DateField(verbose_name='date')
    title = models.CharField(
        verbose_name='title',
        max_length=256,
        null=False
    )
    text = models.TextField(verbose_name='text')
    start_time = models.TimeField(verbose_name='start_time')
    end_time = models.TimeField(verbose_name='end_time')

    def create(self):
        self.save()

    def __str__(self):
        return self.title


class Memo(models.Model):
    memo_id = models.AutoField(
        verbose_name='memo_id',
        primary_key=True
    )
    class_id = models.ForeignKey(
        'main.Class',
        verbose_name='class_id',
        on_delete=models.CASCADE
    )
    period_id = models.ForeignKey(
        'main.Period',
        verbose_name='period_id',
        on_delete=models.CASCADE
    )
    title = models.CharField(
        verbose_name='title',
        max_length=256,
        null=False
    )
    text = models.TextField(verbose_name='text')
    created_date = models.DateTimeField(
        verbose_name='created_time',
        default=timezone.now)
    published_date = models.DateTimeField(
        verbose_name="published_date",
        blank=True,
        null=True)

    def create(self):
        self.published_date = timezone.now()
        self.save()

    def __str__(self):
        return self.title


class Grade(models.Model):
    grade_id = models.AutoField(
        verbose_name='grade_id',
        primary_key=True
    )
    class_id = models.ForeignKey(
        'main.Class',
        verbose_name='class_id',
        on_delete=models.CASCADE
    )
    grade = models.CharField(
        verbose_name='grade',
        max_length=3,
        null=False,
        default='F'
    )
    score = models.FloatField(
        verbose_name='score',
        null=False,
        default=0.0
    )
    is_score = models.BooleanField(
        verbose_name='is_score',
        null=False,
        default=True
    )

    def create(self):
        self.save()

    def __str__(self):
        return self.class_id