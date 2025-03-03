import React, { useState } from "react";
import CustomInput from "../component/Inputs/CustomInput";
import CustomToggleButton from "../component/ToggleButtons/CustomToggleButton";

const Dep_management = () => {
  const [departmentName, setDepartmentName] = useState("");
  const [departments, setDepartments] = useState([]);
  
  // Function to generate an abbreviation
  const generateAbbreviation = (name) => {
    return name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  // Handle search or create department
  const handleSearchCreate = () => {
    if (departmentName && !departments.find((d) => d.name === departmentName)) {
      const newDept = { name: departmentName, abbr: generateAbbreviation(departmentName) };
      setDepartments([...departments, newDept]);
      setDepartmentName("");
    }
  };

  // Handle delete department
  const handleDelete = (abbr) => {
    setDepartments(departments.filter((dept) => dept.abbr !== abbr));
  };

  return (
    <div className="p-6">
      {/* Upper Div - Search/Create Department */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">Create / Search Department</h2>
        <div className="flex items-center gap-4">
          <CustomInput
            name="Department"
            placeholder="Enter department name"
            handleChange={(name, value) => setDepartmentName(value)}
          />
          <CustomToggleButton
            text1="Search/Create"
            text2="Searching..."
            toggleValue="Search/Create"
            changeValue={handleSearchCreate}
          />
        </div>
      </div>

      {/* Lower Div - Manage Departments */}
      <div className="bg-gray-200 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Manage Departments</h2>
        <div className="space-y-3">
          {departments.map((dept) => (
            <div key={dept.abbr} className="flex justify-between items-center bg-white p-3 rounded-lg shadow">
              <span className="text-lg font-medium">{dept.name} ({dept.abbr})</span>
              <CustomToggleButton
                text1="Delete"
                text2="Confirm"
                toggleValue="Delete"
                changeValue={() => handleDelete(dept.abbr)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dep_management;