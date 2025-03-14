import { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, HeatmapLayer, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: '90vw',
  height: '90vh',
  marginTop: '5vh',
  marginRight: '5vw',
  marginBottom: '5vh',
  marginLeft: '5vw',
  display: 'block',
  margin: 'auto',
};
const defaultCenter = { lat:  -33.88363285605243, lng: 151.21301531321515 };

interface MapComponentProps {
  radius: number;
}

interface PlaceData {
  latitude: number;
  longitude: number;
  rating?: number;
  userRatingCount?: number;
}

export default function MapComponent({ radius }: MapComponentProps) {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [heatmapData, setHeatmapData] = useState<google.maps.LatLng[]>([]);

  // Function to fetch heatmap data
  const fetchHeatmapData = async (lat: number, lng: number, radius: number = 1500, option: number = 0) => {
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
      
      // If option is 1, use price level
      if (option == 1) {
        // Define the mapping from price level strings to numeric values
        const priceLevelMap: Record<string, number> = {
          "PRICE_LEVEL_UNSPECIFIED": 0,
          "PRICE_LEVEL_FREE": 10,
          "PRICE_LEVEL_INEXPENSIVE": 20,
          "PRICE_LEVEL_MODERATE": 30,
          "PRICE_LEVEL_EXPENSIVE": 60,
          "PRICE_LEVEL_VERY_EXPENSIVE": 100,
        };

        // Function to map price level string to numeric value
        const mapPriceLevelToNumeric = (priceLevel: string | null): number => {
          return priceLevel ? priceLevelMap[priceLevel] ?? 0 : 0;
        };

        // Grab an array of mapped price levels
        const priceLevels = data.places.map((place: { priceLevel?: string | null }) =>
          mapPriceLevelToNumeric(place.priceLevel ?? null) // Ensure priceLevel is either string or null
        );
          // Calculate the mean of the priceLevels
        const mean = priceLevels.reduce((acc: number, val: number) => acc + val, 0) / priceLevels.length;

        // Calculate the standard deviation of the priceLevels
        const variance = priceLevels.reduce((acc: number, val: number) => acc + Math.pow(val - mean, 2), 0) / priceLevels.length;
        const standardDeviation = Math.sqrt(variance);

          // Print the mean and standard deviation
        console.log('Mean of price levels:', mean);
        console.log('Standard deviation of price levels:', standardDeviation);

        // Filter out places with priceLevel 0
        const validPlaces = data.places.filter((place: { priceLevel?: string | null }, index: number) => {
          return priceLevels[index] !== 0; // Only keep places where priceLevel is not mapped to 0
        });

        console.log('validPlaces:', validPlaces);

        // Now create the heatmap data using the valid places and their mapped price levels
        const heatmapPoints = validPlaces.map((place: PlaceData, index: number) => {
          const weight = priceLevels[index] ?? 0; // Use the mapped price level as weight, fallback to 0 if undefined
          
          if (weight === 0) return null;

          return {
            location: new google.maps.LatLng(place.latitude, place.longitude),
            weight: weight, // Use the mapped weight for heatmap
          };
        }).filter(Boolean);

        console.log("Transformed heatmap data with weights:", heatmapPoints);

        setHeatmapData(heatmapPoints);
        setShowHeatmap(true);
        return;
      }

      const ratings = data.places.map((place: { rating?: number }) => place.rating ?? 0);
      // Step 1: Calculate mean and standard deviation
      const mean = ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length;
      const stdDev = Math.sqrt(ratings.reduce((sum: number, rating: number) => sum + Math.pow(rating - mean, 2), 0) / ratings.length);

      console.log(`Mean weight: ${mean}, Std Dev: ${stdDev}`);

      // Step 2: Standardize the ratings (z-score normalization)
      const standardizedRatings = ratings.map((rating: number) => (rating - mean) / stdDev);
      console.log('Standardized Ratings:', standardizedRatings);

      // Step 3: Min-Max normalize the standardized ratings to the range [0, 10]
      const minStandardized = Math.min(...standardizedRatings);
      const maxStandardized = Math.max(...standardizedRatings);

      console.log(`Min Standardized: ${minStandardized}, Max Standardized: ${maxStandardized}, before clipping`);
      
      const clippedRatings = standardizedRatings.map((rating: number) => {
        const maxStdDev = 1;
        if (rating > maxStdDev) return maxStdDev;
        if (rating < -maxStdDev) return -maxStdDev;
        return rating;
      });

      const minClipped = Math.min(...clippedRatings);
      const maxClipped = Math.max(...clippedRatings);

      console.log(`Min Clipped: ${minClipped}, Max Clipped:: ${maxClipped}, after clipping`);
      

      const normalizedRatings = clippedRatings.map((rating: number) =>
          ((rating - minClipped) / (maxClipped - minClipped)) * 10
      );

      // Log the normalized ratings
      console.log('Normalized Ratings:', normalizedRatings);


      const rawWeights = data.places.map((place: { rating?: number; userRatingCount?: number }, index: number) => {
        const normalizedRating = normalizedRatings[index]; // Use the normalized rating
        const reviewCount = Math.max(place.userRatingCount ?? 1, 1); // Default to 1 if userRatingCount is missing

        const logisticScalar = 2 / (1 + Math.exp(-0.04 * (reviewCount - 90))); //Uses logistic function

        return normalizedRating * logisticScalar; // Calculate the weight
      });

      const mean1 = rawWeights.reduce((sum: number, w: number) => sum + w, 0) / rawWeights.length;
      const stdDev1 = Math.sqrt(rawWeights.reduce((sum: number, w: number) => sum + (w - mean) ** 2, 0) / rawWeights.length);

      console.log(`Mean weight: ${mean1}, Std Dev: ${stdDev1}`);

      // Step 3: Transform data with raw weights for heatmap
      const heatmapPoints = data.places.map((place: PlaceData, index: number) => {
        const weight = rawWeights[index] ?? mean; // Default to mean if undefined
        
        return {
          location: new google.maps.LatLng(place.latitude, place.longitude),
          weight: weight, // Use the raw weight without normalization
        };
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
          google.maps.event.addListener(map, "zoom_changed", () => {
            // Get the current zoom level
            const zoom = map.getZoom();
          });
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
              radius: 50,  
              opacity: 0.3,
              dissipating: true,
              gradient: [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 255, 0, 1)',
                'rgba(255, 255, 0, 1)',
                'rgba(255, 0, 0, 1)', // Make red the brightest
                'rgba(255, 0, 0, 1)', // Keep red the brightest for high-weight places
              ]
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

      {/* Display the heatmap data */}
      <div>
        <h3>Heatmap Data</h3>
        <pre>{JSON.stringify(heatmapData, null, 2)}</pre>
      </div>
    </LoadScript>
  );
}
