import React, { useState } from "react";

/**
 * CustomButton is a reusable button component that dynamically changes background
 * color based on different states (normal, focus, click). It supports both desktop
 * (mouse events) and mobile (touch events) interactions.
 * 
 * @param {string} text - The text to be displayed on the button.
 * @param {function} handleClick - Function to be called when the button is clicked.
 * @param {string} fontSize - The font size for the button text (default is "16px").
 * @param {string} px - Horizontal padding (default is "16px").
 * @param {string} py - Vertical padding (default is "8px").
 * @param {string} bgColor - Default background color.
 * @param {string} focusColor - Background color when focused.
 * @param {string} clickColor - Background color when clicked.
 * @param {string} textColor - Text color.
 * @returns {JSX.Element} A fully customizable button.
 */
const CustomButton = ({
  text,
  handleClick,
  fontSize = "16px",
  px = "16px",
  py = "8px",
  bgColor = "gray",
  focusColor = "darkgray",
  clickColor = "black",
  textColor = "white",
  disabled = false
}) => {
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
      className="rounded-lg transition-all"
      style={{
        fontSize,
        padding: `${py} ${px}`,
        backgroundColor: clicked ? clickColor : bgColor,
        color: textColor,
        marginBottom: 20,
      }}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={() => setClicked(false)}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      onFocus={(e) => e.target.style.backgroundColor = focusColor}
      onBlur={(e) => e.target.style.backgroundColor = bgColor}
      disabled = {disabled}
    >
      {text}
    </button>
  );
};

export default CustomButton;
