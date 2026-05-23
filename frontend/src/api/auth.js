import axios from "axios";

const AUTH_URL = "";

export const login = (email, motDePasse) =>
  axios.post(`${AUTH_URL}/auth/login`, { email, motDePasse });
export const countusers = () => 
  axios.get(`${AUTH_URL}/auth/getUsersCount`);

export const register = (nom, email, motDePasse, role) =>
  axios.post(`${AUTH_URL}/auth/register`, { nom, email, motDePasse, role });

export const updateProfile = (data, token) =>
  axios.put(`${AUTH_URL}/auth/profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
