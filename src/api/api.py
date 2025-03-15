import time
import aiohttp
import asyncio
import nltk
from quart import Quart, jsonify, request
from quart_cors import cors
from nltk.sentiment import SentimentIntensityAnalyzer
from dotenv import load_dotenv
import os

from utils.google_places import GooglePlacesAPI
from utils.geometry import Geometry

nltk.download("vader_lexicon")
sia = SentimentIntensityAnalyzer()

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

def load_api_key(file_path="../../api_keys.txt"):
    with open(file_path, "r") as file:
        return file.read().strip()

API_KEY = load_api_key()

app = Quart(__name__)
app = cors(app, allow_origin="*")

@app.route('/time')
async def get_current_time():
    print("Request received for current time.")
    return jsonify({'time': time.time()})

@app.route("/get_test_data", methods=["POST"])
async def get_test_data():
    data = await request.get_json()
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
                    "rating": 4.5,
                    "latitude": 37.7944351,
                    "longitude": -122.3967897
                },
                {
                    "id": "ChIJ-U9G5Z6AhYARhPZImqlxUSk",
                    "name": "Jang",
                    "rating": 3.8,
                    "latitude": 37.774757,
                    "longitude": -122.4206092
                },
                {
                    "id": "ChIJIQRT5bOAj4ARtg_luwU-pP4",
                    "name": "Awaken Cafe & Roasting",
                    "rating": 4.4,
                    "latitude": 37.805308,
                    "longitude": -122.27084640000001
                }
            ]
        }
    }
    return jsonify(response_data)

@app.route("/get_data", methods=["POST"])
async def get_data():
    data = await request.get_json()
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    radius = data.get("radius")

    if radius > 2000:
        return jsonify({"error": "Invalid request: radius exceeds 2000"}), 400
    if not (-90 <= latitude <= 90):
        return jsonify({"error": "Invalid latitude: must be between -90 and 90"}), 400
    if not (-180 <= longitude <= 180):
        return jsonify({"error": "Invalid longitude: must be between -180 and 180"}), 400
    
    print(f"Received Latitude: {latitude}, Longitude: {longitude}, Radius: {radius}")
    geo = Geometry(100)
    google_places = GooglePlacesAPI(API_KEY, 20, 50)
    
    square_centers = geo.cover_circle_with_squares(circle_x=0, circle_y=0, radius=radius)
    coordinates = geo.meters_to_latlon(latitude, longitude, square_centers)
    
    places_data = await google_places.get_places_near_coordinates(coordinates)
    # print("Generated places_data:", places_data)
    return jsonify(places_data)

@app.route("/get_reviews", methods=["POST"])
async def get_reviews():
    data = await request.get_json()
    place_id = data.get("place_id")

    url = f"https://places.googleapis.com/v1/places/{place_id}"
    API_KEY = os.getenv("GOOGLE_API_KEY")
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "reviews"
    }

    async with aiohttp.ClientSession() as session:
        async with session.get(url, headers=headers) as response:
            reviews_data = await response.json()
    
    if "reviews" not in reviews_data:
        return jsonify({"error": "No reviews found"}), 404
    
    for review in reviews_data.get("reviews", []):
        text = review["text"]["text"]
        sentiment_score = sia.polarity_scores(text)["compound"]
        sentiment_label = "positive" if sentiment_score >= 0.05 else "negative" if sentiment_score <= -0.05 else "neutral"
        review["sentiment_score"] = sentiment_score
        review["sentiment_label"] = sentiment_label
    
    return jsonify(reviews_data)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)