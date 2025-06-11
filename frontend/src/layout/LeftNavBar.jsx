// src/layout/LeftNavBar.jsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/teacher/create-session', label: 'Create Session' },
  { path: '/teacher/add-school', label: 'Add School' },
  { path: '/teacher/add-department', label: 'Add Department' },
  { path: '/teacher/add-classes', label: 'Add Classes' },
  { path: '/teacher/add-specialization', label: 'Add Specialization' },
];

const LeftNavBar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`bg-slate-700 text-white h-full transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full p-2 bg-slate-800 hover:bg-slate-600 transition"
      >
        {collapsed ? '➤' : 'Collapse'}
      </button>

      <nav className="flex flex-col mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-2 hover:bg-slate-600 transition ${isActive ? 'bg-slate-900' : ''}`
            }
          >
            {collapsed ? item.label.charAt(0) : item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default LeftNavBar;
