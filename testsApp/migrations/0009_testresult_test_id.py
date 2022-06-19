# Generated by Django 3.2.7 on 2022-05-15 04:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('testsApp', '0008_alter_answer_question'),
    ]

    operations = [
        migrations.AddField(
            model_name='testresult',
            name='test_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tests_results', to='testsApp.test'),
            preserve_default=False,
        ),
    ]