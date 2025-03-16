import React, { useState } from "react";
import './Navbar2.css'; // Link to the new CSS file

interface NavbarProps {
  searchInputRef: React.RefObject<HTMLInputElement> | null;
  radius: number;
  setRadius: React.Dispatch<React.SetStateAction<number>>;
}

const Navbar2: React.FC<NavbarProps> = ({ searchInputRef, radius, setRadius }) => {
  const [activeBtn, setActiveBtn] = useState<string | null>(null);

  const handleButtonClick = (btnName: string) => {
    setActiveBtn(btnName);
  };

  return (
    <nav className="navbar2">
      <div className="container">
        <div className="navbar-left2">
          <h1 className="company-title2">Industry Map</h1>
        </div>

        <div className="navbar-center2">
          <input
            ref={searchInputRef}
            type="text"
            className="nav-search2"
            placeholder="Search for a place"
          />
        </div>

        <div className="navbar-right2">
          <div className="nav-actions2">
            <button
              className={`action-btn2 ${activeBtn === "generate" ? "active2" : ""}`}
              onClick={() => handleButtonClick("generate")}
            >
              Generate
            </button>
            <select className="action-dropdown2">
              <option value="">Restaurant</option>
              <option value="tech">Real Estate</option>
              <option value="health">Hotel</option>
            </select>
          </div>
        </div>

        <div className="radius-section2">
          <label htmlFor="radius-slider2" className="radius-label2">Radius:</label>
          <span className="radius-value2">{radius} metres</span>
          <input
            id="radius-slider2"
            type="range"
            min={1}
            max={2000}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="radius-slider2"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;
