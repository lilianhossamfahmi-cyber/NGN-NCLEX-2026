# Phase 4: Adaptive Algorithm & AI Intelligence Specs

## 📅 Timeline: 2 Weeks (Mar 11 - Mar 24, 2026)

## 📌 Overview
Phase 4 introduces the "Brain" of the platform: Computer Adaptive Testing (CAT) and AI-driven Personalization. This transforms the platform from a static quiz bank into a smart tutor that adapts to the student's ability level in real-time.

## 🎯 Core Objectives
1.  **CAT Algorithm**: Implement IRT-based question selection (Start L3 -> Adapt).
2.  **Daily Prescription**: Automated 6 AM analysis of student weaknesses -> Daily "Workout".
3.  **Adaptive Study Path**: Dynamic weekly schedule based on Exam Date.
4.  **Weakness Detection**: Real-time alerts for domain/time/foundation gaps.
5.  **Gamification**: Badges, Streaks, Points, Leaderboards.
6.  **Readiness Prediction**: Predictive pass probability model.

---

## 1. 🧠 CAT Algorithm (Computer Adaptive Testing)

The engine uses a simplified **Item Response Theory (IRT)** model to estimate Student Ability (Theta $\theta$).

### Logic
1.  **Initial Status**: Theta = 0.0 (Average / Difficulty Level 3.0).
2.  **Item Selection**: Select item where `ItemDifficulty` $\approx$ `StudentTheta`.
    *   *Constraints*: No duplicate/recently seen items. Balanced domains.
3.  **Response Update**:
    *   **Correct**: Increase Theta. $\Delta\theta = K \times (1 - P_{success})$
    *   **Incorrect**: Decrease Theta. $\Delta\theta = K \times (0 - P_{success})$
    *   *K-Factor*: Starts high (rapid adapatation), decreases as confidence grows.
4.  **Stopping Criteria**:
    *   Max Items Reached (e.g. 85 or 150).
    *   Theta Confidence Interval is narrow (< 0.3) AND Theta is clearly Above/Below Passing Standard.
    *   Max Time Reached (5 hours).

### Pseudocode (`src/student/services/CatEngine.ts`)
```typescript
interface CatState {
  theta: number; // Ability (-3.0 to +3.0)
  standardError: number;
  itemsAdministered: number;
  history: Attempt[];
}

function updateTheta(currentTheta: number, result: boolean, itemDiff: number): number {
  const K = 0.4; // K-factor (simplified)
  // Logistic function probability
  const prob = 1 / (1 + Math.exp(-(currentTheta - itemDiff)));
  
  const score = result ? 1 : 0;
  return currentTheta + K * (score - prob);
}
```

---

## 2. 💊 Daily Prescription Engine & Weakness Detection

Runs automatically (or on login) to generate a "Daily Task".

### Weakness Identification Rules (`src/student/services/RecommendationEngine.ts`)
1.  **Critical Domain Gap**: Domain Accuracy < 55% (Priority #1).
2.  **Foundation Crack**: Level 1-2 Accuracy < 80% (Priority #2).
3.  **CJMM Breakdown**: "Analyze Cues" or "Generate Solutions" < 60% (Priority #3).
4.  **Time Management**: Avg Time > 1.2x Peer Avg (Priority #4).

### Prescription Logic
- **IF** Critical Domain Gap Found in "Pharmacology" → **Prescribe**: "Pharma Drill (15 Questions, Level 2-3 Focus)".
- **IF** Foundation Crack → **Prescribe**: "Back to Basics: 20 Level 1 Questions".
- **IF** No Critical Weakness → **Prescribe**: "Balanced CAT Simulation (85 Questions)".

---

## 3. 🗺️ Personalized Study Path Generator

Dynamic scheduling based on `DaysToExam`.

### Intensity Levels
- **Marathon Mode (> 60 Days)**: 30 mins/day. Focus: Content Mastery.
- **Training Mode (30-60 Days)**: 1-2 hrs/day. Focus: Weakness Targeting.
- **Sprint Mode (14-30 Days)**: 2-3 hrs/day. Focus: Speed & Endurance.
- **Peak Mode (< 14 Days)**: 4+ hrs/day. Focus: Full Mock Exams + Review.

### Algorithm
1.  Calculate `DaysToExam`.
2.  Set `DailyGoalQuestions` based on Intensity.
3.  Distribute domains: 60% Weakest Domains, 40% Mixed/Strong.
4.  Generate Calendar Events.

---

## 4. 🎮 Gamification & Motivation Engine

### Badges (`src/student/gamification/`)
- **Streaks**: 🔥 3-Day, 🔥 7-Day, 🔥 30-Day.
- **Mastery**: 🛡️ Domain Master (Level 5 in a Domain).
- **Speed**: ⚡ Speedster (Avg < 60s with > 80% Acc).
- **Grind**: 🏋️ Early Riser (Study before 8 AM), 🦉 Night Owl.

### Points System
- 1 Q Attempt = 10 XP.
- Correct Bonus = +5 XP.
- Streak Bonus = +50 XP/Day.
- Level Up every 1000 XP.

---

## 5. 🏗 Architecture Plan

### Directory Structure
```
src/
  student/
    learning/        <-- NEW: Learning Logic
      CatEngine.ts
      PrescriptionEngine.ts
      StudyPathGenerator.ts
    gamification/    <-- NEW: Badges/Points
      BadgeSystem.ts
      GamificationService.ts
    components/
      learning/
        CatSessionView.tsx
        DailyPrescriptionCard.tsx
        StudyPlanCalendar.tsx
```

### Database Schema Updates (Mock)
- `StudentProfile`: Added `theta`, `examDate`, `xp`, `level`, `badges[]`.
- `DailyTask`: `id`, `date`, `type`, `status` ('pending', 'completed').

---

## 6. ✅ Completion Checklist

- [ ] **Data Structures**: Define `CatState`, `StudyPath`, `Badge` interfaces.
- [ ] **Engines**: Implement `CatEngine`, `PrescriptionEngine`, `GamificationService`.
- [ ] **UI Components**:
    - [ ] `CatSessionView` (Question swiper with adaptive logic).
    - [ ] `DailyPrescriptionCard` (Dashboard widget).
    - [ ] `GamificationBar` (XP, Level, Streaks).
- [ ] **Integration**: Hook into `useStudentMetrics`.
- [ ] **Testing**: Verify theta updates correctly on right/wrong answers.
