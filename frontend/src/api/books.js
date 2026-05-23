import axios from "axios";

const BOOK_URL = "";

const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const getAllBooks = (token) =>
  axios.get(`${BOOK_URL}/books`, authHeader(token));

export const getAvailableBooks = () =>
  axios.get(`${BOOK_URL}/books/available`);

export const addBook = (data, token) =>
  axios.post(`${BOOK_URL}/books`, data, authHeader(token));

export const updateBook = (id, data, token) =>
  axios.put(`${BOOK_URL}/books/${id}`, data, authHeader(token));

export const deleteBook = (id, token) =>
  axios.delete(`${BOOK_URL}/books/${id}`, authHeader(token));
