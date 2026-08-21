from django.http import JsonResponse
from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User
from django.contrib.auth import logout
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt

from .models import CarMake, CarModel
from .populate import initiate

from .restapis import (
    get_request,
    analyze_review_sentiments,
    post_review
)

import logging
import json


# Get an instance of a logger
logger = logging.getLogger(__name__)


# ============================================================
# Login
# ============================================================

@csrf_exempt
def login_user(request):

    if request.method != 'POST':
        return JsonResponse(
            {
                "error": "POST request required"
            },
            status=405
        )

    try:
        data = json.loads(request.body)

        username = data.get('userName')
        password = data.get('password')

        if not username or not password:
            return JsonResponse(
                {
                    "error": "Username and password are required"
                },
                status=400
            )

        user = authenticate(
            username=username,
            password=password
        )

        if user is not None:

            login(request, user)

            return JsonResponse(
                {
                    "userName": username,
                    "status": "Authenticated"
                },
                status=200
            )

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

    username = (
        request.user.username
        if request.user.is_authenticated
        else ""
    )

    logout(request)

    return JsonResponse({
        "userName": ""
    })


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

        data = json.loads(request.body)

        username = data.get('userName')
        password = data.get('password')
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')

        if not username or not password or not email:
            return JsonResponse(
                {
                    "error": "Username, password, and email are required"
                },
                status=400
            )

        if User.objects.filter(username=username).exists():

            return JsonResponse(
                {
                    "userName": username,
                    "error": "Already Registered"
                },
                status=409
            )

        user = User.objects.create_user(
            username=username,
            first_name=first_name or '',
            last_name=last_name or '',
            password=password,
            email=email
        )

        login(request, user)

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

    except Exception:

        logger.exception("Registration error")

        return JsonResponse(
            {
                "error": "Registration failed"
            },
            status=500
        )


# ============================================================
# Get Cars
# ============================================================

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
# Get Dealerships
# ============================================================

def get_dealerships(request, state="All"):

    if state == "All":
        endpoint = "/fetchDealers"
    else:
        endpoint = "/fetchDealers/" + state

    dealerships = get_request(endpoint)

    return JsonResponse({
        "status": 200,
        "dealers": dealerships
    })


# ============================================================
# Get Dealer Details
# ============================================================

def get_dealer_details(request, dealer_id):

    if dealer_id:

        endpoint = "/fetchDealer/" + str(dealer_id)

        dealership = get_request(endpoint)

        return JsonResponse({
            "status": 200,
            "dealer": dealership
        })

    else:

        return JsonResponse({
            "status": 400,
            "message": "Bad Request"
        })


# ============================================================
# Get Dealer Reviews
# ============================================================

def get_dealer_reviews(request, dealer_id):

    if dealer_id:

        endpoint = "/fetchReviews/dealer/" + str(dealer_id)

        reviews = get_request(endpoint)

        # Make sure reviews is a list
        if reviews is None:
            reviews = []

        for review_detail in reviews:

            review_text = review_detail.get('review', '')

            response = analyze_review_sentiments(review_text)

            print("Sentiment response:", response)

            if response and 'sentiment' in response:

                review_detail['sentiment'] = response['sentiment']

            else:

                review_detail['sentiment'] = 'neutral'

        return JsonResponse({
            "status": 200,
            "reviews": reviews
        })

    else:

        return JsonResponse({
            "status": 400,
            "message": "Bad Request"
        })


# ============================================================
# Add Dealer Review
# ============================================================

@csrf_exempt
def add_review(request):

    # Only POST is allowed
    if request.method != 'POST':

        return JsonResponse(
            {
                "status": 405,
                "message": "POST request required"
            },
            status=405
        )

    # Only authenticated users can post reviews
    if request.user.is_anonymous:

        return JsonResponse(
            {
                "status": 403,
                "message": "Unauthorized"
            },
            status=403
        )

    try:

        # Convert request body from JSON to Python dictionary
        data = json.loads(request.body)

        print("Review data:", data)

        # Send review to Node.js backend
        response = post_review(data)

        # Check whether backend returned a response
        if response is None:

            return JsonResponse(
                {
                    "status": 500,
                    "message": "Error in posting review"
                },
                status=500
            )

        # Successfully posted
        return JsonResponse(
            {
                "status": 200,
                "message": "Review posted successfully"
            },
            status=200
        )

    except json.JSONDecodeError:

        return JsonResponse(
            {
                "status": 400,
                "message": "Invalid JSON request"
            },
            status=400
        )

    except Exception as e:

        print("Error posting review:", e)

        return JsonResponse(
            {
                "status": 500,
                "message": "Error in posting review"
            },
            status=500
        )