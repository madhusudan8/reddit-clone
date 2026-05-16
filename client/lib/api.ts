import axios from "axios";

// Create an Axios instance pointing to our backend
export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle data extraction and basic error mapping
api.interceptors.response.use(
  (response) => {
    // Our API returns `{ success, message, data, pagination }`
    return response.data;
  },
  (error) => {
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ success: false, message: error.message });
  }
);
