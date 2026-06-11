# Smart Expressway Management System

A production-ready full-stack web application designed for the Delhi-Dehradun Expressway. This system provides a comprehensive dashboard, interactive map routing, and advanced vehicle & toll management, powered by a robust DSA engine for complex graph and data queries.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Recharts, React Leaflet, Framer Motion
- **Backend**: Node.js, Express, JWT Authentication
- **Database**: MongoDB (Mongoose)
- **Algorithms**: Custom DSA Engine (Dijkstra, Bellman-Ford, Kruskal, Fenwick Tree, Bloom Filter)

## Installation Guide

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017 or a valid Atlas URI)

### 1. Database Setup
Ensure MongoDB is running locally. To seed the database with initial expressway data (Delhi, Baghpat, Shamli, Saharanpur, Dehradun):
```bash
cd backend
npm install
node src/seed.js
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## Deployment Guide

### Backend Deployment (Render / Heroku)
1. Push the `backend` folder to a GitHub repository.
2. Connect the repo to Render or Heroku as a Node web service.
3. Add the `MONGODB_URI` and `JWT_SECRET` environment variables.
4. Set the build command to `npm install` and start command to `node src/server.js`.

### Frontend Deployment (Vercel / Netlify)
1. Push the `frontend` folder to GitHub.
2. Connect it to Vercel or Netlify.
3. The build command will automatically be detected as `npm run build` and output directory as `dist`.
4. Ensure you set an environment variable `VITE_API_URL` to point to your deployed backend URL.
