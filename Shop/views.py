from tempfile import template

from django.shortcuts import render
from django.contrib.auth.models import auth
from django.contrib.auth import authenticate
from django.shortcuts import render , redirect
from .models import *
from django.http import HttpResponse
from django.template import loader
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime

def index(request):
    template = loader.get_template('index.html')
    return HttpResponse(template.render())

def product(request):

    products = Product.objects.all()
    context = {'products': products}
    return render (request, 'products.html', context=context)

