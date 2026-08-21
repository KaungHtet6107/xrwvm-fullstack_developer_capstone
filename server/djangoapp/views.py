from django.http import JsonResponse
from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User
from django.contrib.auth import logout
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt

from .models import CarMake, CarModel
from .populate import initiate

import logging
import json


# Get an instance of a logger
logger = logging.getLogger(__name__)


# ============================================================
# Login
# ============================================================

@csrf_exempt
def login_user(request):
    """
    Authenticate a user and create a Django login session.
    """

    if request.method != 'POST':
        return JsonResponse(
            {
                "error": "POST request required"
            },
            status=405
        )

    try:
        # Get username and password from request body
        data = json.loads(request.body)

        username = data.get('userName')
        password = data.get('password')

        # Check that both values were provided
        if not username or not password:
            return JsonResponse(
                {
                    "error": "Username and password are required"
                },
                status=400
            )

        # Check whether the credentials are valid
        user = authenticate(
            username=username,
            password=password
        )

        # If authentication is successful
        if user is not None:

            # Create Django session
            login(request, user)

            return JsonResponse(
                {
                    "userName": username,
                    "status": "Authenticated"
                },
                status=200
            )

        # Authentication failed
        return JsonResponse(
            {
                "userName": username,
                "status": "Authentication Failed"
            },
            status=401
        )

    except json.JSONDecodeError:
        return JsonResponse(
            {
                "error": "Invalid JSON request"
            },
            status=400
        )


# ============================================================
# Logout
# ============================================================

def logout_request(request):
    """
    Log the current user out and terminate the Django session.
    """

    # Get the username before logging out
    username = request.user.username if request.user.is_authenticated else ""

    # Terminate the user's Django session
    logout(request)

    # Return empty username after logout
    data = {
        "userName": ""
    }

    return JsonResponse(data)


# ============================================================
# Registration
# ============================================================
@csrf_exempt
def registration(request):

    if request.method != 'POST':
        return JsonResponse(
            {
                "error": "POST request required"
            },
            status=405
        )

    try:

        # Load JSON data from request body
        data = json.loads(request.body)

        username = data.get('userName')
        password = data.get('password')
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')

        # Check required fields
        if not username or not password or not email:
            return JsonResponse(
                {
                    "error": "Username, password, and email are required"
                },
                status=400
            )

        # Check if username already exists
        if User.objects.filter(username=username).exists():

            return JsonResponse(
                {
                    "userName": username,
                    "error": "Already Registered"
                },
                status=409
            )

        # Create the new user
        user = User.objects.create_user(
            username=username,
            first_name=first_name or '',
            last_name=last_name or '',
            password=password,
            email=email
        )

        # Log the newly registered user in
        login(request, user)

        # Return successful response
        return JsonResponse(
            {
                "userName": username,
                "status": "Authenticated"
            },
            status=200
        )

    except json.JSONDecodeError:

        return JsonResponse(
            {
                "error": "Invalid JSON request"
            },
            status=400
        )

    except Exception as e:

        logger.exception("Registration error")

        return JsonResponse(
            {
                "error": "Registration failed"
            },
            status=500
        )

def get_cars(request):
    count = CarMake.objects.all().count()

    print(count)

    if count == 0:
        initiate()

    car_models = CarModel.objects.select_related('car_make')

    cars = []

    for car_model in car_models:
        cars.append({
            "CarModel": car_model.name,
            "CarMake": car_model.car_make.name
        })

    return JsonResponse({
        "CarModels": cars
    })

# ============================================================
# Dealerships
# ============================================================
# We will implement these in later steps.

# def get_dealerships(request):
#     ...


# ============================================================
# Dealer Reviews
# ============================================================

# def get_dealer_reviews(request, dealer_id):
#     ...


# ============================================================
# Dealer Details
# ============================================================

# def get_dealer_details(request, dealer_id):
#     ...


# ============================================================
# Add Review
# ============================================================

# def add_review(request):
#     ...