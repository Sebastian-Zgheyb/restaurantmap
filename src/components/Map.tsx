import { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { HeatmapLayer } from "@react-google-maps/api";


interface Place {
  position: { lat: number; lng: number };
  name: string;
  rating: number;
  reviewCount: number;
}
export default function App() {
  const defaultPosition = { lat: 53.551086, lng: 9.993682 };
  const [open, setOpen] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [heatmapData, setHeatmapData] = useState<google.maps.visualization.WeightedLocation[]>([]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handlePlaceChange = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry || !place.geometry.location) {
      return;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    fetchRestaurants({ lat, lng });
  };

  useEffect(() => {
    const checkGoogle = setInterval(() => {
      if (window.google && searchInputRef.current) {
        clearInterval(checkGoogle);
        const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current);
        autocomplete.setFields(["place_id", "geometry", "name"]);

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          handlePlaceChange(place);
        });
      }
    }, 500);

    return () => clearInterval(checkGoogle);
  }, []);

  const fetchRestaurants = async (location: { lat: number; lng: number }) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=3000&type=restaurant&key=AIzaSyDaBBI4Y6jtOqEyBnImmRWF6bu0ubGxnZY`
    );
    const data = await response.json();

    if (data.results) {
      const processedPlaces = data.results.map((place: any) => ({
        position: { lat: place.geometry.location.lat, lng: place.geometry.location.lng },
        name: place.name || "Unknown",
        rating: place.rating || 0,
        reviewCount: place.user_ratings_total || 0,
      }));

      setPlaces(processedPlaces);

      // Convert to heatmap data
      const points = processedPlaces.map((place: { position: { lat: number | google.maps.LatLng | google.maps.LatLngLiteral; lng: number | boolean | null | undefined; }; rating: number; reviewCount: number; }) => ({
        location: new google.maps.LatLng(place.position.lat, place.position.lng),
        weight: place.rating * (place.reviewCount / 100), // Adjust weight logic as needed
      }));

      setHeatmapData(points);
    }
  };

  return (
    <APIProvider apiKey="AIzaSyDaBBI4Y6jtOqEyBnImmRWF6bu0ubGxnZY" libraries={["places"]}>
      <div style={{ height: "100vh", width: "100vw" }}>
        <Navbar searchInputRef={searchInputRef} setShowHeatmap={setShowHeatmap} showHeatmap={showHeatmap} />

        <Map zoom={12} center={places.length ? places[0].position : defaultPosition} style={{ width: "100%", height: "100%" }} mapId="b31661b678ace0c5">
          {places.map((place, index) => (
            <AdvancedMarker key={index} position={place.position} onClick={() => setOpen(true)}>
              <Pin background={"grey"} />
            </AdvancedMarker>
          ))}

          {open && places[0] && (
            <InfoWindow position={places[0].position} onCloseClick={() => setOpen(false)}>
              <div>
                <h1>{places[0].name}</h1>
                <p>Rating: {places[0].rating}</p>
                <p>Reviews: {places[0].reviewCount}</p>
              </div>
            </InfoWindow>
          )}

          {showHeatmap && heatmapData.length > 0 && <HeatmapLayer data={heatmapData} />}
        </Map>
      </div>
    </APIProvider>
  );
}
