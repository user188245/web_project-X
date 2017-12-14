from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, reverse
import ast
import datetime
import simplejson
from .forms import CreateSemester
from .models import Semester, Class, ClassTime, Calendar


def classtime(request):
    if request.user.is_authenticated:
        return render(request, "main/index.html")
    else:
        return HttpResponseRedirect(
            reverse('signin')
        )


def classtime_ajax(request):
    if request.is_ajax():
        date = datetime.datetime.strptime(ast.literal_eval(request.POST['data'])['date'], '%Y-%m-%d').date()
        current_weekday = date.weekday()
        monday = date - datetime.timedelta(days=current_weekday)
        sunday = date + datetime.timedelta(days=(6 - current_weekday))
        # 쿼리 시작
        semester_rows = Semester.objects.filter(user_id_id=request.user.user_id)
        semester_id = 0
        current_semester = None
        for semester_row in semester_rows:
            if (semester_row.start_day <= date) and (semester_row.end_day >= date):
                semester_id = semester_row.semester_id
                current_semester = semester_row
                break
            else:
                continue
        if semester_id == 0:
            return HttpResponse("No Data")

        lecture_rows = Class.objects.filter(semester_id_id=current_semester.semester_id)
        # classtime_rows = ClassTime.objects.filter(class_id_id__in=lecture_rows.values('class_id'))
        calendar_rows = Calendar.objects.filter(user_id_id=request.user.user_id, date__gte=monday, date__lte=sunday)

        data = {'name': current_semester.semester_name + ' 시간표'}
        lecture_list = []
        for lecture_row in lecture_rows:
            class_data = {}
            class_data['name'] = lecture_row.class_name
            class_data['instructor'] = lecture_row.professor
            class_data['homepage'] = lecture_row.homepage
            classtime_list = []
            classtime_rows = ClassTime.objects.filter(class_id_id=lecture_row.class_id)
            for classtime_row in classtime_rows:
                classtime_data = {
                    'startHour': classtime_row.start_time.hour,
                    'startMinute': classtime_row.start_time.minute,
                    'endHour': classtime_row.end_time.hour,
                    'endMinute': classtime_row.end_time.minute,
                    'week': classtime_row.weekday,
                    'location': classtime_row.location,
                    'isCanceled': False
                }
                classtime_list.append(classtime_data)

            class_data['scheduleList'] = classtime_list
            lecture_list.append(class_data)

        data['lectureList'] = lecture_list
        calendar_list = []
        for calendar_row in calendar_rows:
            calendar_data = {
                'name': calendar_row.title,
                'location': calendar_row.place,
                'text': calendar_row.text,
                'startHour': calendar_row.start_time.hour,
                'startMinute': calendar_row.start_time.minute,
                'endHour': calendar_row.end_time.hour,
                'endMinute': calendar_row.end_time.minute
            }
            date_data = {
                'year': calendar_row.date.year,
                'month': calendar_row.date.month,
                'day': calendar_row.date.day
            }
            calendar_data['date'] = date_data
            calendar_list.append(calendar_data)

        data['exceptionalSchduleList'] = calendar_list
        json = simplejson.dumps(data)
        return HttpResponse(json)
    return HttpResponse("Invalid Request")


def semester(request):
    semesters = Semester.objects.all()
    # posts = Post.objects.filter(published_date__lte=timezone.now()).order_by('published_date');
    return render(request, 'main/semester.html', {'semesters': semesters})


def create_semester(request):
    createform = CreateSemester()
    if request.method == 'POST':
        createform = CreateSemester(request.POST)
        if createform.is_valid():
            create = createform.save(commit=False)
            create.user_id_id = request.user.user_id
            create.save()
            return HttpResponseRedirect(
                reverse('semester')
            )
    return render(request, "main/create_semester.html", {
        "createform": createform
    })


def lecture(request):
    return render(request, 'main/lecture.html')


def lecture_ajax(request):
    if request.is_ajax():
        date = datetime.datetime.strptime(ast.literal_eval(request.POST['data'])['date'], '%Y-%m-%d').date()
        # 쿼리 시작
        semester_rows = Semester.objects.filter(user_id_id=request.user.user_id)
        semester_id = 0
        current_semester = None
        for semester_row in semester_rows:
            if (semester_row.start_day <= date) and (semester_row.end_day >= date):
                semester_id = semester_row.semester_id
                current_semester = semester_row
                break
            else:
                continue
        if semester_id == 0:
            return HttpResponse("No Data")

        lecture_rows = Class.objects.filter(semester_id_id=current_semester.semester_id)
        # classtime_rows = ClassTime.objects.filter(class_id_id__in=lecture_rows.values('class_id'))

        data = {'name': current_semester.semester_name + ' 시간표'}
        lecture_list = []
        for lecture_row in lecture_rows:
            class_data = {}
            class_data['name'] = lecture_row.class_name
            class_data['instructor'] = lecture_row.professor
            class_data['homepage'] = lecture_row.homepage
            classtime_list = []
            classtime_rows = ClassTime.objects.filter(class_id_id=lecture_row.class_id)
            for classtime_row in classtime_rows:
                classtime_data = {
                    'startHour': classtime_row.start_time.hour,
                    'startMinute': classtime_row.start_time.minute,
                    'endHour': classtime_row.end_time.hour,
                    'endMinute': classtime_row.end_time.minute,
                    'week': classtime_row.weekday,
                    'location': classtime_row.location,
                    'isCanceled': False
                }
                classtime_list.append(classtime_data)

            class_data['scheduleList'] = classtime_list
            lecture_list.append(class_data)

        data['lectureList'] = lecture_list

        json = simplejson.dumps(data)
        return HttpResponse(json)
    return HttpResponse("Invalid Request")


def calendar(request):
    return render(request, 'main/calendar.html')


def calendar_ajax(request):
    if request.is_ajax():
        if request.POST['method'] == 'get':
            date = datetime.datetime.strptime(ast.literal_eval(request.POST['data'])['date'], '%Y-%m-%d').date()
            # 쿼리 시작
            semester_rows = Semester.objects.filter(user_id_id=request.user.user_id)
            semester_id = 0
            current_semester = None
            for semester_row in semester_rows:
                if (semester_row.start_day <= date) and (semester_row.end_day >= date):
                    semester_id = semester_row.semester_id
                    current_semester = semester_row
                    break
                else:
                    continue
            if semester_id == 0:
                return HttpResponse("No Data")

            calendar_rows = Calendar.objects.filter(user_id_id=request.user.user_id)

            data = {}
            calendar_list = []
            for calendar_row in calendar_rows:
                calendar_data = {
                    'name': calendar_row.title,
                    'location': calendar_row.place,
                    'text': calendar_row.text,
                    'startHour': calendar_row.start_time.hour,
                    'startMinute': calendar_row.start_time.minute,
                    'endHour': calendar_row.end_time.hour,
                    'endMinute': calendar_row.end_time.minute,
                    'date': calendar_row.date.isoformat()
                }
                calendar_list.append(calendar_data)

            data['scheduleList'] = calendar_list
            json = simplejson.dumps(data)
            return HttpResponse(json)
    return HttpResponse("Invalid Request")
