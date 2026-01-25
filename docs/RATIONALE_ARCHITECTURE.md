# 📐 Rationale Master Fix: Architecture Documentation

## System Overview

```
StudentPreviewModal
       ↓
       ├─ Loads FullItemData via cachedFullItem state
       ├─ Passes to RationaleDrawer
       │         ↓
       │         └─ Extracts rationale via RationalePipeline
       │                   ↓
       │                   └─ Passes to RationaleSheet
       │                             ↓
       │                             ├─ Priority hierarchy extraction
       │                             │   (explicit → fullItem → question → default)
       │                             │
       │                             └─ Passes smartRationale to UltimateRationale
       │                                       ↓
       │                                       ├─ Tab 0: Item Overview & Actions
       │                                       ├─ Tab 1: Option Review (with specialized feedback)
       │                                       ├─ Tab 2: Clinical Logic (NCJMM Steps)
       │                                       ├─ Tab 3: Strategy (Mnemonic & Cheat Sheet)
       │                                       └─ Tab 4: Knowledge (Reference Info)
       │
       └─ Falls back to createDefaultRationale() if data missing
```

---

## Component Props Flow

### StudentPreviewModal → RationaleDrawer
```typescript
{
  open: boolean;
  onClose: () => void;
  question: QuestionConfig;
  fullItem: FullItemData;     // ← Loaded via cachedFullItem state
  metadata?: any;
}
```

### RationaleDrawer → RationaleSheet
```typescript
{
  question: QuestionConfig;
  fullItem: FullItemData;
  rationale: CanonicalRationale;  // ← Extracted via RationalePipeline
  metadata?: any;
}
```

### RationaleSheet → UltimateRationale
```typescript
{
  item: FullItemData | QuestionConfig;
  referenceInfo: ReferenceInfo;
  difficulty: DifficultyData;
  mnemonic: MnemonicData;
  cheatSheet: CheatSheetData;
  strategy: string;
  itemId: string;
  activeTab: string;              // ← Managed by RationaleSheet
  onTabChange: (tab: string) => void;
  outcome: OutcomeModel;
  cjmmStep: string;
  coreConcept: string;
  goldenRule: string;
  caseSummary: string;
  answerAnalysis: string;
  trap: string;
  steps: ClinicalStep[];
  optionReviews: OptionReview[];
  bowTieReview?: BowTieReview;
  highlightReview?: HighlightReview;
  clozeReview?: ClozeReview;
  orderedReview?: OrderedReview;
  matrixRows?: any[];
  matrixColumns?: any[];
  pitfalls: string[];
  formulaMethod?: string;
  dimensionalAnalysis?: string;
  metadata: any;
}
```

---

## Data Extraction Priority Hierarchy

```typescript
// Level 1 (HIGHEST PRIORITY)
if (explicitRationale) → USE explicit rationale
  └─ Data provided directly in props

// Level 2
if (fullItem?.content?.rationale) → EXTRACT from fullItem
  └─ Most complete clinical data (preferred)
  └─ Uses RationalePipeline.processQuestion()

// Level 3
if (question?.content?.rationale) → EXTRACT from question
  └─ Fallback if fullItem missing
  └─ Uses RationalePipeline.processQuestion()

// Level 4 (LOWEST PRIORITY)
else → CREATE default rationale
  └─ Last resort: ensures UI doesn't crash
  └─ Uses RationalePipeline.createDefaultRationale()
  └─ Logs: "🔴 No rationale found anywhere, creating defaults"
```

---

## Error Handling Strategy

### Console Logging Pattern
```
🔍 = STARTING operation
✅ = SUCCESS condition
📊 = DIAGNOSTIC info
⚠️ = WARNING (fallback used)
🔴 = ERROR (data missing, using defaults)
```

### Example Success Flow
```
🔍 RationaleSheet: Starting rationale extraction...
✅ RationaleSheet: Extracting from fullItem.content.rationale
✅ RationaleSheet: Successfully processed fullItem rationale {...}
📊 UltimateRationale: Validating rationale structure...
✅ UltimateRationale: Rationale validation complete {...}
📊 UltimateRationale: Rendering with active tab: 0
```

### Example Fallback Flow
```
🔍 RationaleSheet: Starting rationale extraction...
⚠️ RationaleSheet: No fullItem available, checking question...
✅ RationaleSheet: Extracting from question.content.rationale
🔴 RationaleSheet: No rationale found anywhere, creating defaults
📊 UltimateRationale: Using default reference info (no data)
```

---

## Key Features

### 1. Priority Hierarchy
Ensures data is extracted in order of completeness, with graceful fallback to defaults.

### 2. Type Safety
All components use strict TypeScript interfaces. Minimal `any` types where necessary.

### 3. Caching Strategy
FullItemData is cached via `cachedFullItem` state to prevent redundant API calls.

### 4. Validation Layer
`validatedRationale` useMemo ensures UI has valid data structure even if extraction incomplete.

### 5. Diagnostic Logging
Console logs track data flow for debugging production issues without verbose logging.

### 6. Specialized Feedback Components
- `BowTieFeedback` - For BowTie NGN items
- `MatrixFeedback` - For Matrix/Grid items
- `HighlightFeedback` - For Highlight/Cloze items
- `ClozeFeedback` - For Drop-Down Cloze items
- `OrderedFeedback` - For Ordered Response items

---

## File Structure

```
src/
├── components/
│   ├── StudentPreviewModal.tsx       (Entry point, loads fullItem)
│   ├── RationaleDrawer.tsx           (Opens drawer, passes props)
│   ├── RationaleSheet.tsx            (Priority hierarchy, tab management)
│   ├── UltimateRationale.tsx         (Renders 5 tabs with content)
│   ├── OptionReviewV2.tsx            (Enhanced option analysis)
│   └── feedback/
│       ├── BowTieFeedback.tsx        (Specialized for BowTie items)
│       ├── MatrixFeedback.tsx        (Specialized for Matrix items)
│       ├── HighlightFeedback.tsx     (Specialized for Highlight items)
│       ├── ClozeFeedback.tsx         (Specialized for Cloze items)
│       └── OrderedFeedback.tsx       (Specialized for Ordered items)
│
├── services/
│   └── RationalePipeline.ts          (processQuestion, createDefaultRationale)
│
├── types/
│   ├── index.ts                      (All interfaces: Props, Data, Rationale)
│   └── RationaleTypes.ts             (Specialized rationale types)
│
└── __tests__/
    ├── integration/
    │   └── RationaleFlow.integration.test.ts
    ├── mocks/
    │   └── RationaleTestData.ts
    └── validation/
        └── RationaleFlowValidation.ts
```

---

## Type Definitions

### CanonicalRationale (Core Data Structure)
```typescript
interface CanonicalRationale {
  // Tab 0: Item Overview
  outcome?: OutcomeModel;
  coreConcept?: string;
  caseSummary?: string;
  answerAnalysis?: string;
  trap?: string;

  // Tab 1: Option Review
  optionReviews?: OptionReview[];
  bowTieReview?: BowTieReview;
  highlightReview?: HighlightReview;
  clozeReview?: ClozeReview;
  orderedReview?: OrderedReview;
  matrixRows?: any[];
  matrixColumns?: any[];

  // Tab 2: Clinical Logic
  steps?: ClinicalStep[];
  goldenRule?: string;

  // Tab 3: Strategy
  mnemonic?: MnemonicData;
  cheatSheet?: CheatSheetData;
  pitfalls?: string[];

  // Tab 4: Knowledge
  referenceInfo?: ReferenceInfo;
  difficulty?: DifficultyData;

  // Calculation Specifics
  formulaMethod?: string;
  dimensionalAnalysis?: string;

  // Metadata
  cjmmStep?: string;
  itemType?: string;
}
```

---

## Testing

### Unit Tests
- RationalePipeline.processQuestion()
- RationalePipeline.createDefaultRationale()
- Component props validation

### Integration Tests
- Full data flow (StudentPreviewModal → UltimateRationale)
- Priority hierarchy extraction
- Tab navigation
- Fallback scenarios

### Browser Testing (Manual)
- Tab switching
- Content rendering
- Fallback visibility
- Console log sequence

---

## Performance Considerations

- **Caching**: FullItemData cached via state (no refetch)
- **useMemo**: rationale and validatedRationale prevent unnecessary recomputes
- **Lazy Loading**: Tabs only render when active
- **Bundle Size**: RationalePipeline is tree-shakeable

---

## Future Enhancements

1. Add search within rationale tabs
2. Save favorite rationales for study sessions
3. AI-powered rationale generation for missing data
4. Rationale sharing between users
5. Performance analytics per item type
