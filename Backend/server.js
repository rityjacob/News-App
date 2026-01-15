const express = require('express');
const logger = require('./Middleware/logger');
const route = require('./Route/route');
const errorHandler = require('./Middleware/error');
const invalidRoute = require('./Middleware/issue');
const cookieParser = require("cookie-parser");


PORT = process.env.PORT 
const app = express();



//logger
app.use(logger);

const cors = require("cors");

app.use(cors({
  origin: "*", // or "*" for dev
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});


app.use(express.json());
app.use(cookieParser());
//Route
app.use('/', route);


// Error handler
app.use(invalidRoute);
app.use(errorHandler);


app.listen(PORT, () => console.log(`Server running in  PORT: ${PORT}`));

console.log('hello web app');
