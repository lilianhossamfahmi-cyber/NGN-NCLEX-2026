# 📋 ORDERED RESPONSE REVIEW IMPLEMENTATION PLAN

## 🎯 OBJECTIVE
Transform the feedback for Ordered Response items from "Correct/Incorrect Option" to **"Sequencing Logic"**.
As the user noted, all steps are "correct actions"; the error is in the *ordering*.

## 🚧 CURRENT STATE
- Uses generic `OptionReview` which says "Why this is correct/incorrect".
- Confusing for users because they selected the *right action* (it was mandatory) but just placed it wrong.

## 🛠️ IMPLEMENTATION STEPS

### 1. 🧠 PIPELINE UPDATE (`RationalePipeline.ts`)
- **New Data Structure:** Define `OrderedReviewItem`.
  ```typescript
  interface OrderedReviewItem {
      id: string;
      text: string;
      rationale: string;
      correctRank: number; // 1-based index
      userRank: number | null; // 1-based index or null if not selected (though typically all are)
      isCorrectPosition: boolean;
  }
  ```
- **Logic:** Create specific generation logic for `ordered-response`.
  - Iterate through the **Correct Sequence** (defined in JSON).
  - Find where the user placed each item.
  - Compile the review list.

### 2. 🎨 COMPONENT CREATION (`src/components/feedback/OrderedFeedback.tsx`)
- **Layout:** A clean list/table showing the **Correct Sequence**.
- **Columns:**
  1.  **Step #:** 1, 2, 3...
  2.  **Action:** The step text.
  3.  **Your Rank:** User's placement (e.g., "Placed 3rd") with visual cues (Green if matches Step #, Red/Orange if not).
  4.  **Sequencing Rationale:** Detailed explanation of *why* this step belongs here.
- **Visuals:**
  - Use arrows or flow indicators to suggest progression.
  - No "Why incorrect" labels. Use "Step Rationale" or "Logic".

### 3. 🔗 INTEGRATION (`UltimateRationale.tsx`)
- Add `orderedReview` to props.
- Render `OrderedFeedback` when `orderedReview` is present.

## ✅ SUCCESS CRITERIA
- [ ] Users see exactly where they placed an item vs where it belongs.
- [ ] Feedback explains the *sequence* (e.g., "Airway check must happen before Breathing...").
- [ ] "Why this is incorrect" language is completely removed for this item type.
