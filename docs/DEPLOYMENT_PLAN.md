# 🚀 Full-Stack Deployment Plan (with Supabase)

This updated plan covers deploying the **Master NGN Generator** as a fully functional application with **User Accounts**, **Data Saving**, and **History**.

---

## 🏗️ Phase 1: Accounts & Backend Setup

To make the app "Fully Functional," we need a place to store user data. We will use **Supabase** (an open-source Firebase alternative).

### 1. Create Supabase Project
1.  Go to [https://supabase.com](https://supabase.com) and sign up (free tier is sufficient).
2.  Click **"New Project"**.
3.  Name: `master-ngn-generator`.
4.  Password: Generate a strong database password and **save it**.
5.  Region: Choose one close to you (e.g., East US).
6.  Click **"Create New Project"**.

### 2. Configure Database (The Easy Way)
We need to set up the tables (Users, Questions). I have prepared a script for you.
1.  In your Supabase Dashboard, go to the **SQL Editor** (icon on the left).
2.  Click **"New Query"**.
3.  Open the file `docs/SUPABASE_SCHEMA.sql` from your local project.
4.  **Copy and Paste** the entire content into the Supabase SQL Editor.
5.  Click **"Run"**.
    *   *Result: This creates your `profiles`, `generated_items` tables and sets up security.*

### 3. Get API Keys
1.  Go to **Project Settings** (gear icon) > **API**.
2.  Find **Project URL** and **`anon` / `public` Key**.
3.  **Copy these**—you will need them for Vercel.

---

## � Phase 2: Security & AI Setup

### 1. Google AI Studio (Gemini)
*   **Action**: Ensure you have your `AIza...` key ready.
*   **Security**: As before, restrict this key to your Vercel domain in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

### 2. Authentication Settings (Supabase)
1.  Go to **Authentication** > **Providers** in Supabase.
2.  Ensure **Email/Password** is enabled.
3.  (Optional) Enable Google Auth if you want "Sign in with Google" (requires extra Google Cloud setup).

---

## 🛠️ Phase 3: Deployment on Vercel

### Step 1: Push Code to GitHub
(If you haven't already)
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Project in Vercel
1.  Log in to [Vercel](https://vercel.com).
2.  **Add New... > Project**.
3.  Import `master-ngn-generator`.

### Step 3: Configure Environment Variables (Crucial)
You need to add **3 Keys** in Vercel during setup:

| Key | Value Source | Purpose |
| :--- | :--- | :--- |
| `VITE_GEMINI_API_KEY` | Google AI Studio | Powers the AI generation. |
| `VITE_SUPABASE_URL` | Supabase Settings > API | Connects to your backend. |
| `VITE_SUPABASE_ANON_KEY` | Supabase Settings > API | Allows the app to talk to the DB securely. |

### Step 4: Deploy
1.  Click **"Deploy"**.
2.  Wait for the confetti! 🎉

---

## � Phase 4: Application Update (Code Integration)

**⚠️ IMPORTANT:** Your *current* code is still Client-Side only. To make it "Fully Functional" with the database we just set up, we need to add the connection logic.

**Next Steps for Developer (Me):**
1.  Install Supabase Client: `npm install @supabase/supabase-js`
2.  Create `src/lib/supabase.ts` to initialize the connection.
3.  Build the **Auth Pages** (Login / Sign Up).
4.  Update the **"Save" Button** to write to Supabase instead of downloading a file.
5.  Create a **"History" Dashboard** to load saved items from Supabase.

*Shall I proceed with these Code Integration steps now?*
