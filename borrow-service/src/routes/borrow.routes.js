const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/isAuthenticated');
const {
  borrowBook,
  returnBook,
  getMyBorrows,
  getActiveBorrows,
} = require('../controllers/borrow.controller');

router.get('/my', isAuthenticated, getMyBorrows);
router.get('/', isAuthenticated, getActiveBorrows);
router.post('/', isAuthenticated, borrowBook);
router.put('/:id/return', isAuthenticated, returnBook);

module.exports = router;
