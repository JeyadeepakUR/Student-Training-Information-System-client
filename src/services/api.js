import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3500';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // For form-data requests, remove Content-Type to let browser set it
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const loginAdmin = (credentials) => api.post('/admin/login', credentials);
export const registerAdmin = (adminData) => api.post('/admin/register', adminData);

// Student APIs
export const getAllStudents = () => api.get('/admin/students');
export const registerStudent = (studentData) => api.post('/admin/register-student', studentData);
export const bulkRegisterStudents = (file, batch, passoutYear) => {
  const formData = new FormData();
  formData.append('excel', file);
  formData.append('batch', batch);
  formData.append('passoutYear', passoutYear);
  
  return api.post('/admin/bulk-register', formData);
};

// Training Module APIs
export const getAllModules = () => api.get('/admin/modules');
export const addModule = async (moduleData) => {
  return api.post('/admin/modules', moduleData);
};
export const updateModule = (moduleId, moduleData) => api.put(`/admin/modules/${moduleId}`, moduleData);
export const getStudentModules = () => api.get('/student/modules');
export const getModuleStudents = (moduleId) => api.get(`/admin/students/module/${moduleId}`);

export const getStudentDetails = async (studentId) => {
  const response = await api.get(`/student/${studentId}`);
  return response.data;
};

export const getStudentModulePerformance = async (studentId, moduleId) => {
  const response = await api.get(`/student/${studentId}/module/${moduleId}`);
  return response.data;
};

export default api;
