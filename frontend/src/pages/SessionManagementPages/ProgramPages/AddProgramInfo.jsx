import React, { useEffect, useState } from "react";
import CustomDropDown from "../../../component/Inputs/CustomDropDown";
import CancelButton from "../../../component/Buttons/CancelButton";
import UpdateButton from "../../../component/Buttons/UpdateButton";
import SpecializationCard from "./SpecializationCard";
import axios from "axios";
import { HOST } from "../../../constants/Constants";
import { v4 as uuidv4 } from "uuid";


export default function AddProgramInfo() {
  const [sessionData, setSessionData] = useState();
  const [data , setData] = useState({sessions:[] , schools:[] , departments:[] , programs : []})
  const [session, setSession] = useState([]);
  const [school, setSchool] = useState([]);
  const [department, setDepartment] = useState([]);
  const [program, setProgram] = useState([]);

  const [valid, setValid] = useState({
    session: "",
    school: "",
    department: "",
    program:"",
    existingSpec: [],
    newSpec: [],
  });

  const [existingSpec, setExistingSpec] = useState([]);
  const [newSpec, setNewSpec] = useState([]);

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
      setData((prev)=>({...prev , programs:selectedDepartment.programs.filter((prog)=> prog.deleted === false).map((prog)=>prog.name)}))
      setValid((prev) => ({ ...prev, department: ""}));
    } else {
      setValid((prev) => ({ ...prev, department: "Please provide a valid department name" }));
    }
  };

  const handleProgram = (val) =>{
    if(data.programs.includes(val)){
        const selectedProgram = department.programs.find((prog) => prog.name === val);
        setProgram(selectedProgram);
        setValid((prev) => ({ ...prev, program: "" }));
        setExistingSpec(
          selectedProgram.specializations.map((spec) => ({
            name: spec.name,
            code: spec.code,
            id: spec._id,
            deleted: spec.deleted,
            des: spec.description,
          }))
        );
    }
  }

  const addNewSpecialization = () => {
    const newSpeci = { name: "", code: "", des: "", id: uuidv4() };
    setNewSpec((prev) => [...prev, newSpeci]);
    setValid((prev) => ({
      ...prev,
      newSpec: [...prev.newSpec, { name: "", code: ""}],
    }));
  };

  const handleDeleteSpec = (mode, index) => {
    if (mode === "add") {
      setNewSpec((prev) => prev.filter((_, i) => i !== index));
      setValid((prev) => ({
        ...prev,
        newSpec: prev.newSpec.filter((_, i) => i !== index),
      }));
    } else {
      const updatedSpec= [...existingSpec];
      updatedSpec[index].deleted = !updatedSpec[index].deleted; // Toggle deleted status
      setExistingSpec(updatedSpec);
    }
  };

  const handleUpdateSpec = (mode, index, spec) => {
    if (mode === "add") {
      const updatedSpec = [...newSpec];
      updatedSpec[index] = spec;
      setNewSpec(updatedSpec);
    } else {
      const updatedSpec = [...existingSpec];
      updatedSpec[index] = spec;
      setExistingSpec(updatedSpec);
    }
  };


const validateSpec = () => {
    let hasError = false;
  
    // Create sets to track duplicates
    const seenNames = new Set();
    const seenCodes = new Set();
  
    // Validate new specializations
    const newSpecValidations = newSpec.map((spec) => {
      const validation = {
        name: "",
        code: "",
      };
  
      // Check if name is provided
      if (!spec.name) {
        validation.name = "Name is required";
        hasError = true;
      } else if (seenNames.has(spec.name.toLowerCase())) {
        validation.name = "Duplicate name found";
        hasError = true;
      } else {
        seenNames.add(spec.name.toLowerCase());
      }
  
      // Check if code is provided
      if (!spec.code) {
        validation.code = "Code is required";
        hasError = true;
      } else if (seenCodes.has(spec.code)) {
        validation.code = "Duplicate code found";
        hasError = true;
      } else {
        seenCodes.add(spec.code);
      }
  
      return validation;
    });
  
    // Validate existing specializations
    const existingSpecValidations = existingSpec.map((spec) => {
      const validation = {
        name: "",
        code: "",
      };
  
      // Check if name is provided
      if (!spec.name) {
        validation.name = "Name is required";
        hasError = true;
      } else if (seenNames.has(spec.name.toLowerCase())) {
        validation.name = "Duplicate name found";
        hasError = true;
      } else {
        seenNames.add(spec.name.toLowerCase());
      }
  
      // Check if code is provided
      if (!spec.code) {
        validation.code = "Code is required";
        hasError = true;
      } else if (seenCodes.has(spec.code)) {
        validation.code = "Duplicate code found";
        hasError = true;
      } else {
        seenCodes.add(spec.code);
      }
  
      return validation;
    });
  
    // Update validation state
    setValid((prev) => ({
      ...prev,
      newSpec: newSpecValidations,
      existingSpec: existingSpecValidations,
    }));
  
    return hasError;
  };

  const updateInputData = (fetched) => {
    const updatedData = fetched.sessions;
    const updatedSession = updatedData.find((s) => s._id === session._id);
    const updatedSchool = updatedSession.schools.find((sc) => sc._id === school._id);
    const updatedDepartment = updatedSchool.departments.find((dep) => dep._id === department._id);
    const updatedProgram = updatedDepartment.programs.find((prog) => prog._id === program._id);
  
    setSessionData(updatedData);
    setSession(updatedSession);
    setSchool(updatedSchool);
    setDepartment(updatedDepartment);
    setProgram(updatedProgram);
  };

const handleUpdateData = async () => {
  const error = validateSpec();
  if (error) {
    alert("Please fix the errors before updating.");
    return;
  }


  const data = {
    session: session._id,
    school: school._id,
    department: department._id,
    program:program._id,
    existingSpec,
    newSpec,
  };

  try {
    const response = await axios.put(`${HOST}/api/v1/basicInfo/program/updateSpecialization`, data);

    if (response.status === 200 && response.data?.data) {
      alert("Programs updated successfully");

      const fetched = response.data.data;
      // Map the fetched programs to update the state
      setExistingSpec(
        fetched.specs.map((spec) => ({
          name: spec.name,
          code: spec.code,
          id: spec._id,
          deleted: spec.deleted,
          des: spec.description,
          duration: spec.duration,
          type: spec.degreeType,
        }))
      );

      updateInputData(fetched);
      // Clear new programs and reset validation
      setNewSpec([]);
      setValid((prev) => ({
        ...prev,
        newSpec: [],
        existingSpec: fetched.specs.map(() => ({
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
    console.group("Debugging Data");
    console.log("Session Data:", sessionData);
    console.log("Dropdown Options Data:", data);
    console.log("Selected Session:", session);
    console.log("Selected School:", school);
    console.log("Selected Department:", department);
    console.log("Selected Program:", program);
    console.log("Existing Specializations:", existingSpec);
    console.log("New Specializations:", newSpec);
    console.log("Validation State:", valid);
    console.groupEnd();
  };
  return (
    <div className="bg-gray-50 flex flex-col">
      <header className="p-6 bg-blue-500 text-white text-center text-2xl font-bold" onClick={printData}>
        Add Program Info
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

            <CustomDropDown
              name="Program"
              options={data.programs}
              handleChange={(n, val) => handleProgram(val)}
              valid={valid.program}
            />
          </div>
        </div>

         <div className="flex flex-col border border-gray-300 rounded-lg p-4 relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={addNewSpecialization}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              + Add Specialization
            </button>
          </div>

          <div className="mt-10">
            {newSpec.map((sp, index) => (
              <SpecializationCard
                key={sp.id}
                specialization={sp}
                onDelete={() => handleDeleteSpec("add", index)}
                onUpdate={(spec) => handleUpdateSpec("add", index, spec)}
                valid={valid.newSpec[index]}
                disabled={false}
                mode="add"
              />
            ))}
          </div>
        </div>

            
        {existingSpec.length > 0 && (
          <div className="flex flex-col border border-gray-300 rounded-lg mt-10 p-4 relative">
            <div className="text-lg font-semibold ml-10">Active Programs</div>
            <div className="mt-10">
              {existingSpec.map(
                (sp, index) =>
                  !sp.deleted && (
                    <SpecializationCard
                      key={sp.id}
                      specialization={sp}
                      onDelete={() => handleDeleteSpec("active", index)}
                      onUpdate={(spec) => handleUpdateSpec("active", index, spec)}
                      valid={valid.existingSpec[index]}
                      disabled={false}
                      mode="active"
                    />
                  )
              )}
            </div>
          </div>
        )}

        {existingSpec.length > 0 && (
          <div className="flex flex-col border border-gray-300 rounded-lg p-4 mt-10 relative">
            <div className="text-lg font-semibold ml-10">Deleted Programs</div>
            <div className="mt-10">
              {existingSpec.map(
                (sp, index) =>
                  sp.deleted && (
                    <SpecializationCard
                      key={sp.id}
                      specialization={sp}
                      onDelete={() => handleDeleteSpec("deleted", index)}
                      onUpdate={(spec) => handleUpdateSpec("deleted", index, spec)}
                      valid={valid.existingSpec[index]}
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