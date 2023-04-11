from rest_framework import serializers
from .models import Contestant, Vote, ContestantTitle, Voter


class ContestantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Contestant
        depth = 2
        fields = ["id", "firstName", "surname", "title", "voteCount", "email"]


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        depth = 2
        fields = ["id", "contestant"]


class TitleSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 2
        model = ContestantTitle
        fields = ["id", "titleName"]


class VoterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voter
        fields = ["fingerprintID","voted"]
