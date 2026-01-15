# Phase 6: Mobile Optimization & Production Deployment Specs

## 📅 Timeline: 2 Weeks (April 8 - April 21, 2026)

## 📌 Overview
Phase 6 prepares the "Master NGN Generator" for the real world. This phase focuses on turning the functional prototype into a robust, secure, and performant production application ready for 1000+ users. It emphasizes Mobile-First experiences and DevOps maturity.

## 🎯 Core Objectives
1.  **Mobile First**: Ensure the entire app (especially Quiz taking) is 100% usable on phone screens.
2.  **Performance**: Achieve Lighthouse scores > 90 and sub-500ms dashboard loads.
3.  **Security**: Harden Authentication, audit dependencies, and ensure data privacy.
4.  **Production Readiness**: CI/CD pipelines, Dockerization, Monitoring, and Backups.

---

## 1. 📱 Mobile-First Optimization

### Design System Updates (`components/mobile/`)
-   **Touch Targets**: Minimum 44px for all buttons.
-   **Navigation**:
    -   *Desktop*: Sidebar.
    -   *Mobile*: Fixed Bottom Tab Bar (Home, Quiz, Analytics, Profile).
-   **Layouts**:
    -   Single-column grids for mobile.
    -   Swipe gestures for "Next/Prev Question".
    -   Collapsible keypads for calculator.

### Responsive Breakpoints
-   **sm**: 640px (Phones)
-   **md**: 768px (Tablets)
-   **lg**: 1024px (Laptops)

---

## 2. 🛡️ Security Audit & Hardening

### Authentication
-   **JWT rotation**: Short-lived Access Tokens (15 min) + HttpOnly Refresh Tokens.
-   **Rate Limiting**: Limit API requests to 100/min per IP using Redis.

### Data Protection
-   **Response Data**: Encrypted at REST using AES-256.
-   **Sanitization**: All user inputs (Manual Context, notes) sanitized via `dompurify`.

---

## 3. 🚀 Performance Optimization

### Frontend (Vite)
-   **Code Splitting**: Lazy load routes (`React.lazy`).
-   **Image Opt**: Use `vite-plugin-image-optimizer` for WebP conversion.
-   **PWA**: Service Worker for offline caching of the "Daily Prescription".

### Backend (Node/Express)
-   **Caching**: Redis cache for `AnalyticsEngine` results (TTL 5 mins).
-   **Compression**: Gzip/Brotli compression for all text assets.
-   **Database**: Database indexing on `Attempts(userId, date)` and `Items(type, difficulty)`.

---

## 4. 🏭 Production Architecture

### Infrastructure (AWS/Vercel)
-   **Frontend**: Vercel (Edge Network).
-   **Backend**: AWS ECS (Fargate) or Render.com.
-   **Database**: Supabase / AWS RDS (Postgres).
-   **Redis**: Upstash / AWS ElastiCache.

### CI/CD Pipeline (GitHub Actions)
1.  **Build**: `npm run build`
2.  **Test**: `npm run test` (Unit) + Playwright (E2E).
3.  **Deploy Staging**: Auto-deploy to `staging.masterngn.com`.
4.  **Deploy Prod**: Manual approval to `app.masterngn.com`.

---

## 5. ✅ Completion Checklist

- [ ] **Mobile**:
    -   [ ] Implement Bottom Navigation Bar (Mobile only).
    -   [ ] Verify "Quiz Mode" on iPhone SE (small screen).
- [ ] **Performance**:
    -   [ ] Analyze bloat with `rollup-plugin-visualizer`.
    -   [ ] Implement `Suspense` loaders for Dashboard widgets.
- [ ] **Security**:
    -   [ ] Run `npm audit fix`.
    -   [ ] Add `helmet` headers to Express app.
- [ ] **DevOps**:
    -   [ ] Create `Dockerfile`.
    -   [ ] Configure `sentry.rn` for error tracking.
