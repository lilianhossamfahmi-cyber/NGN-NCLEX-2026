# Phase 3: Student Dashboard & Analytics Engine Specs

## 📅 Timeline: 3 Weeks (Feb 18 - Mar 10, 2026)

## 📌 Overview
This phase builds the high-fidelity **Student Dashboard** for the NGN platform. It transforms raw quiz data into actionable insights, providing students with a "GPS" for their NCLEX preparation.

## 🎯 Core Objectives
1.  **Metrics Engine**: Calculate Accuracy, Pass Probability, Foundation Quality, Time Management.
2.  **Pass Probability Algorithm**: Weighted algorithm calibrated to NCLEX standards.
3.  **Visualization widgets**: 12+ widgets including Trend Charts, Domain Mastery, and CJMM Radar.
4.  **Real-Time Architecture**: WebSocket/Polling for instant updates.
5.  **HUD Integration**: Biometric data (Focus, Stress, Calm).
6.  **AI Recommendations**: Rule-driven engine for next steps.

---

## 1. 🧮 Dashboard Metrics Engine (`src/student/services/AnalyticsEngine.ts`)

| Metric | Formula / Logic | Thresholds |
| :--- | :--- | :--- |
| **Overall Accuracy** | `(Total Correct / Total Attempted) * 100` | 🔴 <60% 🟡 60-75% 🟢 >75% |
| **Pass Probability** | *See Section 2* | 🔴 <50% 🟡 50-70% 🟢 >75% |
| **Foundation Quality** | Accuracy on `Level 1` & `Level 2` items only. | 🔴 <80% 🟡 90% (Target) |
| **Time Management** | `User Avg Time / Peer Benchmark Time` | 🔴 >1.2x 🟢 <1.0x |
| **Trend (7-day)** | Linear regression slope or simple `(Last 3 Days Acc) - (Prev 3 Days Acc)` | ↗️ Improve ↘️ Decline |
| **Domain Mastery** | Accuracy grouped by `clinicalFocus` tag. | Sorted bar chart |
| **CJMM Breakdown** | Accuracy grouped by `cjmmPhase` (Recognize Cues, etc.) | Radar Chart 0-100% |

---

## 2. 🔮 Pass Probability Algorithm
A weighted composite score (0-100%):

```typescript
// Weights
const W_ACCURACY = 0.40;
const W_DIFFICULTY = 0.20;
const W_CJMM = 0.20;
const W_TREND = 0.10;
const W_CONSISTENCY = 0.10;

function calculatePassProb(stats: StudentStats): number {
    const accuracyScore = stats.accuracy; // 0-100
    const diffBonus = (stats.avgDifficulty - 1) * 20; // Level 3 avg = +40pts base
    const cjmmScore = Object.values(stats.cjmm).reduce((a,b) => a+b, 0) / 6;
    
    // Penalize if Foundation (Easy) questions are missed
    const foundationPenalty = stats.foundationAcc < 80 ? 15 : 0;
    
    let rawScore = (
        (accuracyScore * W_ACCURACY) +
        (diffBonus * W_DIFFICULTY) + 
        (cjmmScore * W_CJMM) +
        (stats.trendSlope * W_TREND * 100) // Normalized trend
    );
    
    return Math.min(99, Math.max(1, rawScore - foundationPenalty));
}
```

---

## 3. 🧩 Dashboard Widgets (`src/student/dashboard/widgets/`)

1.  **KPI Cards**:
    *   `AccuracyCard`: Big %, donut chart, small trend arrow.
    *   `PassProbCard`: Big %, confidence interval (e.g. "±5%"), color-coded gauge.
    *   `TimeCard`: "1m 12s / q", comparison label "15% faster than peers".
2.  **Growth & Trends**:
    *   `TrendChart`: Line chart (Chart.js/Recharts), X=Date, Y=Accuracy, smoothed line.
    *   `FoundationGapMeter`: Linear progress bar for Easy questions. "Safe" zone marked.
3.  **Deep Dives**:
    *   `DomainMasteryBars`: Top 5 weakest and Top 5 strongest domains.
    *   `CjmmRadar`: Spider/Radar chart for 6 cognitive steps.
    *   `ClientNeedsToggle`: Switch Domain bars to Client Needs categories.
4.  **HUD & Biometrics**:
    *   `HudMetricsCard`: 3 mini sparklines (Focus, Stress, Calm).
    *   `StressEvents`: Counter for high-stress moments.
5.  **Actionable**:
    *   `RecommendedActions`: List of AI-generated cards (e.g., "Practice Cardiac").
    *   `RecentActivity`: Simple list of last 5 sessions.

---

## 4. 🤖 Recommended Actions Rules
Implementation in `RecommendationEngine.ts`:

- **Rule 1 (Foundation First)**: IF `Foundation < 85%` → "Drill Basics: Go back to Level 1 questions."
- **Rule 2 (Time Alarm)**: IF `Time > 2m` AND `Accuracy > 80%` → "Speed Up: You know it, but too slow."
- **Rule 3 (Clinical Gap)**: IF `LowestDomain < 50%` → "Study Topic: [Domain Name]."
- **Rule 4 (Exam Ready)**: IF `PassProb > 75%` AND `Trend > 0` → "Simulate Exam: Take a full CAT."

---

## 5. 🏗 Architecture & Data Flow

### Directory Structure
```
src/
  student/
    services/
      AnalyticsEngine.ts   <-- Core Calc
      RecommendationEngine.ts
      RealtimeService.ts   <-- WebSocket/Polling wrapper
    components/
      dashboard/
        StudentDashboard.tsx  <-- Main Layout
        widgets/           <-- All widgets
    hooks/
      useStudentMetrics.ts
```

### Data Pipeline
1.  **Frontend**: `useStudentMetrics` hook fetches raw `Attempt` data from API (`/api/student/attempts`).
2.  **Engine**: `AnalyticsEngine` processes the raw array into `DashboardStats` object (Client-side calculation for now to save server load, or Server-side if dataset > 1000 items). *Decision: Client-side for MVP.*
3.  **UI**: Components render based on `DashboardStats`.

---

## 6. ✅ Completion Checklist

- [ ] **Infrastructure**: Create `src/student` folders.
- [ ] **Engine**: Implement `AnalyticsEngine.ts` with testable pure functions.
- [ ] **Components**: Build `KPI Card` primitives.
- [ ] **Charts**: Install `recharts` for Radar/Line charts.
- [ ] **Integration**: Connect to `ItemDbService` (mock data for now, then real DB).
- [ ] **HUD**: Mock HUD data stream integration.
- [ ] **Polishing**: Responsive layout (Grid for Desktop, Stack for Mobile).
