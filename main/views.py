from django.shortcuts import render, reverse
from django.http import HttpResponseRedirect, HttpResponse
import simplejson
import datetime
from .models import Semester, Class, ClassTime, Calendar
from .forms import CreateSemester


def classtime(request):
    if request.user.is_authenticated:
        return render(request, "main/index.html")
    else:
        return HttpResponseRedirect(
            reverse('signin')
        )


def classtime_ajax(request):
    if request.is_ajax():
        date = datetime.datetime.strptime(request.POST['date'], '%Y-%m-%d').date()
        current_weekday = date.weekday()
        monday = date - datetime.timedelta(days=current_weekday)
        sunday = date + datetime.timedelta(days=(6 - current_weekday))
        monday_str = monday.isoformat()
        sunday_str = sunday.isoformat()
        # 쿼리 시작
        semester_rows = Semester.objects.filter(user_id_id=request.user.user_id)
        semester_id = 0
        for semester_row in semester_rows:
            if (semester_row.start_day < date) and (semester_row.end_day > date):
                semester_id = semester_row.semester_id
                current_semester = semester_row
                break
            else:
                continue
        if semester_id == 0:
            return HttpResponse("No Data")

        lecture_rows = Class.objects.filter(semester_id_id=current_semester.semester_id)
        # classtime_rows = ClassTime.objects.filter(class_id_id__in=lecture_rows.values('class_id'))
        calendar_rows = Calendar.objects.filter(class_id_id__in=lecture_rows.values('class_id'), date__range=(monday, sunday))

        data = {}
        data['name'] = current_semester.semester_name + ' 시간표'
        lecture_list = []
        for lecture_row in lecture_rows:
            class_data = {}
            class_data['name'] = lecture_row.class_name
            class_data['instructor'] = lecture_row.professor
            classtime_list = []
            classtime_rows = ClassTime.objects.filter(class_id_id=lecture_row.class_id)
            for classtime_row in classtime_rows:
                classtime_data = {}
                classtime_data['startHour'] = classtime_row.start_time.hour
                classtime_data['startMinute'] = classtime_row.start_time.minute
                classtime_data['endHour'] = classtime_row.end_time.hour
                classtime_data['endMinute'] = classtime_row.end_time.minute
                classtime_data['week'] = classtime_row.weekday
                classtime_data['location'] = classtime_row.location
                classtime_data['isCanceled'] = False
                classtime_list.append(classtime_data)

            class_data['scheduleList'] = classtime_list
            lecture_list.append(class_data)

        data['lectureList'] = lecture_list
        calendar_list = []
        for calendar_row in calendar_rows:
            calendar_data = {}
            calendar_data['name'] = calendar_row.title
            calendar_data['location'] = calendar_row.place
            calendar_data['startHour'] = calendar_row.start_time.hour
            calendar_data['startMinute'] = calendar_row.start_time.minute
            calendar_data['endHour'] = calendar_row.end_time.hour
            calendar_data['endMinute'] = calendar_row.end_time.minute
            date_data = {}
            date_data['year'] = calendar_row.date.year
            date_data['month'] = calendar_row.date.month
            date_data['day'] = calendar_row.date.day
            calendar_data['date'] = date_data
            calendar_list.append(calendar_data)

        data['exceptionalSchduleList'] = calendar_list


        # data = {
        #     'id': 1523352,
        #     'name': '이주원',
        #     'history': [
        #         {'date': '2013-04-05', 'item': '갤럭시'},
        #         {'date': '2013-04-06', 'item': '핸드폰'},
        #     ]
        # }

        json = simplejson.dumps(data)

        # return HttpResponse(calendar_rows.__str__())
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
            # create.start_day = datetime.datetime.strptime(request.POST["start_day"], "%Y-%m-%d").date()
            # create.end_day = datetime.datetime.strptime(request.POST["end_day"], "%Y-%m-%d").date()
            # return HttpResponse(create.start_day)
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


def calendar(request):
    return render(request, 'main/calendar.html')
