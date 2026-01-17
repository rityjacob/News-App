const express = require('express');
const router = express.Router();
const { regUser, userLogin, homePage } = require ('../Controllers/postControllers');
const {validateToken} = require('../JWT')
const {getRSS}=require('../Controllers/rssControllers')

// Register User
router.post('/api/register',regUser);

// User Login
router.post('/api/login/',userLogin);

// Home Page
router.get('/api/homePage',validateToken, homePage)

router.get('/api/rssfeed',validateToken, getRSS)

module.exports = router;