# 🧠 Brain Golden Standards: The Performance Cockpit (v2.0)

This document defines the "World-Class" standard for the **Expert Analytics** sidebar (The "Brain" of the simulator).
The goal is to unify separate widgets into a cohesive, premium "Biometric HUD" (Heads-Up Display) inspired by modern medical interfaces and dark-mode dashboards.

## 1. The Design Language: "Dark Mode HUD & Biostats"
*   **Theme**: **Dark Mode** (`bg-slate-900`) with high-contrast neon accents. The "Brain" is distinct from the white paper exam.
*   **Width**: **Fixed 300px** (Micro-Compact).
*   **Material**: **Dark Glass** (`bg-slate-800/40`, `backdrop-blur`).
*   **Typography**: **Inter** + **Monospace** numbers. Tiny, crisp text (10px-12px) for high density.
*   **Accents**:
    *   **Indigo/Violet** (`#6366f1`): Primary Data.
    *   **Emerald** (`#10b981`): Success/Safety.
    *   **Rose** (`#f43f5e`): Critical Alerts.

## 2. Component-by-Component Upgrades

### A. Header (The Control Panel)
*   **Visual**: "Sticky Glass Header" (`backdrop-blur-md`, `bg-white/90`).
*   **Interaction**: Chevron (▼) animates (rotate 180°) smoothly on click.
*   **Features**:
    *   **Share Icon**: Allow students to share tough questions.
    *   **Settings Gear**: User preferences.
    *   **Toggle**: Clear state indication.

### B. Bio-Feedback ("Exam Vitals")
*   **Concept**: Gamify anxiety management.
*   **Visual**: Dark Navy Card (`#0F172A`).
*   **Animation**: **Real-time EKG** line using CSS Keyframes (`@keyframes dash { ... }`).
*   **States**:
    *   **Calm** (Green): Normal pacing.
    *   **Rushed** (Orange): Answering too quickly.
    *   **Stalled** (Red): Flatline (Time limit approaching).
*   **Purpose**: Teaches self-regulation.

### C. Score Card (The "Impact" Zone)
*   **Visual**: Deep Indigo Gradient (`from-violet-600 to-indigo-600`).
*   **Layout**: "Split Card".
    *   **Left**: Total Score (+1 / -1) in Huge Bold Type.
    *   **Right**: "Scoring Rule" pill (Clickable).
*   **Interaction**: **Count Up Animation** (0 -> 1) with "Confetti Pop" for perfect scores.
*   **JCI Badge**: Show a "Safety Badge" if a Patient Safety Goal was correctly identified.

### D. Performance Metrics (Probability & Pace)
*   **Layout**: **2x1 Grid** (Compact).
*   **Card 1: Peer Rank** (Probability)
    *   Show "Top 8% of Students" instead of just raw %.
    *   Visual: Sparkline Graph.
*   **Card 2: Pace Analysis**
    *   Visual: Circular Progress Bar.
    *   Zones: Green (Optimal), Red (Too Fast/Slow).

### E. Clinical Judgment (The NGN Core)
*   **Visual Upgrade**: **Hexagonal Radar Chart** (Spider Web).
    *   Replaces the 6 text boxes.
    *   Axes: Recognize, Analyze, Prioritize, Generate, Take Action, Evaluate.
*   **Benefit**: Instantly shows skill balance/skew.
*   **Interaction**: Hover points for specific feedback (e.g., "Analyze: 3/3 Correct").

## 3. JCI Compliance Feature: "The QI Tracker"
*   **New Section**: "Quality & Safety Alerts" (at the bottom).
*   **Function**: Flashes **RED** if a critical safety error occurs (e.g., Wrong Med).
*   **Content**:
    *   **Standard**: cites specific JCI Goal (e.g., IPSG.3).
    *   **Root Cause**: Explains *why* (e.g., "Failure to check patient ID").
*   **Goal**: Teaches Root Cause Analysis.

## 4. Technical Specifications (Tailwind CSS)

### Premium "Bio-Feedback" Card Implementation
```jsx
<div className="relative overflow-hidden rounded-xl bg-slate-900 p-4 shadow-lg ring-1 ring-white/10">
  {/* Background Glow Effect */}
  <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl"></div>

  <div className="flex items-center justify-between">
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Exam State</p>
      <div className="mt-1 flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <span className="text-lg font-bold text-white">Focus Flow</span>
      </div>
    </div>

    {/* Animated EKG Graph */}
    <div className="h-10 w-32 rounded bg-slate-800/50 p-1">
      <svg className="h-full w-full stroke-emerald-400" viewBox="0 0 100 20">
         <path d="M0 10 H10 L15 0 L20 20 L25 10 H100" fill="none" strokeWidth="2" className="animate-pulse-fast" />
      </svg>
    </div>
  </div>
</div>
```

### Summary of Transformation
| Component | Current Look | Premium "Highest Standard" |
| :--- | :--- | :--- |
| **Theme** | Flat Colors | Glassmorphism + Gradients + Depth |
| **Bio-Feedback** | Static "Calm" | Animated "Exam Vitals" (Real-time EKG) |
| **Score** | Blue Card | Split-Card with "Count Up" Animation |
| **Metrics** | Separate Bars | 2x1 Grid with Sparklines & Circular Progress |
| **CJMM** | 6 Boxes | Hexagonal Radar Chart (Visual Skill Balance) |
| **JCI Add-on** | None | "Quality & Safety Alert" (Root Cause Analysis) |
