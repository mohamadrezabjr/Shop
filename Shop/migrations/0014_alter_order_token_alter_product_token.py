# Generated by Django 4.2.17 on 2025-02-26 13:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Shop', '0013_remove_product_slug_order_token_product_token'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='token',
            field=models.CharField(blank=True, max_length=10),
        ),
        migrations.AlterField(
            model_name='product',
            name='token',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]
