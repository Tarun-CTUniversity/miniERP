import React from "react";

const ToggleUserType = ({ userType, setUserType }) => {
  return (
    <button
      onClick={setUserType} // Directly trigger toggle function
      className={`px-6 py-3 text-white font-semibold rounded-md transition-all duration-300 ${
        userType === "Student"
          ? "bg-blue-500 hover:bg-blue-600"
          : "bg-green-500 hover:bg-green-600"
      }`}
    >
      {userType}
    </button>
  );
};

export default ToggleUserType;
