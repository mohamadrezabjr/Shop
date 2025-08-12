from django import template
from urllib.parse import urlparse


register = template.Library()

@register.filter
def multiply(value, arg):
    try:
        return value * arg
    except (ValueError, TypeError):
        return ''

@register.filter
def endswith_path(value, suffix):

    if not value or not suffix:
        return False

    path = urlparse(value).path
    return path.endswith(str(suffix))