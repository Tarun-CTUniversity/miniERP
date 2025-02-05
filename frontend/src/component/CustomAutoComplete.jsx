import React, { useMemo, useState } from "react";

/**
 * CustomAutoComplete is a combination of an input field and a dropdown that suggests options based on user input.
 * 
 * ## Props:
 * @param {string} name - The name of the input field.
 * @param {Array<string>} options - The list of options for auto-suggestions (array of strings).
 * @param {function} handleChange - A callback function to handle the change in selected value.
 * @param {string} [placeholder="Type to search..."] - Placeholder text for the input field.
 * @param {boolean} [required=true] - Indicates whether the field is required.
 * @param {boolean} [disabled=false] - Indicates whether the field is disabled.
 * @param {string} [fontsize="16px"] - The font size for the input text.
 * @param {object} valid - An object that holds validation errors for each input field.
 * 
 * ## Returns:
 * @returns {JSX.Element} A combined input and dropdown component for auto-suggestions.
 * 
 * ## State Variables:
 * state => {string} value - Holds the current input value entered by the user.
 * state => {boolean} clicked - Tracks whether the input field is focused (true) or not (false).
 * state => {Array<string>} filteredOptions - Stores the filtered options based on user input.
 * 
 * ## Behavior:
 * - As the user types, `filteredOptions` updates with matching suggestions.
 * - Clicking an option sets the `value` and triggers `handleChange`.
 * - If required, the border color changes based on validation (`valid[name]`).
 */

const CustomAutoComplete = ({
  name,
  options,
  handleChange,
  placeholder = "Type to search...",
  required = true,
  disabled = false,
  fontsize = "16px",
  valid,
}) => {
  
  const [value, setValue] = useState("");
  const [clicked, setClicked] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);

  /**
   * Base CSS styles for the input field.
   */
  const baseStyle =
    "border-2 border-solid rounded-xl text-base w-[90%] text-center py-4 ml-[2%]";

  
  const STYLE = useMemo(() => {
      if (disabled) {
        return `${baseStyle} border-grey cursor-not-allowed`; // If the dropdown is disabled
      } else if (clicked && value && !valid[name]) {
        return `${baseStyle} border-green-400 cursor-pointer`; // If the dropdown is clicked, has a value, and is valid
      } else if (clicked && ((required && !value) || valid[name])) {
        return `${baseStyle} border-red-400 cursor-pointer`; // If the dropdown is required but no value is selected, or validation error
      } else if (!required && clicked && !value) {
        return `${baseStyle} border-black cursor-pointer`; // If the dropdown is not required and has no selected value
      }
      return `${baseStyle} border-black cursor-pointer`; // Default style if no condition applies
    }, [value, valid, clicked, disabled]);

 
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    // Filters options based on user input (case-insensitive)
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  };

  return (
    <div className="w-[200px] gap-y-[5px] flex flex-col relative">
      {/* Label */}
      <p className="ml-[1%]">
        {name} {required && <span style={{ color: "red" }}> * </span>}
      </p>

      {/* Input field */}
      <input
        name={name}
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={STYLE}
        onFocus={() => setClicked(true)} 
        onBlur={() => handleChange(name, value)} 
        style={{ fontSize: fontsize , height:fontsize}}
      />

      {/* Autocomplete Dropdown */}
      {clicked && filteredOptions.length > 0 && (
        <ul className="absolute top-[100%] left-[5%] w-[90%] bg-white border border-gray-300 rounded-md shadow-md max-h-[150px] overflow-y-auto">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
              onMouseDown={() => {
                setValue(option); // Update input value
                setFilteredOptions([]); // Close dropdown
                handleChange(name, option); // Update parent state
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}

      {/* Validation message */}
      {clicked && <p className="text-red-600 text-[12px] text-end -mt-[4px]">
        {valid[name]}
      </p>}
    </div>
  );
};

export default CustomAutoComplete;
