import axios from "axios";

const BORROW_URL = "";

const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const getMyBorrows = (token) =>
  axios.get(`${BORROW_URL}/borrows/my`, authHeader(token));

export const getAllBorrows = (token) =>
  axios.get(`${BORROW_URL}/borrows`, authHeader(token));

export const borrowBook = (livreId, token) =>
  axios.post(`${BORROW_URL}/borrows`, { livreId }, authHeader(token));

export const returnBook = (id, token) =>
  axios.put(`${BORROW_URL}/borrows/${id}/return`, {}, authHeader(token));
