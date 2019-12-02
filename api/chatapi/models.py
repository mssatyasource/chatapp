from django.db import models


# Create your models here.

# the model call represents the table scheme
"""
 Id : unique id and PK
 SKey : is a unique session key from server
 QuestionID : is id of the question
 Answer : is the user's anser
"""
class UserOnboardingInformation(models.Model):
    Id = models.AutoField(primary_key=True)
    Skey = models.IntegerField(default=0)
    QuestionID = models.IntegerField(null=False)
    Answer = models.CharField(max_length=1024,blank=False)


    class Meta:
        db_table = "user_onboarding"



