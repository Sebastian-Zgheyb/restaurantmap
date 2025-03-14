import time
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# CORS(app, origins=["http://localhost:5174"])  # Allow requests only from this origin

@app.route('/time')
def get_current_time():
    print("Request received for current time.")
    return jsonify({'time': time.time()})

@app.route("/get_data", methods=["POST"])
def get_places():
    data = request.get_json()

    latitude = data.get("latitude")
    longitude = data.get("longitude")
    radius = data.get("radius")
    
    print(f"Received Latitude: {latitude}, Longitude: {longitude}, Radius: {radius}")

    response_data = {
        "totalUniquePlaces": 3,
        "places": [
            {
                "id": "place_id_1",
                "name": "Restaurant 1",
                "types": ["restaurant", "food"],
                "rating": 4.5,
                "priceLevel": 2,
                "priceRange": "$$"
            },
            {
                "id": "place_id_2",
                "name": "Restaurant 2",
                "types": ["restaurant", "cafe"],
                "rating": 4.2,
                "priceLevel": 1,
                "priceRange": "$"
            }
        ]
    }

    return jsonify(response_data)


if __name__ == '__main__':
    app.run(debug=True)