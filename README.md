# Ubuntu Project

The Ubuntu-Project App

## 📁 Project Structure

```
ubuntu-project/
├── frontend/          # React app (deploy to GitHub Pages)
├── backend/           # Node.js/Express API
└── README.md
```

## 🚀 Quick Start

### Frontend (React App)
```bash
cd frontend
npm install
npm run dev
```
- Runs on: http://localhost:5173
- Deploy to: GitHub Pages

### Backend (Express API)
```bash
cd backend
npm install
cp env.example .env
npm run dev
```
- Runs on: http://localhost:3001
- Deploy to: Railway, Render, or Vercel

## 🔧 Development

1. **Start both servers:**
   ```bash
   # Terminal 1 - Frontend
   cd frontend && npm run dev
   
   # Terminal 2 - Backend  
   cd backend && npm run dev
   ```

2. **Frontend** will connect to backend via API calls
3. **Backend** provides authentication and data APIs

## 🔐 Authentication

Using JWT tokens with secure authentication flow.