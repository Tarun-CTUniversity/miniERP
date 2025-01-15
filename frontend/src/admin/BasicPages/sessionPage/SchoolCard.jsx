import React from 'react';

const SchoolCard = ({ school, onDelete }) => {
  return (
    <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md mb-4">
      <span className="text-lg font-semibold text-gray-800">School : <span className='font-normal'>{school.name}</span></span>
      <span className="text-lg font-semibold text-gray-800">Description : <span className='font-normal'>{school.description}</span></span>
      <button
        onClick={() => onDelete(school.id)}
        className="text-red-500 hover:text-red-700 focus:outline-none"
      >
        &times;
      </button>
    </div>
  );
};

export default SchoolCard;
