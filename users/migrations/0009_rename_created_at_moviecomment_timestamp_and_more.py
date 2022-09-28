# Generated by Django 4.0.5 on 2022-08-17 03:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_moviecomment'),
    ]

    operations = [
        migrations.RenameField(
            model_name='moviecomment',
            old_name='created_at',
            new_name='timestamp',
        ),
        migrations.AddField(
            model_name='moviecomment',
            name='reply_count',
            field=models.IntegerField(default=0),
        ),
    ]