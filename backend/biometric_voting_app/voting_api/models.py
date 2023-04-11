import uuid
from django.db import models

# Contestnat title model


class ContestantTitle(models.Model):
    id = models.AutoField(primary_key=True)
    titleName = models.CharField(max_length=30)

    def __str__(self):
        return self.titleName


# Contestant
class Contestant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    firstName = models.CharField(max_length=30)
    surname = models.CharField(max_length=30)
    email = models.CharField(max_length=40, unique=True)
    title = models.ForeignKey(
        ContestantTitle, on_delete=models.CASCADE, blank=False)
    voteCount = models.IntegerField(default=0)

    def __str__(self):
        return self.firstName + " " + self.surname


# Voter model
class Voter(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fingerprintID = models.CharField(max_length=3)
    voted = models.CharField(max_length=5)

    def __str__(self):
        return str(self.id)


# Vote model
class Vote(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    contestant = models.ForeignKey(
        Contestant, on_delete=models.CASCADE, blank=False)

    def __str__(self):
        return str(self.contestant)
