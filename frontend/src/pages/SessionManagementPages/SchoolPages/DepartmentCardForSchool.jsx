import React, { useState, useEffect } from 'react';
import CustomInput from '../../../component/Inputs/CustomInput';
import { MdDeleteForever } from "react-icons/md";
import { FaTrashRestore } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const DepartmentCardForSchool = ({
  department: initialDepartment,
  onDelete,
  onUpdate,
  valid,
  disabled = false,
  mode = 'active', // 'add', 'active', 'deleted'
}) => {
  // Department of the form:
  // { name: "", code: "", des: "" }

  const [department, setDepartment] = useState(initialDepartment);

  useEffect(() => {
    onUpdate && onUpdate(department);
  }, [department]);

  const handleNameChange = (name,value) => {
    setDepartment((prev) => ({
      ...prev,
      name: value,
    }));
  };

  const handleCodeChange = (name,value) => {
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
      
      {/* Department Name and Abbreviation */}
      <div className="mb-4 flex gap-3">
        <CustomInput
          name="Name"
          type="text"
          placeholder="Enter Department Name"
          data={department.name}
          handleChange={handleNameChange}
          textsize="16px"
          input_width="50%"
          valid={valid?.name}
          disabled={disabled}
        />

        <CustomInput
          name="Code"
          type="text"
          placeholder="Department Code"
          data={department.code}
          handleChange={handleCodeChange}
          textsize="16px"
          input_width="25%"
          valid={valid?.code}
          disabled={disabled}
        />
      </div>

      {/* Description */}
      <div>
        <textarea
          placeholder="Enter Description ( Write Full Name of Department as per School Guidance)"
          value={department.des}
          onChange={handleDescriptionChange}
          className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          style={{ fontSize: '12px', height: '80px' }}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default DepartmentCardForSchool;
