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
def get_data():
    data = request.get_json()

    latitude = data.get("latitude")
    longitude = data.get("longitude")
    radius = data.get("radius")
    
    print(f"Received Latitude: {latitude}, Longitude: {longitude}, Radius: {radius}")

    # Define the response data in a cleaner format
    response_data = {
        'totalUniquePlaces': 3,
        'places': [
            {
                'id': 'ChIJgetcRmGAhYARjDkShaWuWMs',
                'name': None,
                'types': [
                    'mediterranean_restaurant',
                    'middle_eastern_restaurant',
                    'restaurant',
                    'food',
                    'point_of_interest',
                    'establishment'
                ],
                'rating': 4.5,
                'priceLevel': 'PRICE_LEVEL_MODERATE',
                'priceRange': {
                    'startPrice': {
                        'currencyCode': 'USD',
                        'units': '10'
                    },
                    'endPrice': {
                        'currencyCode': 'USD',
                        'units': '20'
                    }
                }
            },
            {
                'id': 'ChIJ-U9G5Z6AhYARhPZImqlxUSk',
                'name': None,
                'types': [
                    'korean_restaurant',
                    'fine_dining_restaurant',
                    'japanese_restaurant',
                    'restaurant',
                    'point_of_interest',
                    'food',
                    'establishment'
                ],
                'rating': 3.8,
                'priceLevel': None,
                'priceRange': {
                    'startPrice': {
                        'currencyCode': 'USD',
                        'units': '100'
                    }
                }
            },
            {
                'id': 'ChIJIQRT5bOAj4ARtg_luwU-pP4',
                'name': None,
                'types': [
                    'coffee_shop',
                    'cafe',
                    'art_gallery',
                    'bar',
                    'food_store',
                    'store',
                    'restaurant',
                    'food',
                    'point_of_interest',
                    'establishment'
                ],
                'rating': 4.4,
                'priceLevel': 'PRICE_LEVEL_MODERATE',
                'priceRange': {
                    'startPrice': {
                        'currencyCode': 'USD',
                        'units': '1'
                    },
                    'endPrice': {
                        'currencyCode': 'USD',
                        'units': '10'
                    }
                }
            }
        ]
    }

    # Return the JSON response with the formatted data
    return jsonify(response_data)



if __name__ == '__main__':
    app.run(debug=True)