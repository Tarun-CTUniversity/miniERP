import React, { useEffect, useState } from "react";
import CustomDropDown from "../../../component/Inputs/CustomDropDown";
import CancelButton from "../../../component/Buttons/CancelButton";
import UpdateButton from "../../../component/Buttons/UpdateButton";
import ProgramCard from "./ProgramCard";
import axios from "axios";
import { HOST } from "../../../constants/Constants";
import { v4 as uuidv4 } from "uuid";

const PROGRAM_TYPE = ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate'];

export default function AddDepartmentInfo() {
  const [sessionData, setSessionData] = useState();
  const [data , setData] = useState({sessions:[] , schools:[] , departments:[]})
  const [session, setSession] = useState([]);
  const [school, setSchool] = useState([]);
  const [department, setDepartment] = useState([]);

  const [valid, setValid] = useState({
    session: "",
    school: "",
    department: "",
    existingPrograms: [],
    newPrograms: [],
  });

  const [existingPrograms, setExistingPrograms] = useState([]);
  const [newPrograms, setNewPrograms] = useState([]);

  useEffect(() => {
    getSessionData();
  }, []);

  const getSessionData = async () => {
    try {
      const resp = await axios.get(`${HOST}/api/v1/basicInfo/session/getSessionsData`);
      if (resp.status === 200 && resp.data?.data) {
        const val = resp.data.data;
        setSessionData(val);
        setData((prev) => ({
          ...prev,
          sessions: val.filter((s) => s.deleted === false).map((s) => s.name),
        }));
      } else {
        console.error("Unexpected response format:", resp);
        alert("Failed to fetch session data. Please try again later.");
      }
    } catch (err) {
      if (err.response) {
        // Server responded with a status code outside the 2xx range
        console.error("Server error:", err.response.data);
        alert(err.response.data.message || "Failed to fetch session data from the server.");
      } else if (err.request) {
        // Request was made but no response was received
        console.error("No response from server:", err.request);
        alert("No response from the server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        console.error("Error setting up request:", err.message);
        alert("An error occurred while fetching session data. Please try again.");
      }
    }
  };


  const handleSession = (val) => {
    if (data.sessions.includes(val)) {
      
      const selectedSession =  sessionData.find((session) => session.name === val);
      setSession(selectedSession);
      setData((prev)=>({...prev, schools:selectedSession.schools.filter((sch)=> sch.deleted === false).map(sc => sc.name)}))
      setValid((prev) => ({ ...prev, session: "" }));
    } else {
      setValid((prev) => ({ ...prev, session: "Please provide a valid session name" }));
    }
  };

  const handleSchool = (val) => {
    if (data.schools.includes(val)) {
      const selectedSchool = session.schools.find((sch) => sch.name === val)
      setSchool(selectedSchool);
      setData((prev)=>({...prev , departments:selectedSchool.departments.filter((dep)=> dep.deleted === false).map((dep)=>dep.name)}))
      setValid((prev) => ({ ...prev, school: "" }));
    } else {
      setValid((prev) => ({ ...prev, school: "Please provide a valid school name" }));
    }
  };

  const handleDepartment = (val) => {
    if (data.departments.includes(val)) {
      const selectedDepartment = school.departments.find((dep) => dep.name === val);
      setDepartment(selectedDepartment);
      setExistingPrograms(selectedDepartment.programs.map((prog)=>({ name: prog.name, code: prog.code, id: prog._id, deleted: prog.deleted , des: prog.description , duration: prog.duration , type: prog.degreeType})));
      setValid((prev) => ({ ...prev, department: "", existingPrograms: selectedDepartment.programs.map(() => ({ name: "", code: "" , type:"" , duration:""})) }));
    } else {
      setValid((prev) => ({ ...prev, department: "Please provide a valid department name" }));
    }
  };

  const addNewProgram = () => {
    const newProgram = { name: "", code: "", des: "", id: uuidv4() , duration:"", type: PROGRAM_TYPE[0] };
    setNewPrograms((prev) => [...prev, newProgram]);
    setValid((prev) => ({
      ...prev,
      newPrograms: [...prev.newPrograms, { name: "", code: "" ,duration:"", type: "" }],
    }));
  };

  const handleDeleteProgram = (mode, index) => {
    if (mode === "add") {
      setNewPrograms((prev) => prev.filter((_, i) => i !== index));
      setValid((prev) => ({
        ...prev,
        newPrograms: prev.newPrograms.filter((_, i) => i !== index),
      }));
    } else {
      const updatedPrograms = [...existingPrograms];
      updatedPrograms[index].deleted = !updatedPrograms[index].deleted; // Toggle deleted status
      setExistingPrograms(updatedPrograms);
    }
  };

  const handleUpdateProgram = (mode, index, program) => {
    if (mode === "add") {
      const updatedPrograms = [...newPrograms];
      updatedPrograms[index] = program;
      setNewPrograms(updatedPrograms);
    } else {
      const updatedPrograms = [...existingPrograms];
      updatedPrograms[index] = program;
      setExistingPrograms(updatedPrograms);
    }
  };


  const validatePrograms = () => {
  let hasError = false;

  // Create sets to track duplicates
  const seenNames = new Set();
  const seenCodes = new Set();

  // Validate new programs
  const newProgramValidations = newPrograms.map((program) => {
    const validation = {
      name: "",
      code: "",
      type: "",
      duration: "",
    };

    // Check if name is provided
    if (!program.name) {
      validation.name = "Name is required";
      hasError = true;
    } else if (seenNames.has(program.name.toLowerCase())) {
      validation.name = "Duplicate name found";
      hasError = true;
    } else {
      seenNames.add(program.name.toLowerCase());
    }

    // Check if code is provided and is a number
    if (!program.code) {
      validation.code = "Code is required";
      hasError = true;
    } else if (seenCodes.has(program.code)) {
      validation.code = "Duplicate code found";
      hasError = true;
    } else {
      seenCodes.add(program.code);
    }

    // Check if type is valid
    if (!program.type) {
      validation.type = "Type is required";
      hasError = true;
    } else if (!PROGRAM_TYPE.includes(program.type)) {
      validation.type = `Type must be one of: ${PROGRAM_TYPE.join(", ")}`;
      hasError = true;
    }

    // Check if duration is provided
    if (!program.duration) {
      validation.duration = "Duration is required";
      hasError = true;
    }else if (isNaN(program.duration)) {
      validation.duration = "Duration must be a number";
      hasError = true;
    }
    
    return validation;
  });

  // Validate existing programs
  const existingProgramValidations = existingPrograms.map((program) => {
    const validation = {
      name: "",
      code: "",
      type: "",
      duration: "",
    };

    // Check if name is provided
    if (!program.name) {
      validation.name = "Name is required";
      hasError = true;
    } else if (seenNames.has(program.name.toLowerCase())) {
      validation.name = "Duplicate name found";
      hasError = true;
    } else {
      seenNames.add(program.name.toLowerCase());
    }

    // Check if code is provided and is a number
    if (!program.code) {
      validation.code = "Code is required";
      hasError = true;
    } else if (seenCodes.has(program.code)) {
      validation.code = "Duplicate code found";
      hasError = true;
    } else {
      seenCodes.add(program.code);
    }

    // Check if type is valid
    if (!program.type) {
      validation.type = "Type is required";
      hasError = true;
    } else if (!PROGRAM_TYPE.includes(program.type)) {
      validation.type = `Type must be one of: ${PROGRAM_TYPE.join(", ")}`;
      hasError = true;
    }

    // Check if duration is provided
    if (!program.duration) {
      validation.duration = "Duration is required";
      hasError = true;
    }else if (isNaN(program.duration)) {
      validation.duration = "Duration must be a number";
      hasError = true;
    } 
    return validation;
  });

  // Update validation state
  setValid((prev) => ({
    ...prev,
    newPrograms: newProgramValidations,
    existingPrograms: existingProgramValidations,
  }));

  return hasError;
};

const updateInputData = (fetched)=>{
  const updated_data = fetched.sessions;
  const updated_session = updated_data.find((s) => s._id === session._id);
  const updated_school = updated_session.schools.find((sc) => sc._id === school._id);
  const updated_department = updated_school.departments.find((dep) => dep._id === department._id);
  setSessionData(updated_data)
  setSession(updated_session)
  setSchool(updated_school)
  setDepartment(updated_department)

}

const handleUpdateData = async () => {
  const error = validatePrograms();
  if (error) {
    alert("Please fix the errors before updating.");
    return;
  }


  const data = {
    session: session._id,
    school: school._id,
    department: department._id,
    existingPrograms,
    newPrograms,
  };

  try {
    const response = await axios.put(`${HOST}/api/v1/basicInfo/department/updatePrograms`, data);

    if (response.status === 200 && response.data?.data) {
      alert("Programs updated successfully");

      const fetched = response.data.data;
      // Map the fetched programs to update the state
      setExistingPrograms(
        fetched.programs.map((prog) => ({
          name: prog.name,
          code: prog.code,
          id: prog._id,
          deleted: prog.deleted,
          des: prog.description,
          duration: prog.duration,
          type: prog.degreeType,
        }))
      );

      updateInputData(fetched);
      // Clear new programs and reset validation
      setNewPrograms([]);
      setValid((prev) => ({
        ...prev,
        newPrograms: [],
        existingPrograms: fetched.programs.map(() => ({
          name: "",
          code: "",
          duration: "",
          type: "",
        })),
      }));

    } else {
      console.error("Unexpected response format:", response);
      alert("Failed to update programs. Please try again.");
    }
  } catch (error) {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error("Server error:", error.response.data);
      alert(error.response.data.message || "Failed to update programs. Please try again.");
    } else if (error.request) {
      // Request was made but no response was received
      console.error("No response from server:", error.request);
      alert("No response from the server. Please check your connection.");
    } else {
      // Something happened in setting up the request
      console.error("Error setting up request:", error.message);
      alert("An error occurred while updating programs. Please try again.");
    }
  }
};
  
  const printData = () => {
    console.log("Session Data: ", sessionData);
    console.log("Data:", data);
    console.log("Session:", session);
    console.log("School:", school);
    console.log("Department:", department);
    console.log("Existing Programs:", existingPrograms);
    console.log("New Programs:", newPrograms);
    console.log("Validations:", valid);
  }
  return (
    <div className="bg-gray-50 flex flex-col">
      <header className="p-6 bg-blue-500 text-white text-center text-2xl font-bold" onClick={printData}>
        Add Department Info
      </header>

      <main className="flex-1 p-6">
        <div className="mb-6">
          <div className="flex gap-4">
            <CustomDropDown
              name="Session"
              options={data.sessions}
              handleChange={(n, val) => handleSession(val)}
              valid={valid.session}
            />
             <CustomDropDown
              name="School"
              options={data.schools}
              handleChange={(n, val) => handleSchool(val)}
              valid={valid.school}
            />

            
            <CustomDropDown
              name="Department"
              options={data.departments}
              handleChange={(n, val) => handleDepartment(val)}
              valid={valid.department}
            />
          </div>
        </div>

         <div className="flex flex-col border border-gray-300 rounded-lg p-4 relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={addNewProgram}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              + Add Program
            </button>
          </div>

          <div className="mt-10">
            {newPrograms.map((prog, index) => (
              <ProgramCard
                key={prog.id}
                program={prog}
                onDelete={() => handleDeleteProgram("add", index)}
                onUpdate={(program) => handleUpdateProgram("add", index, program)}
                valid={valid.newPrograms[index]}
                disabled={false}
                mode="add"
              />
            ))}
          </div>
        </div>

            
        {existingPrograms.length > 0 && (
          <div className="flex flex-col border border-gray-300 rounded-lg mt-10 p-4 relative">
            <div className="text-lg font-semibold ml-10">Active Programs</div>
            <div className="mt-10">
              {existingPrograms.map(
                (prog, index) =>
                  !prog.deleted && (
                    <ProgramCard
                      key={prog.id}
                      program={prog}
                      onDelete={() => handleDeleteProgram("active", index)}
                      onUpdate={(program) => handleUpdateProgram("active", index, program)}
                      valid={valid.existingPrograms[index]}
                      disabled={false}
                      mode="active"
                    />
                  )
              )}
            </div>
          </div>
        )}

        {existingPrograms.length > 0 && (
          <div className="flex flex-col border border-gray-300 rounded-lg p-4 mt-10 relative">
            <div className="text-lg font-semibold ml-10">Deleted Programs</div>
            <div className="mt-10">
              {existingPrograms.map(
                (prog, index) =>
                  prog.deleted && (
                    <ProgramCard
                      key={prog.id}
                      program={prog}
                      onDelete={() => handleDeleteProgram("deleted", index)}
                      onUpdate={(program) => handleUpdateProgram("deleted", index, program)}
                      valid={valid.existingPrograms[index]}
                      disabled={true}
                      mode={"deleted"}
                    />
                  )
              )}
            </div>
          </div>
        )}
       
        <div className="flex justify-end space-x-4 mt-6">
          <CancelButton handleClick={() => console.log("Cancel")} />
          <UpdateButton handleClick={handleUpdateData} />
        </div> 
      </main>
    </div>
  );
}