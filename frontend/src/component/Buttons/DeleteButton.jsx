import React, { useState } from "react";

/**
 * DeleteButton is a reusable button component that dynamically changes background
 * color based on different states (normal, focus, click). It supports both desktop
 * (mouse events) and mobile (touch events) interactions.
 * 
 * @param {function} handleClick - Function to be called when the button is clicked.
 * @param {string} fontsize - The font size for the button text (default is "16px").
 * @param {string} px - Horizontal padding (default is "16px").
 * @param {string} py - Vertical padding (default is "8px").
 * @param {boolean} disabled - Whether the button is disabled.
 * 
 * @returns {JSX.Element} A styled delete button.
 */
const DeleteButton = ({ handleClick, fontsize = "16px", px = "16px", py = "8px", disabled = false }) => {
  const [clicked, setClicked] = useState(false);

  const handlePress = () => setClicked(true);
  const handleRelease = () => {
    if (clicked && !disabled) {
      handleClick();
      setClicked(false);
    }
  };

  return (
    <button
      className={`text-white rounded-lg transition-all 
        ${clicked ? "bg-red-700" : "bg-red-500 hover:bg-red-600 focus:bg-red-600"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
      style={{ fontSize: fontsize, padding: `${py} ${px}` }}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={() => setClicked(false)}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      disabled={disabled}
    >
      Delete
    </button>
  );
};

export default DeleteButton;
