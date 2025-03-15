import { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

const defaultPosition = { lat: 53.551086, lng: 9.993682 };

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <APIProvider apiKey="AIzaSyDbokWMJyoCcOY7NUJI_mttcPL1pABK51o" libraries={["places"]}>
      <div style={{ height: "100vh", width: "100vw" }}>
        {/* Google Map Component */}
        <Map
          zoom={9}
          center={defaultPosition}
          style={{ width: "100%", height: "100%" }}
          mapId="b31661b678ace0c5"
        >
          {}
          <AdvancedMarker position={defaultPosition} onClick={() => setOpen(true)}>
            <Pin background={"grey"} />
          </AdvancedMarker>

          {open && (
            <InfoWindow position={defaultPosition} onCloseClick={() => setOpen(false)}>
             <div className="marker-card">
                <h1 className="marker-title">Marker Location</h1>
                <p className="marker-details">Radius, other random information about this location</p>
                <button className="generate-map-btn">Generate Map</button>
            </div>

            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}