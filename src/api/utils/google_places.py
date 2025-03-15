import asyncio
import aiohttp
import time

class GooglePlacesAPI:
    def __init__(self, api_key, maxResultCount=1, request_radius=100, max_retries=3):
        self.api_key = api_key
        self.maxResultCount = maxResultCount
        self.request_radius = request_radius
        self.max_retries = max_retries

    async def fetch_places(self, session, lat, lon, headers):
        url = "https://places.googleapis.com/v1/places:searchNearby"
        payload = {
            "includedTypes": ["restaurant"],
            "maxResultCount": self.maxResultCount,
            "locationRestriction": {
                "circle": {
                    "center": {
                        "latitude": lat,
                        "longitude": lon
                    },
                    "radius": self.request_radius
                }
            }
        }
        
        retries = 0
        while retries < self.max_retries:
            try:
                async with session.post(url, json=payload, headers=headers) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        # Log the failure and continue retrying
                        print(f"Failed to get data for Latitude: {lat}, Longitude: {lon}. Status Code: {response.status}")
                        retries += 1  # Increment retry count after failure
                        retry_time = time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime())  # Log the retry time
                        print(f"Request failed at {retry_time}. Retrying... Attempt {retries}/{self.max_retries}")
                        await asyncio.sleep(2)  # Backoff for 2 seconds before retrying
                        continue  # Continue retrying after waiting

            except aiohttp.ClientError as e:
                retries += 1  # Increment retries if exception occurs
                retry_time = time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime())  # Log the retry time
                print(f"Request failed at {retry_time}. Error: {e}. Retrying... Attempt {retries}/{self.max_retries}")
                await asyncio.sleep(2)  # Backoff for 2 seconds before retrying
        
        # If retries are exhausted, log the max retry message and return None
        print(f"Max retries reached for Latitude: {lat}, Longitude: {lon}")
        return None

    async def get_places_near_coordinates(self, coordinates):
        url = "https://places.googleapis.com/v1/places:searchNearby"
        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": self.api_key,
            "X-Goog-FieldMask": "places.displayName,places.id,places.location,places.types,places.rating,places.priceLevel,places.priceRange"
        }

        place_ids_set = set()
        places_dict = {}

        async with aiohttp.ClientSession() as session:
            tasks = [self.fetch_places(session, lat, lon, headers) for lat, lon in coordinates]
            responses = await asyncio.gather(*tasks)

            for data in responses:
                if data:
                    places = data.get("places", [])
                    for place in places:
                        place_id = place.get("id")
                        if place_id and place_id not in place_ids_set:
                            place_ids_set.add(place_id)
                            places_dict[place_id] = place

        places_list = []
        for place_id, place_info in places_dict.items():
            location = place_info.get('location', {})
            lat = location.get('latitude')
            lon = location.get('longitude')

            places_list.append({
                "id": place_id,
                "name": place_info.get('displayName', {}).get('text'),
                "types": place_info.get('types'),
                "rating": place_info.get('rating'),
                "priceLevel": place_info.get('priceLevel'),
                "priceRange": place_info.get('priceRange'),
                "latitude": lat,
                "longitude": lon
            })

        return {
            "totalUniquePlaces": len(places_dict),
            "places": places_list
        }
