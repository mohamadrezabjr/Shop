# Generated by Django 4.2.17 on 2025-02-26 13:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Shop', '0015_remove_order_token'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='token',
        ),
    ]
