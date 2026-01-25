# 📋 Deployment Guide: Rationale Master Fix

## Prerequisites

```bash
# Node.js 18+
# npm 9+
# Access to production environment
```

---

## Pre-Deployment Checklist

```bash
# 1. Run local build
npm run build
# Expected: "build completed successfully"

# 2. Run type checking
npx tsc --noEmit
# Expected: No errors

# 3. Run tests (when jest-environment-jsdom is installed)
npx jest src/__tests__/integration/RationaleFlow.integration.test.ts
# Expected: "6 passed"
```

---

## Deployment Process

### Step 1: Prepare Release
```bash
git checkout main
git pull origin main
npm ci
npm run build
```

### Step 2: Version Bump
```bash
npm version patch  # for bug fixes
# or
npm version minor  # for new features
```

### Step 3: Deploy to Staging
```bash
# Staging deployment (environment-specific)
npm run deploy:staging

# Wait for deployment to complete
# Verify in browser: https://staging.app.com

# Run smoke tests
npm run test:smoke
```

### Step 4: Deploy to Production
```bash
# Production deployment
npm run deploy:production

# Monitor deployment logs
npm run logs:production

# Verify features working
# - Open StudentPreviewModal
# - Click "Show Rationale"
# - Navigate between 5 tabs
# - Check console for diagnostic logs
```

### Step 5: Post-Deployment Validation

**Browser Console Check:**
```
✅ See these logs in console:
🔍 RationaleSheet: Starting rationale extraction...
✅ RationaleSheet: Successfully processed...
📊 UltimateRationale: Validating rationale structure...
✅ UltimateRationale: Rationale validation complete
```

**Feature Verification:**
- [ ] Item Overview tab displays difficulty and actions
- [ ] Option Review tab shows per-option analysis
- [ ] Clinical Logic tab displays NCJMM steps
- [ ] Strategy tab shows mnemonic and cheat sheet
- [ ] Knowledge tab shows anatomy/physiology/pharmacology
- [ ] Tab switching is smooth
- [ ] Fallback content shows if data missing
- [ ] No errors in production console

---

## Monitoring Post-Deployment

### Metrics to Track
- **Error Rate**: Monitor for unexpected errors in console
- **Feature Usage**: Track how many users open rationale
- **Performance**: Monitor tab switching latency
- **Data Completeness**: Track how often fallback rationale is used

### Alert Conditions
- Error rate > 1% → Investigate
- Fallback usage > 50% → Check data pipeline
- Tab switching latency > 100ms → Profile performance

---

## Rollback Procedure

If critical issues arise:

```bash
# 1. Identify issue from logs
# 2. Revert to previous version
git revert <commit-hash>
npm run build
npm run deploy:production

# 3. Investigate root cause
# 4. Fix and re-deploy
```

---

## Verification Commands

```bash
# Check build artifact size
npm run build -- --report

# Check for unused dependencies
npx depcheck

# Run full test suite
npx jest

# Check TypeScript
npx tsc --noEmit
```

---

## Environment Variables

Required for deployment:

```bash
VITE_API_BASE_URL=https://api.example.com
VITE_ENVIRONMENT=production
VITE_LOG_LEVEL=warn
```

---

## Support Contacts

- **Build Issues**: DevOps team
- **Type Errors**: Frontend team lead
- **Runtime Errors**: On-call engineer
- **Data Pipeline**: Backend team
