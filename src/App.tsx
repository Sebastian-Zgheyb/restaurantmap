import { useState, useEffect } from "react";
import './App.css'
import Navbar from "./Components/Navbar";
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import imagePath from './assets/logo.png'

// Include lattitude and longitude within server's JSON file back to client
// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client
// Include lattitude and longitude within server's JSON file back to client
// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client// Include lattitude and longitude within server's JSON file back to client
function App() {
  let items = ["Home", "Product", "Service"];
  const [count, setCount] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/time")
      .then((res) => res.json())
      .then((data) => {
        setCurrentTime(data.time);
      })
      .catch((err) => console.error("Error fetching time:", err));
  }, []);

  return(
      <div><Navbar brandName="RestaurantMap" imageSrcPath={imagePath} navItems={items}></Navbar></div>
  )
}


export default App
