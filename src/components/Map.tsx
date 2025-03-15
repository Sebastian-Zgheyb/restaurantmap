import { useState } from "react";
import { GoogleMap, LoadScript, HeatmapLayer, Marker } from "@react-google-maps/api";

const mapContainerStyle = { width: "100vw", height: "100vh" };
const defaultCenter = { lat: 53.551086, lng: 9.993682 };

export default function MapComponent() {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);

  return (
    <LoadScript googleMapsApiKey="AIzaSyDbokWMJyoCcOY7NUJI_mttcPL1pABK51o" libraries={["visualization"]}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={13}
        onClick={(event) => {
          if (event.latLng) {
          setMarkerPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
          }
        }}
      >
        {/* Heatmap Layer */}
        {showHeatmap && (
          <HeatmapLayer
            data={[
              new google.maps.LatLng(53.5505, 9.9937),
              new google.maps.LatLng(53.5510, 9.9940),
              new google.maps.LatLng(53.5520, 9.9950),
              new google.maps.LatLng(53.5530, 9.9960),
            ]}
          />
        )}

        {/* Default Marker
        <Marker position={defaultCenter} /> */}

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
