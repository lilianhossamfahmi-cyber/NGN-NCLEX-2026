# Zero Error & Safety Fill System Architecture

## 1. System Overview
The "Zero Error System" is a comprehensive architectural standard designed to ensure that the Master NGN Generator provides accurate, consistent, and crash-proof experiences regardless of the quality of the raw AI-generated content. It operates on the principle of **Runtime Enrichment**: never trusting raw data, but always sanitizing and augmenting it before use.

## 2. Safety Fill Engine (`PerfectFillService`)
Located in: `src/utils/perfectFillSystem.ts`

The Safety Fill Engine is the first line of defense. It intercepts raw question data before rendering and applies the following enrichments:

### Key Features
*   **Metadata Injection**: If `clientNeeds`, `level`, or `difficulty` are missing, they are inferred or set to safe defaults (e.g., "Physiological Integrity", "Medium").
*   **CJMM Inference**: Automatically detects the Clinical Judgment Measurement Model step (e.g., "Recognize Cues") based on the question type (e.g., Highlight -> Recognize) if not explicitly provided.
*   **Time Normalization**: Injects `peerAverageTime` (default 60s) if missing, ensuring Pace Analysis never fails.
*   **Clinical Defaults**: Populates missing `gender`, `age`, or `setting` in patient scenarios to prevent "Undefined" UI glitches.

## 3. Zero Error Analytics
Located in: `src/utils/scoringEngine.ts` and `src/components/StudentPreviewModal.tsx`

This subsystem ensures that the **Data displayed** (Badges, Probabilities) matches the **Data calculated** (Scores).

### Resolved Inconsistencies
*   **SATA Object Scoring**: Fixed a critical bug where `multiple-response` answers were passed as Objects (`{id: true}`) but the engine expected Arrays (`['id']`). The engine now normalizes both formats automatically.
*   **Ordered Response logic**: Implemented Strict Sequence checking (0/1 Rule).
*   **History Normalization**: The `sessionAnalytics` loop now runs `normalizeConfig()` on every item. This prevents "Ghost Scores" (e.g., 92% Probability on a failed item) caused by type mismatches (e.g., `drag-and-drop` vs `ordered-response`) triggering generic scoring rules.
*   **Probability Synchronization**: The Pass Probability metric now strictly correlates with the current session's normalized score history.

## 4. Bio-Feedback & Stress Monitoring
Located in: `src/utils/stressEngine.ts` and `src/components/StressMonitorWidget.tsx`

The system now actively monitors user behavior to detect test anxiety:
*   **Hesitation Detection**: Tracks the `changeCount` (number of times an answer is modified).
*   **Thresholds**:
    *   Change Count > 3: Triggers "⚠️ Hesitating" (Amber).
    *   Rapid Clicks / High Latency: Triggers "High Anxiety" (Red).
*   **Visual Feedback**: The widget updates in real-time, providing immediate visual cues (Color changes, Pulse speed) to the user.

## 5. Visualizer Upgrades (Premium Design)
*   **Pace Analysis**: Replaced generic text with a **Relative Time Scale**, plotting "User Time" against "Peer Average" with dynamic icons (Rabbit/Turtle).
