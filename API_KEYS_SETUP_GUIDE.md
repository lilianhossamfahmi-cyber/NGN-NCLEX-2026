# Adding API Keys to Vercel, Supabase, and GitHub

You have requested to update your deployment environments with the new Google Gemini API keys. Since this is a Vite application, the most critical place to update is **Vercel**.

## The Keys
**VITE_GEMINI_API_KEY**:
```
AIzaSyByp0jVBcHgNlRxdOikJdnxvVBiGdIei_w
```

**VITE_GEMINI_API_KEYS**:
```
AIzaSyByp0jVBcHgNlRxdOikJdnxvVBiGdIei_w, AIzaSyDp06qo99vyhYac9i36FMx50FCVNWJe0sU, AIzaSyCDqCMd-MUinG_iXR5lP4YGa9ar0xaJMUs
```

---

## 1. Vercel (Critical for Deployment)
Your application is built by Vercel. Because these variables start with `VITE_`, they must be present during the build process.

### Option A: Via Dashboard (Recommended)
1.  Go to your project dashboard at [vercel.com](https://vercel.com/dashboard).
2.  Navigate to **Settings** > **Environment Variables**.
3.  **Add the first key**:
    *   **Key**: `VITE_GEMINI_API_KEY`
    *   **Value**: (Copy the first key above)
    *   **Environments**: Check Production, Preview, and Development.
    *   Click **Save**.
4.  **Add the key list**:
    *   **Key**: `VITE_GEMINI_API_KEYS`
    *   **Value**: (Copy the long list above)
    *   **Environments**: Check Production, Preview, and Development.
    *   Click **Save**.
5.  **Redeploy**: Go to the **Deployments** tab and redeploy your latest commit for the changes to take effect.

### Option B: Via CLI
Since you have the Vercel CLI installed, you can run these commands in your terminal (one by one). You will be prompted to select the environments (select 'all' or just 'Production'):

```powershell
vercel env add VITE_GEMINI_API_KEY
# Paste: AIzaSyByp0jVBcHgNlRxdOikJdnxvVBiGdIei_w

vercel env add VITE_GEMINI_API_KEYS
# Paste: AIzaSyByp0jVBcHgNlRxdOikJdnxvVBiGdIei_w, AIzaSyDp06qo99vyhYac9i36FMx50FCVNWJe0sU, AIzaSyCDqCMd-MUinG_iXR5lP4YGa9ar0xaJMUs
```

---

## 2. GitHub (For Repository Secrets)
If you use GitHub Codespaces or plan to set up GitHub Actions later, store these as secrets.

1.  Go to your repository on GitHub.
2.  Navigate to **Settings** > **Secrets and variables** > **Actions**.
3.  Click **New repository secret**.
4.  Add `VITE_GEMINI_API_KEY` and its value.
5.  Add `VITE_GEMINI_API_KEYS` and its value.

---

## 3. Supabase (Only if using Edge Functions)
If you aren't using Supabase Edge Functions for AI, you might not need this. But if you are:

1.  Go to your project at [supabase.com](https://supabase.com/dashboard).
2.  Navigate to **Settings** > **Edge Functions**.
3.  Click **Add new secret**.
4.  Name: `GEMINI_API_KEY` (Note: Supabase functions usually don't use the `VITE_` prefix unless you specifically programmed them to).
5.  Value: (Copy the first key).
