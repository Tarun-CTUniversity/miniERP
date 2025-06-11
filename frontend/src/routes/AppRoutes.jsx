import { Routes, Route } from 'react-router-dom';
import RoleBasedRoute from '../pages/Auth/RoleBasedRoute';
import MainLayout from '../layout/MainLayout';

import CreateSession from '../pages/SessionManagementPages/SessionPages/CreateSession';
import AddSchoolInfo from '../pages/SessionManagementPages/SchoolPages/AddSchoolInfo';
import AddDepartmentInfo from '../pages/SessionManagementPages/DepartmentPages/AddDepartmentInfo';
import AddClasses from '../pages/SessionManagementPages/classPages/AddClasses';
import AddSpecialization from '../pages/SessionManagementPages/SpecializationPages/AddSpecialization';
import Unauthorized from '../pages/Auth/Unauthorized';
import Login from '../pages/Auth/Login';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Unauthorized page */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="/" element={<Login />} />

      {/* Teacher Dashboard with layout */}
      <Route
        path="/teacher"
        element={
          <RoleBasedRoute allowedRoles={['HOS', 'HOD']}>
            <MainLayout />
          </RoleBasedRoute>
        }
      >
        <Route path="create-session" element={<CreateSession />} />
        <Route path="add-school" element={<AddSchoolInfo />} />
        <Route path="add-department" element={<AddDepartmentInfo />} />
        <Route path="add-classes" element={<AddClasses />} />
        <Route path="add-specialization" element={<AddSpecialization />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
