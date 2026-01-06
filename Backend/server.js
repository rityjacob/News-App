const express = require('express');
const logger = require('./Logger/logger');

const app = express();
PORT = process.env.PORT || 8000


app.use(express.json());

//logger
app.use(logger)

//Route


app.get('/api/register',(req,res) =>{
    res.send("hello news appp");
})

app.listen(PORT, () => console.log(`Server running in  PORT: ${PORT}`));

console.log('hello web app');
