# 🚀 NCLEX-NGN Generator - Deployment Guide

## ⚠️ **CRITICAL: API Key Security**

Your Gemini API key is: `AIzaSyDE2C4P0TlzUamCN7dnwhF1psD6QEEk94M`

**IMPORTANT:** This key is currently visible in the production build. For Vercel deployment, you MUST:
1. Add the API key to Vercel Environment Variables (not in code)
2. Never commit API keys to git

---

## 📋 Pre-Deployment Checklist

### ✅ Local Verification
- [ ] `npm run build` completes without errors
- [ ] `npm run preview` works correctly
- [ ] All 12 item types render properly
- [ ] Export to all 4 formats works (CSV, JSON, PDF, QTI)
- [ ] Analytics dashboard displays correctly
- [ ] Mobile responsiveness verified (375px, 768px)

### ✅ Security
- [ ] API key is in `.env` (not committed)
- [ ] `.gitignore` includes `.env`
- [ ] No `console.log` in production (terser removes them)
- [ ] Security headers configured in `vercel.json`

---

## 🔧 Vercel Deployment Steps

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Production-ready build"
git push origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects Vite framework

### Step 3: Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_GEMINI_API_KEY` | `AIzaSyDE2C4P0TlzUamCN7dnwhF1psD6QEEk94M` | Production |
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | Production |
| `VITE_SUPABASE_ANON_KEY` | `your-anon-key` | Production |
| `VITE_FEATURE_AI` | `true` | Production |
| `VITE_FEATURE_EXPORT` | `true` | Production |
| `VITE_FEATURE_DEDUPE` | `true` | Production |

**Important:** Check "Automatically expose System Environment Variables"

### Step 4: Supabase Database Setup

1. Log in to [Supabase](https://supabase.com)
2. Go to your Project → SQL Editor
3. Run the migrations found in `supabase/migrations/*.sql`
4. Specifically ensure `20260121_add_item_bank.sql` is run to enable local analytics.

### Step 5: Deploy

1. Click "Deploy"
2. Wait for build to complete (~1-2 minutes)
3. Visit your deployment URL

---

## 📁 Project Structure for Deployment

```
MASTER NGN GENERATOR/
├── dist/                    # Production build output
├── src/                     # Source code
├── public/                  # Static assets
├── .env                     # Local env vars (NOT committed)
├── .env.example             # Template for developers
├── vercel.json              # Vercel configuration
├── vite.config.ts           # Build configuration
└── package.json             # Dependencies
```

---

## 🔐 Security Headers (vercel.json)

The deployment includes these security headers:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-XSS-Protection` | `1; mode=block` | XSS protection |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer info |
| `Permissions-Policy` | `camera=(), microphone=()` | Disable device access |

---

## ⚡ Build Optimization

### Code Splitting (vite.config.ts)

| Chunk | Contents | Approx Size |
|-------|----------|-------------|
| `vendor-react` | React, React-DOM | ~150KB |
| `vendor-charts` | Recharts | ~200KB |
| `vendor-pdf` | jsPDF | ~100KB |
| `vendor-ai` | Google Generative AI | ~50KB |
| `vendor-icons` | Lucide React | ~30KB |
| Main bundle | App code | ~300KB |

### Production Optimizations
- ✅ Console logs removed (`drop_console: true`)
- ✅ Debugger statements removed (`drop_debugger: true`)
- ✅ Terser minification enabled
- ✅ Long-term asset caching (1 year)
- ✅ Gzip compression (~350KB total)

---

## 🧪 Post-Deployment Testing

### Functional Tests
1. [ ] Generate 10 items (various types)
2. [ ] Verify scoring accuracy
3. [ ] Export to CSV, JSON, PDF, QTI
4. [ ] Test on iPhone SE (375px)
5. [ ] Test on iPad (768px)
6. [ ] Run keyboard navigation test
7. [ ] Check analytics dashboard

### Performance Tests
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s

### Security Tests
- [ ] API key not visible in Network tab
- [ ] No exposed secrets in source
- [ ] HTTPS enforced
- [ ] Security headers present

---

## 🔄 Continuous Deployment

Vercel automatically deploys on:
- Push to `main` branch → Production
- Pull requests → Preview deployments

### Branch Protection (Recommended)
1. Go to GitHub repo → Settings → Branches
2. Add rule for `main`
3. Require pull request reviews
4. Require status checks

---

## 📊 Monitoring

### Vercel Analytics
1. Enable in Project Settings → Analytics
2. Track:
   - Page views
   - Web Vitals
   - Error rates

### Error Tracking (Optional)
Consider adding:
- Sentry for error tracking
- LogRocket for session replay

---

## 🚒 Rollback

If deployment fails:
1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

---

## 📞 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Redeploy after adding variables
- Check "Automatically expose" is enabled

### API Key Issues
- Verify key is valid at [Google AI Studio](https://aistudio.google.com)
- Check quota limits
- Ensure billing is enabled (if required)

---

## ✅ Deployment Complete Checklist

- [ ] GitHub repository connected
- [ ] Environment variables configured
- [ ] Production build deployed
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic)
- [ ] All tests passing
- [ ] Monitoring enabled

---

**Deployment URL:** `https://your-project.vercel.app`

**Last Updated:** 2026-01-01
