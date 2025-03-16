import { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, HeatmapLayer, Marker } from "@react-google-maps/api";
import './styles/Map.css';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  marginRight: '5vw',
  marginBottom: '5vh',
  marginLeft: '5vw',
  margin: 'auto',
  display: 'block',
};

const defaultCenter = { lat: -33.88363285605243, lng: 151.21301531321515 };

interface MapComponentProps {
  radius: number;
  setRadius: React.Dispatch<React.SetStateAction<number>>;
}

interface PlaceData {
  latitude: number;
  longitude: number;
  rating?: number;
  userRatingCount?: number;
}

export default function MapComponent({ radius, setRadius }: MapComponentProps) {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [heatmapData, setHeatmapData] = useState<google.maps.LatLng[]>([]);
  const cacheRef = useRef(new Map());
  const [activeBtn, setActiveBtn] = useState<string | null>(null);

  const posRef = useRef<{ lat: number; lng: number } | null>(null);

  // Function to fetch heatmap data
  const fetchHeatmapData = async (lat: number, lng: number, radius: number = 1500) => {
    const cacheKey = `${lat},${lng},${radius}`;
    if (cacheRef.current.has(cacheKey)) {
      console.log("Using cached data for", cacheKey);
      setHeatmapData(cacheRef.current.get(cacheKey));
      setShowHeatmap(true);
      return;
    }
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

      const ratings = data.places.map((place: { rating?: number }) => place.rating ?? 0);
      const mean = ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length;
      const stdDev = Math.sqrt(ratings.reduce((sum: number, rating: number) => sum + Math.pow(rating - mean, 2), 0) / ratings.length);

      console.log(`Mean weight: ${mean}, Std Dev: ${stdDev}`);

      const normalizedRatings = ratings.map((rating: number) => (rating - mean) / stdDev);
      const minStandardized = Math.min(...normalizedRatings);
      const maxStandardized = Math.max(...normalizedRatings);

      const normalizedRatingsClipped = normalizedRatings.map((rating: number) => {
        const maxStdDev = 1;
        if (rating > maxStdDev) return maxStdDev;
        if (rating < -maxStdDev) return -maxStdDev;
        return rating;
      });

      const normalizedRatingsFinal = normalizedRatingsClipped.map((rating: number) =>
        ((rating - minStandardized) / (maxStandardized - minStandardized)) * 10
      );

      const rawWeights = data.places.map((place: PlaceData, index: number) => {
        const normalizedRating = normalizedRatingsFinal[index];
        const reviewCount = Math.max(place.userRatingCount ?? 1, 1);

        const logisticScalar = 2 / (1 + Math.exp(-0.04 * (reviewCount - 90)));
        return normalizedRating * logisticScalar;
      });

      const heatmapPoints = data.places.map((place: PlaceData, index: number) => {
        const weight = rawWeights[index] ?? mean;
        return {
          location: new google.maps.LatLng(place.latitude, place.longitude),
          weight: weight,
        };
      });

      console.log("Transformed heatmap data with weights:", heatmapPoints);

      setHeatmapData(heatmapPoints);
      setShowHeatmap(true);
      cacheRef.current.set(cacheKey, heatmapPoints);
    } catch (error) {
      console.error("Error fetching heatmap data:", error);
    }
  };

  const mapRef = useRef<google.maps.Map | null>(null);

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
    <div className="container">
      <div className="NavBar">
        <button
          onClick={() => {
            setShowHeatmap((prev) => !prev); // Toggle the heatmap visibility
          }}
          style={{
            top: 10,
            left: 10,
            padding: "8px 12px",
            margin: "12px 16px",
            background: "black",
            border: "1px solid black",
            color: "white",
            cursor: "pointer",
          }}
        >
          {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
        </button>
        <button
          className={`action-btn2 ${activeBtn === "generate" ? "active2" : ""}`}
          onClick={() => {
            // Log the Pos (marker position) when Generate is clicked
            if (posRef.current?.lat && posRef.current?.lng) {
              fetchHeatmapData(posRef.current.lat, posRef.current.lng, radius); // Include radius when generating
              console.log("Fetched heatmap data");
            } else {
              console.log("No position selected");
            }
          }}
        >
          Generate
        </button>
        <div className="radius-section2">
          <label htmlFor="radius-slider2" className="radius-label2">Radius:</label>
          <span className="radius-value2">{radius} metres</span>
          <input
            id="radius-slider2"
            type="range"
            min={1}
            max={2000}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="radius-slider2"
          />
        </div>
      </div>
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
            posRef.current = newMarker;  // Store position in ref
            setMarkerPosition(newMarker);
          }}
        >
          <HeatmapLayer
            data={showHeatmap ? heatmapData : []}
            options={{
              radius: 50,
              opacity: 0.3,
              dissipating: true,
              gradient: [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 255, 0, 1)',
                'rgba(255, 255, 0, 1)',
                'rgba(255, 0, 0, 1)',
                'rgba(255, 0, 0, 1)',
              ],
            }}
          />
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
