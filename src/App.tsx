import { useRef } from "react";

import Map from "./components/Map";
import Navbar from "./components/Navbar";
function App() {

  return (
    <div>
      <Navbar searchInputRef={null} />
      <Map />
    </div>
  );
}

export default App;