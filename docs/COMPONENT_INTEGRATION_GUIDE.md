# 🔧 Component Integration Guide

## Quick Start: Using RationaleDrawer in Your Component

### Step 1: Import Required Types
```typescript
import type { FullItemData, QuestionConfig } from '@/types';
import { RationaleDrawer } from '@/components/RationaleDrawer';
```

### Step 2: Set Up State
```typescript
const [rationaleOpen, setRationaleOpen] = useState(false);
const [currentItem, setCurrentItem] = useState<FullItemData | null>(null);
const [currentQuestion, setCurrentQuestion] = useState<QuestionConfig | null>(null);
```

### Step 3: Load Full Item Data
```typescript
const loadFullItem = async (itemId: string) => {
  try {
    const fullItem = await fetchFullItemData(itemId); // Your API call
    setCurrentItem(fullItem);
  } catch (error) {
    console.error('Failed to load full item:', error);
    // Graceful fallback handled by RationaleDrawer
  }
};
```

### Step 4: Render the Drawer
```typescript
<RationaleDrawer
  open={rationaleOpen}
  onClose={() => setRationaleOpen(false)}
  question={currentQuestion}
  fullItem={currentItem}
/>
```

---

## How It Works

1. **StudentPreviewModal** opens with question data
2. User clicks "Show Rationale" button
3. **RationaleDrawer** opens and extracts rationale via RationalePipeline
4. **RationaleSheet** manages tabs and passes data to UltimateRationale
5. **UltimateRationale** renders 5 tabs with clinical information
6. User navigates between tabs to explore different aspects

---

## Props Reference

### RationaleDrawer Props

| Prop     | Type           | Required | Description                        |
|----------|----------------|----------|------------------------------------|
| open     | boolean        | ✅       | Controls drawer visibility         |
| onClose  | () => void     | ✅       | Callback when drawer closes        |
| question | QuestionConfig | ✅       | The question being reviewed        |
| fullItem | FullItemData   | ✅       | Complete item with rationale       |
| metadata | any            | ❌       | Optional metadata for tracking     |

---

## Common Patterns

### Pattern 1: Open Rationale on Button Click
```typescript
<button onClick={() => {
  setCurrentQuestion(question);
  loadFullItem(question.id);
  setRationaleOpen(true);
}}>
  Show Rationale
</button>
```

### Pattern 2: Track Active Question
```typescript
useEffect(() => {
  if (rationaleOpen && currentQuestion?.id) {
    console.log('Viewing rationale for:', currentQuestion.id);
    // Track analytics, etc.
  }
}, [rationaleOpen, currentQuestion?.id]);
```

### Pattern 3: Pre-load Full Items
```typescript
const preloadFullItems = async (questionIds: string[]) => {
  for (const id of questionIds) {
    const fullItem = await fetchFullItemData(id);
    cache.set(id, fullItem); // Store in cache
  }
};
```

---

## Troubleshooting

### Issue: Rationale tab shows "Information not available"

**Cause:** Data extraction failed (missing rationale in fullItem or question)

**Solution:**
- Check console for 🔴 error logs
- Verify `fullItem.content.rationale` exists
- Fallback shows default rationale (working as designed)

### Issue: Tab switching is slow

**Cause:** `useMemo` dependencies triggering unnecessary recomputes

**Solution:**
- Check if `fullItem`/`question` objects are being recreated
- Memoize parent component if needed
- Consider virtualizing tabs for large datasets

### Issue: Console shows many 🔍 logs

**Cause:** Normal - these are diagnostic logs

**Solution:** Safe to ignore in production (can disable with feature flag if needed)

---

## Advanced Usage

### Integrating with Custom Feedback Component
```typescript
<RationaleDrawer
  open={rationaleOpen}
  onClose={() => setRationaleOpen(false)}
  question={currentQuestion}
  fullItem={currentItem}
  metadata={{
    userId: user.id,
    sessionId: currentSession.id,
    timestamp: Date.now(),
  }}
/>
```

### Conditional Rendering Based on Item Type
```typescript
const renderAppropriate = (item: FullItemData) => {
  switch(item.type) {
    case 'BowTie':
      return <BowTieFeedback rationale={rationale} />;
    case 'Matrix':
      return <MatrixFeedback rationale={rationale} />;
    default:
      return <UltimateRationale rationale={rationale} />;
  }
};
```

---

## Tab Overview

| Tab | Name               | Content                                      |
|-----|--------------------|----------------------------------------------|
| 0   | Item Overview      | Difficulty, recommended actions, core concept|
| 1   | Option Review      | Per-option analysis, specialized feedback    |
| 2   | Clinical Logic     | NCJMM steps, golden rule                     |
| 3   | Strategy           | Mnemonic, cheat sheet, pitfalls              |
| 4   | Knowledge          | Anatomy, physiology, pharmacology            |

---

## Best Practices

1. **Always cache fullItem** - Avoid refetching on drawer open/close
2. **Use memoization** - Prevent unnecessary re-renders with useMemo
3. **Handle loading states** - Show skeleton while data loads
4. **Log diagnostics** - Use 🔍✅📊🔴 pattern for debugging
5. **Test fallbacks** - Verify default rationale displays correctly
