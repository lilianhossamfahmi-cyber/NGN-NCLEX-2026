# 🔧 HIGHLIGHT ITEM FIXES LOG

**Date:** January 9, 2026  
**Status:** ✅ COMPLETE  
**Author:** AI Assistant  

---

## 📋 EXECUTIVE SUMMARY

This document details the comprehensive fixes applied to the **Highlight Item** type to resolve multiple issues with:
- Correct/Incorrect status mismatches between Question Screen and Rationale Modal
- Generic fallback rationale messages instead of specific clinical explanations
- Scoring calculation failures
- Dark, unreadable UI in the Option Review tab

---

## 🐛 ISSUES IDENTIFIED

### Issue 1: Correctness Status Mismatch
**Symptom:** An item shown as "Correct" (green) on the Question Screen was displayed as "Incorrect" (red) in the Clinical Reasoning Modal's Option Review tab.

**Root Cause:** The `RationalePipeline.ts` used a simplistic matching logic:
```typescript
const isCorrect = correctSet.has(item.id);
```
While the `HighlightRenderer.tsx` used a more robust matching:
```typescript
const isCorrect = correctSet.has(id) || correctSet.has(cleanText) || correctSet.has(normText);
```

### Issue 2: AI-Generated Keys with Trailing Commas
**Symptom:** TokenMap keys and correctIds were not matching span IDs.

**Root Cause:** The AI was generating malformed JSON with trailing commas and spaces in keys:
```json
{
  "correct": ["h1, ", "h2, ", "h3, "],  // ❌ Malformed
  "tokenMap": {
    "h1, ": { "whyCorrect": "..." }     // ❌ Malformed
  }
}
```
When comparing with extracted span IDs (`h1`, `h2`), no matches were found.

### Issue 3: Generic Rationale Messages
**Symptom:** "Why This is Correct" showed generic text like "Correct finding indicating clinical significance."

**Root Cause:** 
1. Old items didn't have `tokenMap` data
2. Golden Prompt didn't require specific `whyCorrect`/`whyIncorrect` fields
3. Pipeline wasn't looking in the correct location for `tokenMap`

### Issue 4: Dark, Unreadable UI
**Symptom:** The Option Review tab had a dark slate-900 background making text hard to read.

---

## ✅ FIXES APPLIED

### Fix 1: Robust Correctness Matching
**File:** `src/services/RationalePipeline.ts`

Added text normalization and multi-source matching:
```typescript
// Robustly build correct set (EXACTLY matching HighlightRenderer logic)
const normalizeText = (text: string) => text.toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, " ").trim();

const checkIsCorrect = (id: string, text: string) => {
    const cleanText = text.trim();
    const normText = normalizeText(cleanText);
    return correctSet.has(id) || correctSet.has(cleanText) || correctSet.has(normText);
};
```

---

### Fix 2: Normalize AI-Generated Keys
**File:** `src/services/RationalePipeline.ts`

#### 2a. Normalize `correctIds` in Score Calculation
```typescript
export function calculateHighlightScore(userAnswers, config) {
    const rawCorrectIds = config.correct || config.correctIds || [];
    
    // Normalize: remove trailing commas/spaces like "h1, " → "h1"
    const correctIds = rawCorrectIds.map((id: string) => 
        typeof id === 'string' ? id.replace(/[,\s]+$/, '').trim() : id
    );
    // ...
}
```

#### 2b. Normalize `correctSet` Values
```typescript
const addToCorrect = (val: any) => {
    if (val === undefined || val === null) return;
    // Normalize: remove trailing commas/spaces
    const cleanVal = typeof val === 'string' ? val.replace(/[,\s]+$/, '').trim() : String(val);
    correctSet.add(cleanVal);
    correctSet.add(normalizeText(cleanVal));
};
```

#### 2c. Normalize `tokenMap` Keys
```typescript
const rawTokenMap = highlightConfig.tokenMap || config.tokenMap || {};

// Normalize tokenMap keys (handle "h1, " → "h1")
const tokenMap: Record<string, any> = {};
Object.entries(rawTokenMap).forEach(([key, value]) => {
    const normalizedKey = key.replace(/[,\s]+$/, '').trim();
    tokenMap[normalizedKey] = value;
});
```

---

### Fix 3: Extract Nested Config Structure
**File:** `src/services/RationalePipeline.ts`

The config object may have the structure nested:
```typescript
// Extract the actual structure config (may be nested)
const highlightConfig = config.structure || config.content?.structure || config;

// Check both locations for tokenMap
const rawTokenMap = highlightConfig.tokenMap || config.tokenMap || {};

// Check both locations for correct arrays
const correctArray = highlightConfig.correct || config.correct || [];
const correctIdsArray = highlightConfig.correctIds || config.correctIds || [];
```

---

### Fix 4: Updated Golden Prompt
**File:** `docs/external_prompts/Golden Prompts/Golden-NGN-Highlight-Item.md`

#### 4a. New TokenMap Format with `whyCorrect`/`whyIncorrect`
```markdown
- **Token Map (MANDATORY):** You MUST provide a `tokenMap` object in `structure`.
  - Keys must match span IDs (`h1`, `h2`...).
  - Values must contain `{ "isCorrect": boolean, "whyCorrect": "...", "whyIncorrect": "..." }`.
  - **For CORRECT items:** Provide detailed `whyCorrect`. Set `whyIncorrect` to "N/A".
  - **For INCORRECT items:** Provide detailed `whyIncorrect`. Set `whyCorrect` to "N/A".
```

#### 4b. Explicit Forbidden Generic Phrases
```markdown
  - **FORBIDDEN GENERIC PHRASES:**
    - ❌ "This is correct."
    - ❌ "This is a distractor."
    - ❌ "Correct finding indicating clinical significance."
    - ❌ "This finding is not a priority."
  - **REQUIRED SPECIFIC EXPLANATIONS:**
    - ✅ "Tachycardia (HR 112) indicates compensatory response to hypovolemia from ectopic rupture."
    - ✅ "Smoking history is a chronic risk factor, not an acute assessment finding requiring immediate action."
```

#### 4c. Example TokenMap in JSON
```json
"tokenMap": {
  "h1": { 
    "isCorrect": true,
    "whyCorrect": "Sudden chest pain is a cardinal sign of acute myocardial ischemia requiring immediate intervention.",
    "whyIncorrect": "N/A"
  },
  "h3": { 
    "isCorrect": false,
    "whyCorrect": "N/A",
    "whyIncorrect": "Hypertension is a chronic historical finding, not an acute assessment finding requiring immediate action."
  }
}
```

---

### Fix 5: Updated HighlightSpan Type
**File:** `src/types/RationaleTypes.ts`

Added new fields to the interface:
```typescript
export interface HighlightSpan {
    id: string;
    text: string;
    status: 'correct' | 'incorrect' | 'missed' | 'neutral';
    rationale: string;
    whyCorrect?: string;    // ← NEW
    whyIncorrect?: string;  // ← NEW
    description?: string;
}
```

---

### Fix 6: Pipeline Extracts whyCorrect/whyIncorrect
**File:** `src/services/RationalePipeline.ts`

```typescript
extractedItems.forEach(item => {
    const tokenData = tokenMap[item.id] || {};
    const whyCorrect = tokenData.whyCorrect || (isCorrect ? "Correct finding indicating clinical significance." : "N/A");
    const whyIncorrect = tokenData.whyIncorrect || (!isCorrect ? "This finding is a distractor - not clinically significant in this context." : "N/A");

    // Fallback rationale (for legacy tokenMap format with single 'rationale' field)
    const legacyRationale = tokenData.rationale;
    const displayRationale = legacyRationale || (isCorrect ? whyCorrect : whyIncorrect);

    spanRecord[item.id] = {
        id: item.id,
        text: item.text,
        status: status,
        rationale: displayRationale,
        whyCorrect: whyCorrect,
        whyIncorrect: whyIncorrect,
        description: isCorrect ? "Priority Finding" : "Distractor"
    };
});
```

---

### Fix 7: Modern Light Theme UI
**File:** `src/components/feedback/HighlightFeedback.tsx`

#### 7a. Light Paper Background
```tsx
<div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50/80 via-white to-slate-50 overflow-hidden shadow-xl relative">
```

#### 7b. Blue Professional Header
```tsx
<div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-500/20">
```

#### 7c. Vibrant Highlight Colors (Light Theme)
```tsx
if (spanData.status === 'correct') {
    styleClass = "bg-emerald-100 border-b-2 border-emerald-500 text-emerald-800 font-semibold";
} else if (spanData.status === 'incorrect') {
    styleClass = "bg-red-100 border-b-2 border-red-500 text-red-800 font-semibold";
} else if (spanData.status === 'missed') {
    styleClass = "border-2 border-dashed border-amber-500 text-amber-800 bg-amber-50 rounded px-1 font-medium";
}
```

#### 7d. Separate Why Correct / Why Incorrect Cards
The Insight Card now shows:
- **Green Box**: "Why This is Correct" (only for correct items)
- **Red Box**: "Why This is Incorrect" (only for incorrect items)
- **Fallback**: Generic "Clinical Rationale" for legacy data

---

## 📁 FILES MODIFIED

| File | Changes |
|------|---------|
| `src/services/RationalePipeline.ts` | Robust correctness matching, key normalization, structure extraction, whyCorrect/whyIncorrect extraction |
| `src/types/RationaleTypes.ts` | Added `whyCorrect` and `whyIncorrect` to `HighlightSpan` interface |
| `src/components/feedback/HighlightFeedback.tsx` | Light theme, modern design, separate why correct/incorrect cards |
| `docs/external_prompts/Golden Prompts/Golden-NGN-Highlight-Item.md` | Mandatory tokenMap with specific whyCorrect/whyIncorrect fields |

---

## 🧪 TESTING CHECKLIST

- [x] Question Screen shows correct green/red highlighting
- [x] Option Review tab shows SAME green/red highlighting
- [x] Score calculation works correctly (e.g., 2/6)
- [x] Expert HUD shows matching score
- [x] Click on token shows specific "Why This is Correct" or "Why This is Incorrect"
- [x] Light theme is readable and visually engaging
- [x] Legend clearly explains color meanings
- [x] Legacy items (without tokenMap) fallback to generic messages gracefully

---

## ⚠️ KNOWN LIMITATIONS

1. **Legacy Items:** Items generated before the Golden Prompt update will show generic fallback messages. To get specific explanations, regenerate the item.

2. **AI Key Format Errors:** Some AI models may still generate malformed keys. The normalization handles trailing `, ` but other formats may require additional handling.

---

## 🚀 FUTURE IMPROVEMENTS

- [ ] Add validation in the ingestion pipeline to alert on malformed JSON keys
- [ ] Consider auto-fixing malformed keys during item import
- [ ] Add unit tests for `calculateHighlightScore` with various input formats

---

**END OF FIX LOG**
