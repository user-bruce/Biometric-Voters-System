# Generated by Django 4.1.2 on 2023-03-08 06:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('voting_api', '0003_rename_contestant_contestant_title'),
    ]

    operations = [
        migrations.RenameField(
            model_name='contestant',
            old_name='lastName',
            new_name='surname',
        ),
    ]
