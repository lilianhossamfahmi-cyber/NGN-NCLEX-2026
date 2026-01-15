# Fix Log: AI Model 404 Error (Magic Fixer Feature)

**Date:** 2026-01-15  
**Severity:** Critical (Feature-Breaking)  
**Component:** Backend AI Service (`server/aiService.ts`)  
**Feature Affected:** Magic AI Fixer, Skeleton Item Generation

---

## 🚨 SYMPTOM

When using the "Magic AI Fixer" modal to generate content (e.g., Nurses Notes, H&P, Rationales), the following error appeared:

```
[GoogleGenerativeAI Error]: Error fetching from 
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent: 
[404 Not Found] models/gemini-1.5-flash is not found for API version v1beta, 
or is not supported for generateContent. 
Call ListModels to see the list of available models and their supported methods.
```

The Admin Panel also showed:
- `ERR_CONNECTION_REFUSED` errors (intermittent, due to server restarts)
- "No items found matching your criteria" (Items disappeared from grid)

---

## 🔍 INVESTIGATION PROCESS

### Step 1: Verify API Key
- **Location:** `.env` file
- **Variable:** `VITE_GEMINI_API_KEY`
- **Finding:** API key was present and valid (`AIzaSy...` format)

### Step 2: Verify Key Has Access to Models
- **Command Used:**
  ```powershell
  Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_KEY"
  ```
- **Finding:** The API returned a list of available models, confirming the key is valid.

### Step 3: Identify Available Models
- **Observation:** The API response listed models with prefix `models/gemini-2.0-flash`, `models/veo-*`, `models/imagen-*`, etc.
- **Missing Models:** The classic `gemini-1.5-flash`, `gemini-1.5-pro`, and `gemini-pro` models were NOT in the list or not accessible for `generateContent`.

### Step 4: Cross-Reference with Code
- **File:** `server/aiService.ts` (Line 21)
- **Original Code:**
  ```typescript
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  ```
- **Issue:** The code was requesting `gemini-1.5-flash`, but this model was not available/accessible for the API key.

---

## 🎯 ROOT CAUSE

**The Google Generative AI API key's accessible models changed.**

Possible reasons:
1. **Model Deprecation:** Google periodically retires older model aliases.
2. **Account Tier Change:** Free-tier keys may lose access to certain models over time.
3. **Regional Restrictions:** Some models are only available in specific regions.
4. **API Version Mismatch:** The `v1beta` API might have updated its model registry.

The older model aliases (`gemini-1.5-flash`, `gemini-pro`, `gemini-1.5-pro`) were returning `404 Not Found`, but the newer `gemini-2.0-flash` model was confirmed available.

---

## ✅ SOLUTION

### Fix Applied:
Changed the model identifier in `server/aiService.ts` from:
```typescript
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
```
To:
```typescript
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
```

### File Modified:
`server/aiService.ts` (Line 21)

### Backend Restart Required:
After modifying the file, the backend server must be restarted:
```powershell
# Kill existing process on port 4000
try { Stop-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess -Force } catch {}

# Start backend server
npm run dev:api
```

---

## 🔧 ADDITIONAL FIXES APPLIED DURING THIS SESSION

### 1. Environment Variable Loading (Preventive)
**File:** `server/index.ts`  
**Issue:** `dotenv` was only loaded in `aiService.ts`, not at server entry point.  
**Fix:** Added `dotenv` import at top of `server/index.ts`:
```typescript
import dotenv from 'dotenv';
dotenv.config();
```

### 2. Schema Update for Tags
**File:** `src/types/master-schema.ts`  
**Issue:** TypeScript error "Property 'tags' does not exist on type 'MasterQuestionItem'"  
**Fix:** Added `tags?: string[];` to the `MasterQuestionItem` interface.

### 3. Auto-Remove SKELETON Tag on Magic Fix
**File:** `src/components/admin/MagicFixModal.tsx`  
**Issue:** Items kept the "SKELETON" tag (purple glow) even after being fleshed out.  
**Fix:** Added logic to remove the tag on successful Magic Fix:
```typescript
const updatedTags = (newItem.tags || []).filter(t => t !== 'SKELETON');
```

---

## 📋 TROUBLESHOOTING CHECKLIST (For Future Issues)

If the Magic Fixer fails with `404 Not Found` error:

### 1. Verify API Key Exists
```powershell
# Check .env file
cat .env | Select-String "GEMINI"
```
Expected: `VITE_GEMINI_API_KEY=AIzaSy...`

### 2. List Available Models
```powershell
$key = "YOUR_API_KEY_HERE"
Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models?key=$key" | 
  Select-Object -ExpandProperty models | 
  Where-Object { $_.name -match "gemini" } | 
  Select-Object name, displayName
```

### 3. Find a Working Model
Look for models that support `generateContent`:
```powershell
$key = "YOUR_API_KEY_HERE"
(Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models?key=$key").models | 
  Where-Object { $_.supportedGenerationMethods -contains "generateContent" } | 
  Select-Object name
```

### 4. Update the Model in Code
Edit `server/aiService.ts` line 21:
```typescript
const model = genAI.getGenerativeModel({ model: "WORKING_MODEL_NAME" });
```

### 5. Restart Backend
```powershell
try { Stop-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess -Force } catch {}
npm run dev:api
```

---

## 📊 MODEL HISTORY

| Date | Model Used | Status |
|------|------------|--------|
| Before 2026-01-15 | `gemini-2.0-flash-exp` | Working (experimental) |
| 2026-01-15 Attempt 1 | `gemini-1.5-flash` | ❌ 404 Not Found |
| 2026-01-15 Attempt 2 | `gemini-1.5-flash-001` | ❌ 404 Not Found |
| 2026-01-15 Attempt 3 | `gemini-pro` | ❌ 404 Not Found |
| 2026-01-15 Attempt 4 | `gemini-1.5-pro` | ❌ 404 Not Found |
| 2026-01-15 Attempt 5 | `gemini-2.0-flash-exp` | ❌ 404 Not Found |
| 2026-01-15 **FINAL** | `gemini-2.0-flash` | ✅ Working |

---

## 🔗 RELEVANT FILES

- **AI Service:** `server/aiService.ts`
- **Server Entry:** `server/index.ts`
- **Environment:** `.env`
- **Magic Fixer Modal:** `src/components/admin/MagicFixModal.tsx`
- **Schema Types:** `src/types/master-schema.ts`

---

## 📝 NOTES

1. **Always use the Models API** to verify which models are available before assuming a model name works.
2. **Google's Generative AI models evolve** - model names that work today may not work tomorrow.
3. **The `@google/generative-ai` npm package** uses the `v1beta` API by default.
4. **Consider implementing a fallback mechanism** that tries multiple models if the primary fails.

---

## 💡 FUTURE IMPROVEMENT SUGGESTION

Add a health check endpoint that verifies AI connectivity:
```typescript
app.get('/api/ai/health', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Hello");
    res.json({ status: 'ok', model: 'gemini-2.0-flash' });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});
```

---

*Document created: 2026-01-15*  
*Last updated: 2026-01-15*
