from django.urls import path
from django.conf.urls.static import static
from django.conf import settings

from . import views

app_name = 'djangoapp'

urlpatterns = [

                  # Login
                  path(
                      route='login',
                      view=views.login_user,
                      name='login'
                  ),

                  # Registration
                  path(
                      route='register',
                      view=views.registration,
                      name='register'
                  ),

                  # Logout
                  path(
                      route='logout',
                      view=views.logout_request,
                      name='logout'
                  ),

                  # Dealer reviews
                  # We will add these in later lessons.

                  # Add review
                  # We will add this in a later lesson.

              ] + static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)
