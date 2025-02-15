# Generated by Django 4.2.17 on 2025-02-08 22:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Shop', '0009_category_slug_product_slug'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('ontheway', 'Ontheway'), ('canceled', 'Canceled')], default='pending', max_length=10)),
                ('address', models.TextField()),
                ('number', models.IntegerField()),
                ('city', models.TextField()),
                ('price', models.FloatField()),
                ('products', models.ManyToManyField(to='Shop.cart')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
