import React, { useEffect, useState } from 'react';
import CustomInput from '../../../component/Inputs/CustomInput';
import CustomDropDown from '../../../component/Inputs/CustomDropDown';
import CancelButton from '../../../component/Buttons/CancelButton';
import CreateButton from '../../../component/Buttons/CreateButton';
import SchoolCardForSession from './SchoolCardForSession';
import axios from 'axios';
const CreateSession = () => {
  const SESSION_OPTIONS = ["Jan-June", "Sep-Dec"];
  const [session, setSession] = useState("Jan-June");
  const [year, setYear] = useState('2025');
  const [valid, setValid] = useState({ year: '', session: '' , schools : []});
  const [schools, setSchools] = useState([]);

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
      if (normalizedName === ''){
        validData.name = "Empty Name";
        error = true;
      }
      else{
        if(seenNames.has(normalizedName)){
          validData.name = "Duplicate Name";
          error = true;
        }
        else{
          validData.name = "";
          seenNames.add(normalizedName);
        }
      }
      // Check Codes
      if(normalisedCode === ''){
        validData.code = "Empty Code";
        error = true;
      }
      else{
        if(seenCodes.has(normalisedCode)){
          validData.code = "Duplicate Code";
          error = true;
        }
        else{
          seenCodes.add(normalisedCode);
          validData.code = "";
        }
      }

      newValidSchools.push(validData);
      
    });

    setValid((prev)=>({...prev , schools:newValidSchools}));
    return error;
  };


  const handleCreate = async () => {
    const isError = validateSchoolData();
    
    if (isError) {
      alert("Please clear all the errors before submission");
      return;
    }
    
    try {
      const response = await axios.post("http://localhost:4000/api/v1/basicInfo/session", {
        name: year + "," + session,
        schools: schools
      });
      
      // Handle successful response
      alert("Session has been created successfully");
      console.log("Success:", response.data);
      
    } catch (err) {
      // Handle error response
      if (err.response) {
        // The server responded with a status code outside the 2xx range
        const errorMessage = err.response.data.message || "Failed to create session";
        alert(`Error: ${errorMessage}`);
        console.error("Server error:", err.response.data);
      } else if (err.request) {
        // The request was made but no response was received
        alert("No response from server. Please check your connection and try again.");
        console.error("Request error:", err.request);
      } else {
        // Something happened in setting up the request
        alert("Failed to send request. Please try again later.");
        console.error("Request setup error:", err.message);
      }
    }
  };

  const handleYear=(value) =>{
    setYear(value);
    if(value.length == 4){
      setValid((prev)=>({...prev , year : ""}))
    }else{
      setValid((prev)=>({...prev , year : "Please give proper Year"}))
    }
  }
  const handleSession = (val) =>{
    
    if(SESSION_OPTIONS.includes(val)){
      setSession(val);
      setValid((prev)=>({...prev,session:""}))
    }else{
      setValid((prev)=>({...prev,session:"Please provide proper session Name"}))
    }
  }

  // Add a new school card
  const handleAddSchool = () => {
    const newSchool = { name: '', code: '', des: '' };
    setSchools((prevSchools) => [...prevSchools, newSchool]);

    const valid_schools = [...valid.schools , {"name" : "" , "code":""}]
    setValid((prev)=>({...prev,schools:valid_schools}));
  };

  // Update a school in the list
  const handleUpdateSchool = (index, updatedSchool) => {
    setSchools((prevSchools) => {
      const updatedSchools = [...prevSchools];
      updatedSchools[index] = updatedSchool;
      return updatedSchools;
    });
  };

  // Delete a school from the list
  const handleDeleteSchool = (index) => {
    setSchools((prevSchools) => prevSchools.filter((_, i) => i !== index));
    const validSchools = valid.schools.filter((_, i) => i !== index);
    setValid((prev)=>({...prev , schools:validSchools}));
  };

  return (
    <div className="bg-gray-50 flex flex-col">
      <header className="p-6 bg-blue-500 text-white text-center text-2xl font-bold">
        Create Session
      </header>

      <main className="flex-1 p-6">
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2" htmlFor="sessionName">
            Session Name
          </label>
          <div className='flex'>
            <CustomInput
              name="Year"
              type="number"
              placeholder="Give Session Year"
              handleChange={(n, value) => handleYear(value)}
              valid={valid.year}
            />

            <CustomDropDown
              name="Session"
              options={SESSION_OPTIONS}
              handleChange={(n, val) => handleSession(val)}
              valid={valid.session}
            />
          </div>
        </div>

        <div className="flex flex-col flex-1 border border-gray-300 rounded-lg p-4 relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={handleAddSchool}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              + Add School
            </button>
          </div>

          <div className="mt-10">
            {schools.map((school, index) => (
              <SchoolCardForSession
                key={index}
                school={school}
                onDelete={() => handleDeleteSchool(index)}
                onUpdate={(updatedSchool) => handleUpdateSchool(index, updatedSchool)}
                valid = {valid.schools[index]}
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

export default CreateSession;