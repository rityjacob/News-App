const express = require('express');
const router = express.Router();
const { regUser } = require ('../Controllers/postControllers');


// Register User
router.get('/api/register',regUser);

module.exports = router;