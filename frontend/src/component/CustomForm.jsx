// TODO
// 2. onDetele is not working
// 3. onupdate is also not working

import React, { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { MdDeleteForever } from 'react-icons/md';
import { FaTrashRestore } from 'react-icons/fa';
import CustomInput from './Inputs/CustomInput'; // Adjust path as needed
import CustomDropDown from './Inputs/CustomDropDown';
/**
 * CustomForm is a flexible form component that supports text inputs, dropdowns,
 * textareas, field validation, conditional disabling, custom styling, grid layout,
 * input transformation, and optional soft deletion.
 *
 * @component
 *
 * @param {number} columns - Total number of columns in the grid layout.
 * @param {Array<string>} names - Current values of each form field (by index).
 * @param {Array<'text' | 'dropdown' | 'textarea'>} tags - Type of UI component to render per field.
 * @param {Array<'text' | 'number'>} types - HTML input type (used only for 'text' fields).
 * @param {Array<string>} placeholders - Placeholder text for each field.
 * @param {Array<boolean>} required - Whether the field is required for form validation.

 * @param {Array<Array<string>>} options - Dropdown options for each field, used only if `tags[index] === 'dropdown'`.
 * @param {Array<number|null>} dependencies - If set, the field is disabled until the value at `names[dependencies[index]]` is non-empty.
 * @param {Array<string>} styles - Custom Tailwind CSS class overrides per field container.
 * @param {Array<number>} rowStarts - Grid row start positions (e.g., to break rows manually).
 * @param {Array<number>} rowSpans - Grid row span for each field.
 * @param {Array<number>} colStarts - Grid column positions (e.g., to break rows manually).
 * @param {Array<number>} colSpans - Grid column span for each field.  
 * @param {Array<{name: string, args?: Array<any>}>} useFunction - Optional transformation functions to apply on input (e.g., uppercase, limitLength).
 * @param {Object.<number, string>} valid - Validation error messages by field index.
 * @param {function} onDelete - Function to call on delete or restore icon click.
 * @param {function} onUpdate - Function to call when a field is updated: (index: number, value: string) => void
 * @param {'add' | 'active' | 'deleted'} mode - Mode of the form row for conditional rendering of icons.
 * @param {boolean} [deletionAllowed=false] - Whether to show delete or restore buttons for this row.
 */


const builtInFunctions = {
  uppercase: (value) => value.toUpperCase(),
  noSpaces: (value) => value.replace(/\s+/g, ''),
  limitLength: (value, len) => value.slice(0, len),
  abbreviation: (value) =>
    value
      .split(' ')
      .map((word) => word[0]?.toUpperCase())
      .join(''),
};

const CustomForm = ({
  data,
  columns,
  names,
  tags,
  types,
  placeholders,
  required,
  options,
  dependencies,
  styles,
  rowStarts,
  rowSpans,
  colStarts,
  colSpans,
  useFunction,
  valid,
  onDelete,
  onUpdate,
  mode,
  deletionAllowed = false,
}) => {
   // State to hold current values of all fields
   const [formValues, setFormValues] = useState(
    names.reduce((acc, name) => ({ ...acc, [name]: data[name] || '' }), {})
  );

  // Handle changes in field values
  const handleChange = (index, value) => {
    const fieldName = names[index];
  
    // Start with the latest form values
    let updatedValues = { ...formValues, [fieldName]: value };
    
  
    // Apply transformation functions where this field is in their input
    useFunction?.forEach(({ fun, for: targetField, input }) => {
      if (input.includes(fieldName) && builtInFunctions[fun]) { 
        const args = input.map(key => updatedValues[key] || '');
        const newValue = builtInFunctions[fun]( ...args);
        updatedValues[targetField] = newValue;
      }
      
    });
  
    setFormValues(updatedValues);
    onUpdate(updatedValues);
  };
  
  
  

  const renderActionIcon = () => {
    if (!deletionAllowed) return null;

    switch (mode) {
      case 'add':
        return (
          <RxCross2
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 cursor-pointer text-xl"
          />
        );
      case 'active':
        return (
          <MdDeleteForever
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 cursor-pointer text-2xl"
          />
        );
      case 'deleted':
        return (
          <FaTrashRestore
            onClick={onDelete}
            className="text-green-500 hover:text-green-700 cursor-pointer text-2xl"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='flex flex-col border border-gray-300 rounded-lg mt-5'>
      { deletionAllowed && (
        <div className="flex justify-end items-start col-span-full mx-2 my-2">
          {renderActionIcon()}
        </div>
      )}
      
      <div className={`grid gap-2 w-full px-4`}
      
        style={
          {
            gridTemplateColumns: `repeat( ${columns}, 1fr)`
          }
        }
      >      
        {names.map((name, index) => {
          const isRequired = required?.[index];
          const isDisabled =
            dependencies?.[index] !== null &&
            formValues[dependencies[index]] === '' ||
            mode == "deleted";

          const row = rowStarts?.[index]
            ? ` ${rowStarts[index]} / span ${rowSpans?.[index]}`
            : '1 / span 1';
          const col =  colStarts?.[index]
          ? ` ${colStarts[index]} / span ${colSpans?.[index]}`
          : '1 / span 1';
          const customStyle = styles?.[index] || {};
          const errorMsg = valid?.[names[index]] || '';
          return (
            <div
              key={data.id + name}
              style={
                {
                  gridRow:row,
                  gridColumn : col,
                  ...customStyle
                }
              }
            >
              {tags[index] === 'textarea' ? (
                <>
                  <textarea
                    placeholder={placeholders?.[index] || 'Enter description...'}
                    value={formValues[name]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    required={isRequired}
                    disabled={isDisabled}
                    className={`w-full p-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 ${
                      isDisabled ? 'bg-gray-100' : ''
                    }`}
                    style={{ fontSize: '12px', height: '80px' }}
                  />
                  {errorMsg && (
                    <span className="text-red-500 text-xs">{errorMsg}</span>
                  )}
                </>
              ) : tags[index] === 'dropdown' ? (
                <CustomDropDown
                  name={name}
                  options={options?.[index] || []}
                  handleChange={(e) => handleChange(index, e.target.value)}
                  placeholder={placeholders?.[index] || 'Select...'}
                  required={isRequired}
                  disabled={isDisabled}
                  textsiz="16px"
                  valid={errorMsg}
                />
              ) : (
                <CustomInput
                  name={name}
                  type={types?.[index] || 'text'}
                  data={formValues[name]}
                  handleChange={(name,value) => handleChange(index, value)}
                  required={isRequired}
                  disabled={isDisabled}
                  placeholder={placeholders?.[index] || ''}
                  textSize="16px"
                  valid={errorMsg}      
                />
              )}
            </div>
          );
        })}

        
      </div>
    </div>
  );
};

export default CustomForm;
