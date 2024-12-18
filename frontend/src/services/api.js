import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// User APIs
export const registerUser = (formData) => API.post("/users/register", formData);
export const loginUser = (formData) => API.post("/users/login", formData);
