# 🎯 UNIFIED DATA PIPELINE - CONSOLIDATION PLAN

## Problem Statement
Currently there are **6+ files** all performing overlapping data normalization, causing:
- Difficulty showing 3 instead of 5
- BowTie showing "Fallback" text instead of real data
- Vitals/Labs not reaching the UI
- Inconsistent difficulty readings across components

## Current Fragmented Architecture

```
Import JSON
    ↓
📂 importService.ts           → Maps raw JSON to MasterQuestionItem
    ↓
📂 DataSanitizer.ts           → normalizeGoldenPromptFormat(), stabilizeItem()
    ↓
📂 ItemIngestionService.ts    → normalize(), reconstructBowTie()
    ↓
📂 ItemRenderer.tsx           → normalizeConfig() 
    ↓
📂 BowTieRenderer.tsx         → getPool() - Expects specific format
📂 StudentPreviewModal.tsx    → Reads item.content.clinicalData
📂 ExpertDashboard.tsx        → Reads itemDifficulty
📂 RationaleSheet.tsx         → Reads question.metadata.difficultyLevel
📂 UltimateRationale.tsx      → calculateNGNDifficulty()
```

**Each file has its OWN assumptions about where data lives!**

---

## Proposed Solution: Single Source of Truth

### NEW FILE: `src/services/UnifiedDataPipeline.ts`

This single file will:
1. **Receive** raw JSON from import/generation
2. **Transform** once to a CANONICAL format
3. **Output** a fully-normalized item ready for ALL consumers

```
Import JSON
    ↓
📂 UnifiedDataPipeline.ts     → ONE transformation, ALL mappings
    ↓
✅ Canonical MasterQuestionItem
    ↓
All components read from the same structure
```

---

## Data Contract (Canonical Format)

After processing through UnifiedDataPipeline, ALL items will have:

```typescript
{
  id: string,
  type: string,                    // Normalized: 'bow-tie', 'calculation', etc.
  
  metadata: {
    title: string,
    difficulty: number,            // ALWAYS 1-5
    difficultyLevel: number,       // ALIAS for difficulty
    topic: string,
    clinicalFocus: string,
  },
  
  pedagogy: {
    difficultyLevel: number,       // MIRROR of metadata.difficulty
  },
  
  content: {
    prompt: string,                // The question stem
    
    // Clinical Data - ALWAYS in clinicalData
    clinicalData: {
      patientInfo: {...},
      vitals: [],                  // ALWAYS 'vitals', never 'vitalSigns'
      labs: [],                    // ALWAYS 'labs', never 'laboratory'
      orders: [],
      history: [],                 // Nurses notes
      historyPhysical: string,
      radiology: [],
    },
    
    // Question Structure - FLAT at content level
    structure: {
      type: string,
      prompt: string,
      
      // For BowTie
      actions: [],
      conditions: [],
      parameters: [],
      
      // For Matrix
      rows: [],
      columns: [],
      
      // For MCQ/SATA
      options: [],
    },
    
    // Rationale - ALWAYS has difficulty
    rationale: {
      coreConcept: string,
      caseSummary: string,
      answerAnalysis: string,
      difficulty: {
        level: number,             // MATCHES metadata.difficulty
        score: number,
        label: string,
      }
    }
  }
}
```

---

## Implementation Steps

### Phase 1: Create UnifiedDataPipeline.ts
- [ ] Create new file with TypeScript interfaces
- [ ] Implement `transform(raw: any): MasterQuestionItem`
- [ ] Handle ALL field mappings (vitalSigns→vitals, laboratory→labs, etc.)
- [ ] Handle ALL type detections (bow-tie, calculation, etc.)
- [ ] Ensure difficulty is set in ALL required locations

### Phase 2: Update Import Flow
- [ ] Modify `importService.ts` to use `UnifiedDataPipeline.transform()`
- [ ] Remove duplicate normalization logic from importService

### Phase 3: Update StudentPreviewModal
- [ ] Remove `DataSanitizer.stabilizeItem()` call
- [ ] Remove `PerfectFillService.enrich()` call
- [ ] Read directly from pre-normalized item

### Phase 4: Update ItemRenderer
- [ ] Remove `normalizeConfig()` function
- [ ] Remove `ItemIngestionService.ingest()` call
- [ ] Pass normalized config directly to renderers

### Phase 5: Update Individual Renderers
- [ ] BowTieRenderer: Read from canonical `config.structure.actions`
- [ ] Remove all fallback/alias logic (no longer needed)

### Phase 6: Delete/Deprecate Old Code
- [ ] Mark DataSanitizer normalization functions as deprecated
- [ ] Mark ItemIngestionService as deprecated
- [ ] Remove normalizeConfig from ItemRenderer

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `UnifiedDataPipeline.ts` | **CREATE** - New single authority |
| `importService.ts` | MODIFY - Use UnifiedDataPipeline |
| `StudentPreviewModal.tsx` | MODIFY - Remove extra processing |
| `ItemRenderer.tsx` | MODIFY - Remove normalizeConfig |
| `DataSanitizer.ts` | DEPRECATE - Keep for backwards compat |
| `ItemIngestionService.ts` | DEPRECATE - No longer needed |

---

## Expected Outcome

After consolidation:
- ✅ Difficulty will be 5 everywhere (metadata, pedagogy, rationale)
- ✅ BowTie actions/conditions/parameters will be in correct location
- ✅ Vitals/Labs will be in clinicalData.vitals and clinicalData.labs
- ✅ ONE file controls ALL transformations
- ✅ Easy to debug - single point of failure

---

## Timeline Estimate

| Phase | Time |
|-------|------|
| Phase 1: Create UnifiedDataPipeline | 45 min |
| Phase 2: Update Import | 15 min |
| Phase 3: Update StudentPreviewModal | 20 min |
| Phase 4: Update ItemRenderer | 20 min |
| Phase 5: Update Renderers | 15 min |
| Phase 6: Cleanup | 15 min |
| **Total** | **~2 hours** |

---

## Approval Required

Do you approve this consolidation plan? 

Options:
1. **Approve & Execute** - I will implement all phases
2. **Approve Phase 1 Only** - Create the UnifiedDataPipeline first, then review
3. **Modify Plan** - Suggest changes to the approach
