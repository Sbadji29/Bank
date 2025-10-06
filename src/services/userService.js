import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;
export const getUsers = async () => {
  const res = await axios.get(`${API_BASE_URL}/utilisateurs`);
  return res.data;
};  

export const switchUserStatus = async (userId) => {
  const res = await axios.patch(`${API_BASE_URL}/utilisateurs/${userId}/switch-statut`);
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await axios.delete(`${API_BASE_URL}/utilisateurs/${userId}`);
  return res.data;
};

export const getUserCounts = async () => {
  const response = await axios.get(`${API_BASE_URL}/utilisateurs/stats/count`);
  return response.data;
};

export const createDepot = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/transactions/depot`, data);
  return res.data;
};

export const deleteMultipleUsers = async (userIds) => {
  const res = await axios.post(`${API_BASE_URL}/utilisateurs/delete-multiple`, { userIds });
  return res.data;
};

export const switchMultipleUsers = async (userIds) => {
  const res = await axios.post(`${API_BASE_URL}/utilisateurs/switch-statut-multiple`, { userIds });
  return res.data;
};
