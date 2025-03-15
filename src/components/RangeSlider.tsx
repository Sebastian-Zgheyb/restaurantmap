// src/RangeSlider.tsx
import React, { useState } from 'react';

const RangeSlider: React.FC = () => {
  const [value, setValue] = useState<number>(50); // Default slider value

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  return (
    <div className="p-4">
      <label htmlFor="slider" className="block mb-2 font-medium">
        Radius: {value}
      </label>
      <input
        id="slider"
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default RangeSlider;
