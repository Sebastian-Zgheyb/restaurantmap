import MapComponent from "./components/Map";
import Navbar from "./components/Navbar";
import Navbar2 from "./components/Navbar2";

import { useState } from "react";
import MapLegend from "./components/MapLegend";

function App() {
  const [radius, setRadius] = useState<number>(14);

  return (
    <div>
      <Navbar2 searchInputRef={null} radius={radius} setRadius={setRadius} />

      {/*
      <MapComponent radius={radius} />
      <MapLegend/>
      */}
    </div>
  );
}

export default App;
