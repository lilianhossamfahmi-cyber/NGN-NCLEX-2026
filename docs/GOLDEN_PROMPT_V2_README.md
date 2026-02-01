# Golden Prompt V2 Implementation Complete

**Date**: January 30, 2026  
**Status**: ✅ Implementation Complete

---

## What Was Implemented

### 1. Golden Prompt V2 Template
**File**: `src/prompts/case-study-golden-v2.md`

A comprehensive AI prompt template that:
- Enforces ZERO TOLERANCE validation rules
- Contains exact JSON schema templates for all 6 CJMM screens
- Lists all banned generic phrases
- Requires minimum 15-word rationales
- Includes pre-generation validation checklist

### 2. Case Study Generator V2 Service
**File**: `src/services/CaseStudyGeneratorV2.ts`

A browser/Node.js compatible service that:
- Loads and prepares the golden prompt
- Parses AI responses (handles markdown code blocks)
- Validates generated case studies with built-in rules
- Works in both browser and Node.js environments

### 3. Admin Dashboard Integration
**File**: `src/components/admin/AdminDashboard.tsx`

Added two new buttons:
- **Generate V2** (green) - Prompts for topic, copies golden prompt to clipboard
- **Validate & Import** (purple) - Uploads JSON, validates, and imports to item bank

### 4. CLI Generation Script
**File**: `scripts/generateCaseStudy.ts`

Usage:
```bash
npx ts-node scripts/generateCaseStudy.ts "Septic Shock"
```

Generates the prompt file and provides next-step instructions.

### 5. Workflow Documentation
**File**: `.agent/workflows/golden-prompt-v2-plan.md`

Comprehensive plan including:
- Historical error analysis
- Minimal file architecture
- Screen-by-screen templates
- Implementation checklist
- Quality assurance guidelines

---

## How to Use

### Method 1: Via Admin Dashboard (Recommended)

1. Open the Admin Dashboard
2. Click **"Generate V2"** button
3. Enter a topic (e.g., "Septic Shock", "Acute PE", "DKA")
4. Prompt is copied to clipboard
5. Paste into ChatGPT, Claude, or Gemini
6. Get the JSON response
7. Save as `.json` file
8. Click **"Validate & Import"** and select the file
9. Case study is validated and added to item bank

### Method 2: Via CLI

1. Generate prompt:
   ```bash
   npx ts-node scripts/generateCaseStudy.ts "Septic Shock"
   ```

2. Open the generated prompt file in `src/dataStore/_prompt_septic_shock.md`

3. Paste into AI and get JSON response

4. Save response as JSON file

5. Validate:
   ```bash
   npx ts-node scripts/validate_case_study.ts src/dataStore/my_case.json
   ```

---

## Error Prevention Features

The Golden Prompt V2 prevents all historical errors:

| Error | Prevention |
|-------|------------|
| Missing rationales | Explicit requirement with examples |
| String Bow-Tie pools | Template shows object format |
| Wrong `highlightReview` key | Explicit ban, correct key shown |
| Generic phrases | Banned list included in prompt |
| Empty rationales | Minimum 15-word requirement |
| Inconsistent fields | Standardized templates |

---

## Validation Summary

All existing case studies pass validation:
- ✅ `case-acute-hf-cardiogenic-shock.json` - 0 errors
- ✅ `critical_care_case_study.json` - 0 errors
- ✅ `david_asthma_corrected.json` - 0 errors
- ✅ `generated_pe_case_1769779084880.json` - 0 errors

Build status: ✅ Successful (3m 55s)

---

## Next Steps

1. **Test the workflow**: Generate a new case study using the V2 system
2. **Validate pass rate**: Confirm AI-generated cases pass validation on first try
3. **Iterate on prompt**: If errors occur, update prompt with additional guardrails
4. **Train content creators**: Share the workflow documentation
