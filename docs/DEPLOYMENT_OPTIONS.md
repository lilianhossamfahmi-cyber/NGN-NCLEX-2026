# ☁️ Deployment Guide

This guide outlines how to deploy the **Master NGN Generator** (Frontend + Backend) to the cloud.

## Recommended Stack: The "Modern Hybrid"
We recommend splitting the deployment:
1.  **Backend (API):** Deploy to **Railway** or **Render** (Support for long-running Node.js processes).
2.  **Frontend (App):** Deploy to **Vercel** (Best for Vite/React performance).

---

## 🚀 Part 1: Deploying the Backend (API)

**Why Railway/Render?**
The backend requires a persistent `Node.js` process to keep the AI engine and API listening. Serverless functions (Vercel Functions) have timeouts that will break long AI generation tasks.

**Steps:**
1.  **Push Code to GitHub:** Ensure your project is in a GitHub repository.
2.  **Sign up for Railway.app** (or Render.com).
3.  **Create New Service:**
    *   Connect your GitHub repo.
    *   Select the **Root Directory** as `/` (default).
    *   **Build Command:** `npm ci --include=dev` (or leave blank if using Dockerfile).
    *   **Start Command:** `npm start`
4.  **Environment Variables:**
    *   Go to "Variables" in Railway/Render.
    *   Add:
        *   `PORT` = `4000` (or `8080`, Railway usually overrides this automatically).
        *   `GEMINI_API_KEY` = `your_key_here`
        *   `SUPABASE_URL` = `your_supabase_url`
        *   `SUPABASE_KEY` = `your_supabase_key`
5.  **Get Public URL:** Once deployed, you will get a URL like `https://master-ngn-backend.up.railway.app`. **Copy this.**

**Docker Support (Included):**
We added a `Dockerfile` to the root. Railway/Render will automatically detect it and use it to build a rock-solid container environment.

---

## 🌐 Part 2: Deploying the Frontend

**Steps:**
1.  **Sign up for Vercel.com.**
2.  **Add New Project:** Import the same GitHub repository.
3.  **Build Settings:**
    *   Framework Preset: **Vite**
    *   Build Command: `npm run build`
    *   Output Directory: `dist`
4.  **Environment Variables:**
    *   Add `VITE_API_URL` and set it to your **Backend URL** from Part 1 (e.g., `https://master-ngn-backend.up.railway.app`).
    *   *Important:* Do NOT include the trailing slash `/` unless your code expects it. Usually `.../api` or just the domain.
    *   Add `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`.
5.  **Deploy:** Click Deploy.

---

## 🔄 Verification
1.  Open your Vercel URL.
2.  Open Chrome DevTools -> Network.
3.  Load an item. Check that calls go to `your-backend.railway.app/api/...` instead of `localhost:4000`.

## ⚠️ Important Production Notes
*   **Database:** Ensure your Supabase database is in "Production" mode (not free tier paused).
*   **CORS:** In `server/index.ts`, update the `cors` configuration to allow your Vercel domain:
    ```typescript
    app.use(cors({
        origin: [
            "http://localhost:7005",
            "https://your-vercel-app.vercel.app" // Add this after deployment
        ],
        credentials: true
    }));
    ```
