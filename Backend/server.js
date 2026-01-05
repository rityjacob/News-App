const express = require('express');

const app = express();


PORT = process.env.PORT || 8000

app.get('/',(req,res) =>{
    res.send("hello news app");
})

app.listen(PORT, () => console.log(`Server running in  PORT: ${PORT}`));

console.log('hello web app');
