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
          if (event.latLng) {
            const latLng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
            setMarkerPosition(latLng); 
          }
        }}
      >
        {/* Heatmap Layer */}
        {showHeatmap && (
          <HeatmapLayer
            data={[
              new google.maps.LatLng(34.9285, 138.6007),
              new google.maps.LatLng(34.2, 138.32007),
              new google.maps.LatLng(34.9285, 138.6007),
              new google.maps.LatLng(34.9285, 138.6007),
            ]}
          />
        )}

        {/* User-placed Marker */}
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>

      {/* Toggle Heatmap Button */}
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
