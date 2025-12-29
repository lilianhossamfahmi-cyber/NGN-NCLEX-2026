# HOT SPOT ZERO-ERROR CHECKLIST

**Objective:** Validate Image interaction items.

## 1. Image Strategy
- [ ] **Dual Source**:
    -   `imageUrl`: Exists, valid URL structure, HTTPS.
    -   `imageGenPrompt`: Comprehensive, descriptive description of the visual.
- [ ] **Relevance**: The visual explicitly matches the patient's condition (e.g., Left arm vs Right arm).

## 2. Target Area Precision
- [ ] **Coordinates**: `x`, `y` values are between 0-100.
- [ ] **Size**: `radius` is reasonable (5-15%). Too small = unclickable. Too large = overlaps distractors.
- [ ] **Overlap**: Target area does not overlap with other distinct anatomical landmarks that are distractors.

## 3. Rationale
- [ ] **Visual Explanation**: The rationale describes the location visually (e.g. "5th intercostal space, mid-clavicular line").
