const express = require('express');
const router = express.Router();
const { register, login , getUsersCount } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.get('/getUsersCount', getUsersCount);



module.exports = router;
