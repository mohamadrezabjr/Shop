from tempfile import template
from django.shortcuts import render
from django.contrib.auth.models import auth
from django.contrib.auth import authenticate , logout
from django.shortcuts import render , redirect
from .models import *
from django.http import HttpResponse
from django.template import loader
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime

def logout_view(request):
    logout(request)
    return redirect('/')
def index(request):

    log= False
    if request.user.is_authenticated:
        log = True
    context = {'log':log ,'user':request.user}
    return render(request, 'index.html', context)

def product(request):

    products = Product.objects.all()
    context = {'products': products}
    return render (request, 'products.html', context=context)

def details(request , id):

    this_product = Product.objects.get(id=id)
    context = {'this_product': this_product}
    if request.method == 'POST':
        this_user = request.user
        Cart.objects.create(user = this_user, name  = request.POST['name'] , price =request.POST['price'])


    return render(request , "details.html", context=context)



