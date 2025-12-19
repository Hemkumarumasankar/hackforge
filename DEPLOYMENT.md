# 🚀 Deployment Guide for Nexus Submission Portal

This guide will walk you through deploying the **Frontend** (React/Vite) to **Vercel** and the **Backend** (Express/Node.js) to **Railway**.

---

## 🏗️ 1. Deploying the Backend (Railway)

We deploy the backend first because the frontend needs the backend URL.

### Steps:
1.  **Push your code to GitHub** (Create a repo and push this project).
2.  Go to [Railway.app](https://railway.app/) and sign up/login.
3.  Click **"New Project"** -> **"Deploy from GitHub repo"**.
4.  Select your repository.
5.  **Important**: Railway might try to deploy the root. We need to deploy the `server` folder.
    - Go to **Settings** -> **Root Directory** -> Set to `/server`.
6.  **Environment Variables**:
    - Go to **Variables** tab.
    - Add the variables from your `server/.env` file:
        - `PORT`: `3001` (or let Railway assign one, usually `PORT` is auto-assigned)
        - `MOCK_MODE`: `false`
        - `USE_FILE_REQUEST`: `false`
        - `SENESENSE_MEGA_EMAIL`: `...`
        - `SENESENSE_MEGA_PASSWORD`: `...`
        - (And so on for other companies...)
7.  **Build Command**: Railway usually auto-detects `npm run build`.
8.  **Start Command**: `npm start` (Make sure your `package.json` has `start: "node dist/server.js"`).
9.  **Deploy**: Railway will build and deploy.
10. **Copy URL**: Once deployed, copy the provided URL (e.g., `https://nexus-backend.up.railway.app`).

---

## 🌐 2. Deploying the Frontend (Vercel)

Now we deploy the frontend UI.

### Steps:
1.  Go to [Vercel.com](https://vercel.com/) and sign up/login.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import the **Same GitHub Repository**.
4.  **Framework Preset**: Select **Vite**.
5.  **Root Directory**: Click "Edit" and select the root folder (default).
6.  **Environment Variables**:
    - Add a new variable:
        - **Name**: `VITE_API_URL`
        - **Value**: The **Backend URL** you copied from Railway (e.g., `https://nexus-backend.up.railway.app`) (Note: No trailing slash).
7.  Click **Deploy**.

---

## 🔒 3. Final Configuration (CORS)

Once the frontend is deployed and you have its URL (e.g., `https://nexus-portal.vercel.app`), you need to tell the backend to allow requests from it.

1.  Go back to **Railway**.
2.  Go to **Variables**.
3.  Add/Update `ALLOWED_ORIGIN` (You might need to update the server code to read this variable, currently it's hardcoded to localhost).

### ⚠️ IMPORTANT: Update Server Code for CORS
Before deploying, update `server/src/server.ts` to allow production domains:

```typescript
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL // Add this env var!
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
```

Then add `FRONTEND_URL` = `https://your-frontend.vercel.app` in Railway variables.

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Railway
- [ ] Backend Env Vars set (MEGA credentials, MOCK_MODE=false)
- [ ] Backend has `FRONTEND_URL` set to Vercel URL
- [ ] Frontend deployed to Vercel
- [ ] Frontend has `VITE_API_URL` set to Railway URL
- [ ] Test a small upload to verify connectivity
- [ ] Test a large upload (1GB+) to verify timeouts

---

## 🆘 Troubleshooting

- **"Network Error" on Vercel**: Check if `VITE_API_URL` is set correctly (no trailing slash). Check standard browser console logs.
- **"CORS Error"**: Check if Backend has the correct `FRONTEND_URL` allowed.
- **Upload stops at 100%**: Normal for large files (server -> MEGA transfer). Be patient.
