import MapComponent from "./components/Map";
import Navbar from "./components/Navbar";
import { useState } from "react";

function App() {
  const [radius, setRadius] = useState<number>(14);

  return (
    <div>
      <Navbar searchInputRef={null} radius={radius} setRadius={setRadius} />
      <MapComponent radius={radius} />
    </div>
  );
}

export default App;
