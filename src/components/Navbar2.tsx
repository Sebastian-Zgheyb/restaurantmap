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
          <h1 className="company-title2">HotSpots</h1>
        </div>

        
        <div className="radius-section2">
          <label htmlFor="radius-slider2" className="radius-label2">Area:</label>
          <span className="radius-value2">{radius.toLocaleString()} <span className = "metre-squared">m<sup>2</sup></span></span>
          <input
            id="radius-slider2"
            type="range"
            min={1}
            max={10000000}
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
