# 🧠 UNIFIED RATIONALE PIPELINE - CONSOLIDATION PLAN

## Problem Statement
After submitting answers, the Clinical Reasoning modal shows:
- ❌ No score in Expert HUD panel
- ❌ Option Review tab is empty or using old format
- ❌ Clinical Logic tab is empty (needs `steps` data)
- ❌ Strategy tab is empty (needs `mnemonic`, `cheatSheet`, `pitfalls`)
- ❌ Knowledge tab is empty (needs `referenceInfo` with anatomy/physiology/pharm)

## Root Cause Analysis

### Current Fragmented Architecture
```
Submit Answer
    ↓
📂 StudentPreviewModal.tsx    → Calculates basic score
    ↓
📂 RationaleSheet.tsx         → Parses raw rationale, creates `smartRationale`
    ↓
📂 UltimateRationale.tsx      → Expects specific fields for each tab:
                                - Tab 0: outcome, coreConcept
                                - Tab 1: optionReviews, matrixRows
                                - Tab 2: steps (MISSING!)
                                - Tab 3: mnemonic, cheatSheet (MISSING!)
                                - Tab 4: referenceInfo (MISSING!)
```

**The issue**: `RationaleSheet.tsx` fallbacks for BowTie/Cloze don't include `steps`, `mnemonic`, `cheatSheet`, or `referenceInfo`.

---

## Proposed Solution: Unified Rationale Pipeline

### NEW FILE: `src/services/RationalePipeline.ts`

This single file will:
1. **Receive** raw rationale from item + user answers
2. **Generate** structured feedback for ALL item types
3. **Output** a fully-populated rationale object for ALL tabs

---

## Rationale Data Contract (Canonical Format)

After processing through RationalePipeline, ALL items will have:

```typescript
interface CanonicalRationale {
  // Tab 0: Item Overview
  outcome: {
    badge: 'CORRECT' | 'INCORRECT' | 'PARTIAL',
    score: number,       // 0-100
    totalPoints: number,
    earnedPoints: number,
    message: string,
  },
  coreConcept: string,
  caseSummary: string,
  
  // Tab 1: Option Review
  optionReviews: OptionReview[],    // For MCQ/SATA
  matrixRows: MatrixRowReview[],    // For Matrix items
  bowTieReview: BowTieReview,       // For BowTie items
  clozeReviews: ClozeReview[],      // For Cloze items
  
  // Tab 2: Clinical Logic
  steps: {
    tag: string,            // 'RECOGNIZE' | 'ANALYZE' | 'PRIORITIZE' | 'ACT'
    description: string,
  }[],
  goldenRule: string,
  
  // Tab 3: Strategy
  mnemonic: {
    title: string,
    content: string,
    explanation: string,
  },
  cheatSheet: {
    title: string,
    points: string[],
  },
  pitfalls: string[],
  
  // Tab 4: Knowledge
  referenceInfo: {
    anatomy: string,
    physiology: string,
    pharm: string,
  },
  
  // Metadata
  cjmmStep: string,        // 'Recognize Cues', 'Analyze Cues', etc.
  itemType: string,
}
```

---

## Implementation Steps

### Phase 1: Create RationalePipeline.ts
- [ ] Create new file with TypeScript interfaces
- [ ] Implement `generate(item, userAnswers, isCorrect): CanonicalRationale`
- [ ] Handle ALL item types: BowTie, Matrix, Cloze, SATA, Single-Choice
- [ ] Generate proper `steps` for Clinical Logic tab
- [ ] Generate/extract `mnemonic`, `cheatSheet`, `pitfalls` for Strategy tab
- [ ] Generate/extract `referenceInfo` for Knowledge tab

### Phase 2: BowTie Score Calculation
- [ ] Create `calculateBowTieScore(userAnswers, correctAnswers)` function
- [ ] Return { earned, total, percentage, breakdown }
- [ ] Actions: 2 points each (4 total)
- [ ] Condition: 2 points (2 total)
- [ ] Parameters: 2 points each (4 total)
- [ ] Total: 10 points possible

### Phase 3: BowTie Option Review
- [ ] Create `generateBowTieReview(item, userAnswers)` function
- [ ] Return detailed analysis for each section:
  - Actions: Which were correct, why incorrect ones are wrong
  - Condition: Correct diagnosis and why user's choice was right/wrong
  - Parameters: Which monitoring parameters and why

### Phase 4: Update RationaleSheet.tsx
- [ ] Import and use `RationalePipeline.generate()`
- [ ] Remove inline fallback logic
- [ ] Pass canonical rationale to UltimateRationale

### Phase 5: Update UltimateRationale.tsx
- [ ] Update to receive canonical rationale format
- [ ] Add proper rendering for BowTie reviews
- [ ] Ensure all tabs populate correctly

### Phase 6: Update StudentPreviewModal.tsx (Expert HUD)
- [ ] Import score calculation from RationalePipeline
- [ ] Display BowTie score in Expert HUD panel
- [ ] Show breakdown (Actions: 2/4, Condition: 1/2, Parameters: 2/4)

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `RationalePipeline.ts` | **CREATE** - New single authority for rationale |
| `RationaleSheet.tsx` | MODIFY - Use RationalePipeline |
| `UltimateRationale.tsx` | MODIFY - Handle BowTie reviews |
| `StudentPreviewModal.tsx` | MODIFY - Display BowTie scores |

---

## Default Content Generators

For items without AI-generated rationale, generate clinical defaults:

### Default Steps (Clinical Logic)
```javascript
const DEFAULT_STEPS = [
  { tag: 'RECOGNIZE', description: 'Identify key clinical findings and patient presentation' },
  { tag: 'ANALYZE', description: 'Connect findings to potential diagnoses using clinical reasoning' },
  { tag: 'PRIORITIZE', description: 'Determine most urgent interventions based on patient acuity' },
  { tag: 'ACT', description: 'Implement appropriate nursing actions and evaluate outcomes' },
];
```

### Default Mnemonic (Strategy)
```javascript
const DEFAULT_MNEMONIC = {
  title: 'Clinical Decision Framework',
  content: 'ASSESS → ANALYZE → ACT → EVALUATE',
  explanation: 'Systematic approach to clinical judgment requires assessment, analysis, action, and evaluation of patient response.',
};
```

### Default Reference Info (Knowledge)
```javascript
const DEFAULT_REFERENCE = {
  anatomy: 'Review relevant body systems and structures affected by this condition.',
  physiology: 'Understand normal physiological processes and how they are altered in this condition.',
  pharm: 'Know the mechanism of action, indications, and nursing considerations for relevant medications.',
};
```

---

## Expected Outcome

After implementation:
- ✅ BowTie score shows in Expert HUD (e.g., "8/10 = 80%")
- ✅ Option Review shows BowTie analysis for all sections
- ✅ Clinical Logic shows 4-step NCJMM pathway
- ✅ Strategy shows mnemonic and clinical pearls
- ✅ Knowledge shows anatomy/physiology/pharmacology notes
- ✅ All item types supported (BowTie, Matrix, Cloze, SATA, Single-Choice)

---

## Timeline Estimate

| Phase | Time |
|-------|------|
| Phase 1: Create RationalePipeline | 30 min |
| Phase 2: BowTie Score Calculation | 15 min |
| Phase 3: BowTie Option Review | 20 min |
| Phase 4: Update RationaleSheet | 15 min |
| Phase 5: Update UltimateRationale | 20 min |
| Phase 6: Update Expert HUD | 15 min |
| **Total** | **~2 hours** |

---

## Approval Required

Do you approve this rationale pipeline plan?

Options:
1. **Approve & Execute** - I will implement all phases
2. **Approve Phase 1-3 Only** - Create the core pipeline first, then review
3. **Modify Plan** - Suggest changes to the approach
