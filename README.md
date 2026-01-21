# Blog App (MERN-style)

This repo contains:

- **`api/`**: Node/Express backend (MongoDB Atlas)
- **`client/`**: React frontend (CRA)

## Requirements

- Node.js + npm
- A MongoDB Atlas database (or any MongoDB connection string)

## Setup

### 1) Backend environment variables

Create `api/.env` (this file is **ignored by git**):

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-host>/<dbName>?retryWrites=true&w=majority&appName=<appName>
JWT_SECRET=change-me-to-a-long-random-string
```

You can copy from `api/env.example`.

### 2) Install dependencies

Backend:

```bash
cd api
npm install
```

Frontend:

```bash
cd client
npm install
```

## Run locally (dev)

### Start backend (port 8800)

```bash
cd api
npm start
```

### Start frontend (port 3000)

```bash
cd client
npm start
```

Open `http://localhost:3000`.

## API routes

Base URL: `http://localhost:8800/api`

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /posts`
- `GET /posts/:id`
- `POST /posts`
- `PUT /posts/:id`
- `DELETE /posts/:id`
- `POST /upload`

## Notes

- The React dev server proxies requests via `client/src/setupProxy.js` (e.g. `/posts` → `/api/posts`).
- Do **not** commit secrets. Put them in `api/.env` and configure environment variables in your hosting provider for production.

# simple_blog
