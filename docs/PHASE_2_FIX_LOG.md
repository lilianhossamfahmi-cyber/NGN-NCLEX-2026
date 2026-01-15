# Phase 2 Fix Log & Completion Report

## 🚀 Status: Phase 2 Completed
**Feature:** API & Scripts Setup, Bulk Generation, and Item Bank DB.

### ✅ Accomplishments
1. **Backend API (`server/index.ts`)**:
   - Implemented Express server on port 4000.
   - Connected to SQLite `itemBank.db`.
   - Added REST endpoints: `GET /items`, `POST /items/batch`, `DELETE`.
   - Enabled CORS and JSON body parsing (10mb limit).

2. **Database Service (`src/services/itemDbService.ts`)**:
   - Implemented SQLite table `item_bank` with schema:
     - `id, type_id, difficulty_level, clinical_focus` (indexed).
     - `item_json` (stores full JSON payload).
   - **FIXED**: Updated `saveBatchToBank` to correctly extract `difficultyLevel` and `clinicalFocus` from the nested `pedagogy` object in the schema, resolving `NOT NULL` constraint violations.

3. **Bulk Generator Script (`scripts/bulkGenerator.ts`)**:
   - **FIXED**: Added `dotenv` support to load API keys when running in CLI.
   - **FIXED**: Removed `cross-fetch` polyfill (native Node 18+ used).
   - **FIXED**: Updated `targetTypes` selection to pick small batches (3 types) instead of 'mix-all' to prevent AI response truncation.
   - **FIXED**: Logic maps `item.type` (from AI) to `item.typeId` (schema required) in `processGeneratedItem`.
   - Script now generates items, enriches them with Quality Scores, and pushes them to the DB.

4. **API Client (`src/services/itemApiService.ts`)**:
   - Implemented `saveBatchToBank` to post data to the server.
   - Updated environment variable detection (`process.env` fallback) for Node.js usage.

### 🐛 Resolved Issues
1. **Validation Error**: `difficulty_level` NULL constraint.
   - **Cause**: DB service was looking for `enriched.difficultyLevel` (root) instead of `enriched.pedagogy.difficultyLevel`.
   - **Fix**: Updated extraction logic in `itemDbService.ts`.

2. **Environment Variable Missing**: `VITE_GEMINI_API_KEY`.
   - **Cause**: CLI scripts don't load `.env` by default.
   - **Fix**: Added `dotenv` preload to `package.json` script.

3. **Crash on Startup**:
   - `cross-fetch` module resolution issues in ESM mode.
   - **Fix**: Removed explicit import in favor of native `fetch`.

### 📝 Next Steps (Phase 3)
1. **API Stability**: Ensure `npm run dev:api` runs consistently without `triggerUncaughtException` (likely transient environment/port issue).
2. **Frontend Integration**: Hook up "Student Mode" to fetch items from `http://localhost:4000/api/items`.
3. **Analytics**: Build the dashboard stats using the real DB counts.

---
### 🛠 How to Run
**Terminal 1 (Server):**
```bash
npm run dev:api
```

**Terminal 2 (Generator):**
```bash
npm run bulk:gen
```
