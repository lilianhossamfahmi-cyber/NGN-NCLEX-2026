# Phase 5: Expert HUD Integration & Biometric Analytics Specs

## 📅 Timeline: 2 Weeks (Mar 25 - Apr 7, 2026)

## 📌 Overview
Phase 5 integrates the "Expert HUD," bringing emotional intelligence into the platform. By monitoring user behavior (mouse movements, response times, activity), we infer focus and stress levels to provide real-time coaching and post-quiz resilience analytics.

## 🎯 Core Objectives
1.  **Biometric Data Collection**: Infer Focus/Stress from behavioral signals (Mouse, Keyboard, Time).
2.  **Stress Coaching**: Real-time micro-interventions (Breathing, Refocusing).
3.  **CALM Metric**: A new composite score for emotional stability.
4.  **Clinical Reasoning Hex**: A visual spider-chart for CJMM steps.
5.  **Correlational Analytics**: "Do you score better when you're calm?"

---

## 1. 🧬 Biometric Data Engine (`src/student/services/BiometricService.ts`)

Since we don't have physical sensors, we use **Behavioral Proxy Metrics**:

| Metric | Proxy Signal | Sampling Rate |
| :--- | :--- | :--- |
| **Focus** | Tab visibility, Mouse movement consistency, Scroll linearity. | 5 sec |
| **Stress** | Rapid/Erratic mouse movements, "Rage clicking", Typing speed variance. | Event-based |
| **Fatigue** | Time per question trend (increasing = fatigue), Idle time. | Per Item |

### Data Schema (`BiometricSession`)
```typescript
interface BiometricSession {
  sessionId: string;
  timeline: {
    timestamp: number;
    focusScore: number; // 0-100
    stressIndex: number; // 0-100
    action?: 'idle' | 'active' | 'scrolling';
  }[];
  interventions: {
    time: number;
    type: 'breathing' | 'refocus';
    accepted: boolean;
  }[];
}
```

---

## 2. 🧘 Stress Coach & Interventions

**Trigger Logic**:
- **High Stress**: `StressIndex > 80` for > 30s → *Trigger Breathing Exercise*.
- **Low Focus**: `FocusScore < 40` for > 60s → *Trigger "Eyes Up" Reminder*.
- **Rushing**: `TimePerItem < 10s` (complex item) → *Trigger "Slow Down"*.

**Visuals**:
- Subtle Toast Notifications (Non-blocking).
- "Zen Mode" toggle (hides timer/score).

---

## 3. 🛡️ CALM Metric Algorithm

**CALM** = **C**onsistent **A**ttention & **L**ow **M**ental-strain.

$$CALM = (0.5 \times (100 - AvgStress)) + (0.3 \times AvgFocus) + (0.2 \times ConsistencyFactor)$$

- **Display**: A fluid gauge on the dashboard.
- **Goal**: Maintain > 75% CALM score during simulations.

---

## 4. 🕸️ Clinical Reasoning Hex (Visualization)

A 6-sided radar chart (similar to Phase 3 but specialized for HUD).
- **Nodes**: Recognize, Analyze, Prioritize, Generate, Take Action, Evaluate.
- **Dynamic**: Updates *live* as student answers case study questions.
- **Comparison**: Overlay "Peer Average" in gray.

---

## 5. 🏗 Architecture Plan

### Directory Structure
```
src/
  student/
    hud/             <-- NEW: Biometrics & HUD
      BiometricService.ts
      StressCoach.ts
      CalmEngine.ts
    components/
      hud/
        FocusMonitor.tsx    <-- Real-time indicator
        StressIntervention.tsx <-- Popup
        ClinicalHex.tsx     <-- Widget
        CalmGauge.tsx
```

---

## 6. ✅ Completion Checklist

- [ ] **Engine**: Implement `BiometricService` (Mock listeners for behaviors).
- [ ] **Logic**: Implement `CalmEngine` calculation.
- [ ] **UI Components**:
    - [ ] `FocusMonitor`: Animated pill showing "High Focus".
    - [ ] `StressIntervention`: Modal with breathing animation.
    - [ ] `ClinicalHex`: Recharts Radar (reused/styled).
    - [ ] `CalmGauge`: SVG Circular progress.
- [ ] **Integration**: Bind `FocusMonitor` to `PracticeMode`.
- [ ] **Analytics**: Correlate Focus vs. Score in `AnalyticsEngine`.
