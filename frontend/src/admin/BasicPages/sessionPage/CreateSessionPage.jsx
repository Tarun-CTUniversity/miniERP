import React, { useState } from 'react';
import AddSchoolPopUp from './AddSchoolPopUp';
import SchoolCard from './SchoolCard';

const CreateSessionPage = () => {
  const [sessionName, setSessionName] = useState('');
  const [schools, setSchools] = useState([]);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const handleAddSchool = (school) => {
    if (school) {
      setSchools((prevSchools) => [
        ...prevSchools,
        { id: Date.now(), name: school.name , description:school.description },
      ]);
    }
    setIsPopUpOpen(false);
  };

  const handleDeleteSchool = (id) => {
    setSchools((prevSchools) => prevSchools.filter((school) => school.id !== id));
  };

  const handleCancel = () =>{
    setSchools([]);
    setSessionName("");
  }

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
          <input
            type="text"
            id="sessionName"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="Enter session name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col flex-1 border border-gray-300 rounded-lg p-4 relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setIsPopUpOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              + Add School
            </button>
          </div>

          <div className="mt-10">
            {schools.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                onDelete={handleDeleteSchool}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button  onClick={handleCancel}
          className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600">
            Cancel
          </button>
          <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600">
            Create
          </button>
        </div>
      </main>

      {isPopUpOpen && <AddSchoolPopUp onClose={handleAddSchool} />}
    </div>
  );
};

export default CreateSessionPage;
