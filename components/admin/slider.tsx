
"use client";
import React, { useState, useEffect } from 'react';

// Define the RangeSlider component with customizable props
const RangeSlider = ({
  initialMin = 50,
  initialMax = 100,
  min = 0,
  max = 100,
  step = 1,
  trackColor = '#e2e8f0',
  rangeColor = '#2f855a',
  handleColor = '#4CAF50',
  onChange = () => {},
}) => {
  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);
  
  useEffect(() => {
    // Notify parent component when values change
    onChange({ min: minValue, max: maxValue });
  }, [minValue, maxValue, onChange]);
  
  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxValue - step);
    setMinValue(value);
  };
  
  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minValue + step);
    setMaxValue(value);
  };
  
  // Calculate the position percentages for the range track
  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;
  
  return (
    <div className="w-full">
      <div className="relative h-12 flex items-center">
        {/* Track background */}
        <div 
          className="absolute w-full h-1" 
          style={{ backgroundColor: trackColor }}
        ></div>
        
        {/* Active track */}
        <div 
          className="absolute h-1" 
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
            backgroundColor: rangeColor
          }}
        ></div>
        
        {/* Min handle */}
        <input 
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none"
          style={{
            zIndex: 3,
            WebkitAppearance: 'none'
          }}
        />
        
        {/* Max handle */}
        <input 
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none"
          style={{
            zIndex: 4,
            WebkitAppearance: 'none'
          }}
        />
        
        {/* Custom handle styles */}
        <style jsx>{`
          input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            pointer-events: all;
            width: 24px;
            height: 24px;
            background-color: ${handleColor};
            border-radius: 50%;
            cursor: pointer;
          }
          
          input[type=range]::-moz-range-thumb {
            pointer-events: all;
            width: 24px;
            height: 24px;
            background-color: ${handleColor};
            border-radius: 50%;
            cursor: pointer;
          }
        `}</style>
      </div>
      
      {/* Value labels */}
      <div className="mt-1 w-full flex justify-between px-3">
        <span className="text-gray-700 font-medium">{minValue}</span>
        <span className="text-gray-700 font-medium">{maxValue}</span>
      </div>
    </div>
  );
};

// Example usage of the component
const ExampleUsage = () => {
  const handleRangeChange = ({ min, max }) => {
    console.log(`Range changed: ${min} - ${max}`);
    // Do something with the values
  };
  
  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Price Range</h2>
      <RangeSlider 
        initialMin={50}
        initialMax={100}
        min={0}
        max={100}
        step={1}
        trackColor="#e2e8f0"
        rangeColor="#2f855a"
        handleColor="#4CAF50"
        onChange={handleRangeChange}
      />
    </div>
  );
};

export default RangeSlider;