import React, { useState, useEffect } from 'react';
import CustomInput from '../../../component/Inputs/CustomInput';

const DepartmentCardForSchool = ({ department: initialDepartment, onDelete, onUpdate , valid }) => {
    const [department, setDepartment] = useState(initialDepartment || { name: '', code: '', des: '' });


  // Notify parent component when department data changes
  useEffect(() => {
    onUpdate(department);
  }, [department]);

  const handleDepartmentNameChange = (name, value) => {
    // Check if the abbreviation was auto-generated previously or is empty
    // If it was auto-generated or is empty, update it with the new name
    const shouldUpdateAbb = 
      !department.code || 
      department.code === department.name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase();
  
    const newAbb = shouldUpdateAbb
      ? value
          .split(' ')
          .map((word) => word[0])
          .join('')
          .toUpperCase()
      : department.code;
  
    setDepartment((prev) => ({
      ...prev,
      name: value,
      code: newAbb,
    }));
  };

  const handleAbbreviationChange = (name, value) => {
    setDepartment((prev) => ({
      ...prev,
      code: value.toUpperCase(),
    }));
  };

  const handleDescriptionChange = (e) => {
    setDepartment((prev) => ({
      ...prev,
      des: e.target.value,
    }));
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
      {/* department Name Input */}
      <div className="mb-4 flex gap-3">
        <CustomInput
          name="Department"
          type="text"
          placeholder="Enter Department Name"
          data={department.name}
          handleChange={handleDepartmentNameChange}
          textsize="16px"
          input_width = "50%"
          valid = {valid.name}
        />

        <CustomInput
          name="Code"
          type="text"
          placeholder="Abbreviation"
          data={department.code}
          handleChange={handleAbbreviationChange}
          textsize="16px"
          input_width = "25%"
          valid = {valid.code}
          disabled = {department.name ? false : true}
        />
      </div>


      {/* Description Textarea */}
      <div className="mb-4">
        <textarea
          placeholder="Enter Description"
          value={department.des}
          onChange={handleDescriptionChange}
          className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          style={{ fontSize: '12px', height: '80px' }}
        />
      </div>

      {/* Delete Button */}
      <div className="flex justify-end">
        <button
          onClick={() => onDelete()}
          className="text-red-500 hover:text-red-700 focus:outline-none text-2xl"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default DepartmentCardForSchool;