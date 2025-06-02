import React, { useState, useEffect } from 'react';
import CustomInput from '../../../component/Inputs/CustomInput';
import { MdDeleteForever } from "react-icons/md";
import { FaTrashRestore } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const SchoolCardForSession = ({
  school: initialSchool,
  onDelete,
  onUpdate,
  valid,
  disabled = false,
  mode = 'active', // 'add', 'active', 'deleted'
}) => {
  const [school, setSchool] = useState(initialSchool);

  useEffect(() => {
    onUpdate && onUpdate(school);
  }, [school]);

  const handleSchoolNameChange = (name, value) => {
    const shouldUpdateAbb =
      !school.code ||
      school.code === school.name
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
      : school.code;

    setSchool((prev) => ({
      ...prev,
      name: value,
      code: newAbb,
    }));
  };

  const handleAbbreviationChange = (name, value) => {
    setSchool((prev) => ({
      ...prev,
      code: value.toUpperCase(),
    }));
  };

  const handleDescriptionChange = (e) => {
    setSchool((prev) => ({
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

      {/* School Name and Abbreviation */}
      <div className="mb-4 flex gap-3">
        <CustomInput
          name="School"
          type="text"
          placeholder="Enter School Name"
          data={school.name}
          handleChange={handleSchoolNameChange}
          textsize="16px"
          input_width="50%"
          valid={valid?.name}
          disabled={disabled}
        />

        <CustomInput
          name="Code"
          type="text"
          placeholder="Abbreviation"
          data={school.code}
          handleChange={handleAbbreviationChange}
          textsize="16px"
          input_width="25%"
          valid={valid?.code}
          disabled={disabled || !school.name}
        />
      </div>

      {/* Description */}
      <div>
        <textarea
          placeholder="Enter Description ( Write Full Name of School as per School Guidance)"
          value={school.des}
          onChange={handleDescriptionChange}
          className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          style={{ fontSize: '12px', height: '80px' }}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default SchoolCardForSession;
