import React, { useState } from "react";

/**
 * CancelButton is a reusable button component that dynamically changes background
 * color based on different states (normal, focus, click). It supports both desktop
 * (mouse events) and mobile (touch events) interactions.
 * 
 * @param {function} handleClick - Function to be called when the button is clicked.
 * @param {string} fontsize - The font size for the button text (default is "16px").
 * @param {string} px - Horizontal padding (default is "16px").
 * @param {string} py - Vertical padding (default is "8px").
 * @returns {JSX.Element} A styled cancel button.
 */
const CancelButton = ({ handleClick, fontsize = "16px", px = "16px", py = "8px" , disabled = false}) => {
  const [clicked, setClicked] = useState(false);

  const handlePress = () => setClicked(true);
  const handleRelease = () => {
    if (clicked) {
      handleClick();
      setClicked(false);
    }
  };

  return (
    <button
      className={`text-white rounded-lg transition-all 
        ${clicked ? "bg-red-800" : "bg-red-600 hover:bg-red-700 focus:bg-red-700"}
      `}
      style={{ fontSize: fontsize, padding: `${py} ${px}` }}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={() => setClicked(false)}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      disabled = {disabled}
    >
      Cancel
    </button>
  );
};

export default CancelButton;
