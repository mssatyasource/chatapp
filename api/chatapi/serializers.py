
from rest_framework import serializers
from .models import UserOnboardingInformation


"""
UserOnBoardingSerilizer : Serilize  class for UserOnboardingInformation model
"""
class UserOnBoardingSerilizer(serializers.ModelSerializer):

    class Meta:
        model = UserOnboardingInformation
        fields =('Id','Skey','QuestionID','Answer')