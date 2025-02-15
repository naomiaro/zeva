# Generated by Django 3.1.12 on 2021-08-13 20:07

import db_comments.model_mixins
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0120_supplementalreportsales_supplementalreportsupplierinformation'),
    ]

    operations = [
        migrations.CreateModel(
            name='SupplementalReportCreditActivity',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_timestamp', models.DateTimeField(auto_now_add=True, null=True)),
                ('create_user', models.CharField(default='SYSTEM', max_length=130)),
                ('update_timestamp', models.DateTimeField(auto_now=True, null=True)),
                ('update_user', models.CharField(max_length=130, null=True)),
                ('ldv_sales', models.IntegerField(blank=True)),
                ('credit_a_value', models.DecimalField(decimal_places=2, max_digits=20, null=True)),
                ('credit_b_value', models.DecimalField(decimal_places=2, max_digits=20, null=True)),
                ('category', models.CharField(blank=True, max_length=100, null=True)),
                ('model_year', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='api.modelyear')),
                ('supplemental_report', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='supplemental_report_credit_activity', to='api.supplementalreport')),
            ],
            options={
                'db_table': 'supplemental_report_credit_activity',
            },
            bases=(models.Model, db_comments.model_mixins.DBComments),
        ),
    ]
