from django.shortcuts import render, redirect
from Shop.models import *


def profile(request):
    if not request.user.is_authenticated:
        return redirect('login')
    order = Order.objects.filter(user=request.user)
    name = request.user.get_username()
    email = request.user.email


    return render (request , 'profile.html')
# Create your views here.
