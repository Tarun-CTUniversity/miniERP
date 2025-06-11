import React, { useState } from "react";
import { ROLES } from "../../constants/Constants";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [values, setValues] = useState({
    role: "",
    userID: "",
    password: "",
  });

  const [valid, setValid] = useState({
    role: "",
    userID: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    let error = "";
    if (!value) {
      error = `${name} is required`;
    } else if (name === "password" && value.length < 6) {
      error = "Password must be at least 6 characters";
    }

    setValid((prev) => ({ ...prev, [name]: error }));
  };

  const handleLogin = () => {
    const newValid = {};
    let allValid = true;

    for (const key in values) {
      if (!values[key]) {
        newValid[key] = `${key} is required`;
        allValid = false;
      } else if (key === "password" && values[key].length < 6) {
        newValid[key] = "Password must be at least 6 characters";
        allValid = false;
      } else {
        newValid[key] = "";
      }
    }

    setValid(newValid);

    if (allValid) {
      console.log("Logging in with:", values);
      // Your login logic here
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

        {/* Role Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            name="role"
            value={values.role}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${
              valid.role ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          >
            <option value="">Select Role</option>
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          {valid.role && <p className="text-red-500 text-sm mt-1">{valid.role}</p>}
        </div>

        {/* User ID Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">User ID</label>
          <input
            type="text"
            name="userID"
            value={values.userID}
            onChange={handleChange}
            placeholder="Enter your User ID"
            className={`w-full px-4 py-2 rounded-lg border ${
              valid.userID ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {valid.userID && <p className="text-red-500 text-sm mt-1">{valid.userID}</p>}
        </div>

        {/* Password Input with Eye Toggle */}
        <div className="mb-6 relative">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={values.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className={`w-full px-4 py-2 pr-10 rounded-lg border ${
              valid.password ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-600 text-lg focus:outline-none"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {valid.password && <p className="text-red-500 text-sm mt-1">{valid.password}</p>}
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
