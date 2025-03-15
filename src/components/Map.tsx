import { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, HeatmapLayer, Marker } from "@react-google-maps/api";

const mapContainerStyle = { width: "100vw", height: "100vh" };
const defaultCenter = { lat: -34.9285, lng: 138.6007 };

interface MapComponentProps {
  radius: number;
}

export default function MapComponent({ radius }: MapComponentProps) {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [heatmapData, setHeatmapData] = useState<google.maps.LatLng[]>([]);

  // Function to fetch heatmap data
  const fetchHeatmapData = async (lat: number, lng: number, radius: number = 500) => {
    try {
      console.log("Fetching heatmap data...");
  
      const response = await fetch("http://127.0.0.1:8000/get_test_data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lng, radius }),
      });
  
      const data = await response.json();
      console.log("Fetched data:", data);
  
      if (!data || !data.places || !Array.isArray(data.places)) {
        console.error("Unexpected data format:", data);
        return;
      }
  
      console.log("Heatmap raw places data:", data.places);
  
      // Transform data with weights
      const heatmapPoints = data.places.map((place: { latitude: number; longitude: number; rating?: number; userRatingCount?: number }) => {
        const rating = place.rating ?? 0;  // Default to 0 if undefined
        const reviewCount = Math.max(place.userRatingCount ?? 1, 1); // Default to 1, avoid 0 in log
        
        const weight = rating * Math.log(reviewCount) * 0.2; // Weighted formula
        console.log(weight);
        return { location: new google.maps.LatLng(place.latitude, place.longitude), weight };
      });
  
      console.log("Transformed heatmap data with weights:", heatmapPoints);
  
      setHeatmapData(heatmapPoints);
      setShowHeatmap(true);
    } catch (error) {
      console.error("Error fetching heatmap data:", error);
    }
  };
  
  
  
  const mapRef = useRef<google.maps.Map | null>(null); // Reference to the Google Map instance

  
  useEffect(() => {
    if (mapRef.current && markerPosition) {
      const circle = new google.maps.Circle({
        center: markerPosition,
        radius: radius, 
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillOpacity: 0.0,
      });

      circle.setMap(mapRef.current); 

      return () => {
        circle.setMap(null);
      };
    }
  }, [radius, markerPosition]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyDbokWMJyoCcOY7NUJI_mttcPL1pABK51o" libraries={["visualization"]}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={13}
        onLoad={(map) => {
          mapRef.current = map; 
        }}
        onClick={(event) => {
          const newMarker = { lat: event.latLng.lat(), lng: event.latLng.lng() };
          setMarkerPosition(newMarker);
          fetchHeatmapData(newMarker.lat, newMarker.lng);
        }}
      >
        {/* Heatmap Layer */}
        {showHeatmap && heatmapData.length > 0 && (
          <HeatmapLayer
            data={heatmapData}
            options={{
              radius: 30,  
              opacity: 0.6,
              dissipating: true, // Ensures weight is considered properly
            }}
            // just add "gradient: "
          />
        )}

        {/* User-placed Marker */}
        {markerPosition && <Marker position={markerPosition} />}

        
      </GoogleMap>

      {/* Debug Button to Show/Hide Heatmap */}
      <button
        onClick={() => setShowHeatmap(!showHeatmap)}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 100,
          padding: "8px 12px",
          background: "white",
          border: "1px solid black",
          cursor: "pointer",
        }}
      >
        {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
      </button>
    </LoadScript>
  );
}
