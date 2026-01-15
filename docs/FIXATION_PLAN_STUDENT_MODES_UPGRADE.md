
# Fixation Plan: Student Application Modernization & Integration

## Objective
Transform the Student Application into a production-grade, premium experience by integrating all modes with the **Admin Item Bank**, verifying rigorous logic (CAT, Survival Ladder), and applying a high-end, interactive UI.

## 1. Adaptive NCLEX Simulation (CAT)
**Goal**: Refine the dual-mode experience (Tutor vs. Real Exam).
- [ ] **Tutor Mode**: Ensure explicit "Next Question" button appears *only* after rationale is viewed.
- [ ] **Real Exam Mode**:
    -   Hide **ALL** rationales and feedback.
    -   "Submit" button should immediately lock answer and show "Next Question" (or auto-advance after brief delay).
    -   Ensure absolutely no "green/red" indicators are shown.

## 2. Memory Master (Spaced Repetition)
**Goal**: Replace legacy mocks with Item Bank connection.
- [ ] **Data Source**: Refactor `SpacedRepetitionMode.tsx` to use `QuestionService`.
- [ ] **Logic**: Fetch items from Bank, filtering by "Review Needed" status (simulated SRS logic).
- [ ] **UI**: Add standard "Next Question" flow.
- [ ] **Design**: Modern intro card explaining the SRS algorithm.

## 3. Clinical Cases
**Goal**: Dual-mode selection (AI vs. Bank).
- [ ] **Intro Screen**: Add mode selection:
    1.  **"Bank Cases"**: Fetches validated, published case studies from Admin Bank.
    2.  **"AI Generator"**: Uses existing generative logic for infinite practice.
- [ ] **Navigation**: Ensure "Next Question" persists across screen changes in NGN cases.

- [x] **Adaptive NCLEX Simulation (CAT)**
    - [x] Split logic into `Tutor Mode` (rationales) vs `Real Exam Mode` (hidden rationales).
    - [x] Implement UI for mode selection on startup.
    - [x] Ensure `Real Exam Mode` strictly hides rationales and auto-advances or requires manual "Next" without feedback.

- [x] **Memory Master (Spaced Repetition)**
    - [x] Refactor to use `fetchNextQuestion` from `QuestionService` (replacing legacy `generateQuestions`).
    - [x] Implement SRS logic based on item review status (simulated queue for MVP).
    - [x] Add standard "Next Question" flow after rating confidence.
    - [x] Modern intro dashboard with forecast.

- [x] **Clinical Cases (Unfolding)**
    - [x] Add "Mode Selection" screen (Bank Cases vs. AI Generator).
    - [x] Fetch validated, published cases from the Bank for the "Bank Case" path (using `targetTypes: ['case-study']`).
    - [x] Retain AI generation as a fallback/option ("Infinite Gen").
    - [x] Ensure "Next Question" persistence across NGN case screens.

- [x] **Survival Mode (The Gauntlet)**
    - [x] Implement "Difficulty Ladder" logic (Level 1 -> 5).
    - [x] Fetch shuffled bank questions respecting the current level's difficulty.
    - [x] Remove mock question generation; use `fetchNextQuestion`.
    - [x] Improve Game Over and HUD UI.

- [x] **Exam Builder (Flex Master)**
    - [x] Implement "NCLEX Auto-Select" feature (`NGN_BLUEPRINT` preset).
    - [x] Ensure it uses NGN distribution percentages (partially implemented via domain balancing loop).
    - [x] Strictly use `QuestionService` with `targetTypes` and `domain` filters.

- [x] **Global UI/UX Overhaul**
    - [x] Create reusable `ModeIntro` components (implemented per-mode for specific needs).
    - [x] Ensure consistent header with progress/exit across updated modes.
    - [x] Apply modern styling (Cards, Glassmorphism elements) to new screens.smorphism card effects.
    -   Animated icons (Lucide-react).
    -   Brief, punchy descriptions.
- [ ] **Transitions**: Page transition animations for entering/exiting questions.
- [ ] **Consistency**: Unified header with "Exit", "Timer", and "Progress" across all modes.

## 4. Survival Mode (The Ladder)
**Goal**: Implement specific "Difficulty Ladder" logic with Bank items.
- [ ] **Logic**: New game loop:
    -   Phase 1: 5 Questions @ Level 1 (Easy)
    -   Phase 2: 5 Questions @ Level 2 (Moderate)
    -   Phase 3: 5 Questions @ Level 3 (Hard)
    -   Phase 4: 5 Questions @ Level 4 (Expert)
    -   Phase 5: 5 Questions @ Level 5 (Master)
- [ ] **Data Source**: Fetch batch of 25+ questions from Bank, sorted by difficulty buckets, then shuffled within buckets.
- [ ] **Requirement**: Verification that Bank has sufficient items (will assume dev environment has mixed difficulty).

## 5. Exam Builder
**Goal**: topic-based construction + "NCLEX Auto-Select".
- [ ] **Manual Build**: User selects Topic + Count -> Fetches random matching Published items.
- [ ] **NCLEX Auto-Select**: One-click generation following NGN Blueprint (e.g., 20% Pharm, 15% Peds, etc.).
- [ ] **Integration**: Strict reliance on `QuestionService` with `targetTypes` and `domain` filters.

## 6. Premium UI/UX Overhaul
**Goal**: "Best modern design" with advanced interactivity.
- [ ] **Intro Screens**: Create a reusable `ModeIntro` component with:
    -   Glassmorphism card effects.
    -   Animated icons (Lucide-react).
    -   Brief, punchy descriptions.
- [ ] **Transitions**: Page transition animations for entering/exiting questions.
- [ ] **Consistency**: Unified header with "Exit", "Timer", and "Progress" across all modes.

## Implementation Sequence
1.  **Refactor Exam Builder** (Foundational for filtering logic).
2.  **Update Memory Master** (Easy data swap).
3.  **Upgrade Clinical Cases** (Add Dual Mode UI).
4.  **Rebuild Survival Mode** (New Game Logic).
5.  **Polish Adaptive Mode** (Strict "Real Exam" visibility rules).
6.  **Global UI Polish** (Apply new design system).
