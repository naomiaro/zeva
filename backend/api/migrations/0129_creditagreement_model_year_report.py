# Generated by Django 3.1.12 on 2021-09-13 18:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0128_supplementalreport_supplemental_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='creditagreement',
            name='model_year_report',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='credit_agreement', to='api.modelyearreport'),
        ),
    ]
