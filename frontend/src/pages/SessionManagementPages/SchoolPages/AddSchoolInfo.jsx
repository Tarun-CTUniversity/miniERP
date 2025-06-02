import React, { useEffect, useState } from "react";
import CustomDropDown from "../../../component/Inputs/CustomDropDown";
import CancelButton from "../../../component/Buttons/CancelButton";
import UpdateButton from "../../../component/Buttons/UpdateButton";
import DepartmentCardForSchool from "./DepartmentCardForSchool";
import { v4 as uuidv4 } from 'uuid';
import api from '../../../api/api';
import { useApi } from '../../../hooks/useApi';

const AddSchoolInfo = () => {
  const [sessionData, setSessionData] = useState({ SESSION: [], SCHOOLS: [] });
  const [session, setSession] = useState("");
  const [school, setSchool] = useState("");
  const { request, loading, error } = useApi();

  const [valid, setValid] = useState({
    school: "",
    session: "",
    existingDepartments: [],
    newDepartments: [],
  });

  const [existingDepartments, setExistingDepartments] = useState([]);
  const [newDepartments, setNewDepartments] = useState([]);

  useEffect(() => {
    getSessionNames();
  }, []);

  const getSessionNames = async () => {
  try {
    const resp = await request(api.getSessionNames);
    console.log(resp);
    setSessionData((prev) => ({
      ...prev,
      SESSION: resp.data.data.map((item) => item.name),
    }));
  } catch (err) {
    alert("Server Not working Properly");
    console.error(err);
  }
};

  const getSchoolNames = async (name) => {
    try {
      const resp = await request(api.getSessionByName,name);
      setSessionData((prev) => ({
        ...prev,
        SCHOOLS: resp.data.data.schools.map((school) => school.name),
      }));
    } catch (err) {
      alert("Server Not working Properly");
      console.error(err);
    }
  };

  const getDepartments = async (department) => {
    const schoolInfo = `${session}_${department}`;
    try {
      const response = await request(api.getAllDepartmentsBySchool,schoolInfo);
      if (response.status === 200 && response.data?.data) {
        const fetched = response.data.data;
        setExistingDepartments(fetched.map((dept) => ({ name : dept.name, code : dept.code, id : dept._id  , deleted : dept.deleted })));
        setValid((prev) => ({
          ...prev,
          existingDepartments: fetched.map(() => ({ name: "", code: "" })),
        }));
      } else {
        console.error("Unexpected response format:", response);
        alert("Failed to fetch departments. Please try again later.");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        console.error("Server error:", error.response.data);
        alert(
          error.response.data.message || "Failed to fetch departments from the server."
        );
      } else if (error.request) {
        // Request was made but no response was received
        console.error("No response from server:", error.request);
        alert("No response from the server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        console.error("Error setting up request:", error.message);
        alert("An error occurred while fetching departments. Please try again.");
      }
    }
  };

  const handleSession = (val) => {
    if (sessionData.SESSION.includes(val)) {
      setSession(val);
      setValid((prev) => ({ ...prev, session: "" }));
      getSchoolNames(val);
    } else {
      setValid((prev) => ({ ...prev, session: "Please provide proper session Name" }));
    }
  };

  const handleSchool = (val) => {
    if (sessionData.SCHOOLS.includes(val)) {
      setSchool(val);
      setValid((prev) => ({ ...prev, school: "" }));
      getDepartments(val);
    } else {
      setValid((prev) => ({ ...prev, school: "Please provide proper School Name" }));
    }
  };

  // ✅ Matches CreateSession naming
  const addNewDepartmentHandler = () => {
    const newDept = { name: "", code: "", des: "",id: uuidv4() };
    setNewDepartments((prev) => [...prev, newDept]);
    setValid((prev) => ({
      ...prev,
      newDepartments: [...prev.newDepartments, { name: "", code: "" }],
    }));
  };

  const handleDeleteDepartment= (mode,index) => {
    if(mode == 'add'){
      setNewDepartments((prev) => prev.filter((_, i) => i !== index));
      setValid((prev) => ({
        ...prev,
        newDepartments: prev.newDepartments.filter((_, i) => i !== index),
      }));
    }else{
      const updatedDepartments = [...existingDepartments];
      updatedDepartments[index].deleted = !updatedDepartments[index].deleted; // Toggle the deleted statu
      setExistingDepartments(updatedDepartments);
    }
  }

  const handleUpdateDepartment = (mode , index , department) => {
    if(mode == 'add'){
      const updatedDepartments = [...newDepartments];
      updatedDepartments[index] = department; // Update the department at the specified index
      setNewDepartments(updatedDepartments);
     }
    else{
      const updatedDepartments = [...existingDepartments];
      updatedDepartments[index] = department; // Update the department at the specified index
      setExistingDepartments(updatedDepartments);
    }
  }

  const validateDepartments = () => {
    // Validate all department data before submission
    const seenNames = new Set();
    const seenCodes = new Set();
    let error = false;
  
    const validateDepartment = (departments, departmentType) => {
      const newValidDepartments = [];
  
      departments.forEach((department, index) => {
        const normalizedName = department.name.trim().toLowerCase();
        const normalizedCode = department.code.trim().toLowerCase();
        const validData = valid[departmentType][index];
  
        // Validate names
        if (normalizedName === "") {
          validData.name = "Empty Name";
          error = true;
        } else {
          if (seenNames.has(normalizedName)) {
            validData.name = "Duplicate Name";
            error = true;
          } else {
            validData.name = "";
            seenNames.add(normalizedName);
          }
        }
  
        // Validate codes
        if (normalizedCode === "") {
          validData.code = "Empty Code";
          error = true;
        } else {
          if (seenCodes.has(normalizedCode)) {
            validData.code = "Duplicate Code";
            error = true;
          } else {
            validData.code = "";
            seenCodes.add(normalizedCode);
          }
        }
  
        newValidDepartments.push(validData);
      });
  
      setValid((prev) => ({ ...prev, [departmentType]: newValidDepartments }));
      return error;
    };
  
    // Validate both new and existing departments
    const newDeptError = validateDepartment(newDepartments, "newDepartments");
    const existingDeptError = validateDepartment(existingDepartments, "existingDepartments");
  
    return newDeptError && existingDeptError;
  };

  const handleUpdateData = async () => {
    const hasError = validateDepartments();
    if (hasError) {
      alert("Please fix the errors before submitting.");
      return;
    }

    const data = {
      session,
      school,
      existingDepartments: existingDepartments,
      newDepartments: newDepartments
    };

    try {
      const response = await request(api.updateSchoolDepartment,data);
      if (response.status === 200) {
        alert("Data Updated Successfully");
        if(response.data.data){
          const fetched = response.data.data;
          setExistingDepartments(fetched.map((dept) => ({ name : dept.name, code : dept.code, id : dept._id  , deleted : dept.deleted })));
          setNewDepartments([]);
          setValid((prev) => ({
            ...prev,newDepartments: [],
            existingDepartments: fetched.map(() => ({ name: "", code: "" })),  
    
        }));
      }
      } else {
        alert("Failed to update data. Please try again.");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Failed to update data. Please try again.");
    }
  }

  const handlePrintData = () => {
    console.log("Print data:", {
      session,
      school,
      existingDepartments,
      newDepartments,
    });
  };

  return (
    <div className="bg-gray-50 flex flex-col">
      <header className="p-6 bg-blue-500 text-white text-center text-2xl font-bold" onClick={handlePrintData}>
        Add School Info
      </header>

      <main className="flex-1 p-6">
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Session & School</label>
          <div className="flex gap-4">
            <CustomDropDown
              name="Session"
              options={sessionData.SESSION}
              handleChange={(n, val) => handleSession(val)}
              valid={valid.session}
            />
            <CustomDropDown
              name="School"
              options={sessionData.SCHOOLS}
              handleChange={(n, val) => handleSchool(val)}
              valid={valid.school}
            />
          </div>
        </div>

        <div className="flex flex-col border border-gray-300 rounded-lg p-4 relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={addNewDepartmentHandler}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              + Add Department
            </button>
          </div>

          <div className="mt-10">
            {newDepartments.map((dept, index) =>
                <DepartmentCardForSchool
                  key={dept.id}
                  department={dept}
                  onDelete = {() => handleDeleteDepartment('add',index)}
                  onUpdate = {(department) => handleUpdateDepartment('add',index,department)}
                  valid = {valid.newDepartments[index]}
                  disabled = {false}
                  mode = {'add'}
                />
            )}
          </div>
        </div>

        {/* ///////////............. Active Departments Section ...........////// */}
        {existingDepartments.length > 0 && 
        <div className="flex flex-col border border-gray-300 rounded-lg mt-10 p-4 relative">
        <div className="text-lg font-semibold ml-10">Active Departments</div> 
        <div className="mt-10">
          {existingDepartments.map((dept, index) =>
            dept.deleted == false && 
              <DepartmentCardForSchool
                key={dept.id}
                department={dept}
                onDelete = {() => handleDeleteDepartment('active',index)}
                onUpdate = {(department) => handleUpdateDepartment('active',index,department)}
                valid = {valid.existingDepartments[index]}
                disabled = {false}
                mode = {'active'}
              />
          )}
        </div>
      </div>}

        {/* ///////////............. Deleted Departments Section ...........////// */}
        {existingDepartments.length > 0 &&
        <div className="flex flex-col border border-gray-300 rounded-lg p-4 mt-10 relative">
        <div className="text-lg font-semibold ml-10">Deleted Departments</div>
        <div className="mt-10">
          {existingDepartments.map((dept, index) =>
            dept.deleted &&
              <DepartmentCardForSchool
                key={dept.id}
                department={dept}
                onDelete = {() => handleDeleteDepartment('active',index)}
                onUpdate = {(department) => handleUpdateDepartment('active',index,department)}
                valid = {valid.existingDepartments[index]}
                disabled = {true}
                mode = {'deleted'}
              />
          )}
        </div>
      </div>}

        <div className="flex justify-end space-x-4 mt-6">
          <CancelButton handleClick={() => console.log("Cancel")} />
          <UpdateButton handleClick={handleUpdateData} />
        
        </div>
      </main>
    </div>
  );
};

export default AddSchoolInfo;
