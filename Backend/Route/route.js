const express = require('express');
const router = express.Router();

// Register User
router.get('/api/register',(req,res) =>{
    res.send("hello news appp");
})

module.exports = router;