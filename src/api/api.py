import time
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk

from utils.google_places import GooglePlacesAPI
from utils.geometry import Geometry

import asyncio
import aiohttp

nltk.download("vader_lexicon")
sia = SentimentIntensityAnalyzer()

# start seb comment. for team members, feel free to do this another way if u want i dont think we even need to do lik ethis
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
# end seb comment

#ryan
def load_api_key(file_path="../../api_keys.txt"): #should be a local file called api_keys.txt
    with open(file_path, "r") as file:
        return file.read().strip()

API_KEY = load_api_key()
#yeet

# // Include lattitude and longitude within server's JSON file back to client
app = Flask(__name__)
CORS(app)
# CORS(app, origins=["http://localhost:5174"])  # Allow requests only from this origin

@app.route('/time')
def get_current_time():
    print("Request received for current time.")
    return jsonify({'time': time.time()})

@app.route("/get_test_data", methods=["POST"])
def get_test_data():
    data = request.get_json()
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    radius = data.get("radius")
    
    print(f"Received Latitude: {latitude}, Longitude: {longitude}, Radius: {radius}")
    
    response_data = {
        "message": "Valid request",
        "latitude": latitude,
        "longitude": longitude,
        "radius": radius,
        "places_data": {
            "totalUniquePlaces": 3,
            "places": [
                {
                    "id": "ChIJgetcRmGAhYARjDkShaWuWMs",
                    "name": "Oasis Grill",
                    "types": [
                        "mediterranean_restaurant",
                        "middle_eastern_restaurant",
                        "restaurant",
                        "food",
                        "point_of_interest",
                        "establishment"
                    ],
                    "rating": 4.5,
                    "priceLevel": "PRICE_LEVEL_MODERATE",
                    "priceRange": {
                        "startPrice": {
                            "currencyCode": "USD",
                            "units": "10"
                        },
                        "endPrice": {
                            "currencyCode": "USD",
                            "units": "20"
                        }
                    },
                    "latitude": 37.7944351,
                    "longitude": -122.3967897
                },
                {
                    "id": "ChIJ-U9G5Z6AhYARhPZImqlxUSk",
                    "name": "Jang",
                    "types": [
                        "korean_restaurant",
                        "fine_dining_restaurant",
                        "japanese_restaurant",
                        "restaurant",
                        "point_of_interest",
                        "food",
                        "establishment"
                    ],
                    "rating": 3.8,
                    "priceLevel": None,
                    "priceRange": {
                        "startPrice": {
                            "currencyCode": "USD",
                            "units": "100"
                        }
                    },
                    "latitude": 37.774757,
                    "longitude": -122.4206092
                },
                {
                    "id": "ChIJIQRT5bOAj4ARtg_luwU-pP4",
                    "name": "Awaken Cafe & Roasting",
                    "types": [
                        "coffee_shop",
                        "art_gallery",
                        "bar",
                        "restaurant",
                        "food_store",
                        "cafe",
                        "point_of_interest",
                        "food",
                        "store",
                        "establishment"
                    ],
                    "rating": 4.4,
                    "priceLevel": "PRICE_LEVEL_MODERATE",
                    "priceRange": {
                        "startPrice": {
                            "currencyCode": "USD",
                            "units": "1"
                        },
                        "endPrice": {
                            "currencyCode": "USD",
                            "units": "10"
                        }
                    },
                    "latitude": 37.805308,
                    "longitude": -122.27084640000001
                }
            ]
        }
    }

    return jsonify(response_data)


@app.route("/get_data", methods=["POST"])
async def get_data():
    data = request.get_json()
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    radius = data.get("radius")

    request_radius = 100
    
    # Validate the radius
    if radius > 2000:
        return jsonify({"error": "Invalid request: radius exceeds 2000"}), 400
    # Validate latitude and longitude
    if not (-90 <= latitude <= 90):
        return jsonify({"error": "Invalid latitude: must be between -90 and 90"}), 400
    if not (-180 <= longitude <= 180):
        return jsonify({"error": "Invalid longitude: must be between -180 and 180"}), 400
    
    print(f"Received Latitude: {latitude}, Longitude: {longitude}, Radius: {radius}")
    geo = Geometry(request_radius)  # Be very careful when making this value smaller
    google_places = GooglePlacesAPI(API_KEY, 1)
    
    # Get the square centers around the circle (returns (x, y) Cartesian coordinates) where 1 unit is 1m
    square_centers = geo.cover_circle_with_squares(circle_x=0, circle_y=0, radius=radius)
    # Convert square centers (displacements) into latitude and longitude
    coordinates = geo.meters_to_latlon(latitude, longitude, square_centers)

    # Async call to fetch places
    places_data = await google_places.get_places_near_coordinates(coordinates)
    print("Generated places_data:", places_data)
    # Process normally if the request is valid
    return jsonify({
        "message": "Valid request",
        "latitude": latitude,
        "longitude": longitude,
        "radius": radius,
        "places_data": places_data
    })

@app.route("/get_reviews", methods=["POST"])
def get_reviews():
    data = request.get_json()
    place_id = data.get("place_id")

    url = f"https://places.googleapis.com/v1/places/{place_id}"
    API_KEY = "AIzaSyDaBBI4Y6jtOqEyBnImmRWF6bu0ubGxnZY"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "reviews"
    }

    response = requests.get(url, headers=headers)
    reviews_data = response.json()
    
    if "reviews" not in reviews_data:
        return jsonify({"error": "No reviews found"}), 404

    # Add sentiment analysis
    for review in reviews_data.get("reviews", []):
        text = review["text"]["text"]
        sentiment_score = sia.polarity_scores(text)["compound"]

        if sentiment_score >= 0.05:
            sentiment_label = "positive"
        elif sentiment_score <= -0.05:
            sentiment_label = "negative"
        else:
            sentiment_label = "neutral"

        review["sentiment_score"] = sentiment_score
        review["sentiment_label"] = sentiment_label

    return jsonify(reviews_data)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)