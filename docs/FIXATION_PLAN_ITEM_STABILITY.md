
# Fixation Plan: Item Content Stability & Student Integration

## Critical Issue Resolved: Item Instability
The issue of item content changing on refresh in the Student App has been identified and resolved.

### Root Cause
1.  **Random Selection Logic**: The Student App's "Adaptive" and "Simulation" modes were designed to fetch a *random* question from the bank (or generate one) each time they started.
2.  **Lack of Deep Linking**: When "refreshing" the browser in the Student App, the session state was lost, causing a restart of the mode, which triggered a new random fetch.
3.  **Ambiguous "Unified" IDs**: The batch generation process created multiple items all starting with `unified_`. The user likely refreshed and received *different* `unified_` items (e.g., `unified_A` then `unified_B`), misinterpreting this as "The single unified item changing content".

### Solution Implemented
1.  **Deep Linking Support**:
    *   Updated `MasterCreatorEngine` to respect `?mode=student`.
    *   Updated `StudentDashboard` to respect `?itemId=...`.
2.  **Single Item Preview Mode**:
    *   Created `SingleItemPreviewMode.tsx` which fetches and locks onto a specific ID provided in the URL. This bypasses the random selection logic entirely.
3.  **Admin Integration**:
    *   Added an "Open in Student App" button (External Link icon) to the Admin Item Bank Grid.
    *   This button opens `/?mode=student&itemId={ID}` in a new tab.

### Testing the Fix
1.  Go to the Admin Panel -> Item Bank.
2.  Find a `unified_` item.
3.  Click the new **Blue External Link** button (square with arrow).
4.  A new tab will open directly in the Student View.
5.  **Refresh the page**. The content should remain **identical**, because the ID is locked in the URL.

## Pending items
- [x] Verify `unified_` items are fully persisted in DB (Confirmed via script).
- [x] Implement `fetchItemById` in `QuestionService`.
- [x] Implement `SingleItemPreviewMode`.
- [x] Add "Open in App" button to Admin Grid.

## Future Recommendations
-   **Session Persistence**: Implement `localStorage` persistence for Student App sessions so that refreshing during an *Adaptive Exam* (not preview) resumes the same exam instead of restarting.
-   **Batch Visualization**: In Admin, group items by Batch ID to avoid confusion when multiple similar items exist.
