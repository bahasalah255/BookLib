const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/isAuthenticated');
const {
  getAllBooks,
  getAvailableBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/book.controller');

// Public routes
router.get('/', getAllBooks);
router.get('/available', getAvailableBooks);
router.get('/:id', getBookById);

// Protected admin routes
router.post('/', isAuthenticated, isAdmin, createBook);
router.put('/:id', isAuthenticated, isAdmin, updateBook);
router.delete('/:id', isAuthenticated, isAdmin, deleteBook);

module.exports = router;
