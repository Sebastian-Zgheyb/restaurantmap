import asyncio
import aiohttp
import time
import json

def load_api_key(file_path="../../api_keys.txt"):
    with open(file_path, "r") as file:
        return file.read().strip()

API_KEY = load_api_key()

async def fetch_places(session, lat, lon, headers):
    url = "https://places.googleapis.com/v1/places:searchNearby"
    payload = {
        "includedTypes": ["restaurant"],
        "maxResultCount": 1,
        "locationRestriction": {
            "circle": {
                "center": {
                    "latitude": lat,
                    "longitude": lon
                },
                "radius": 125.0
            }
        }
    }

    async with session.post(url, json=payload, headers=headers) as response:
        if response.status == 200:
            return await response.json()
        else:
            print(f"Failed to get data for Latitude: {lat}, Longitude: {lon}. Status Code: {response.status}")
            return None

async def get_places_near_coordinates(coordinates):
    url = "https://places.googleapis.com/v1/places:searchNearby"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "places.displayName,places.id,places.location,places.types,places.rating,places.priceLevel,places.priceRange"
    }

    place_ids_set = set()
    places_dict = {}

    async with aiohttp.ClientSession() as session:
        tasks = [fetch_places(session, lat, lon, headers) for lat, lon in coordinates]
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

# Example usage
coordinates = [
    (37.7937, -122.3965), (37.7749, -122.4194), (37.8044, -122.2711),
    (37.7833, -122.4167), (37.7957, -122.4036), (37.7943, -122.3997),
    (37.7983, -122.3990), (37.8014, -122.3941), (37.7753, -122.4195),
    (37.7869, -122.3991), (37.7792, -122.4068), (37.7915, -122.4024),
    (37.7961, -122.3968), (37.7898, -122.4136), (37.7732, -122.4188),
    (37.7824, -122.3964), (37.7886, -122.4049), (37.7921, -122.3987),
    (37.7872, -122.3960), (37.7796, -122.3975), (37.7841, -122.3992),
    (37.7981, -122.4103), (37.7850, -122.4015), (37.7839, -122.4092),
    (37.7814, -122.3995), (37.7990, -122.3960), (37.7720, -122.4026),
    (37.7819, -122.4147), (37.7890, -122.3979), (37.7781, -122.3988),
    (37.7945, -122.4106), (37.7845, -122.4070), (37.7809, -122.4099),
    (37.7994, -122.3953), (37.7883, -122.3961), (37.7762, -122.4143),
    (37.7854, -122.4086), (37.7903, -122.4009), (37.7757, -122.4045),
    (37.7998, -122.4052), (37.7867, -122.4012), (37.7823, -122.4078),
    (37.7926, -122.3976), (37.7810, -122.3962), (37.7756, -122.4108),
    (37.7849, -122.4130), (37.7798, -122.4013), (37.7952, -122.3994),
    (37.7933, -122.4059), (37.7842, -122.4102), (37.7900, -122.4140),
    (37.7818, -122.4135), (37.7868, -122.4055), (37.7746, -122.4144),
    (37.7931, -122.3970), (37.7881, -122.4020), (37.7864, -122.4074),
    (37.7803, -122.3967), (37.7917, -122.4000), (37.7724, -122.4065),
    (37.7909, -122.4035), (37.7843, -122.4126), (37.7832, -122.4083),
    (37.7906, -122.3985), (37.7760, -122.4063), (37.7953, -122.3981),
    (37.7828, -122.4071), (37.7941, -122.4022), (37.7795, -122.4011),
    (37.7862, -122.4132), (37.7940, -122.4047), (37.7835, -122.4104),
    (37.7976, -122.3986), (37.7759, -122.4019), (37.7873, -122.4075),
    (37.7923, -122.4018), (37.7807, -122.4101), (37.7910, -122.3980),
    (37.7822, -122.4014), (37.7736, -122.4112), (37.7840, -122.4007),
    (37.7793, -122.4040), (37.7919, -122.4038), (37.7902, -122.4010),
    (37.7764, -122.4003), (37.7958, -122.4023), (37.7897, -122.4079),
    (37.7743, -122.4060), (37.7815, -122.4053), (37.7996, -122.3972),
    (37.7901, -122.4029), (37.7755, -122.4039), (37.7794, -122.4109),
    (37.7866, -122.4093), (37.7984, -122.4057), (37.7838, -122.3977),
    (37.7826, -122.4062), (37.7949, -122.3978), (37.7778, -122.4100),
    (37.7914, -122.4032), (37.7837, -122.4072), (37.7895, -122.4041),
    (37.7852, -122.4073), (37.7987, -122.4033), (37.7766, -122.4117),
    (37.7797, -122.4081), (37.7946, -122.3984), (37.7761, -122.4094),
    (37.7907, -122.4056), (37.7847, -122.4064), (37.7791, -122.4042),
    (37.7972, -122.4076), (37.7927, -122.4017), (37.7834, -122.4008)
]

# Measure the time taken for asynchronous requests
start_time = time.time()
places_dict = asyncio.run(get_places_near_coordinates(coordinates))
end_time = time.time()

print(f"Time taken: {end_time - start_time} seconds")
