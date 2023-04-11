from django.urls import path, include
from .views import (
    ContestantApiView,
    ContestantTitleApiView,
    VoteApiView,
    VoterAPIView,
)

urlpatterns = [
    path('api/contestants', ContestantApiView.as_view()),
    path('api/titles', ContestantTitleApiView.as_view()),
    path('api/votes', VoteApiView.as_view()),
    path('api/voters', VoterAPIView.as_view()),
    path('api/voters/<int:uuid>', VoterAPIView.as_view())
]
