import React, { useState } from 'react';
import './styles/Navbar.css';

// Define the type for Navbar props
interface NavbarProps {
  searchInputRef: React.RefObject<HTMLInputElement>;
}

const Navbar: React.FC<NavbarProps> = ({ searchInputRef }) => {
  const [activeBtn, setActiveBtn] = useState<string | null>(null);

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
      <div className="navbar-right">
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
    </nav>
  );
};

export default Navbar;
