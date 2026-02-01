---
description: Golden Prompt V2 - Case Study Generation with Admin/Item Bank Integration
---

# Golden Prompt V2 Implementation Plan

## Overview
This plan creates a bulletproof case study generation prompt that:
1. Generates 100% validation-passing case studies on first attempt
2. Provides a simple, direct path to Admin Panel and Item Bank
3. Uses minimal system files (only essential ones)
4. Addresses ALL historical errors from our development history

---

## Part 1: Historical Error Analysis & Solutions

### Errors We've Fixed (Built Into Prompt)

| Error Category | Root Cause | Solution in Prompt |
|----------------|------------|-------------------|
| **Missing Option Rationales** | MCQ/MR options lacked per-option `rationale` field | Enforce `rationale` field on EVERY option object |
| **String-based Bow-Tie Pools** | Pools used `["text1", "text2"]` instead of objects | Mandate object format: `{id, text, isCorrect, rationale}` |
| **Drop-Cloze Missing Rationales** | Dropdown options lacked rationales | Require `rationale` on every dropdown option |
| **Highlight Wrong Key** | Used `highlightReview` instead of `rationales` | Mandate `rationales` (plural) key with span ID keys |
| **Generic Rationales** | Phrases like "correct finding", "good choice" | Explicit ban list + specific content requirements |
| **Inconsistent Structure** | Mixed `content` vs `text` fields in Bow-Tie | Standardize on `text` field only |
| **Empty Rationale Strings** | `rationale: ""` passed generation but failed | Require minimum 15-word substantive rationales |
| **Matrix Missing Row Rationales** | Rows lacked individual `rationale` fields | Mandate `rationale` on every matrix row |

---

## Part 2: Minimal File Architecture

### Files Required (Only 5 Essential Files)

```
src/
├── prompts/
│   └── case-study-golden-v2.md      ← NEW: The golden prompt template
├── services/
│   └── CaseStudyGeneratorV2.ts      ← NEW: Simple generation service
├── dataStore/
│   └── [generated-case-xxx.json]    ← Output: Generated case studies
├── components/
│   └── AdminDashboard.tsx           ← EXISTING: Admin panel (minor update)
└── lib/
    └── ItemBankService.ts           ← EXISTING: Item bank (no changes)
```

### Files NOT Needed (Bypass These)
- ❌ UnifiedDataPipeline.ts (complex normalization)
- ❌ ItemIngestionService.ts (over-engineered)
- ❌ Multiple validator files (use built-in validation)
- ❌ RationalePipeline.ts (rationales embedded in data)
- ❌ TextSanitizer.ts (prompt handles sanitization)

---

## Part 3: The Golden Prompt V2 Structure

### Section 1: System Instructions (Anti-Error Guardrails)

```markdown
## CRITICAL GENERATION RULES

### JSON Structure Requirements
1. EVERY option object MUST have: {id, text, isCorrect, rationale}
2. Bow-Tie pools MUST be object arrays, NEVER string arrays
3. Highlight rationales MUST use key `rationales` (plural) with span IDs as keys
4. Matrix rows MUST have: {id, text, correctColumnId, correctColumnIds, rationale}
5. Drop-Cloze options MUST have: {id, text, isCorrect, rationale}

### Rationale Quality Requirements
1. MINIMUM 15 words per rationale
2. BANNED phrases: "correct answer", "incorrect answer", "this is correct", 
   "appropriate choice", "good answer", "wrong answer"
3. MUST reference specific patient data (vitals, labs, symptoms)
4. MUST explain WHY using clinical reasoning (ABCs, perfusion, trends)
```

### Section 2: Case Study Schema Template

```json
{
  "id": "case-[condition]-[timestamp]",
  "typeId": "case-study",
  "content": {
    "clinicalData": {
      "patientProfile": {},
      "setting": "",
      "timeProgression": [
        {"timestamp": "0800", "vitals": {}, "notes": "", "labs": {}, "orders": []}
      ]
    },
    "structure": {
      "screens": [
        // S1: Highlight - Recognize Cues
        // S2: Matrix - Analyze Cues  
        // S3: MCQ - Prioritize Hypotheses
        // S4: Bow-Tie - Generate Solutions
        // S5: Drop-Cloze - Take Action
        // S6: Multiple-Response - Evaluate Outcomes
      ]
    }
  },
  "rationale": {
    "coreConcept": "",
    "caseSummary": "",
    "goldenRule": "",
    "pitfalls": [],
    "cheatSheet": {},
    "mnemonic": {}
  }
}
```

### Section 3: Screen-by-Screen Templates

#### S1: Highlight (Recognize Cues)
```json
{
  "id": "s1",
  "type": "highlight",
  "cjmmStep": "Recognize Cues",
  "prompt": "Highlight the findings most concerning for [condition].",
  "text": "Patient text with <span id='h1'>highlighted</span> findings...",
  "correct": ["h1", "h2", "h3"],
  "rationales": {
    "h1": {
      "isCorrect": true,
      "whyCorrect": "[Hook] Key finding. [Breakdown] Clinical significance. [Trap] Don't confuse with X."
    },
    "h2": {
      "isCorrect": false,
      "whyIncorrect": "[Hook] Seems concerning but... [Breakdown] Expected in this context."
    }
  }
}
```

#### S2: Matrix (Analyze Cues)
```json
{
  "id": "s2",
  "type": "matrix",
  "cjmmStep": "Analyze Cues",
  "prompt": "Classify each finding...",
  "columns": [
    {"id": "c1", "text": "Category A"},
    {"id": "c2", "text": "Category B"}
  ],
  "rows": [
    {
      "id": "r1",
      "text": "Finding 1",
      "correctColumnId": "c1",
      "correctColumnIds": ["c1"],
      "rationale": "Specific clinical reasoning (15+ words)..."
    }
  ]
}
```

#### S3: MCQ (Prioritize Hypotheses)
```json
{
  "id": "s3",
  "type": "multiple-choice",
  "cjmmStep": "Prioritize Hypotheses",
  "prompt": "Which is the highest priority concern?",
  "options": [
    {
      "id": "o1",
      "text": "Option text",
      "isCorrect": true,
      "rationale": "Correct because ABCs/perfusion priority + specific patient data..."
    },
    {
      "id": "o2",
      "text": "Option text",
      "isCorrect": false,
      "rationale": "Incorrect because this is secondary to X given patient's Y..."
    }
  ]
}
```

#### S4: Bow-Tie (Generate Solutions)
```json
{
  "id": "s4",
  "type": "bow-tie",
  "cjmmStep": "Generate Solutions",
  "prompt": "Complete the Bow-Tie diagram...",
  "conditions": [
    {"id": "c1", "text": "Primary condition", "isCorrect": true, "rationale": "..."},
    {"id": "c2", "text": "Distractor", "isCorrect": false, "rationale": "..."}
  ],
  "actions": [
    {"id": "a1", "text": "Priority action 1", "isCorrect": true, "rationale": "..."},
    {"id": "a2", "text": "Priority action 2", "isCorrect": true, "rationale": "..."},
    {"id": "a3", "text": "Distractor action", "isCorrect": false, "rationale": "..."}
  ],
  "parameters": [
    {"id": "p1", "text": "Monitor parameter 1", "isCorrect": true, "rationale": "..."},
    {"id": "p2", "text": "Monitor parameter 2", "isCorrect": true, "rationale": "..."},
    {"id": "p3", "text": "Distractor parameter", "isCorrect": false, "rationale": "..."}
  ],
  "correct": {
    "condition": "c1",
    "actions": ["a1", "a2"],
    "parameters": ["p1", "p2"]
  }
}
```

#### S5: Drop-Cloze (Take Action)
```json
{
  "id": "s5",
  "type": "drop-cloze",
  "cjmmStep": "Take Action",
  "prompt": "Complete the nursing action statement...",
  "text": "The nurse should place the patient in %{d1}% position and ensure %{d2}% is available.",
  "dropdowns": [
    {
      "id": "d1",
      "options": [
        {"id": "d1-o1", "text": "High-Fowler's", "isCorrect": true, "rationale": "Maximizes chest expansion for respiratory distress..."},
        {"id": "d1-o2", "text": "Supine", "isCorrect": false, "rationale": "Restricts breathing, increases work of breathing..."},
        {"id": "d1-o3", "text": "Trendelenburg", "isCorrect": false, "rationale": "Pushes abdominal contents against diaphragm..."}
      ]
    },
    {
      "id": "d2",
      "options": [
        {"id": "d2-o1", "text": "Suction equipment", "isCorrect": true, "rationale": "Essential for secretion management if patient fatigues..."},
        {"id": "d2-o2", "text": "Heating pad", "isCorrect": false, "rationale": "Not indicated for this condition..."}
      ]
    }
  ]
}
```

#### S6: Multiple-Response (Evaluate Outcomes)
```json
{
  "id": "s6",
  "type": "multiple-response",
  "cjmmStep": "Evaluate Outcomes",
  "prompt": "Which findings indicate improvement? Select all that apply.",
  "options": [
    {"id": "o1", "text": "SpO2 improved from 88% to 95%", "isCorrect": true, "rationale": "Demonstrates effective oxygen therapy..."},
    {"id": "o2", "text": "HR decreased from 134 to 98 bpm", "isCorrect": true, "rationale": "Indicates reduced stress and improved perfusion..."},
    {"id": "o3", "text": "Patient remains lethargic", "isCorrect": false, "rationale": "Persistent altered LOC indicates ongoing hypoperfusion..."}
  ]
}
```

---

## Part 4: Simple Integration Path

### Step 1: Generate Case Study
```typescript
// CaseStudyGeneratorV2.ts - Simple, single-purpose service
export class CaseStudyGeneratorV2 {
  async generate(topic: string): Promise<CaseStudyJSON> {
    const prompt = await loadGoldenPromptV2();
    const response = await callAI(prompt.replace('{TOPIC}', topic));
    const caseStudy = JSON.parse(response);
    
    // Built-in validation (no external validator needed)
    this.validateStructure(caseStudy);
    
    return caseStudy;
  }
  
  private validateStructure(data: any): void {
    // Check all screens have required fields
    // Check all options have rationales
    // Throw if any missing
  }
}
```

### Step 2: Save to Item Bank (Direct Write)
```typescript
// In AdminDashboard - simple save flow
const saveToItemBank = async (caseStudy) => {
  const id = `case-${Date.now()}`;
  const filePath = `src/dataStore/${id}.json`;
  
  // Direct file write - no pipeline
  await fs.writeFile(filePath, JSON.stringify(caseStudy, null, 2));
  
  // Add to item bank index
  await itemBankService.addItem({
    id,
    type: 'case-study',
    status: 'draft',
    path: filePath
  });
};
```

### Step 3: Admin Panel Integration
```typescript
// Add to AdminDashboard.tsx
<Button onClick={() => {
  const generator = new CaseStudyGeneratorV2();
  const caseStudy = await generator.generate(selectedTopic);
  await saveToItemBank(caseStudy);
  refreshItemList();
}}>
  Generate Case Study V2
</Button>
```

---

## Part 5: Implementation Checklist

### Phase 1: Create Prompt (Day 1)
- [ ] Create `src/prompts/case-study-golden-v2.md`
- [ ] Include all anti-error guardrails
- [ ] Include JSON schema templates
- [ ] Include example case (optional but recommended)

### Phase 2: Create Generator Service (Day 1)
- [ ] Create `src/services/CaseStudyGeneratorV2.ts`
- [ ] Implement prompt loading
- [ ] Implement AI call
- [ ] Implement built-in validation
- [ ] Test with 3 different topics

### Phase 3: Admin Integration (Day 2)
- [ ] Add "Generate V2" button to AdminDashboard
- [ ] Implement direct save to dataStore
- [ ] Add item to ItemBank index
- [ ] Test end-to-end flow

### Phase 4: Validation & Testing (Day 2)
- [ ] Run existing validator on generated cases
- [ ] Verify 0 errors, 0 warnings
- [ ] Test in Student Preview
- [ ] Verify all rationales display correctly

---

## Part 6: Quality Assurance

### Pre-Generation Checklist (Built into Prompt)
```markdown
Before outputting JSON, verify:
□ All 6 screens present (s1-s6)
□ Every option has {id, text, isCorrect, rationale}
□ Bow-Tie uses object arrays (not strings)
□ Highlight uses `rationales` key (plural)
□ Matrix rows have `rationale` field
□ No empty rationale strings
□ No banned generic phrases
□ All rationales ≥15 words
□ Clinical data is coherent across time points
```

### Post-Generation Validation
```bash
# Quick validation command
npx ts-node scripts/validate_case_study.ts src/dataStore/[new-case].json
```

---

## Part 7: Prompt Content Template

### The Golden Prompt V2 Header
```markdown
# NGN Case Study Generator - Golden Prompt V2

## Your Role
You are an expert NCLEX-NGN item writer creating clinical case studies for nursing students.

## Output Requirements
- Pure JSON only (no markdown, no explanations)
- Must pass ALL validation rules below
- Every field is required unless marked optional

## CRITICAL: Validation Rules (MUST FOLLOW)
[Include all rules from Section 1]

## Case Study Topic
Generate a case study for: {TOPIC}

## Schema Template
[Include full JSON schema from Section 2]

## Screen Templates
[Include all 6 screen templates from Section 3]

## Quality Checklist
[Include pre-generation checklist from Part 6]
```

---

## Summary

This plan provides:
1. **100% Pass Rate**: Built-in validation rules prevent all historical errors
2. **Simple Path**: Only 5 files needed (prompt, generator, output, admin, item bank)
3. **Minimal Complexity**: No pipelines, normalizers, or sanitizers needed
4. **Error Prevention**: Explicit guardrails for every known issue
5. **Fast Integration**: Direct path from generation to admin panel to item bank

**Next Steps**: 
1. Approve this plan
2. Create the golden prompt file
3. Create the simple generator service
4. Add admin button
5. Test end-to-end

---

## Part 8: Additional Recommendations (Lessons Learned)

### A. Rationale Formatting Best Practices

Based on our fixes, rationales should follow this structure:

```
[Hook] One-sentence attention grabber explaining clinical significance
[Breakdown] 1-2 sentences with pathophysiology or mechanism
[Trap] Common misconception to avoid (optional but recommended)
```

**Example:**
```
"[Hook] Rising PaCO2 in severe asthma is a danger sign, not improvement. 
[Breakdown] Normally patients hyperventilate, blowing off CO2. A 'normal' 
CO2 means they are tiring and can no longer compensate. 
[Trap] Don't be fooled by a 'normal' value—context matters."
```

### B. Ordered-Response Screen Support (Optional)

Our validator flagged `ordered-response` as unknown. If needed, add this screen type:

```json
{
  "id": "s3",
  "type": "ordered-response",
  "cjmmStep": "Prioritize Hypotheses",
  "prompt": "Rank the following in order of priority...",
  "options": [
    {"id": "opt1", "text": "Item 1", "rationale": "Why this priority..."},
    {"id": "opt2", "text": "Item 2", "rationale": "Why this priority..."}
  ],
  "correctOrder": ["opt1", "opt2", "opt3"],
  "rationale": {
    "coreConcept": "Priority ordering based on ABCs..."
  }
}
```

### C. EHR Data Integrity Rules

Ensure clinical data consistency across time points:

1. **Labs should have units**: `"lactate": "4.2 mmol/L"` not `"lactate": "4.2"`
2. **Vitals should be realistic progressions**: Don't jump from HR 140 to HR 80 without intervention
3. **Notes should reference vitals**: "Patient tachycardic at 118 bpm" matches vital signs
4. **Orders should trigger changes**: If Lasix ordered, expect decreased output initially then diuresis

### D. Distractor Quality Guidelines

Strong distractors follow these rules:

| Type | Good Distractor | Bad Distractor |
|------|----------------|----------------|
| **Plausible but wrong timing** | "Administer diuretics" (wrong in septic shock, right in CHF) | "Give vitamin supplements" |
| **Related but secondary** | "Monitor temperature" (important but not priority in PE) | "Check dietary preferences" |
| **Common misconception** | "Reassure patient anxiety is causing symptoms" | "Ignore findings" |

### E. Prevent Common AI Generation Errors

Add these explicit instructions to prompt:

```markdown
## AI Generation Guardrails

DO NOT:
- Use placeholder text like "TBD", "INSERT HERE", "EXAMPLE"
- Leave any field empty or null
- Use generic medication names like "medication" or "drug"
- Create unrealistic vital sign combinations
- Forget to include distractor options
- Mix up `isCorrect: true` and `isCorrect: false`

DO:
- Use specific medication names (Norepinephrine, Albuterol, Heparin)
- Ensure exactly 1 correct answer for MCQ, 2+ for SATA
- Make all IDs unique (no duplicate s1, o1, etc.)
- Include time context in prompts ("2 hours after intervention")
```

### F. Validation Command Shortcut

Add this script for quick validation:

```bash
# Add to package.json scripts
"validate-case": "npx ts-node scripts/validate_case_study.ts"

# Usage
npm run validate-case src/dataStore/new-case.json
```

### G. Admin Panel Quick Actions

Recommended admin panel additions:

1. **Generate V2** → Creates case using golden prompt
2. **Validate** → Runs validation, shows pass/fail
3. **Quick Fix** → Auto-repairs known issues (add missing rationales)
4. **Publish** → Moves to student-facing item bank
5. **Export** → Downloads JSON for backup

### H. Error Recovery Strategy

If generation fails validation:

```
Step 1: Identify error type (missing field, generic phrase, structure)
Step 2: If <3 errors → Manual fix in JSON
Step 3: If ≥3 errors → Re-generate with more specific prompt
Step 4: Log error pattern for prompt improvement
```

---

## Appendix: Quick Reference Card

### Must-Have Fields by Screen Type

| Screen Type | Required Fields |
|-------------|-----------------|
| **Highlight** | `text`, `correct[]`, `rationales{}` with span IDs |
| **Matrix** | `columns[]`, `rows[]` each with `rationale`, `correctColumnIds[]` |
| **MCQ** | `options[]` each with `{id, text, isCorrect, rationale}` |
| **Bow-Tie** | `conditions[]`, `actions[]`, `parameters[]` each as objects with `rationale` |
| **Drop-Cloze** | `dropdowns[]` or `sentences[].dropdowns[]`, options with `rationale` |
| **Multiple-Response** | `options[]` each with `{id, text, isCorrect, rationale}` |

### Banned Phrases (Copy to Prompt)
```
"correct finding", "appropriate choice", "this is correct",
"this is incorrect", "good answer", "wrong answer", 
"correct answer", "incorrect answer", "option is correct",
"option is incorrect", "correct option", "incorrect option"
```

### Minimum Lengths
- Rationale: 15 words
- Highlight text: 100 words
- Case summary: 50 words
- Prompt text: 10 words
