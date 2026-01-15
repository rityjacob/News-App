const express = require('express');
const router = express.Router();
const { regUser, userLogin, homePage } = require ('../Controllers/postControllers');


// Register User
router.post('/api/register',regUser);

// User Login
router.post('/api/login/',userLogin);

// Home Page
router.post('/api/homePage',homePage)

module.exports = router;