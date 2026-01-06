const express = require('express');
const logger = require('./Middleware/logger');
const { route } = require('./Route/route');
const errorHandler = require('./Middleware/error');
const invalidRoute = require('./Middleware/issue');



const app = express();
PORT = process.env.PORT || 8000


app.use(express.json());

//logger
app.use(logger);

//Route
app.use('/', route);


// Error handler
app.use(invalidRoute);
app.use(errorHandler);


app.listen(PORT, () => console.log(`Server running in  PORT: ${PORT}`));

console.log('hello web app');
