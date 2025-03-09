import React from "react";

/**
 * CustomToggleButton is a reusable toggle button component that switches between two text values.
 * It dynamically changes background color based on the selected state and supports custom padding and font size.
 * 
 * @param {string} text1 - First text option.
 * @param {string} text2 - Second text option.
 * @param {string} toggleValue - The current state value.
 * @param {function} changeValue - Function to update the state with the new value.
 * @param {string} fontSize - Font size for the button text (default is "16px").
 * @param {string} px - Horizontal padding (default is "16px").
 * @param {string} py - Vertical padding (default is "8px").
 * @returns {JSX.Element} A toggle button with dynamic text, color, padding, and font size.
 */
const CustomToggleButton = ({
  text1,
  text2,
  buttonValue,
  setButtonValue,
  textSize = "16px",
  px = "16px",
  py = "8px",
}) => {
  return (
    <button
      onClick={() => setButtonValue(buttonValue === text1 ? text2 : text1)}
      className={`text-white font-semibold rounded-md transition-all duration-300 ${
        buttonValue === text1
          ? "bg-blue-500 hover:bg-blue-600"
          : "bg-green-500 hover:bg-green-600"
      }`}
      style={{ fontSize : textSize , padding: `${py} ${px}` }}
    >
      {buttonValue}
    </button>
  );
};

export default CustomToggleButton;
