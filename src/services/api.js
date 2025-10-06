import axios from "axios";

const API_URL = "http://localhost:5000/api"; 

export const registerUser = async (data) => {
  return await axios.post(`${API_URL}/auth/register`, data);
};

export const loginUser = async (identifiant, mot_de_passe) => {
  const res = await axios.post(`${API_URL}/auth/login`, { identifiant, mot_de_passe });
  if (res.data.token) {
    localStorage.setItem("token", res.data.token); 
  }
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const getUsers = async () => {
  const token = localStorage.getItem("token");
  return await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
