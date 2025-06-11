// src/pages/Unauthorized.jsx
import React from 'react';

const Unauthorized = () => {
  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold text-red-600">403 - Unauthorized</h1>
      <p className="mt-2">You do not have permission to view this page.</p>
    </div>
  );
};

export default Unauthorized;
