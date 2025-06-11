import React, { useEffect, useState } from "react";
import CustomDropDown from "../../../component/Inputs/CustomDropDown";
import CancelButton from "../../../component/Buttons/CancelButton";
import UpdateButton from "../../../component/Buttons/UpdateButton";
import { v4 as uuidv4 } from "uuid";
import api from "../../../api/api";
import { useApi } from "../../../hooks/useApi";
import SpecializationCard from "./SpecializationCard";

export default function AddSpecialization() {
  const [session, setSession] = useState([]);
  const [selectedSession , setSelectedSession] = useState([]);
  const {request} = useApi();
  const [valid, setValid] = useState({
    session: "",
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
      const resp = await request(api.getSessionNames);
      if (resp.status === 200 && resp.data?.data) {
        const val = resp.data.data;
        setSession(val);
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
    const s = session.find((item) => item.name === val);
    if (s) {
      setSelectedSession(s);
      getSpecializationData(s._id);

    } else {
      setValid((prev) => ({ ...prev, session: "Please provide a valid session name" }));
    }
  };

  const getSpecializationData = async (sessionID) => {
    try {
      const resp = await request(api.getAllSpecializationsBySession, sessionID);

      if (resp.status === 200 && Array.isArray(resp.data?.data?.specializations)) {
        const specializations = resp.data.data.specializations;

        // Always reset specialization
        setValid((prev) => ({ ...prev, specialization: "" }));

        // Handle if no specializations
        if (specializations.length === 0) {
          setExistingSpec([]); // Clear the specialization list
          alert("No specializations found for this session.");
          return;
        }

        // Set specializations
        setExistingSpec(
          specializations.map((spec) => ({
            name: spec.name,
            code: spec.code,
            id: spec._id,
            deleted: spec.deleted,
            des: spec.description,
          }))
        );
      } else {
        console.error("Unexpected response format:", resp);
        alert("Failed to fetch specialization data. Please try again later.");
      }
    } catch (err) {
      if (err.response) {
        console.error("Server error:", err.response.data);
        alert(err.response.data.message || "Failed to fetch specialization data from the server.");
      } else if (err.request) {
        console.error("No response from server:", err.request);
        alert("No response from the server. Please check your connection.");
      } else {
        console.error("Error setting up request:", err.message);
        alert("An error occurred while fetching specialization data. Please try again.");
      }
    }
  };


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

const handleUpdateData = async () => {
  const error = validateSpec();
  if (error) {
    alert("Please fix the errors before updating.");
    return;
  }


  const data = {
    sessionID: selectedSession._id,
    existingSpec,
    newSpec
  };

  try {
    const response = await request(api.updateSpecialization,data);

    if (response.status === 200 && response.data?.data) {
      alert("Specialization updated successfully");

      const fetched = response.data.data;
      console.log(fetched);
      // Map the fetched specializations to update the state
      setExistingSpec(
        fetched.map((spec) => ({
          name: spec.name,
          code: spec.code,
          id: spec._id,
          deleted: spec.deleted,
          des: spec.description,  
        }))
      );

      setNewSpec([]);
      setValid((prev) => ({
        ...prev,
        newSpec: [],
        existingSpec: fetched.map(() => ({
          name: "",
          code: "",
          duration: "",
          type: "",
        })),
      }));

    } else {
      console.error("Unexpected response format:", response);
      alert("Failed to update Specializations. Please try again.");
    }
  } catch (error) {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error("Server error:", error.response.data);
      alert(error.response.data.message || "Failed to update Specializations. Please try again.");
    } else if (error.request) {
      // Request was made but no response was received
      console.error("No response from server:", error.request);
      alert("No response from the server. Please check your connection.");
    } else {
      // Something happened in setting up the request
      console.error("Error setting up request:", error.message);
      alert("An error occurred while updating specializations. Please try again.");
    }
  }
};
  
  const printData = () => {
    console.log("Session Data: ", session);
    console.log("selected Session" , selectedSession);
    console.log("new Specialization" , newSpec);
    console.log("Existing Specialization" , existingSpec);
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
              options={session.map(val => val.name)}
              handleChange={(n, val) => handleSession(val)}
              valid={valid.session}
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
            <div className="text-lg font-semibold ml-10">Active Specializations</div>
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
            <div className="text-lg font-semibold ml-10">Deleted Specialization</div>
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