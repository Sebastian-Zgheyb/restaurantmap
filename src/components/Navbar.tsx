import React, { useState } from "react";
import "./styles/Navbar.css";

interface NavbarProps {
  searchInputRef: React.RefObject<HTMLInputElement>;
  setShowHeatmap: React.Dispatch<React.SetStateAction<boolean>>;
  showHeatmap: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ searchInputRef, setShowHeatmap, showHeatmap }) => {
  const [activeBtn, setActiveBtn] = useState<string | null>(null);

  const handleButtonClick = (btnName: string) => {
    setActiveBtn(btnName);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="company-title">HotSpots 🔥</h1>
      </div>
      <div className="navbar-center">
        <input ref={searchInputRef} type="text" className="nav-search" placeholder="Search for a place" />
      </div>
      <div className="navbar-right">
        <div className="nav-actions">
          <button className={`action-btn ${activeBtn === "rating" ? "active" : ""}`} onClick={() => handleButtonClick("rating")}>
            Rating
          </button>
          <button className={`action-btn ${activeBtn === "review" ? "active" : ""}`} onClick={() => handleButtonClick("review")}>
            Review
          </button>
          <button className={`action-btn ${activeBtn === "price" ? "active" : ""}`} onClick={() => handleButtonClick("price")}>
            Price
          </button>
          <select className="action-dropdown">
            <option value="">Restaurant</option>
            <option value="real_estate">Real Estate</option>
            <option value="hotel">Hotel</option>
          </select>
          <button onClick={() => setShowHeatmap((prev) => !prev)} className="heatmap-btn">
            {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;