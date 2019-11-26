# api/urls.py

from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import *

urlpatterns = {
    url(r'^onboardingview/$', OnBoardingView.as_view(), name="create"),
    url(r'^sessionkeyview/$', SessionKeyView.as_view(), name="sessionkey"),
    url(r'^chatquestionsview/$', ChatQuestionsView.as_view(), name="questions"),

}

urlpatterns = format_suffix_patterns(urlpatterns)