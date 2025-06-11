// src/pages/Auth/RoleBasedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth(); // assumes user = { roles: ['HOD', 'teacher'] }

  const isAuthorized = user?.roles?.some(role => allowedRoles.includes(role));

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleBasedRoute;
