import React, { useState } from "react";

/**
 * BackButton is a reusable button component that dynamically changes background
 * color based on different states (normal, focus, click). It supports both desktop
 * (mouse events) and mobile (touch events) interactions.
 * 
 * @param {function} handleClick - Function to be called when the button is clicked.
 * @param {string} fontsize - The font size for the button text (default is "16px").
 * @param {string} px - Horizontal padding (default is "16px").
 * @param {string} py - Vertical padding (default is "8px").
 
 * @returns {JSX.Element} A styled back button.
 */
const BackButton = ({ handleClick, fontsize = "16px", px = "16px", py = "8px", disabled = false }) => {
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
      className={`text-black rounded-lg transition-all 
        ${clicked ? "bg-yellow-700" : "bg-yellow-500 hover:bg-yellow-600 focus:bg-yellow-600"}
      `}
      style={{ fontSize: fontsize, padding: `${py} ${px}` }}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={() => setClicked(false)}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      disabled = {disabled}
    >
      Back
    </button>
  );
};

export default BackButton;
