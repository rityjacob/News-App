const express = require('express');
const router = express.Router();
const { regUser, userLogin } = require ('../Controllers/postControllers');


// Register User
router.post('/api/register',regUser);

// User Login
router.post('/api/login/',userLogin);

module.exports = router;