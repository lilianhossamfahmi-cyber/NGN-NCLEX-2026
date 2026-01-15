# Fix Log: The "Cycle of Issues" (Server Stability & AI Errors)

**Date:** 2026-01-15  
**Severity:** Critical (System Unusable)  
**Components:** Backend Server (`server/index.ts`), AI Service, Frontend Connection

---

## 🚨 THE CYCLE OF SYMPTOMS

The user experienced a frustrating loop of issues:
1.  **"Items Disappeared"**: The Admin Panel shows 0 items.
2.  **"Connection Refused"**: The Frontend cannot talk to the Backend (Port 4000).
3.  **"Exit Code 0"**: The Backend server process terminates immediately after starting.
4.  **"Invalid JSON" / 500 Error**: When the server *is* running, AI generation fails.
5.  **"Blank Page"**: Frontend potentially crashing when API is unreachable.

---

## 🔍 ROOT CAUSE ANALYSIS

### 1. The "Server Restart Loop" (The Hidden Culprit)
**Diagnosis:**
The backend uses `tsx` to run the server. By default, or if implicit watching is active, `tsx` monitors file changes.
SQLite (`sqlite3`) modifies the database file (`itemBank.db`) and its journal files (`.db-journal`, `.wal`) upon initialization and operation.

**The Crash Cycle:**
1. Server Starts (`npm run dev:api`).
2. Database Initializes -> **Writes to `itemBank.db`**.
3. `tsx` detects file change -> **Triggers Restart**.
4. The "Old" server hasn't released Port 4000 yet.
5. The "New" server tries to bind Port 4000 -> **Fails (`EADDRINUSE`)**.
6. Server Process Exits.
7. Frontend sees `ERR_CONNECTION_REFUSED`.

### 2. The AI JSON Error
**Diagnosis:**
Use of `gemini-2.0-flash` without strict JSON enforcement allowed the AI to return conversational text (Markdown, explanations) alongside JSON, breaking the `JSON.parse` logic and causing `500 Internal Server Error`.

---

## ✅ APPLIED FIXES

### Fix 1: Break the Restart Loop (Server Stability)
**Action:** Updated `package.json` to explicitly **ignore** database files during watch mode.
**Code Change:**
```json
"dev:api": "tsx --watch --ignore itemBank.db --ignore itemBank.db-journal server/index.ts"
```
**Result:** The server now runs persistently and ignores DB writes, preventing self-sabotage/restarts.

### Fix 2: AI Robustness (JSON Mode)
**Action:** Enabled strict JSON MIME type in Gemini configuration.
**Code Change (`server/aiService.ts`):**
```typescript
generationConfig: {
    responseMimeType: "application/json"
}
```
**Result:** AI now returns pure, parseable JSON every time.

### Fix 3: Enhanced Prompt Engineering
**Action:** Rewrote `server/aiService.ts` to include "Golden Schemas" for all content types (Nurses Notes, Vitals, etc.).
**Result:** "Quick Actions" like "Generate Nurses Notes" now produce detailed, schema-compliant clinical data.

---

## 📋 PREVENTIVE MAINTENANCE (Future Reference)

If the **"Items Disappear"** or **"Connection Refused"** returns:

1.  **Check Terminal for "EADDRINUSE"**:
    If you see `Error: listen EADDRINUSE: address already in use :::4000`, it means a "zombie" process is holding the port.
    **Fix:** Run this PowerShell command to kill it:
    ```powershell
    try { Stop-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess -Force } catch {}
    ```

2.  **Verify Database Exclusion**:
    Ensure your runner (`tsx`, `nodemon`, etc.) **ALWAYS** ignores the `.db`, `.sqlite`, `.journal`, and `.wal` files.

3.  **Frontend Blank Page**:
    If the API is down, the Frontend might render nothing. Always check the **Network Tab** (F12) first. Red calls = Backend Issue.

---

*Document created: 2026-01-15 13:07*
