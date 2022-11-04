# Generated by Django 4.0.5 on 2022-11-04 06:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0006_remove_movie_tags_delete_tag'),
        ('users', '0012_remove_following_following_remove_following_user_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='MovieLog',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('watched_at', models.DateField()),
                ('comment', models.TextField()),
                ('spoiler_alert', models.BooleanField(default=False)),
                ('like', models.BooleanField(default=False)),
                ('watched', models.BooleanField(default=False)),
                ('watchlist', models.BooleanField(default=False)),
                ('score', models.IntegerField(default=0)),
                ('like_count', models.IntegerField(default=0)),
                ('reply_count', models.IntegerField(default=0)),
                ('timestamp', models.DateTimeField(auto_now_add=True, null=True)),
                ('movie', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='movies.movie')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='movielog_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
