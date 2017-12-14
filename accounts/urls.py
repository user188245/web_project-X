from django.conf.urls import url, include
from . import views


urlpatterns = [
    url(r'^$', views.signin, name='signin'),
    url(r'^register/$', views.signup, name='signup'),
    # url(r'^signout/$', views.signout, name='signout', kwargs={'next_page': '/'}),
    url(r'^signout/$', views.signout, name='signout'),
]