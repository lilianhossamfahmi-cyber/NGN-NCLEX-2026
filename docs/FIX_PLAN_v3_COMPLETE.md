# 🔧 GOLDEN CASE STUDY - COMPLETE FIX PLAN v3.0

**Document Version:** 3.0 (Complete Overhaul)  
**Created:** 2026-01-03  
**Status:** Ready for Implementation  

---

## ❌ IDENTIFIED ISSUES (From Testing)

### A. PROMPT ISSUES (AI Output is Wrong)

| # | Issue | Current State | Required State |
|:--|:------|:--------------|:---------------|
| 1 | Bow-Tie (Q4) options | 2 per section | **Minimum 4 per section** |
| 2 | Highlight (Q1) - all correct | No incorrect spans | **Must have decoy/incorrect spans** |
| 3 | Nurses Notes | 1 or 0 entries | **Minimum 2 entries for Level 4-5** |
| 4 | History & Physical | Empty | **Must have H&P data** |
| 5 | Medical Orders | Empty | **Must have orders** |
| 6 | Radiology | "No Imaging" | **Include if relevant to case** |
| 7 | Matrix options | May be too few | **Minimum 4 rows** |
| 8 | Ordered Response | May be too few | **Minimum 5 steps** |
| 9 | Multiple Response | May be too few | **Minimum 5 options** |

### B. CODE ISSUES (Rendering/Logic Problems)

| # | Issue | Component | Fix |
|:--|:------|:----------|:----|
| 1 | Q5 (Drop-Cloze) not working | Renderer | Check DropClozeRenderer |
| 2 | Knowledge tab generic | enrichRationale() | Use case-specific content |
| 3 | Pass Probability unrealistic | ExpertDashboard | Needs proper calculation |

---

## 📋 IMPLEMENTATION PLAN

### PHASE 1: FIX GOLDEN PROMPT (Critical)

**File:** `docs/external_prompts/Golden Prompts/Golden-NGN-Case-Study-6Q.md`

#### 1.1 Add MINIMUM OPTION COUNTS Section

```markdown
## 🔢 MINIMUM OPTION COUNTS (MANDATORY)

For DIFFICULTY LEVEL 4-5, you MUST meet these minimums:

| Screen | Type | Minimum Options | Notes |
|:-------|:-----|:---------------:|:------|
| 1 | Highlight | 6 spans (3 correct, 3 incorrect) | Mix of relevant and decoy findings |
| 2 | Matrix | 5 rows, 3 columns | Each row must have ONE correct column |
| 3 | Ordered Response | 5-6 steps | Order matters for scoring |
| 4 | Bow-Tie | 4+ actions, 3+ conditions, 4+ parameters | AT LEAST 4 PER SECTION |
| 5 | Drop-Cloze | 3-4 blanks, 4 options each | Each dropdown needs 4 choices |
| 6 | Multiple Response | 6 options (3-4 correct) | SATA format |

**CRITICAL FOR BOW-TIE (Screen 4):**
- Actions: Minimum 4 (2 correct, 2 incorrect)
- Conditions: Minimum 3 (1 correct, 2 incorrect)
- Parameters: Minimum 4 (2 correct, 2 incorrect)
```

#### 1.2 Add CLINICAL DATA REQUIREMENTS Section

```markdown
## 🏥 CLINICAL DATA REQUIREMENTS (Level 4-5)

For Expert-level (Level 4-5) Case Studies, you MUST include:

### Nurses Notes (Minimum 2 entries)
```json
"history": [
  {
    "time": "0800",
    "entry": "<p><strong>Chief Complaint:</strong> Detailed presenting symptoms...</p><p><strong>Nursing Assessment:</strong> Physical findings, patient statements, vital signs context...</p>",
    "author": "RN Smith"
  },
  {
    "time": "0930",
    "entry": "<p><strong>Follow-up Assessment:</strong> Changes noted, interventions performed, patient response...</p>",
    "author": "RN Smith"
  }
]
```

### History & Physical (REQUIRED)
```json
"historyPhysical": {
  "chiefComplaint": "Detailed CC",
  "hpi": "Full history of present illness narrative",
  "pmh": ["Condition 1", "Condition 2"],
  "medications": ["Med 1 dose route", "Med 2 dose route"],
  "allergies": "Allergies with reaction type",
  "socialHistory": "Relevant social factors",
  "familyHistory": "Relevant family history",
  "reviewOfSystems": {
    "constitutional": "Findings",
    "cardiovascular": "Findings",
    "respiratory": "Findings",
    "neurological": "Findings"
  },
  "physicalExam": {
    "general": "Appearance",
    "heent": "Head/Eyes/Ears/Nose/Throat",
    "cardiovascular": "Heart sounds, pulses",
    "respiratory": "Breath sounds",
    "abdomen": "Examination findings",
    "extremities": "Edema, pulses",
    "neurological": "Mental status, reflexes"
  }
}
```

### Medical Orders (REQUIRED)
```json
"orders": [
  { "order": "IV Normal Saline 1000mL at 125mL/hr", "status": "Active", "orderedBy": "Dr. S. Specialist", "time": "0815" },
  { "order": "CBC, CMP, Lactate STAT", "status": "Pending", "orderedBy": "Dr. S. Specialist", "time": "0815" },
  { "order": "Chest X-Ray portable", "status": "Completed", "orderedBy": "Dr. S. Specialist", "time": "0820" },
  { "order": "Continuous pulse oximetry", "status": "Active", "orderedBy": "Dr. S. Specialist", "time": "0815" }
]
```

### Radiology (Include if clinically relevant)
```json
"radiology": [
  {
    "study": "Chest X-Ray (Portable)", 
    "date": "Current Date",
    "indication": "Shortness of breath, fever",
    "findings": "Bilateral infiltrates in lower lobes. No pleural effusion. Heart size normal. No pneumothorax.",
    "impression": "Findings consistent with bilateral pneumonia. Recommend clinical correlation.",
    "radiologist": "Dr. R. Imaging"
  }
]
```

**OMIT radiology ONLY if the case does not require imaging (e.g., purely psychiatric, routine assessment).**
```

#### 1.3 Add HIGHLIGHT DECOY REQUIREMENT

```markdown
## ⚠️ HIGHLIGHT SCREEN RULES (Screen 1)

The Highlight screen MUST include BOTH relevant AND irrelevant/decoy findings:

```json
{
  "type": "highlight",
  "text": "Patient reports <span id='h1'>severe chest pain radiating to left arm</span> and <span id='h2'>shortness of breath</span>. Patient states they had <span id='h3'>coffee this morning</span> and <span id='h4'>watched TV last night</span>. Vitals show <span id='h5'>BP 88/50</span> and <span id='h6'>HR 110</span>.",
  "correct": ["h1", "h2", "h5", "h6"],
  "decoys": ["h3", "h4"]
}
```

**RULES:**
- Include at least 2-3 DECOY spans (normal findings, irrelevant information)
- Decoys should be plausible but NOT clinically significant
- Total spans: Minimum 6 (at least 3 correct, at least 2 decoy)
```

#### 1.4 Add RATIONALE CASE-SPECIFIC CONTENT

```markdown
## 📚 CASE-SPECIFIC RATIONALE CONTENT

The `referenceInfo` in rationale must be SPECIFIC to the case, not generic.

**BAD (Generic):**
```json
"referenceInfo": {
  "anatomy": "Review relevant anatomy",
  "physiology": "Consider physiological mechanisms",
  "pharm": "Identify pharmacological interventions"
}
```

**GOOD (Case-Specific):**
```json
"referenceInfo": {
  "anatomy": "The coronary arteries supply the myocardium. The LAD supplies the anterior wall and septum. The RCA supplies the inferior wall and right ventricle. Occlusion leads to ischemia in the perfusion territory.",
  "physiology": "Myocardial ischemia occurs when oxygen demand exceeds supply. This triggers anaerobic metabolism, lactate accumulation, and cellular dysfunction. ST elevation indicates transmural ischemia requiring emergent intervention.",
  "pharm": "Aspirin 325mg inhibits platelet aggregation via COX-1 inhibition. Nitroglycerin causes vasodilation via nitric oxide pathway. Heparin prevents clot propagation. Beta-blockers reduce myocardial oxygen demand."
}
```
```

---

### PHASE 2: FIX DataSanitizer.ts

**File:** `src/utils/DataSanitizer.ts`

#### 2.1 Remove Generic Defaults, Extract from Case Data

Update `enrichRationale()` to use case-specific content when available:

```typescript
enrichRationale: (rationale: any, clinicalFocus?: string, caseData?: any): any => {
    const r = rationale || {};
    const focus = clinicalFocus || 'Clinical Assessment';
    
    // PRIORITY 1: Use AI-provided referenceInfo if complete
    if (r.referenceInfo?.anatomy && r.referenceInfo?.physiology && r.referenceInfo?.pharm) {
        // Already has case-specific content - preserve it
        return { ...r, difficulty: r.difficulty || DEFAULT_DIFFICULTY };
    }
    
    // PRIORITY 2: Build from case data if available
    if (caseData) {
        const builtInfo = buildReferenceInfoFromCase(caseData, focus);
        r.referenceInfo = { ...builtInfo, ...r.referenceInfo };
    }
    
    // PRIORITY 3: Only use defaults as absolute fallback
    // ... existing default logic
}
```

---

### PHASE 3: FIX Drop-Cloze Renderer (Q5)

**File:** `src/components/item-types/renderers/DropClozeRenderer.tsx`

Check and fix:
1. Proper parsing of `%{id}` placeholder format
2. Dropdown initialization
3. Answer tracking

---

### PHASE 4: FIX Expert HUD Data

**File:** `src/utils/scoringEngine.ts` or `StudentPreviewModal.tsx`

The Pass Probability needs real data:
1. Calculate from actual performance on screens
2. Initialize with reasonable defaults (not 0% or 100%)
3. Update after each screen submission

---

## 📝 COMPLETE GOLDEN PROMPT UPDATE

Below is the FULL updated section to add to the Golden Prompt:

```markdown
## 🔢 CRITICAL: MINIMUM REQUIREMENTS FOR LEVEL 4-5

### Option Count Minimums

| Screen | Type | Items Required | Correct | Incorrect |
|:-------|:-----|:--------------:|:-------:|:---------:|
| 1 | Highlight | 6+ spans | 3-4 | 2-3 decoys |
| 2 | Matrix | 5+ rows | 1 per row | Rest of columns |
| 3 | Ordered | 5-6 steps | Order is answer | N/A |
| 4 | Bow-Tie | 11+ total | See below | See below |
| 5 | Drop-Cloze | 3-4 blanks | 1 per blank | 3 per blank |
| 6 | Multi-Response | 6+ options | 3-4 | 2-3 |

**BOW-TIE BREAKDOWN:**
- Actions: 4 minimum (2 correct marked `isCorrect: true`)
- Conditions: 3 minimum (1 correct marked `isCorrect: true`)
- Parameters: 4 minimum (2 correct marked `isCorrect: true`)

### Clinical Data Minimums

| Data Type | Level 1-3 | Level 4-5 |
|:----------|:----------|:----------|
| Nurses Notes | 1 entry | 2+ entries |
| History & Physical | Optional | REQUIRED |
| Vitals | 1 reading | 2+ readings (show trend) |
| Labs | Basic panel | Comprehensive with flags |
| Orders | Basic | 4+ orders |
| Radiology | If relevant | REQUIRED if clinical scenario involves imaging |

### Content Quality Standards

1. **Highlight decoys**: Include benign/normal findings that students might incorrectly select
2. **Matrix rows**: Each finding should clearly belong to ONE condition
3. **Ordered steps**: Must have logical sequence (ABC order, Maslow hierarchy)
4. **Bow-tie logic**: Actions must connect to conditions via clinical reasoning
5. **Drop-cloze**: Each blank must have semantically different options
6. **Multi-response**: Include "almost correct" distractors

### Rationale Quality Standards

1. **referenceInfo** must be CASE-SPECIFIC, not generic
2. **anatomy**: Name specific structures relevant to THIS case
3. **physiology**: Explain the pathophysiology of THIS condition
4. **pharm**: Detail medications and their mechanisms for THIS patient
5. **steps**: Must map to CJMM for THIS question type
6. **mnemonic**: Must be relevant to THIS clinical topic
```

---

## ✅ IMPLEMENTATION CHECKLIST

```
PHASE 1: PROMPT FIXES
[x] 1.1 Add minimum option counts section - ADDED to prompt
[x] 1.2 Add clinical data requirements section - ADDED (85+ lines)
[x] 1.3 Add highlight decoy requirement - ADDED (with 8 spans example)
[x] 1.4 Add case-specific rationale content rule - ADDED with examples
[x] 1.5 Update screen schemas with minimum counts - Bow-Tie: 6/4/5, Matrix: 6 rows, Highlight: 8 spans
[x] 1.6 Update validation checklist - Enhanced

PHASE 2: DataSanitizer FIXES
[x] 2.1 Update enrichRationale to prioritize AI content - DONE
[x] 2.2 Added isGenericPlaceholder() helper - Detects generic text
[x] 2.3 Uses topic-specific defaults when AI content is generic

PHASE 3: Renderer FIXES
[x] 3.1 Fixed DropClozeRenderer - Added Format 2 for Golden text+dropdowns
[x] 3.2 BowTieRenderer handles variable counts - Works with expanded schemas
[ ] 3.3 Verify all renderers with new data

PHASE 4: Expert HUD FIXES
[x] 4.1 Initialize Pass Probability with 65% baseline - DONE
[x] 4.2 Calculate using Bayesian formula with difficulty weighting - DONE
[x] 4.3 Added PassProbabilityWidget with circular gauge - DONE
```

---

## 🚀 ESTIMATED IMPLEMENTATION TIME

| Phase | Time | Priority |
|:------|:-----|:---------|
| Phase 1 (Prompt) | 20 min | P0 - Critical |
| Phase 2 (DataSanitizer) | 15 min | P0 - Critical |
| Phase 3 (Renderers) | 15 min | P1 - High |
| Phase 4 (Expert HUD) | 10 min | P2 - Medium |
| **Total** | **60 min** | |

---

## 📊 EXPECTED OUTCOMES

After implementation:
- ✅ Bow-Tie has 4+ options per section
- ✅ Highlight has mix of correct and decoy spans
- ✅ Nurses Notes has 2+ entries
- ✅ H&P section is populated
- ✅ Orders section is populated
- ✅ Radiology shown when relevant
- ✅ Knowledge tab shows case-specific content
- ✅ Q5 (Drop-Cloze) functions correctly
- ✅ Pass Probability shows realistic values

---

**Ready to implement? Reply "GO" to start Phase 1.**
