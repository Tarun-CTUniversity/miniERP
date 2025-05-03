import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MdDeleteForever } from "react-icons/md";
import { FaTrashRestore } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import CustomInput from "../../../component/Inputs/CustomInput";
import CustomDropDown from "../../../component/Inputs/CustomDropDown";

const PROGRAM_TYPE = ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate'];

/**
 * ProgramCard Component
 * Displays program details and provides options to update or delete the program.
 *
 * @param {Object}  - Component props
 * @param {Object} - Program data (name, code, description)
 * @param {Function} - Callback for updating the program
 * @param {Function} - Callback for deleting the program
 * @param {boolean}  - Whether the card actions are disabled
 * @param {string} - Mode of the program ('add', 'active', 'deleted')
 * @param {Object} - Validation object for the program
 */
export default function ProgramCard({ 
    program : initialProgram, 
    onUpdate, 
    onDelete, 
    valid,
    disabled = false, 
    mode="active" // can be 'add', 'active', or 'deleted'
    }) {
    const [program, setProgram] = useState(initialProgram);
    
      useEffect(() => {
        onUpdate && onUpdate(program);
      }, [program]);
    
      const handleNameChange = (name,value) => {
        setProgram((prev) => ({
          ...prev,
          name: value,
        }));
      };
    
      const handleCodeChange = (name,value) => {
        setProgram((prev) => ({
          ...prev,
          code: value.toUpperCase(),
        }));
      };
    
      const handleDescriptionChange = (e) => {
        setProgram((prev) => ({
          ...prev,
          des: e.target.value,
        }));
      };

      const handleTypeChange = (name,value) => {
        if(PROGRAM_TYPE.includes(value)){
          setProgram((prev) => ({
            ...prev,
            type: value,
          }));
        }
      };

      const handleDurationChange = (name,value) => {
        if(value > 0 ){
          setProgram((prev) => ({
            ...prev,
            duration: value,
          }));
        } 
      };
    
      const renderActionIcon = () => {
        if (mode === 'add') {
          return (
            <RxCross2
              onClick={() => onDelete && onDelete()}
              className="text-red-500 hover:text-red-700 cursor-pointer text-xl"
            />
          );
        } else if (mode === 'active') {
          return (
            <MdDeleteForever
            onClick={() => onDelete && onDelete()}
              className="text-red-500 hover:text-red-700 cursor-pointer text-2xl"
            />
          );
        } else if (mode === 'deleted') {
          return (
            <FaTrashRestore
            onClick={() => onDelete && onDelete()}
              className="text-green-500 hover:text-green-700 cursor-pointer text-2xl"
            />
          );
        }
      };
    
      return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
          <div className="flex justify-end mb-2">{renderActionIcon()}</div>
          
          {/* Program Name and Code*/}
          <div className="mb-4 flex gap-3">
            <CustomInput
              name="Name"
              type="text"
              placeholder="Enter Program Name"
              data={program.name}
              handleChange={handleNameChange}
              textsize="16px"
              input_width="50%"
              valid={valid.name}
              disabled={disabled}
            />
    
            <CustomInput
              name="Code"
              type="text"
              placeholder="Program Code"
              data={program.code}
              handleChange={handleCodeChange}
              textsize="16px"
              input_width="25%"
              valid={valid.code}
              disabled={disabled}
            />
            <CustomDropDown
              name="Type"
              options={PROGRAM_TYPE}
              handleChange={handleTypeChange}
              valid={valid?.type}
            />

            <CustomInput
              name="Duration"
              type="Number"
              placeholder="Enter Program Duration in Years"
              data={program.duration}
              handleChange={handleDurationChange}
              textsize="16px"
              input_width="50%"
              valid={valid?.duration}
              disabled={disabled}
            />
          </div>
    
          {/* Description */}
          <div>
            <textarea
              placeholder="Enter Description"
              value={program.des}
              onChange={handleDescriptionChange}
              className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              style={{ fontSize: '12px', height: '80px' }}
              disabled={disabled}
            />
          </div>
        </div>
  );
}

