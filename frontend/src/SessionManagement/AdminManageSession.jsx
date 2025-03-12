// import React, { useState } from "react";
// import CustomToggleButton from "../component/ToggleButtons/CustomToggleButton"; // Import your custom button
// import CustomInput from "../component/Inputs/CustomInput";
// import CustomButton from "../component/Buttons/CustomButton";

// const AdminManageSessions = () => {
//     const [session, setSession] = useState("");
//     const [batch, setBatch] = useState("Jan-June"); // Default batch
//     const [departments, setDepartments] = useState([]);
//     const [departmentName, setDepartmentName] = useState("");

//     // Function to generate abbreviation
//     const generateAbbreviation = (name) => {
//         return name
//             .split(" ")
//             .map((word) => word[0].toUpperCase())
//             .join("");
//     };

//     // Function to add a new department
//     const addDepartment = () => {
//         if (departmentName.trim() === "") return;
//         const abbreviation = generateAbbreviation(departmentName);
//         setDepartments([...departments, { name: departmentName, abbr: abbreviation }]);
//         setDepartmentName("");
//     };

//     // Function to remove a department
//     const removeDepartment = (abbr) => {
//         setDepartments(departments.filter((dept) => dept.abbr !== abbr));
//     };

//     // Function to handle the 2-in-1 button logic
//     const handleSession = () => {
//         if (sessionExists()) {
//             alert("Session exists! Displaying details...");
//             // Fetch and show session details (Mock Implementation)
//         } else {
//             alert("Creating new session...");
//             // Backend API call to create session (Mock Implementation)
//         }
//     };

//     // Mock function to check if session exists
//     const sessionExists = () => {
//         return false; // Replace with actual API check
//     };

//     return (
//         <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
//             <h1 className="text-2xl font-bold mb-4">Manage Sessions</h1>

//             {/* Session Input */}
//             <div className="mb-4 w-full px-3 py-2 border rounded-lg">
//                 {<label className="block font-medium mb-1">Session (e.g., 2025-26):</label>}
//                 {<input
//                     type="text"
//                     className="w-full px-3 py-2 border rounded-lg"
//                     value={session}
//                     onChange={(e) => setSession(e.target.value)}
//                     placeholder="Enter session year"
//                 />}
//             </div>

//             {/* Batch Toggle Button */}
//             <div className="mb-4">
//                 <label className="block font-medium mb-1">Batch:</label>
//                 <CustomToggleButton
//                     text1="Jan-June"
//                     text2="July-Dec"
//                     toggleValue={batch}
//                     changeValue={setBatch}
//                     fontSize="16px"
//                     px="16px"
//                     py="8px"
//                 />
//             </div >

//             {/* 2-in-1 Button */}
//             <CustomButton text="Create New Session" bgColor="#0047AB"/>
//             <button
//                 className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
//                 onClick={handleSession}
//             >
//                 {sessionExists() ? "Show Session Details" : "Create New Session"}
//             </button>

//             {/* Department Section */}
//             {session && (
//                 <div className="mt-6">
//                     <h2 className="text-xl font-semibold mb-3">Manage Departments</h2>

//                     {/* Department Input */}
//                     <div className="flex gap-2">
//                     <CustomToggleButton
//                     text1="Jan-June"
//                     text2="July-Dec"
//                     toggleValue={batch}
//                     changeValue={setBatch}
//                     fontSize="16px"
//                     px="16px"
//                     py="8px"
//                 />
//                         <input
//                             type="text"
//                             className="flex-1 px-3 py-2 border rounded-lg"
//                             value={departmentName}
//                             onChange={(e) => setDepartmentName(e.target.value)}
//                             placeholder="Enter department name"
//                         />
//                         <button
//                             className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
//                             onClick={addDepartment}
//                         >
//                             Add
//                         </button>
//                     </div>

//                     {/* List of Departments */}
//                     {departments.length > 0 && (
//                         <ul className="mt-4 border-t pt-3">
//                             {departments.map((dept) => (
//                                 <li key={dept.abbr} className="flex justify-between items-center py-2 border-b">
//                                     <span>
//                                         {dept.name} <span className="text-gray-500">({dept.abbr})</span>
//                                     </span>
//                                     <button
//                                         className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
//                                         onClick={() => removeDepartment(dept.abbr)}
//                                     >
//                                         Delete
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdminManageSessions;

/* Above is the code where we made the page our way ,
we were unable to make good UI using the predefined that's why we created that but below is the code
which we created using existing attributes */

import React, { useState } from "react";
import CustomToggleButton from "../component/Buttons/CustomToggleButton"; 
import CustomInput from "../component/Inputs/CustomInput";
import CustomButton from "../component/Buttons/CustomButton";

const AdminManageSessions = () => {
  const [session, setSession] = useState("");
  const [batch, setBatch] = useState("Jan-June");
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [valid, setValid] = useState({}); // Validation object

  // Function to generate abbreviation
  const generateAbbreviation = (name) => {
    return name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  // Function to add a new department
  const addDepartment = () => {
    if (!departmentName.trim()) {
      setValid((prev) => ({ ...prev, departmentName: "Department name is required" }));
      return;
    }
    const abbreviation = generateAbbreviation(departmentName);
    setDepartments([...departments, { name: departmentName, abbr: abbreviation }]);
    setDepartmentName("");
  };

  // Function to remove a department
  const removeDepartment = (abbr) => {
    setDepartments(departments.filter((dept) => dept.abbr !== abbr));
  };

  // Function to handle session check or creation
  const handleSession = () => {
    if (sessionExists()) {
      alert("Session exists! Displaying details...");
      // Fetch and show session details (Mock Implementation)
    } else {
      alert("Creating new session...");
      // Backend API call to create session (Mock Implementation)
    }
  };

  // Mock function to check if session exists
  const sessionExists = () => {
    return false; // Replace with actual API check
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Manage Sessions</h1>

      {/* Session Input */}
      <div className="mb-4">
        <CustomInput
          name="Session"
          type="text"
          handleChange={(name, value) => setSession(value)}
          placeholder="Enter session year (e.g., 2025-26)"
          valid={valid}
        />
      </div>

      {/* Batch Toggle Button */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Batch:</label>
        <CustomToggleButton
          text1="Jan-June"
          text2="July-Dec"
          toggleValue={batch}
          changeValue={setBatch}
        />
      </div>

      {/* 2-in-1 Session Button */}
      <CustomButton
        text={sessionExists() ? "Show Session Details" : "Create New Session"}
        onClick={handleSession}
      />

      {/* Department Section */}
      {session && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Manage Departments</h2>

          {/* Department Input */}
          <div className="flex gap-2">
            <CustomInput
              name="Department Name"
              type="text"
              handleChange={(name, value) => setDepartmentName(value)}
              placeholder="Enter department name"
              valid={valid}
            />
            <CustomButton text="Add" onClick={addDepartment} />
          </div>

          {/* List of Departments */}
          {departments.length > 0 && (
            <ul className="mt-4 border-t pt-3">
              {departments.map((dept) => (
                <li key={dept.abbr} className="flex justify-between items-center py-2 border-b">
                  <span>
                    {dept.name} <span className="text-gray-500">({dept.abbr})</span>
                  </span>
                  <CustomButton text="Delete" onClick={() => removeDepartment(dept.abbr)} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminManageSessions;
