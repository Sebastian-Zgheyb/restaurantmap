import { useState, useEffect } from "react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Include lattitude and longitude within server's JSON file back to client
function App() {
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

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p>The current time is: {currentTime}</p>
    </>
  );
}

export default App
