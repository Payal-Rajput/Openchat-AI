import React, { useState } from 'react';
import { THEME_CONFIG } from '../config/theme';

const ColorWheelPicker = ({ onColorSelect, selectedColor, title = "Choose Color" }) => {
  const [hoveredColor, setHoveredColor] = useState(null);

  // Use colors from theme configuration
  const colorWheel = THEME_CONFIG.COLOR_WHEEL;

  const handleColorClick = (color) => {
    console.log('Color clicked:', color);
    console.log('onColorSelect function:', onColorSelect);
    console.log('typeof onColorSelect:', typeof onColorSelect);
    if (onColorSelect && typeof onColorSelect === 'function') {
      console.log('Calling onColorSelect with color:', color);
      onColorSelect(color);
    } else {
      console.error('onColorSelect function not provided or not a function');
    }
  };

  return (
    <div className="space-y-4">
      {/* <h4 className="text-md font-medium text-zinc-400 dark:text-white mb-3">{title}</h4> */}
      
      <div className="relative w-80 h-80 mx-auto">
        {/* Traditional Color Wheel - Grid Layout */}
        <div className="relative w-full h-full">
          {/* Create a grid of color dots arranged in circles */}
          {colorWheel.map((colorGroup, groupIndex) => {
            const angle = (groupIndex * 25.7); // 14 segments, ~25.7 degrees each
            
            return (
              <div
                key={colorGroup.name}
                className="absolute inset-0"
                style={{
                  transform: `rotate(${angle}deg)`,
                }}
              >
                {/* Create 5 concentric rings for tints */}
                {colorGroup.tints.map((tint, tintIndex) => {






                 





                  const radius = 15 + (tintIndex * 12); // Start from center, expand outward
                  const isSelected = selectedColor === tint;
                  const isHovered = hoveredColor === tint;
                  
                  // Calculate position for each color dot
                  const x = 50 + (radius * Math.cos(12 * Math.PI / 180)); // 12 degrees from center
                  const y = 50 - (radius * Math.sin(12 * Math.PI / 180));






                  
                  return (
                    <button
                      key={`${colorGroup.name}-${tintIndex}`}
                      onClick={() => {
                        console.log('Button clicked for color:', tint);
                        handleColorClick(tint);
                      }}
                      onMouseEnter={() => setHoveredColor(tint)}
                      onMouseLeave={() => setHoveredColor(null)}
                      className={`absolute w-7 h-7 rounded-full transition-all duration-300 hover:shadow-lg cursor-pointer ${
                        isSelected 
                          ? 'scale-150 shadow-xl ring-2 ring-blue-400 z-10' 
                          : isHovered 
                            ? 'scale-125 shadow-md z-5' 
                            : 'hover:scale-110'
                      }`}
                      style={{
                        backgroundColor: tint,
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                        border: isSelected ? '3px solid white' : isHovered ? '2px solid rgba(255,255,255,0.8)' : '1px solid rgba(0,0,0,0.3)',
                        boxShadow: isSelected ? '0 0 0 2px #3b82f6' : isHovered ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.2)',
                      }}
                      title={`${colorGroup.name} - ${tintIndex === 0 ? 'Base' : `Tint ${tintIndex}`}`}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
        
        {/* Center circle with selected color preview */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-12 h-12 rounded-full border-3 border-gray-300 shadow-lg flex items-center justify-center"
            style={{ backgroundColor: selectedColor || '#ffffff' }}
          >
            {selectedColor && (
              <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
            )}
          </div>
        </div>
        
        {/* Color labels around the wheel */}
        {/* {colorWheel.map((colorGroup, index) => {
          const angle = (index * 30) + 1; // Center of each segment
          const labelRadius = 160;
          
          return (
            <div
              key={`label-${colorGroup.name}`}
              className="absolute text-xs font-medium text-gray-500 dark:text-gray-400 pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${labelRadius}px)`,
              }}
            >
              <span className="transform -rotate-90 block text-center whitespace-nowrap">
                {colorGroup.name.replace('-', ' ')}
              </span>
            </div>
          );
        })} */}
      </div>
      
      {/* Selected color display with enhanced styling */}
      {selectedColor && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-3 bg-zinc-800 dark:bg-gray-700 rounded-lg px-4 py-2">
            <div 
              className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-md"
              style={{ backgroundColor: selectedColor }}
            ></div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-300 dark:text-gray-200 font-mono">
                {selectedColor}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-400">
                Selected Color
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorWheelPicker;
