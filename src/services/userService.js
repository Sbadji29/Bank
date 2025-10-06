import axios from 'axios';

const API_URL = 'http://localhost:5000/api/utilisateurs';

export const getUsers = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};  

export const switchUserStatus = async (userId) => {
  const res = await axios.patch(`${API_URL}/${userId}/switch-statut`);
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await axios.delete(`${API_URL}/${userId}`);
  return res.data;
};

export const getUserCounts = async () => {
  const response = await axios.get(`${API_URL}/stats/count`);
  return response.data;
};

export const createDepot = async (data) => {
  const res = await axios.post('http://localhost:5000/api/transactions/depot', data);
  return res.data;
};

export const deleteMultipleUsers = async (userIds) => {
  const res = await axios.post(`${API_URL}/delete-multiple`, { userIds });
  return res.data;
};

export const switchMultipleUsers = async (userIds) => {
  const res = await axios.post(`http://localhost:5000/api/utilisateurs/switch-statut-multiple`, { userIds });
  return res.data;
};
