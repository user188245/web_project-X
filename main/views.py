from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, reverse
import ast
import datetime
import simplejson
from .forms import CreateSemester
from .models import *


semester_id = 0


def classtime(request):
    if request.user.is_authenticated:
        return render(request, "main/index.html")
    else:
        return HttpResponseRedirect(
            reverse('signin')
        )


def classtime_ajax(request):
    global semester_id
    if request.is_ajax():
        data = simplejson.loads(request.POST['data'])
        date = datetime.datetime.strptime(data['date'], '%Y-%m-%d').date()
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
            class_data = {
                'name': lecture_row.class_name,
                'instructor': lecture_row.professor,
                'homepage': lecture_row.homepage
            }
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
                }
                nolecture_calendar = Calendar.objects.filter(
                    class_id=classtime_row.class_id_id,
                    start_time=classtime_row.start_time,
                    title=lecture_row.class_name + ' 휴강'
                )
                if len(nolecture_calendar) == 0:
                    classtime_data['isCanceled'] = False
                else:
                    classtime_data['isCanceled'] = True
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


def nolecture_ajax(request):
    if request.is_ajax():
        return HttpResponse("Invalid Request")


def semester(request):
    if request.user.is_authenticated:
        semesters = Semester.objects.filter(user_id_id=request.user.user_id)
        return render(request, 'main/semester.html', {'semesters': semesters})
    else:
        return HttpResponseRedirect(
            reverse('signin')
        )


def create_semester(request):
    if request.user.is_authenticated:
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
    else:
        return HttpResponseRedirect(
            reverse('signin')
        )


def lecture(request):
    if request.user.is_authenticated:
        return render(request, 'main/lecture.html')
    else:
        return HttpResponseRedirect(
            reverse('signin')
        )


def lecture_ajax(request):
    # global semester_id
    if request.is_ajax():
        global semester_id
        date = datetime.datetime.now().date()
        # 쿼리 시작
        semester_rows = Semester.objects.filter(user_id_id=request.user.user_id)
        for semester_row in semester_rows:
            if (semester_row.start_day <= date) and (semester_row.end_day >= date):
                semester_id = semester_row.semester_id
                break
            else:
                continue
        if semester_id == 0:
            return HttpResponse("No Data")
        if request.POST['method'] == 'get':
            if semester_id == 0:
                return HttpResponse("No Data")

            lecture_rows = Class.objects.filter(semester_id_id=semester_id)
            # classtime_rows = ClassTime.objects.filter(class_id_id__in=lecture_rows.values('class_id'))

            data = {}
            lecture_list = []
            for lecture_row in lecture_rows:
                class_data = {
                    'name': lecture_row.class_name,
                    'instructor': lecture_row.professor,
                    'homepage': lecture_row.homepage
                }
                classtime_list = []
                classtime_rows = ClassTime.objects.filter(class_id_id=lecture_row.class_id)
                for classtime_row in classtime_rows:
                    classtime_data = {
                        'start_hour': classtime_row.start_time.hour,
                        'start_min': classtime_row.start_time.minute,
                        'end_hour': classtime_row.end_time.hour,
                        'end_min': classtime_row.end_time.minute,
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

        if request.POST['method'] == 'add':
            data = simplejson.loads(request.POST['data'])
            lecture_info = data['lecture']
            schedule_list = lecture_info['scheduleList']
            time_list = []
            for schedule in schedule_list:
                time = {
                    'start_time': datetime.datetime.strptime(str(schedule['scheduleTime']['start_hour']) + ":" + str(schedule['scheduleTime']['start_min']), '%H:%M'),
                    'end_time': datetime.datetime.strptime(str(schedule['scheduleTime']['end_hour']) + ":" + str(schedule['scheduleTime']['end_min']), '%H:%M')
                }
                time_list.append(time)

            new_lecture = Class(class_name=lecture_info['name'], professor=lecture_info['instructor'], credit=3,
                                homepage=lecture_info['homepage'], semester_id_id=semester_id)
            new_lecture.save()

            latest_lecture = Class.objects.filter(semester_id_id=semester_id).last()
            class_id = latest_lecture.class_id

            for i in range(0, len(schedule_list)):
                new_classtime = ClassTime(weekday=schedule_list[i]['week'], start_time=time_list[i]['start_time'],
                                          end_time=time_list[i]['end_time'], location=schedule_list[i]['location'],
                                          class_id_id=class_id)
                new_classtime.save()

            return HttpResponse('Complete.')

        if request.POST['method'] == 'modify':
            return HttpResponse('Soon.')

        if request.POST['method'] == 'remove':
            data = simplejson.loads(request.POST['data'])
            saved_lecture = Class.objects.filter(class_name=data['lecture'])[0]
            saved_lecture.delete()
            return HttpResponse('Complete.')

    return HttpResponse("Invalid Request")


def calendar(request):
    if request.user.is_authenticated:
        return render(request, 'main/calendar.html')
    else:
        return HttpResponseRedirect(
            reverse('signin')
        )


def calendar_ajax(request):
    if request.is_ajax():
        if request.POST['method'] == 'get':
            data = simplejson.loads(request.POST['data'])
            date = datetime.datetime.strptime(data['date'], '%Y-%m-%d').date()
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

        elif request.POST['method'] == 'add':
            data = simplejson.loads(request.POST['data'])
            schedule = data['schedule']
            time = schedule['scheduleTime']
            start_time = datetime.datetime.strptime(str(time['start_hour']) + ":" + str(time['start_min']), '%H:%M')
            end_time = datetime.datetime.strptime(str(time['end_hour']) + ":" + str(time['end_min']), '%H:%M')
            new_calendar = Calendar(date=schedule['date'], title=schedule['name'], text=schedule['text'],
                                    place=schedule['location'], start_time=start_time, end_time=end_time, user_id_id=request.user.user_id)
            new_calendar.save()
            return HttpResponse('Complete.')

        elif request.POST['method'] == 'modify':
            data = simplejson.loads(request.POST['data'])
            schedule = data['schedule']
            time = schedule['scheduleTime']
            start_time = datetime.datetime.strptime(str(time['start_hour']) + ":" + str(time['start_min']), '%H:%M')
            end_time = datetime.datetime.strptime(str(time['end_hour']) + ":" + str(time['end_min']), '%H:%M')

            saved_calendar = Calendar.objects.filter(title=schedule['name'])[0]
            saved_calendar.date = schedule['date']
            saved_calendar.text = schedule['text']
            saved_calendar.place = schedule['location']
            saved_calendar.start_time = start_time
            saved_calendar.end_time = end_time

            saved_calendar.save()
            return HttpResponse('Complete.')

        elif request.POST['method'] == 'remove':
            data = simplejson.loads(request.POST['data'])
            saved_calendar = Calendar.objects.filter(title=data['schedule'])[0]
            saved_calendar.delete()
            return HttpResponse('Complete.')

    return HttpResponse("Invalid Request")
