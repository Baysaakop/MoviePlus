# Generated by Django 4.0.5 on 2022-07-01 06:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0004_alter_genre_id_alter_movie_id_alter_moviecomment_id_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='MovieComment',
        ),
    ]
