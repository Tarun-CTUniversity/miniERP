import React, { useState, useMemo } from "react";

/**
 * CustomDropDown is a reusable dropdown (select) component that allows you to select from a list of options.
 * It dynamically applies styles based on focus, validation, and error handling.
 *
 * @param {string} name - The name of the dropdown (used for labeling and validation).
 * @param {Array<string>} options - The list of options to display in the dropdown (array of strings).
 * @param {function} handleChange - A callback function to handle the change in selected value.
 * @param {string} placeholder - Placeholder text for the dropdown (optional).
 * @param {boolean} required - Indicates whether the dropdown is required or not (default is true).
 * @param {boolean} disabled - Indicates whether the dropdown is disabled (default is false).
 * @param {string} textsize - The font size for the dropdown text (default is "16px").
 * @param {object} valid - An object that holds validation errors for each input field.
 * 
 * @returns {JSX.Element} A custom dropdown element with dynamic styling and validation.
 */
const CustomDropDown = ({
  name,
  options,
  handleChange,
  valid,
  placeholder = "Select...",
  required = true,
  disabled = false,
  textsize = "16px",
  initialValue = ""
}) => {

  const [selectedValue, setSelectedValue] = useState(initialValue);
  const baseStyle = "border-2 border-solid rounded-xl text-base w-[90%] py-1 ml-[2%] text-center";
  const [clicked, setClicked] = useState(false);

  const STYLE = useMemo(() => {
    if (disabled) {
      return `${baseStyle} border-grey cursor-not-allowed`; // If the dropdown is disabled
    } else if (clicked && selectedValue && !valid[name]) {
      return `${baseStyle} border-green-400 cursor-pointer`; // If the dropdown is clicked, has a value, and is valid
    } else if (clicked && ((required && !selectedValue) || valid[name])) {
      return `${baseStyle} border-red-400 cursor-pointer`; // If the dropdown is required but no value is selected, or validation error
    } else if (!required && clicked && !selectedValue) {
      return `${baseStyle} border-black cursor-pointer`; // If the dropdown is not required and has no selected value
    }
    return `${baseStyle} border-black cursor-pointer`; // Default style if no condition applies
  }, [selectedValue, valid, clicked, disabled]);

  function capitalizeFirstLetter(str) {
    if (!str) return ''; // Handle empty or null strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <div className="w-[200px] gap-y-[5px] flex flex-col">
      {/* Dropdown label with a red asterisk for required fields */}
      <p className="ml-[1%]">
        {capitalizeFirstLetter(name)} {required && <span style={{ color: "red" }}> * </span>}
      </p>

      {/* The dropdown (select) field */}
      <select
        name={name} 
        value={selectedValue}
        onChange={(e) => {
          setSelectedValue(e.target.value);
          handleChange(name, e.target.value)
        }}
        required={required} 
        disabled={disabled} 
        className={STYLE} 
        onFocus={() => {
          if (!clicked) setClicked(true);
        }}
        onTouchStart={() => {
          if (!clicked) setClicked(true);
        }}
        style={{ fontSize: textsize}}
      >
        <option value="" disabled>{placeholder}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {/* Validation message */}
      {clicked && <p className="text-red-600 text-[12px] text-end -mt-[4px]">
        {valid[name]}
      </p>}
    </div>
  );
};

export default CustomDropDown;
