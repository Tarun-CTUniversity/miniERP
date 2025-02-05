import React, { useState, useMemo } from "react";

/**
 * CustomInput is a reusable form input component that displays an input field
 * with dynamic styling based on the input value, focus, validity, and other properties.
 * It also supports a validation mechanism and can be disabled or made read-only.
 * 
 * @param {string} name - The label/name of the input field.
 * @param {string} type - The input type (default is "text"). It can be "text", "number", etc.
 * @param {function} handleChange - A callback function to handle the change in input value , has two inputs (name , value). Used on Blur
 * @param {string} placeholder - Placeholder text for the input field.
 * @param {boolean} required - Indicates whether the field is required or not (default is true).
 * @param {boolean} disabled - Indicates whether the field is disabled (default is false).
 * @param {string} fontsize - The font size for the input text (default is "16px").
 * @param {object} valid - An object that holds validation errors for each input field. {name:Error}
 * 
 * @returns {JSX.Element} A custom input element that updates its state and validates based on given props.
 */
const CustomInput = ({
  name,
  type = "text",
  handleChange,
  placeholder = "",
  required = true,
  disabled = false,
  fontsize = "16px",
  valid
}) => {

  // Local state to manage the value of the input field.
  const [value, setValue] = useState("");

  // Base styling for the input field.
  const baseStyle = "border-2 border-solid rounded-xl text-base w-[90%] text-center py-4 ml-[2%]";

  // State to track if the input field has been clicked (focused) by the user.
  const [clicked, setClicked] = useState(false);

  /**
   * Memoized style computation to avoid unnecessary re-renders.
   * The style of the input is based on various conditions:
   * - Disabled state
   * - Validity of the input (using the 'valid' prop)
   * - Focused state (whether the input has been clicked)
   * - Required state (whether the field is required or not)
   */
  const STYLE = useMemo(() => {
    if (disabled) {
      return `${baseStyle} border-grey cursor-not-allowed`; // If the field is disabled
    } else if (clicked && value && !valid[name]) {
      return `${baseStyle} border-green-400 cursor-text`; // If the input is clicked, has a value, and is valid
    } else if ((required && clicked && !value) || valid[name]) {
      return `${baseStyle} border-red-400 cursor-text`; // If the field is required but no value entered or has validation error
    } else if (!required && clicked && !value) {
      return `${baseStyle} border-black cursor-text`; // If the field is not required and has no value
    }
    return `${baseStyle} border-black cursor-text`; // Default style if no condition applies
  }, [value, valid, clicked, disabled]);

  return (
    <div className="w-[200px] gap-y-[5px] flex flex-col">

      {/* Input label with a red asterisk for required fields */}
      <p className="ml-[1%]">
        {name} {required && <span style={{ color: "red" }}> * </span>}
      </p>

      {/* The input field */}
      <input
        name={name} 
        type={type} 
        value={value}
        onChange={(e) => {
          
          if (clicked) setValue(e.target.value);
        }}
        placeholder={placeholder} 
        required={required} 
        disabled={disabled} 
        readOnly={!clicked} 
        className={STYLE} 
        onFocus={() => {
          
          if (!clicked) setClicked(true);
        }}
        onBlur={() => handleChange(name, value)} 
        style={{ fontSize: fontsize, height: fontsize }} 
      />

      {/* Validation message */}
      <p className="text-red-600 text-[12px] text-end -mt-[4px]">{valid[name]}</p>
    </div>
  );
};

export default CustomInput;
