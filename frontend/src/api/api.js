import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7000", // adjust based on your backend
  headers: {
    "Content-Type": "application/json",
  },
});

// All your API calls
const api = {
  // Sessions
  getAllSessions: () => API.get("/api/v1/getAllSessions"),
  getSessionByName: (sessionName) => API.get(`/api/v1/basicInfo/session/getSessionByName/${sessionName}`),
  getSessionNames:()=>API.get("/api/v1/basicInfo/session/getSessionNames"),
  createSession:(data)=>API.post(`/api/v1/basicInfo/session`,data),
  updateSession:(data) => API.put("/api/v1/basicInfo/session",data),
  getSessionData:()=>API.get("/api/v1/basicInfo/session/getSessionsData"),


  // Departments
  getAllDepartmentsBySchool:(school) => API.get(`/api/v1/basicInfo/school/getAllDepartment/${school}`),
  updateSchoolDepartment:(data) => API.put(`/api/v1/basicInfo/school/updateSchoolDepartments`, data),

  // Programs
  updatePrograms : (data) => API.put("/api/v1/basicInfo/department/updatePrograms",data),

  // Specialization
  getAllSpecializationsBySession: (sessionID) => API.get(`/api/v1/basicInfo/getAllSpecialization/${sessionID}`),
  updateSpecialization : (data) => API.put("/api/v1/basicInfo/specialization",data),
  

  // More functions can be added here (programs, students, etc.)
};

export default api;



