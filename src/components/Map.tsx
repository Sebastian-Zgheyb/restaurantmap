import { useState } from "react";
import {
  APIProvider,
  Map
} from "@vis.gl/react-google-maps";

export default function Intro() {
  const position = { lat: 53.551086, lng: 9.993682 };



  return (
    <APIProvider apiKey="AIzaSyDbokWMJyoCcOY7NUJI_mttcPL1pABK51o">
      <div style={{ height: "100vh", width: "100vw" }}>
        <Map
          zoom={9}
          center={position}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </APIProvider>
  );
}
