import React from "react";

const CustomActionButton = ({ label, onClick, bgColor, textColor = "text-white", shadow = "shadow-md" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 font-semibold rounded-md transition-all duration-300 ${bgColor} ${textColor} ${shadow} hover:opacity-80`}
    >
      {label}
    </button>
  );
};

export default CustomButton;
