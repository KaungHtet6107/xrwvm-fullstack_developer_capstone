"""djangoproj URL Configuration"""

from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [

    # ========================================================
    # Django Admin
    # ========================================================

    path(
        'admin/',
        admin.site.urls
    ),


    # ========================================================
    # Django API
    # ========================================================

    path(
        'djangoapp/',
        include('djangoapp.urls')
    ),


    # ========================================================
    # Home
    # ========================================================

    path(
        '',
        TemplateView.as_view(
            template_name="Home.html"
        )
    ),


    # ========================================================
    # About Us
    # ========================================================

    path(
        'about/',
        TemplateView.as_view(
            template_name="About.html"
        )
    ),


    # ========================================================
    # Contact Us
    # ========================================================

    path(
        'contact/',
        TemplateView.as_view(
            template_name="Contact.html"
        )
    ),


    # ========================================================
    # React Login page
    # ========================================================

    path(
        'login/',
        TemplateView.as_view(
            template_name="index.html"
        )
    ),


    # ========================================================
    # React Register page
    # ========================================================

    path(
        'register/',
        TemplateView.as_view(
            template_name="index.html"
        )
    ),


    # ========================================================
    # React Dealers page
    # ========================================================

    path(
        'dealers/',
        TemplateView.as_view(
            template_name="index.html"
        )
    ),

] + static(
    settings.STATIC_URL,
    document_root=settings.STATIC_ROOT
)