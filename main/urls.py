from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.classtime, name='classtime'),
    url(r'^get/$', views.classtime_ajax, name='classtime_ajax'),
    url(r'^semester/$', views.semester, name='semester'),
    url(r'^semester/create/$', views.create_semester, name='create_semester'),
    url(r'lecture/$', views.lecture, name='lecture'),
    url(r'lecture/get/$', views.lecture_ajax, name='lecture_ajax'),
    url(r'calendar/$', views.calendar, name='calendar'),
    url(r'calendar/get/$', views.calendar_ajax, name='calendar_ajax'),
]
