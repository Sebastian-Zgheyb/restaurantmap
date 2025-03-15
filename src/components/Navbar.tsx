import React, { useState } from 'react';
import './styles/Navbar.css';

// Define the type for Navbar props
interface NavbarProps {
  searchInputRef: React.RefObject<HTMLInputElement>;
}

const Navbar: React.FC<NavbarProps> = ({ searchInputRef }) => {
  const [activeBtn, setActiveBtn] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(14); // Default radius

  const handleButtonClick = (btnName: string) => {
    setActiveBtn(btnName);
  };

  return (
    <nav className="navbar">
      
      <div className="navbar-left">
        <h1 className="company-title">IndustryMap</h1>
      </div>
      <div className="navbar-center">
        <input
          ref={searchInputRef}
          type="text"
          className="nav-search"
          placeholder="Search for a place"
        />
      </div>
      
      <div className="navbar-right space-x-2">
        <div className="nav-actions">
          <button
            className={`action-btn ${activeBtn === 'rating' ? 'active' : ''}`}
            onClick={() => handleButtonClick('rating')}
          >
            Rating
          </button>
          <button
            className={`action-btn ${activeBtn === 'review' ? 'active' : ''}`}
            onClick={() => handleButtonClick('review')}
          >
            Review
          </button>
          <button
            className={`action-btn ${activeBtn === 'price' ? 'active' : ''}`}
            onClick={() => handleButtonClick('price')}
          >
            Price
          </button>
          <select className="action-dropdown">
            <option value="">Restaurant</option>
            <option value="tech">Real Estate</option>
            <option value="health">Hotel</option>
          </select>
        </div>
      </div>

      <div className="flex items-center text-white ml-8">
      <label htmlFor="radius-slider" className="mr-2">Radius:</label>
      <input
        id="radius-slider"
        type="range"
        min={1}
        max={50}
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
        className="w-24"
      />
  <span className="ml-2">{radius}</span>
</div>
    </nav>
  );
};

export default Navbar;
