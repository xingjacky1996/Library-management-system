# Generated by Django 2.1.3 on 2019-05-28 00:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('systeam', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='jieinfo',
            name='updata_time',
            field=models.DateField(auto_now=True, verbose_name='最后更新时间'),
        ),
        migrations.AlterField(
            model_name='book',
            name='num',
            field=models.PositiveIntegerField(verbose_name='数量'),
        ),
    ]
