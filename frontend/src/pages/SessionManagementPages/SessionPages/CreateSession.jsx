// On selection of Year and Session
// 1. Check if Session Exists then send the data
// 2. If not then create a new session with the given name and schools
// 3. Modify or Create the session based on if session Exist or not


import React, { useEffect, useState } from 'react';
import CustomInput from '../../../component/Inputs/CustomInput';
import CustomDropDown from '../../../component/Inputs/CustomDropDown';
import CancelButton from '../../../component/Buttons/CancelButton';
import CreateButton from '../../../component/Buttons/CreateButton';
import SchoolCardForSession from './SchoolCardForSession';
import axios from 'axios';
import { HOST } from '../../../constants/Constants';
import { v4 as uuidv4 } from 'uuid';
import UpdateButton from '../../../component/Buttons/UpdateButton';


const CreateSession = () => {
  const SESSION_OPTIONS = ["Jan-June", "Sep-Dec"];
  const [QueryType,setQueryType] = useState("create");
  const [session, setSession] = useState("");
  const [year, setYear] = useState('');
  const [valid, setValid] = useState({ year: '', session: '' , addedSchools : [] , existingSchools : []});
  const [addedSchools, setAddedSchools] = useState([]);
  const [existingSchools, setExistingSchools] = useState([]);


  const validateSchoolData = () => {
    
    // Here just before submiting data we will validate all the data and check if school names / Codes are non Empty and Non Duplicate
    const seenNames = new Set();
    const seenCodes = new Set();
    let error = false;
    const newValidSchools = [];

    const checkSchools=(schools , SchoolType)=>{
      schools.forEach((school, index) => {
        const normalizedName = school.name.trim().toLowerCase();
        const normalisedCode = school.code.trim().toLowerCase();
        const validData = valid[SchoolType][index];
        
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
  
      setValid((prev)=>({...prev , [SchoolType]:newValidSchools}));
      return error;
    }

    return checkSchools(addedSchools , "addedSchools") && checkSchools(existingSchools , "existingSchools");
    
  };


  const handleCreate = async () => {

    const isError = validateSchoolData();
    
    if (isError) {
      alert("Please clear all the errors before submission");
      return;
    }
    
    try {
      const response = await axios.post(`${HOST}/api/v1/basicInfo/session`, {
        name: year + "," + session,
        schools: addedSchools
      });
      
      // Handle successful response
      alert("Session has been created successfully");
      console.log("Success:", response.data);
      setAddedSchools([]);
      setExistingSchools(response.data.data.schools.map((school) => ({ id: school._id, name: school.name, code: school.code, des: school.description , deleted: school.deleted })));
      const newValidSchools = response.data.data.schools.map((school) => ({ "name": "", "code": "" }));
      setValid((prev) => ({ ...prev,addedSchools:[] ,existingSchools: newValidSchools }));
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

  const handleUpdate = async() =>{
    const isError = validateSchoolData();
    
    if (isError) {
      alert("Please clear all the errors before submission");
      return;
    }
    
    try {
      const response = await axios.put(`${HOST}/api/v1/basicInfo/session`, {
        name: year + "," + session,
        existingSchools: existingSchools,
        addedSchools: addedSchools
      });
      
      // Handle successful response
      alert("Session has been created successfully");
      const newSchools = response.data.data.schools.map((school) => ({ id: school._id, name: school.name, code: school.code, des: school.description , deleted: school.deleted }));
      setExistingSchools(newSchools);
      setAddedSchools([]);
      const newValidSchools = response.data.data.schools.map((school) => ({ "name": "", "code": "" }));
      setValid((prev) => ({ ...prev, addedSchools:[] , existingSchools: newValidSchools }));
      console.log("Response after update : " , response.data.data.schools)
      
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
      } else{
        // Something happened in setting up the request
        alert("Failed to send request. Please try again later.");
        console.error("Request setup error:", err.message);
      }
    }
  }

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
    const newSchool = {id: uuidv4(), name: '', code: '', des: '',deleted : false };
    setAddedSchools((prevSchools) => [...prevSchools, newSchool]);

    const added_schools_valid = [...valid.addedSchools , {"name" : "" , "code":""}]
    setValid((prev)=>({...prev,addedSchools:added_schools_valid}));
  };

  // Update a school in the list
  const handleUpdateSchool = (mode = 'add',index, updatedSchool) => {
    if(mode == "add"){
      setAddedSchools((prevSchools) => {
        const updatedSchools = [...prevSchools];
        updatedSchools[index] = updatedSchool;
        return updatedSchools;
      });
    }
    else if(mode == 'active'){
      setExistingSchools((prevSchools) => {
        const updatedSchools = [...prevSchools];
        updatedSchools[index] = updatedSchool;
        return updatedSchools;
      });
    }
  };

  // Delete a school from the list
  const handleDeleteSchool = (mode = 'add',index) => {
    if(mode == "add"){
      setAddedSchools((prevSchools) => prevSchools.filter((_, i) => i !== index));
      const validSchools = valid.addedSchools.filter((_, i) => i !== index);
      setValid((prev)=>({...prev , addedSchools:validSchools}));
    }
    else{
      const changed_school = existingSchools[index];
      changed_school.deleted = !changed_school.deleted;
      setExistingSchools((prevSchools) => {
        const updatedSchools = [...prevSchools];
        updatedSchools[index] = changed_school;
        return updatedSchools;
      });
    }
  };

  // get data of all the schools if session already exists
  const getSessionData = async (sessionName) => {
    try {
      const response = await axios.get(`${HOST}/api/v1/basicInfo/session/getSessionByName/${sessionName}`);
      if(response.data.data){
        const schoolData = response.data.data.schools.map((school) => ({ id: school._id, name: school.name, code: school.code, des: school.description,deleted:school.deleted }));
        setExistingSchools(schoolData);
        setQueryType("update");
        const valid_schools = response.data.data.schools.map((school) => ({ "name": "", "code": "" }));
        setValid((prev) => ({ ...prev, existingSchools: valid_schools }));
        
      }
      
      
    } catch (error) {
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        const errorMessage = error.response.data.message || "Failed to fetch session data";
        if(errorMessage === "Session not found"){
          setQueryType("create");
          return;
        } 
        alert(`Error: ${errorMessage}`);
        console.error("Server error:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        alert("No response from server. Please check your connection and try again.");
        console.error("Request error:", error.request);
      } else {
        // Something happened in setting up the request
        alert("Failed to send request. Please try again later.");
        console.error("Request setup error:", error.message);
      }
    }
  };

  useEffect(() => {
    
    if (year.length === 4 && session !== ''){
      // Check if the session already exists
      const sessionName = `${year},${session}`;
      getSessionData(sessionName);
    }
  }, [year, session]);

  const printData = () => {
    console.log("Existing Schools" , existingSchools)
    console.log("Added Schools", addedSchools);
    console.log("Valid : " , valid)
  }
 

  return (
    <div className="bg-gray-50 flex flex-col">
      <header className="p-6 bg-blue-500 text-white text-center text-2xl font-bold" onClick={printData}>
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

        {/* /////////.........................Added Schools Section................../////////// */}

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
            {addedSchools.map((school, index) =>
              !school.deleted ? (
                <SchoolCardForSession
                  key={school.id}
                  school={school}
                  onDelete={() => handleDeleteSchool('add',index)}
                  onUpdate={(updatedSchool) => handleUpdateSchool('add',index, updatedSchool)}
                  valid={valid.addedSchools[index]}
                  deleted={false}
                  mode={'add'}
                />
              ) : null
            )}
          </div>
        </div>

            {/* //////////.........................Existing Schools Section................../////////// */}

        {
          existingSchools.length > 0 && 
            <div className="flex flex-col flex-1 border border-gray-300 rounded-lg p-4 relative mt-6">
            <div className="text-lg font-semibold ml-10">Active Schools in Current Session</div>      
            <div className="mt-10">
              {existingSchools.map((school, index) =>
                !school.deleted ? (
                  <SchoolCardForSession
                    key={school.id}
                    school={school}
                    onDelete={() => handleDeleteSchool('active',index)}
                    onUpdate={(updatedSchool) => handleUpdateSchool('active',index, updatedSchool)}
                    valid={valid.existingSchools[index]}
                    deleted={false}
                  />
                ) : null
              )}
            </div>
          </div>
        }

            {/* ///////////////.........................Deleted Schools Section................../////////// */}

        {/* Deleted Schools Section */}
        {
          existingSchools.length > 0 &&
          <div className="flex flex-col flex-1 border border-gray-300 rounded-lg p-4 relative mt-6">
          <div className="text-lg font-semibold ml-10">Deleted Schools</div>

          <div className="mt-10">
            {existingSchools.map((school, index) =>
              school.deleted ? (
                <SchoolCardForSession
                  key={school.id}
                  school={school}
                  onDelete={() => handleDeleteSchool('deleted',index)}
                  onUpdate={(updatedSchool) => handleUpdateSchool('deleted',index, updatedSchool)}
                  valid={valid.existingSchools[index]}
                  deleted={true}
                  disabled={true}
                  mode = {"deleted"}
                />
              ) : null
            )}
          </div>
        </div>
        }


        

        <div className="flex justify-end space-x-4 mt-6">
          <CancelButton handleClick={() => console.log("Cancel")} />
          {
            QueryType === "create" ? (
              <CreateButton handleClick={handleCreate} />
            ) : (
              <UpdateButton handleClick={handleUpdate} />
            )
          }
        </div>
      </main>
    </div>
  );
};

export default CreateSession;