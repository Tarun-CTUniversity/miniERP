import React, { useState } from 'react';

const AddSchoolPopUp = ({ onClose }) => {
  const [schoolName, setSchoolName] = useState('');
  const [schoolDescription, setSchoolDescription] = useState('');

  const handleSubmit = () => {
    if (schoolName.trim()) {
      onClose({ name: schoolName, description: schoolDescription });
    } else {
      alert('Please enter a valid school name.');
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-sm p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Add School</h2>
        <input
          type="text"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          placeholder="Enter school name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <textarea
          value={schoolDescription}
          onChange={(e) => setSchoolDescription(e.target.value)}
          placeholder="Enter school description (optional)"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          rows="3"
        ></textarea>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSchoolPopUp;
