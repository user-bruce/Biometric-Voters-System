from django.contrib import admin
from .models import Contestant, ContestantTitle, Vote, Voter

# Register your models here.
admin.site.register(Contestant)
admin.site.register(Vote)
admin.site.register(ContestantTitle)
admin.site.register(Voter)
