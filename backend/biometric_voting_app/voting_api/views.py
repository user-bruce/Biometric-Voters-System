import json
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions

from .models import Contestant, ContestantTitle, Vote, Voter
from .serializers import ContestantSerializer, TitleSerializer, VoteSerializer, VoterSerializer


class ContestantApiView(APIView):

    # Contestant CRUD

    # LIST
    def get(self, request, *args, **kwargs):
        contestants = Contestant.objects.all()
        contestantSerializer = ContestantSerializer(contestants, many=True)

        return Response(contestantSerializer.data, status=status.HTTP_200_OK)

    # CREATE
    def post(self, request, *args, **kwargs):

        serializer = ContestantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # VOTE(PATCH)
    def patch(self, request, id):
        result = Contestant.objects.get(id)
        serializer = ContestantSerializer(
            result, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContestantTitleApiView(APIView):

    # Contestant title CRUD
    # LIST
    def get(self, request, *args, **kwargs):
        contestantTitles = ContestantTitle.objects.all()
        contestantSerializer = TitleSerializer(contestantTitles, many=True)
        return Response(contestantSerializer.data, status=status.HTTP_200_OK)


class VoterAPIView(APIView):

    # TODO: Retrieve one voter by their ID
    def get(self, request, *args, **kwargs):
        voter = Voter.objects.filter(fingerprintID=self.kwargs['uuid']).first()
        voterSerializer = VoterSerializer(voter, many=False)
        return Response(voterSerializer.data, status=status.HTTP_200_OK)

    # Create a voter(signup)
    def post(self, request, *args, **kwargs):
        voter = (json.loads(request.body.decode('utf-8')))
        print(voter)
        v = Voter(fingerprintID=voter['fingerprintID'], voted="NO")
        v.save()
        voter = Voter.objects.all().filter(
            fingerprintID=voter['fingerprintID'])
        voterSerializer = VoterSerializer(voter, many=True)
        return Response(voterSerializer.data, status=status.HTTP_200_OK)


class VoteApiView(APIView):

    # Votes CRUD

    # Post a vote
    def post(self, request, *args, **kwargs):
        vote = (json.loads(request.body.decode('utf-8')))
        print(vote)
        contestant = Contestant.objects.all().filter(id=vote['contestant']['id'])[0]
        contestant.voteCount = contestant.voteCount+1
        contestant.save(update_fields=["voteCount"])

        print(vote['voter'])
        print(Voter.objects.all().filter(fingerprintID=vote['voter']).first())
        voter = Voter.objects.all().filter(fingerprintID=vote['voter']).first()
        print(voter)
        voter.voted = 'YES'
        voter.save(update_fields=["voted"])
        return Response(status=status.HTTP_200_OK)

    # LIST
    def get(self, request, *args, **kwargs):
        votes = Vote.objects.all()
        serializer = VoteSerializer(votes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
