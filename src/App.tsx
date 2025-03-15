import MapComponent from "./components/Map";
import Navbar from "./components/Navbar";

function App() {

  return (
    <div>
      <Navbar searchInputRef={null} />
      <MapComponent />
    </div>
  );
}

export default App;