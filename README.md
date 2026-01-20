# WorldLens - News App

A full-stack news aggregation application that displays RSS feeds from various news sources. Users can register, login, and view personalized news feeds.

## Tech Stack

**Backend:** Node.js, Express.js, Prisma, PostgreSQL, JWT, bcrypt  
**Frontend:** HTML5, CSS3, Vanilla JavaScript

## Project Structure

```
News-App/
  Backend/
    Controllers/        # postControllers, rssControllers
    Middleware/         # error, issue, logger
    Route/              # API routes
    prisma/             # schema and migrations
    JWT.js              # Token creation and validation
    server.js           # Express server setup
  Frontend/
    home.html           # Main news feed page
    home-script.js      # News feed logic
    login.html          # Login page
    loginScript.js      # Login logic
    registration.html   # Registration page
    script.js           # Registration logic
```

## Prerequisites

- Node.js 14+
- npm
- PostgreSQL running locally (or connection string available)

## Setup

Install dependencies:
```bash
cd Backend
npm install
```

Configure environment variables. Create `.env` file in `Backend/` directory:

Required keys:
- `PORT` - Server port (default: 5001)
- `DATABASE_URL` - PostgreSQL connection string
- `secretKey` - JWT secret key

Setup database:
```bash
npx prisma generate
npx prisma migrate dev
```

## Scripts

```bash
npm start        # start server
npm run dev      # start with auto-reload
```

## Running

Start backend:
```bash
cd Backend
npm run dev
# Server runs on http://localhost:5001
```

Serve frontend using any static file server (e.g., Live Server on port 5500)

## API Endpoints

**Authentication:**
- `POST /api/register` - Register new user (username, password, email, mobno, dob)
- `POST /api/login/` - Login user (username, password)
  - Returns: `{ "success": true, "msg": "Log in success", "token": "..." }`

**Protected Routes (Require JWT Token):**
- `GET /api/homePage` - Home page
- `GET /api/rssfeed` - RSS feed data
  - Header: `Authorization: Bearer <token>`

## Auth Flow

1. Register user with credentials
2. Login returns JWT token (stored in localStorage)
3. Use token in `Authorization: Bearer <token>` header for protected routes
4. Server validates token on each request

## License

ISC License

## Author

**rj** - [GitHub](https://github.com/rityjacob)
