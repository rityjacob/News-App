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
  origin: function (origin, callback) {
    // For requests with credentials, we must return the exact origin (not wildcard)
    if (!origin) {
      // Allow requests with no origin (like mobile apps or Postman)
      return callback(null, true);
    }
    if (origin.startsWith('http://localhost') || 
        origin.startsWith('http://127.0.0.1')) {
      // Return the exact origin for credential requests
      return callback(null, origin);
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  credentials: true,
  exposedHeaders: ["Set-Cookie"]
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
