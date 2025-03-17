import React, { useEffect, useState } from "react";

import CustomInput from "../../../component/Inputs/CustomInput";
import CustomDropDown from "../../../component/Inputs/CustomDropDown";
import CancelButton from "../../../component/Buttons/CancelButton";
import CreateButton from "../../../component/Buttons/CreateButton";
import CreateSession from "../SessionPages/CreateSession";
import DepartmentCardForSchool from "./DepartmentCardForSchool";
import axios from "axios";
import { HOST } from "../../../constants/Constants";

const AddSchoolInfo = () => {
  const [sessionData , setSessionData] = useState({SESSION:[] ,SCHOOLS : []});
  const [session, setSession] = useState("");
  const [school,setSchool] = useState("")
  const [valid, setValid] = useState({ school: "", session: "", departments: [] });
  const [departments, setDepartments] = useState([]);

  const getSessionNames = async() =>{
    try{
      const resp = await axios.get(`${HOST}/api/v1/basicInfo/session/getSessionNames`);
      setSessionData((prev) =>({...prev , SESSION:resp.data.data.map((data)=>data.name)}));
    }catch(err){
      alert("Server Not working Properly");
      console.log(err);
    }
  }

  const getSchoolNames = async(name) =>{
    try{
      const resp = await axios.get(`${HOST}/api/v1/basicInfo/session/getSessionByName/${name}`);
      setSessionData((prev)=> ({...prev , SCHOOLS : resp.data.data.schools.map((school)=> school.name)}))
    }catch(err){
      alert("Server Not working Properly");
      console.log(err);
    }
  }

  const getDepartments = async(name) =>{
    try{
      const resp = await axios.get(`${HOST}/api/v1/basicInfo/department/getDepartmentNames/${session + "_" + name}`);
      // setSessionData((prev) =>({...prev , SESSION:resp.data.data.map((data)=>data.name)}));
      console.log(resp.data);
    }catch(err){
      alert("Server Not working Properly");
      console.log(err);
    }
  }

  const handleSession = (val) => {
    if (sessionData.SESSION.includes(val)) {
      setSession(val);
      setValid((prev) => ({ ...prev, session: "" }));
      getSchoolNames(val);
    } else {
      setValid((prev) => ({
        ...prev,
        session: "Please provide proper session Name",
      }));
    }
  };

  const handleSchool = (val) =>{
    if(sessionData.SCHOOLS.includes(val)){
      setSchool(val);
      setValid((prev)=>({...prev,school:""}))
      getDepartments(val);
    }else{
      setValid((prev) => ({
        ...prev,
        session: "Please provide proper School Name",
      }));
    }
  }

  useEffect(()=>{
    getSessionNames();
  },[])

  useEffect(()=>{
    console.log(departments);
    console.log(valid)
  })

  


 
  

  const validateSchoolData = () => {
    // Here just before submiting data we will validate all the data and check if school names / Codes are non Empty and Non Duplicate
    const seenNames = new Set();
    const seenCodes = new Set();
    let error = false;
    const newValidSchools = [];

    schools.forEach((school, index) => {
      const normalizedName = school.name.trim().toLowerCase();
      const normalisedCode = school.code.trim().toLowerCase();
      const validData = valid.schools[index];

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
      // Check Codes
      if (normalisedCode === "") {
        validData.code = "Empty Code";
        error = true;
      } else {
        if (seenCodes.has(normalisedCode)) {
          validData.code = "Duplicate Code";
          error = true;
        } else {
          seenCodes.add(normalisedCode);
          validData.code = "";
        }
      }

      newValidSchools.push(validData);
    });

    setValid((prev) => ({ ...prev, schools: newValidSchools }));
    return error;
  };

  const handleCreate = async () => {
    const isError = validateSchoolData();

    if (isError) {
      alert("Please clear all the errors before submission");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/basicInfo/session",
        {
          name: year + "," + session,
          schools: schools,
        }
      );

      // Handle successful response
      alert("Session has been created successfully");
      console.log("Success:", response.data);
    } catch (err) {
      // Handle error response
      if (err.response) {
        // The server responded with a status code outside the 2xx range
        const errorMessage =
          err.response.data.message || "Failed to create session";
        alert(`Error: ${errorMessage}`);
        console.error("Server error:", err.response.data);
      } else if (err.request) {
        // The request was made but no response was received
        alert(
          "No response from server. Please check your connection and try again."
        );
        console.error("Request error:", err.request);
      } else {
        // Something happened in setting up the request
        alert("Failed to send request. Please try again later.");
        console.error("Request setup error:", err.message);
      }
    }
  };


  

  // Add a new school card
  const handleAddDepartment = () => {
    const newDepartment= { name: "", code: "", des: "" };
    setDepartments((prev) => [...prev, newDepartment]);

    const valid_Departments = [...valid.departments , { name: "", code: "" }];
    setValid((prev) => ({ ...prev, departments: valid_Departments }));
  };

  // Update a school in the list
  const handleUpdateDepartment = (index, newDepartment) => {
    setDepartments((prev) => {
      // const updated = [...prev];
      prev[index] = newDepartment;
      return prev;
    });
  };

  // Delete a school from the list
  const handleDeleteDepartment = (index) => {
    setDepartments((prev) => prev.filter((_, i) => i !== index));

    const validSchools = valid.departments.filter((_, i) => i !== index);
    setValid((prev) => ({ ...prev, departments: validSchools }));
  };

  return (
    <div className="bg-gray-50 flex flex-col">
      <header className="p-6 bg-blue-500 text-white text-center text-2xl font-bold">
        Add School Info
      </header>

      <main className="flex-1 p-6">
        <div className="mb-6">
          <label
            className="block text-lg font-semibold mb-2"
            htmlFor="sessionName"
          >
            Session Name
          </label>
          <div className="flex">
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
              valid={valid.session}
            />
          </div>
        </div>

        <div className="flex flex-col flex-1 border border-gray-300 rounded-lg p-4 relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={handleAddDepartment}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              + Add Department
            </button>
          </div>

          <div className="mt-10">
            {departments.map((department, index) => (
              <DepartmentCardForSchool
                key={index}
                department={department}
                onDelete={() => handleDeleteDepartment(index)}
                onUpdate={(updatedDepartment) =>
                  handleUpdateDepartment(index, updatedDepartment)
                }
                valid={valid.departments[index]}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <CancelButton handleClick={() => console.log("Cancel")} />
          <CreateButton handleClick={() => handleCreate()} />
        </div>
      </main>
    </div>
  );
};

export default AddSchoolInfo ;
