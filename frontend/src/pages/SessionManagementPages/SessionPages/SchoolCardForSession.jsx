import React, { useState, useEffect } from 'react';
import CustomInput from '../../../component/Inputs/CustomInput';

const SchoolCardForSession = ({ school: initialSchool, onDelete, onUpdate }) => {
  const [school, setSchool] = useState(initialSchool);
  const [valid,setValid] = useState({"School" : "" , "":""});

  // Notify parent component when school data changes
  useEffect(() => {
    onUpdate(school);
  }, [school]);

  const handleSchoolNameChange = (name, value) => {
    // Check if the abbreviation was auto-generated previously or is empty
    // If it was auto-generated or is empty, update it with the new name
    const shouldUpdateAbb = 
      !school.abb || 
      school.abb === school.name
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
      : school.abb;
  
    setSchool((prev) => ({
      ...prev,
      name: value,
      abb: newAbb,
    }));
  };
  useEffect(()=>{
    console.log(school);
  })

  const handleAbbreviationChange = (name, value) => {
    setSchool((prev) => ({
      ...prev,
      abb: value.toUpperCase(),
    }));
  };

  const handleDescriptionChange = (e) => {
    setSchool((prev) => ({
      ...prev,
      des: e.target.value,
    }));
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
      {/* School Name Input */}
      <div className="mb-4 flex gap-3">
        <CustomInput
          name="School"
          type="text"
          placeholder="Enter School Name"
          data={school.name}
          handleChange={handleSchoolNameChange}
          textsize="16px"
          input_width = "50%"
          valid = {valid}
        />

        <CustomInput
          name=""
          type="text"
          placeholder="Abbreviation"
          data={school.abb}
          handleChange={handleAbbreviationChange}
          textsize="16px"
          input_width = "25%"
          valid = {valid}
          disabled = {school.name ? false : true}
        />
      </div>


      {/* Description Textarea */}
      <div className="mb-4">
        <textarea
          placeholder="Enter Description"
          value={school.des}
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

export default SchoolCardForSession;