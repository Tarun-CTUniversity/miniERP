# React + Vite





<!--  -->
# Project Overview and Data Flow

## Table of Contents
- [App Entry Point](#app-entry-point)
- [Authentication and User Context](#authentication-and-user-context)
- [Routing and Role-Based Access Control](#routing-and-role-based-access-control)
- [Layout and Page Rendering](#layout-and-page-rendering)
- [Component Responsibilities](#component-responsibilities)
- [Data Flow Summary](#data-flow-summary)
- [Error Handling and Future Extensions](#error-handling-and-future-extensions)

---

## App Entry Point

- **`main.jsx`**  
  Wraps the entire React app inside `<AuthProvider>` (from `context/AuthContext.jsx`), which provides authentication state (user info and roles) throughout the app.

- **`App.jsx`**  
  The root component that imports and renders `<AppRoutes />` which handles all route definitions.

---

## Authentication and User Context

- **`context/AuthContext.jsx`**  
  Defines `AuthContext` and `AuthProvider`.  
  - Holds the current `user` object and their `roles`.  
  - `setUser` allows updating auth state (e.g., on login/logout).  
  - This context is the source of truth for user identity and permissions.

- **`hooks/useAuth.js`**  
  Custom React hook that provides convenient access to `AuthContext`.

---

## Routing and Role-Based Access Control

- **`routes/AppRoutes.jsx`**  
  - Defines all app routes using React Router `<Routes>`.  
  - Uses `<RoleBasedRoute>` (from `auth/RoleBasedRoute.jsx`) as a guard wrapper on protected routes.

- **`auth/RoleBasedRoute.jsx`**  
  - Checks if current user's roles (from `useAuth`) intersect with allowed roles for a route.  
  - If allowed, renders nested routes/pages via `<Outlet />`.  
  - Otherwise, redirects to `/unauthorized` page.

---

## Layout and Page Rendering

- **`layout/MainLayout.jsx`**  
  - Wraps the main UI: top navigation bar (`TopNavBar.jsx`), left collapsible sidebar (`LeftNavBar.jsx`), and page content via `<Outlet />`.  
  - Ensures consistent UI chrome on protected pages.

- **`pages/Auth/Login.jsx`** (to be added later)  
  - Will handle user login and update auth state via `setUser`.

- **`pages/Auth/Unauthorized.jsx`**  
  - Displays an access denied message when unauthorized users attempt to access protected pages.

- **`pages/SessionManagement/…`**  
  - Various feature pages like `AddClasses.jsx`, `AddDepartmentInfo.jsx`, etc., which are protected by roles like "HOS" and "HOD".

---

## Component Responsibilities

| Component                         | Responsibility / Data Handling                             |
|----------------------------------|------------------------------------------------------------|
| `AuthProvider`                   | Provides user auth state and updater globally.             |
| `useAuth`                       | Accesses auth context anywhere in the app.                  |
| `RoleBasedRoute`                | Protects routes by user roles, redirects unauthorized users.|
| `AppRoutes`                    | Defines routes and applies route guards.                    |
| `MainLayout`                   | Layout wrapper with navigation bars and main content area. |
| `TopNavBar`                    | Displays app header and user info.                          |
| `LeftNavBar`                   | Sidebar navigation, collapsible menu.                       |
| `Login` (to be added)          | Authenticates user, sets user roles in context.             |
| `Unauthorized`                 | Shows unauthorized access message.                          |
| SessionManagement Pages         | Functional pages for managing sessions, schools, depts.     |

---

## Data Flow Summary

1. **Login Flow (planned):**  
   - User submits login credentials in `Login.jsx`.  
   - On success, `setUser` is called in `AuthContext` to update the user object with roles.  
   - App re-renders and routes update based on new roles.

2. **Route Protection:**  
   - User visits a protected route (e.g., `/add-classes`).  
   - `RoleBasedRoute` checks user roles from `AuthContext`.  
   - If allowed, renders `MainLayout` and requested page component.  
   - If not allowed, redirects to `/unauthorized`.

3. **Page Rendering:**  
   - `MainLayout` renders top navigation and sidebar.  
   - Page component loads and may fetch or accept props/data.  
   - UI components inside pages render and interact with backend as needed.

---

## Error Handling and Future Extensions

- **Error Handling Suggestions:**  
  - Wrap async data fetch calls in try/catch in page components.  
  - Use React error boundaries for UI-level errors.  
  - Handle unauthorized or session expired cases gracefully (redirect to login).  
  - Provide user feedback on loading/error states in UI.

- **Future Work for File System Handling:**  
  - Authentication and user roles flow remain the same.  
  - For file uploads/downloads, create new components or hooks that interact with backend API.  
  - Use `AuthContext` for secure access tokens or permissions before file actions.  
  - Place new utilities in `utils/` (e.g., `fileHelpers.js`).  
  - Extend `RoleBasedRoute` to protect file management routes.

---

# Summary

- Your app uses **`AuthContext`** for centralized auth state including roles.  
- **`RoleBasedRoute`** protects routes and decides access based on user roles.  
- The main UI uses **`MainLayout`** to provide consistent navigation and layout.  
- Pages under `SessionManagement/` are role-protected and rendered inside this layout.  
- Auth state flows top-down from `AuthProvider` → components → route guards → pages.  
- Future error handling and file system features can be built within this structure using the same role-based principles.

---

## Guidelines for Future Enhancements

### Adding a New Component

1. **Decide the Location:**  
   - If the component is a reusable UI element (e.g., button, input), place it inside `components/` in an appropriate subfolder (`Buttons/`, `Inputs/`, etc.).  
   - If it is a new page/screen, place it inside the appropriate folder under `pages/`. For example, if it's related to session management, place it under `pages/SessionManagement/`.

2. **Routing:**  
   - Add a route entry in `routes/AppRoutes.jsx` for the new page/component.  
   - Wrap the route with `<RoleBasedRoute>` if the page requires role-based protection.

3. **Role-Based Access:**  
   - Determine which roles should access this component/page.  
   - Update the `allowedRoles` prop in `RoleBasedRoute` accordingly.

4. **Data Access:**  
   - Use `useAuth` hook to access user info and roles if needed inside your component.  
   - For API calls, include necessary authentication tokens or headers as required.

5. **Layout:**  
   - If the new page should use the app's main UI shell, wrap it inside `MainLayout.jsx`.  
   - If it needs a different layout, create a new layout component under `layout/` and update routing accordingly.

---

### Extending Authentication or Adding New Auth Features

1. **Update Auth Context (`context/AuthContext.jsx`):**  
   - Add any new user state fields (e.g., permissions, tokens, profile info) to the context’s state.  
   - Add helper functions for login, logout, or token refresh if needed.

2. **Update or Add Hooks (`hooks/useAuth.js`):**  
   - Extend `useAuth` or create new custom hooks for specific auth features (e.g., `useToken`, `usePermissions`).

3. **Modify or Add Authentication Pages:**  
   - Create or update `pages/Auth/Login.jsx` to handle new login logic.  
   - Add pages like `Register.jsx`, `ForgotPassword.jsx`, etc., as needed.

4. **Adjust Route Guards:**  
   - Update `auth/RoleBasedRoute.jsx` to handle new roles, permissions, or auth conditions.  
   - Consider creating new guard components if different kinds of auth checks are needed.

5. **Persisting Auth State:**  
   - If you add tokens or persistent login, implement storage mechanisms (e.g., localStorage, cookies) inside the `AuthProvider`.

6. **Error Handling:**  
   - Handle auth errors globally or inside `AuthProvider` and route guards.  
   - Show user-friendly messages or redirect to login/unauthorized pages as needed.

---

### Summary

- **New UI components:** Put in `components/` → add route (if needed) → protect with `RoleBasedRoute` → use `useAuth` if auth info needed.  
- **New pages:** Put in `pages/` → update routes → set permissions → wrap in layout.  
- **Auth features:** Update `AuthContext` and hooks → modify auth pages → update route guards → handle token storage and errors.

Following this approach will keep your project organized, maintain clean separation of concerns, and ensure your role-based access control remains consistent.

---

If you want, I can create templates or boilerplate code for adding new protected pages or auth features! Just ask.


# Enhancing Your React App: Login Flow & Error Boundary Setup

---

## 1. Login Flow Implementation

### Purpose
Implement user login to update authentication context and control access based on roles.

### Steps

#### a) Create Login Page (`pages/Auth/Login.jsx`)

```jsx
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Replace this mock check with actual API authentication
    if (username === "admin" && password === "admin123") {
      setUser({ name: "Admin User", roles: ["HOS"] });
      navigate("/");
    } else if (username === "teacher" && password === "teacher123") {
      setUser({ name: "Teacher User", roles: ["teacher"] });
      navigate("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;


### b) Add Login Route

In `routes/AppRoutes.jsx`:

```jsx
import Login from "../pages/Auth/Login";

// Add inside <Routes> component:
<Route path="/login" element={<Login />} />



