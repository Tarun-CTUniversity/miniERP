import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import CustomDropDown from "../../../component/Inputs/CustomDropDown";
import CancelButton from "../../../component/Buttons/CancelButton";
import UpdateButton from "../../../component/Buttons/UpdateButton";
import ClassCard from "./ClassCard";
import { HOST } from "../../../constants/Constants";

export default function AddClasses() {
  // State for dropdown options
  const [dropdownData, setDropdownData] = useState({
    sessions: [],
    schools: [],
    departments: [],
    programs: []
  });

  // State for selected items
  const [selected, setSelected] = useState({
    session: null,
    school: null,
    department: null,
    program: null
  });

  // State for classes
  const [existingClasses, setExistingClasses] = useState([]);
  const [newClasses, setNewClasses] = useState([]);

  // Validation state
  const [valid, setValid] = useState({
    session: "",
    school: "",
    department: "",
    program: "",
    existingClasses: [],
    newClasses: []
  });

  // Fetch initial session data
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axios.get(`${HOST}/api/v1/basicInfo/session/getSessionsData`);
        if (response.status === 200 && response.data?.data) {
          const sessions = response.data.data.filter(s => !s.deleted);
          setDropdownData(prev => ({
            ...prev,
            sessions: sessions.map(s => s.name)
          }));
        }
      } catch (error) {
        console.error("Failed to fetch session data:", error);
      }
    };

    fetchSessionData();
  }, []);

  // Handle session selection
  const handleSessionSelect = (sessionName) => {
    if (!dropdownData.sessions.includes(sessionName)) {
      setValid(prev => ({ ...prev, session: "Please select a valid session" }));
      return;
    }

    const session = sessionData.find(s => s.name === sessionName);
    const schools = session.schools.filter(s => !s.deleted);

    setSelected({
      session,
      school: null,
      department: null,
      program: null
    });

    setDropdownData(prev => ({
      ...prev,
      schools: schools.map(s => s.name),
      departments: [],
      programs: []
    }));

    setValid(prev => ({ ...prev, session: "" }));
  };

  // Handle school selection
  const handleSchoolSelect = (schoolName) => {
    if (!dropdownData.schools.includes(schoolName)) {
      setValid(prev => ({ ...prev, school: "Please select a valid school" }));
      return;
    }

    const school = selected.session.schools.find(s => s.name === schoolName);
    const departments = school.departments.filter(d => !d.deleted);

    setSelected(prev => ({
      ...prev,
      school,
      department: null,
      program: null
    }));

    setDropdownData(prev => ({
      ...prev,
      departments: departments.map(d => d.name),
      programs: []
    }));

    setValid(prev => ({ ...prev, school: "" }));
  };

  // Handle department selection
  const handleDepartmentSelect = (departmentName) => {
    if (!dropdownData.departments.includes(departmentName)) {
      setValid(prev => ({ ...prev, department: "Please select a valid department" }));
      return;
    }

    const department = selected.school.departments.find(d => d.name === departmentName);
    const programs = department.programs.filter(p => !p.deleted);

    setSelected(prev => ({
      ...prev,
      department,
      program: null
    }));

    setDropdownData(prev => ({
      ...prev,
      programs: programs.map(p => p.name)
    }));

    setValid(prev => ({ ...prev, department: "" }));
  };

  // Handle program selection
  const handleProgramSelect = (programName) => {
    if (!dropdownData.programs.includes(programName)) {
      setValid(prev => ({ ...prev, program: "Please select a valid program" }));
      return;
    }

    const program = selected.department.programs.find(p => p.name === programName);
    
    setSelected(prev => ({
      ...prev,
      program
    }));

    // Load existing classes for this program
    setExistingClasses(
      program.classes.map(cls => ({
        ...cls,
        id: cls._id || uuidv4()
      }))
    );

    setValid(prev => ({ ...prev, program: "" }));
  };

  // Add new class
  const addNewClass = () => {
    const newClass = {
      id: uuidv4(),
      name: "",
      section: "",
      semester: "",
      deleted: false
    };

    setNewClasses(prev => [...prev, newClass]);
    setValid(prev => ({
      ...prev,
      newClasses: [...prev.newClasses, { name: "", section: "", semester: "" }]
    }));
  };

  // Delete/restore class
  const handleClassDelete = (mode, index) => {
    if (mode === "add") {
      setNewClasses(prev => prev.filter((_, i) => i !== index));
      setValid(prev => ({
        ...prev,
        newClasses: prev.newClasses.filter((_, i) => i !== index)
      }));
    } else {
      const updatedClasses = [...existingClasses];
      updatedClasses[index].deleted = !updatedClasses[index].deleted;
      setExistingClasses(updatedClasses);
    }
  };

  // Update class
  const handleClassUpdate = (mode, index, updatedClass) => {
    if (mode === "add") {
      const updated = [...newClasses];
      updated[index] = updatedClass;
      setNewClasses(updated);
    } else {
      const updated = [...existingClasses];
      updated[index] = updatedClass;
      setExistingClasses(updated);
    }
  };

  // Validate classes before submission
  const validateClasses = () => {
    let hasError = false;
    const newValidations = [];
    const existingValidations = [];

    // Validate new classes
    newClasses.forEach(cls => {
      const validation = { name: "", section: "", semester: "" };
      
      if (!cls.name) {
        validation.name = "Name is required";
        hasError = true;
      }
      
      if (!cls.section) {
        validation.section = "Section is required";
        hasError = true;
      }
      
      if (!cls.semester) {
        validation.semester = "Semester is required";
        hasError = true;
      }

      newValidations.push(validation);
    });

    // Validate existing classes
    existingClasses.forEach(cls => {
      const validation = { name: "", section: "", semester: "" };
      
      if (!cls.deleted && !cls.name) {
        validation.name = "Name is required";
        hasError = true;
      }
      
      if (!cls.deleted && !cls.section) {
        validation.section = "Section is required";
        hasError = true;
      }
      
      if (!cls.deleted && !cls.semester) {
        validation.semester = "Semester is required";
        hasError = true;
      }

      existingValidations.push(validation);
    });

    setValid(prev => ({
      ...prev,
      newClasses: newValidations,
      existingClasses: existingValidations
    }));

    return hasError;
  };

  // Submit data
  const handleSubmit = async () => {
    // Validate required dropdowns
    if (!selected.session) {
      setValid(prev => ({ ...prev, session: "Session is required" }));
      return;
    }
    if (!selected.school) {
      setValid(prev => ({ ...prev, school: "School is required" }));
      return;
    }
    if (!selected.department) {
      setValid(prev => ({ ...prev, department: "Department is required" }));
      return;
    }
    if (!selected.program) {
      setValid(prev => ({ ...prev, program: "Program is required" }));
      return;
    }

    // Validate classes
    if (validateClasses()) {
      alert("Please fix validation errors before submitting");
      return;
    }

    const payload = {
      sessionId: selected.session._id,
      schoolId: selected.school._id,
      departmentId: selected.department._id,
      programId: selected.program._id,
      existingClasses,
      newClasses
    };

    try {
      const response = await axios.put(`${HOST}/api/v1/basicInfo/program/updateClasses`, payload);
      
      if (response.status === 200) {
        alert("Classes updated successfully");
        // Update state with response data if needed
        const updatedProgram = response.data.program;
        setExistingClasses(updatedProgram.classes);
        setNewClasses([]);
      }
    } catch (error) {
      console.error("Failed to update classes:", error);
      alert("Failed to update classes. Please try again.");
    }
  };

  return (
    <div className="bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Classes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <CustomDropDown
          name="Session"
          options={dropdownData.sessions}
          handleChange={handleSessionSelect}
          valid={valid.session}
        />
        <CustomDropDown
          name="School"
          options={dropdownData.schools}
          handleChange={handleSchoolSelect}
          valid={valid.school}
          disabled={!selected.session}
        />
        <CustomDropDown
          name="Department"
          options={dropdownData.departments}
          handleChange={handleDepartmentSelect}
          valid={valid.department}
          disabled={!selected.school}
        />
        <CustomDropDown
          name="Program"
          options={dropdownData.programs}
          handleChange={handleProgramSelect}
          valid={valid.program}
          disabled={!selected.department}
        />
      </div>

      <div className="mb-8">
        <button
          onClick={addNewClass}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={!selected.program}
        >
          + Add New Class
        </button>
      </div>

      {/* New Classes */}
      {newClasses.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">New Classes</h2>
          {newClasses.map((cls, index) => (
            <ClassCard
              key={cls.id}
              classTitle={cls}
              onDelete={() => handleClassDelete("add", index)}
              onUpdate={(updated) => handleClassUpdate("add", index, updated)}
              valid={valid.newClasses[index]}
              mode="add"
            />
          ))}
        </div>
      )}

      {/* Existing Active Classes */}
      {existingClasses.filter(c => !c.deleted).length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Existing Classes</h2>
          {existingClasses
            .filter(c => !c.deleted)
            .map((cls, index) => (
              <ClassCard
                key={cls.id}
                classTitle={cls}
                onDelete={() => handleClassDelete("active", index)}
                onUpdate={(updated) => handleClassUpdate("active", index, updated)}
                valid={valid.existingClasses[index]}
                mode="active"
              />
            ))}
        </div>
      )}

      {/* Deleted Classes */}
      {existingClasses.filter(c => c.deleted).length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Deleted Classes</h2>
          {existingClasses
            .filter(c => c.deleted)
            .map((cls, index) => (
              <ClassCard
                key={cls.id}
                classTitle={cls}
                onDelete={() => handleClassDelete("deleted", index)}
                onUpdate={(updated) => handleClassUpdate("deleted", index, updated)}
                valid={valid.existingClasses[index]}
                mode="deleted"
                disabled
              />
            ))}
        </div>
      )}

      <div className="flex justify-end gap-4 mt-8">
        <CancelButton onClick={() => window.location.reload()} />
        <UpdateButton onClick={handleSubmit} disabled={!selected.program} />
      </div>
    </div>
  );
}