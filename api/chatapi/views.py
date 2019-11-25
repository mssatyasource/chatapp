from django.shortcuts import render

from rest_framework import generics
from .models import UserOnboardingInformation
from .serializers import UserOnBoardingSerilizer
from rest_framework.views import APIView
from django.http import Http404
from rest_framework.response import Response
from rest_framework import status
import random

import json

# Create your views here.

import os









def GetNextSessionKey():
    nextid = 0
    try:
        nextid = UserOnboardingInformation.objects.latest('Id').Id
        nextid += 1
        return nextid
    except Exception as Error:
        print(Error)

    return nextid


def ReadChatQuestins():
    data = None
    try:
        dirpath = os.getcwd()
        print('cur_dir={}'.format(dirpath))
        with open('cerebral_challenge.json','r') as file:
            filedata = file.read()
            data = json.loads(filedata)
    except Exception as Error:
        print(Error)

    return data



class ChatQuestionsView(APIView):
    #http_method_names = ['get']

    def options(self, request, *args, **kwargs):
        data = ReadChatQuestins()
        return Response(data)



    def get(self, request, format=None):
        data = ReadChatQuestins()
        return Response(data)





# view  to get the unique session key for each conversasation
class SessionKeyView(APIView):

    def post(self, request, format=None):
        return Response("Invalid operation",status=status.HTTP_401_UNAUTHORIZED)

    def get(self, request, format=None):
        data = GetNextSessionKey()
        return Response(data)




class OnBoardingView(generics.ListCreateAPIView):
    """This class defines the create behavior of our rest api."""
    latest_skey = 0
    try:
        latest_skey = UserOnboardingInformation.objects.latest('Skey').Skey
    except Exception as Error:
        print(Error)
    queryset = UserOnboardingInformation.objects.filter(Skey=latest_skey).order_by('QuestionID')
    serializer_class = UserOnBoardingSerilizer



    def perform_create(self, serializer):
        """Save the post data when creating a new bucketlist."""
        serializer.save()






