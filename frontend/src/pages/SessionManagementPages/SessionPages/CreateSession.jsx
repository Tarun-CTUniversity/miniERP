import React, { useEffect, useState } from 'react';
import CustomInput from '../../../component/Inputs/CustomInput';
import CustomDropDown from '../../../component/Inputs/CustomDropDown';
import CancelButton from '../../../component/Buttons/CancelButton';
import CreateButton from '../../../component/Buttons/CreateButton';
import SchoolCardForSession from './SchoolCardForSession';

const CreateSession = () => {
  const SESSION_OPTIONS = ["Jan-June", "Sep-Dec"];
  const [session, setSession] = useState("Jan-June");
  const [year, setYear] = useState('2025');
  const [valid, setValid] = useState({ Year: '', Session: '' });
  const [schools, setSchools] = useState([]);

  useEffect(()=>{
    console.log(schools);
  },[schools]);

  // Add a new school card
  const handleAddSchool = () => {
    const newSchool = { name: '', abb: '', des: '' };
    setSchools((prevSchools) => [...prevSchools, newSchool]);
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
              handleChange={(n, value) => setYear(value)}
              valid={valid}
            />

            <CustomDropDown
              name="Session"
              options={SESSION_OPTIONS}
              handleChange={(n, val) => setSession(val)}
              valid={valid}
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
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <CancelButton handleClick={() => console.log("Cancel")} />
          <CreateButton handleClick={() => console.log("Create")} />
        </div>
      </main>
    </div>
  );
};

export default CreateSession;