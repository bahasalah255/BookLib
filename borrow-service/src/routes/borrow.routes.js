const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/isAuthenticated');
const {
  borrowBook,
  returnBook,
  getActiveBorrows,
} = require('../controllers/borrow.controller');

// Toutes les routes nécessitent une authentification JWT
router.post('/', isAuthenticated, borrowBook);
router.put('/:id/return', isAuthenticated, returnBook);
router.get('/', isAuthenticated, getActiveBorrows);

module.exports = router;
