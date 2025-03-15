import React, { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";


interface Place {
  position: { lat: number; lng: number };
  name: string;
}

export default function App() {
  const defaultPosition = { lat: 53.551086, lng: 9.993682 };
  const [open, setOpen] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handlePlaceChange = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry || !place.geometry.location) {
  
      return;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const newPosition = { lat, lng };
    setPlaces([{ position: newPosition, name: place.name || "Unknown" }]);
  };

  useEffect(() => {
    const checkGoogle = setInterval(() => {
      if (window.google && searchInputRef.current) {
        clearInterval(checkGoogle);
        const autocomplete = new window.google.maps.places.Autocomplete(
          searchInputRef.current
        );
        autocomplete.setFields(["place_id", "geometry", "name"]);

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          handlePlaceChange(place);
        });
      }
    }, 500);

    return () => clearInterval(checkGoogle);
  }, []);

  return (
    <APIProvider apiKey="AIzaSyDbokWMJyoCcOY7NUJI_mttcPL1pABK51o" libraries={["places"]}>
      <div style={{ height: "100vh", width: "100vw" }}>
        {}
        <Navbar searchInputRef={searchInputRef} />

        {/* Google Map Component */}
        <Map
          zoom={9}
          center={places.length ? places[0].position : defaultPosition} 
          style={{ width: "100%", height: "100%" }}
          mapId="b31661b678ace0c5"
        >
          {places.map((place, index) => (
            <AdvancedMarker
              key={index}
              position={place.position}
              onClick={() => setOpen(true)}
            >
              <Pin background={"grey"} />
            </AdvancedMarker>
          ))}

          {open && places[0] && (
            <InfoWindow
              position={places[0].position}
              onCloseClick={() => setOpen(false)}
            >
              <div>
                <h1>{places[0].name}</h1>
                <p>Details about this marker.</p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
