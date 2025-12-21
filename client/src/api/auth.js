import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// REGISTER
export const registerUser = async (data) => {
  return await axios.post(`${API}/auth/register`, data);
};

// LOGIN
export const loginUser = async (data) => {
  return await axios.post(`${API}/auth/login`, data);
};
