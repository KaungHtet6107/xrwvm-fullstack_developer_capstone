import requests
import os

from dotenv import load_dotenv
from urllib.parse import quote


# ============================================================
# Load environment variables
# ============================================================

load_dotenv()


# ============================================================
# Backend API URL
# ============================================================

backend_url = os.getenv(
    'backend_url',
    default='http://localhost:3030'
).rstrip('/')


# ============================================================
# Sentiment Analyzer API URL
# ============================================================

sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default='http://localhost:5050/'
).rstrip('/')


# ============================================================
# GET Request
# ============================================================

def get_request(endpoint, **kwargs):
    """
    Send a GET request to the backend API.

    Example:
        get_request('/fetchDealers')

    Example with parameters:
        get_request('/fetchDealer', dealerId='3')
    """

    params = {}

    for key, value in kwargs.items():
        params[key] = value

    request_url = backend_url + endpoint

    print("GET from {}".format(request_url))

    try:
        response = requests.get(
            request_url,
            params=params
        )

        response.raise_for_status()

        return response.json()

    except requests.RequestException as e:
        print("Network exception occurred:", e)
        return None

    except ValueError as e:
        print("Invalid JSON response:", e)
        return None


# ============================================================
# Analyze Review Sentiments
# ============================================================

def analyze_review_sentiments(text):
    """
    Send review text to the sentiment analyzer microservice.
    """

    encoded_text = quote(str(text), safe='')

    request_url = (
        sentiment_analyzer_url
        + "/analyze/"
        + encoded_text
    )

    print("GET from {}".format(request_url))

    try:
        response = requests.get(request_url)

        response.raise_for_status()

        return response.json()

    except requests.RequestException as e:
        print("Network exception occurred:", e)
        return None

    except ValueError as e:
        print("Invalid JSON response:", e)
        return None


# ============================================================
# POST Review
# ============================================================

def post_review(data_dict):
    """
    Send a dealer review to the backend API.
    """

    request_url = backend_url + "/insert_review"

    print("POST to {}".format(request_url))

    try:
        response = requests.post(
            request_url,
            json=data_dict
        )

        response.raise_for_status()

        result = response.json()

        print("POST response:", result)

        return result

    except requests.RequestException as e:
        print("Network exception occurred:", e)
        return None

    except ValueError as e:
        print("Invalid JSON response:", e)
        return None