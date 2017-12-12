from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.classtime, name='classtime'),
    url(r'^semester/$', views.semester, name='semester'),
    url(r'^semester/create/$', views.create_semester, name='create_semester'),
]
