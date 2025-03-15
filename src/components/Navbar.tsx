import { useState } from "react";

const Navbar = () => {
  const [selectedIndustry, setSelectedIndustry] = useState("Pick an Industry");
  const industries = ["Restaurants", "Hotels", "Real Estate"];

  return (
    <nav className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Search Bar */}
      <div className="relative w-1/4">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <span className="absolute left-3 top-2.5 text-gray-500">
          🔍 {/* Placeholder for a search icon */}
        </span>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Prices
        </button>
        <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
          Ratings
        </button>
        <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
          Reviews
        </button>
      </div>

      {/* Industry Dropdown */}
      <div className="relative">
        <button className="px-4 py-2 bg-gray-200 rounded-lg focus:outline-none">
          {selectedIndustry} ⏷
        </button>
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
          {industries.map((industry) => (
            <button
              key={industry}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => setSelectedIndustry(industry)}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
