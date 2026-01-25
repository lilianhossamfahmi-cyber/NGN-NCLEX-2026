# 🔧 Troubleshooting Guide: Rationale Master Fix

## Common Issues & Solutions

---

### Issue 1: "Cannot read properties of undefined (reading 'content')"

**Error Message:**
```
TypeError: Cannot read properties of undefined (reading 'content')
```

**Root Cause:** `fullItem` or `question` is undefined

**Solution:**
1. Check StudentPreviewModal is passing `fullItem` correctly
2. Verify `cachedFullItem` state is loading data
3. Look for 🔴 logs indicating extraction failure
4. Component should use fallback rationale (check browser)

**Debug Steps:**
```typescript
// In RationaleSheet.tsx, add:
console.log('DEBUG: fullItem =', fullItem);
console.log('DEBUG: question =', question);
console.log('DEBUG: explicitRationale =', explicitRationale);
```

---

### Issue 2: Rationale tab shows "Reference information not available"

**Root Cause:** Data extraction failed, using default rationale

**Solution:**
- Check console for 🔴 error log
- Verify `fullItem.content.rationale` structure
- This is NORMAL if data is truly missing
- Fallback working as designed

**Debug Steps:**
```typescript
// In browser console:
// Open StudentPreviewModal with a question
// Click Show Rationale
// Look for logs:
console.log(/* Check if you see ✅ or 🔴 */);
```

---

### Issue 3: Tab switching appears frozen

**Root Cause:** Slow component rerender

**Solution:**
- Check if parent components are re-rendering unnecessarily
- Verify `fullItem`/`question` objects are stable (memoized if needed)
- Profile with React DevTools

**Debug Steps:**
```bash
# Enable React Profiler
npm run dev  # with REACT_PROFILER=true
# Open React DevTools → Profiler tab
# Click a tab
# Look for unexpected rerenders
```

---

### Issue 4: Console shows many duplicate logs

**Root Cause:** useEffect or useMemo running multiple times

**Solution:** NORMAL during development. In production:
- Check browser DevTools → disable all extensions
- Verify no console.log overrides
- Logs are diagnostic (can ignore)

---

### Issue 5: TypeScript error: "Property 'metadata' does not exist"

**Root Cause:** Type definition mismatch

**Solution:**
1. Run `npx tsc --noEmit`
2. Verify `RationaleDrawerProps` includes `metadata`
3. Check `src/types/index.ts` is up to date
4. Restart TypeScript language server in IDE

**File: src/types/index.ts**
```typescript
export interface RationaleDrawerProps {
  open: boolean;
  onClose: () => void;
  question?: QuestionConfig;
  fullItem?: FullItemData;
  metadata?: any; // ← Must be present
}
```

---

### Issue 6: Build fails: "jest-environment-jsdom not found"

**Root Cause:** `jest-environment-jsdom` not installed

**Solution:**
```bash
npm install --save-dev jest-environment-jsdom

# Or if using Yarn:
yarn add --dev jest-environment-jsdom

# Then run:
npm run build
```

---

### Issue 7: Rationale opens but shows nothing

**Root Cause:** Components not rendering, or CSS issue

**Solution:**
- Check browser DevTools → Elements tab
- Verify UltimateRationale div is present
- Check CSS not hiding content (z-index, display: none, etc.)
- Look for JavaScript errors in console

**Debug:**
```typescript
// In UltimateRationale.tsx, add:
useEffect(() => {
  console.log('UltimateRationale rendered with props:', {
    item, referenceInfo, difficulty, mnemonic, cheatSheet
  });
}, [item, referenceInfo, difficulty, mnemonic, cheatSheet]);
```

---

### Issue 8: Data extraction works in dev, fails in production

**Root Cause:** Environment difference (API, data format, etc.)

**Solution:**
- Check production API returns correct data format
- Verify `FullItemData` structure matches types
- Check error logs in production monitoring tool
- Look for 🔴 console logs

**Production Debug:**
```typescript
// Temporarily add:
useEffect(() => {
  if (!rationale?.referenceInfo?.anatomy) {
    console.warn('⚠️ PROD: Missing anatomy data', rationale);
  }
}, [rationale]);
```

---

### Issue 9: activeTab state not syncing between components

**Root Cause:** Tab state managed in wrong component

**Solution:**
- Verify `activeTab` is managed in RationaleSheet
- Check `onTabChange` callback is passed correctly to UltimateRationale
- Ensure tab IDs are strings ("0", "1", "2", etc.)

**Debug:**
```typescript
// In RationaleSheet.tsx:
console.log('Current activeTab:', activeTab);

// In UltimateRationale.tsx:
console.log('Received activeTab prop:', activeTab);
```

---

### Issue 10: Specialized feedback components not rendering

**Root Cause:** Missing review data (bowTieReview, highlightReview, etc.)

**Solution:**
- Check RationalePipeline is extracting specialized reviews
- Verify item type matches expected format
- Look for conditional rendering guards

**Debug:**
```typescript
// In UltimateRationale.tsx:
console.log('Review data:', {
  bowTieReview,
  highlightReview,
  clozeReview,
  orderedReview,
  matrixRows
});
```

---

## Diagnostic Checklist

When troubleshooting, go through this checklist:

- [ ] **Build Status**: Does `npm run build` succeed?
- [ ] **Types**: Does `npx tsc --noEmit` pass?
- [ ] **Console Logs**: Do you see expected 🔍 ✅ 📊 logs?
- [ ] **Fallback**: Does fallback content show if real data missing?
- [ ] **Browser Cache**: Have you hard-refreshed (Cmd+Shift+R / Ctrl+Shift+R)?
- [ ] **Network**: Check DevTools Network tab - API calls succeeding?
- [ ] **Data Structure**: Does `fullItem.content.rationale` match `CanonicalRationale` interface?
- [ ] **Props Flow**: Trace props through StudentPreviewModal → RationaleDrawer → RationaleSheet → UltimateRationale

---

## Debug Commands

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Build with verbose output
npm run build -- --debug

# Start dev server with logging
npm run dev
```

---

## Console Log Reference

| Emoji | Meaning                          |
|-------|----------------------------------|
| 🔍    | Starting operation               |
| ✅    | Success condition                |
| 📊    | Diagnostic information           |
| ⚠️    | Warning (fallback used)          |
| 🔴    | Error (data missing, using defaults) |

---

## Emergency Contacts

- **Build Issues**: DevOps
- **Type/Code Issues**: Frontend Lead
- **Runtime Errors**: On-call Engineer
- **Data Format Issues**: Backend Lead
