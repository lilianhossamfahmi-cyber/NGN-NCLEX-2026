# Item Type & UX Golden Standards
**Last Updated:** 2025-12-30

This document defines the **Highest Standard Upgrade** specifications for all item types, tools, and the global user interface of the NCLEX NGN Simulator. These standards allow us to achieve a premium, world-class "look and feel" (comparable to UWorld or Archer).

---

## 1. Item Type Specific Standards

### 1.1 Highlight / Hotspot Questions (Files: 89, 96)
**Goal:** Transform basic highlighting into a realistic "Highlighter Pen" interaction.

#### Design Specs
*   **Selection State:**
    *   **Background:** `bg-yellow-200` (Classic Highlighter Yellow)
    *   **Style:** `border-b-2 border-yellow-500` (Marker stroke effect)
    *   **Text Color:** `#1F2937` (Dark Grey) to ensure contrast ratio > 4.5:1.
*   **Hover State:**
    *   **Cursor:** Custom "Highlighter Icon" (or `cursor-text` with modifier).
    *   **Preview:** Subtle `bg-yellow-50` overlay on hoverable text.

#### Content Specs
*   **Distractors:** Wrong answer sentences must be clinically plausible, not obvious fillers.
*   **Length:**
    *   Stem: < 20 words (Concise).
    *   Text: 50-80 words (Context-rich).

---

### 1.2 Dropdown / Cloze Questions (File: 90)
**Goal:** Replace default browser controls with premium custom components.

#### Design Specs
*   **Component:** Custom React Listbox (Headless UI or Radix UI recommended).
*   **Unselected State:**
    *   White box, `border-gray-300`, `rounded-md`.
    *   Text: "Select Option..." in `text-gray-400`.
*   **Open State:**
    *   `shadow-lg` floating menu.
    *   Options hover: `hover:bg-blue-50`.
    *   Animation: Subtle fade-in/slide-down.
*   **Selected State:**
    *   Border: `border-blue-500` (#3B82F6).
    *   Text: **Bold** Dark Blue.

#### Content Specs
*   **Cognitive Load:** Max 3-5 options per dropdown to prevent decision fatigue.

---

### 1.3 Matrix / Grid Questions (File: 91)
**Goal:** Improve clickability and readability of large tables.

#### Design Specs
*   **Click Targets:** Entire <td> cell must be clickable, not just the radio inputs.
*   **Visual Feedback:**
    *   **Row Completion:** Background changes to `bg-blue-50/30` when a selection is made.
*   **Headers:**
    *   Background: Dark Navy (`#1E293B`).
    *   Text: White.
    *   Behavior: Sticky positioning if list is long.
*   **Zebra Striping:** Alternating `bg-white` and `bg-slate-50` rows for tracking.

---

### 1.4 Bow-Tie / Drag and Drop (File: 93)
**Goal:** Create a tactile, responsive drag-and-drop experience.

#### Design Specs
*   **Color Coding:**
    *   **Actions (Left):** Blue Border / `bg-blue-50`.
    *   **Condition (Center):** Purple Border / `bg-purple-50`.
    *   **Parameters (Right):** Green Border / `bg-green-50`.
*   **Interaction:**
    *   **Drag State:** Scale item up (1.05x) + `shadow-lg` when lifting.
    *   **Drop Zone:** Border thickens (`border-2` -> `border-4`) and pulses when valid item hovers.
    *   **Success:** Subtle "Snap" animation on drop.

#### Content Specs
*   **Distractors:** Must be relevant differential diagnoses or plausible alternative actions.

---

### 1.5 Calculation Questions (File: 95)
**Goal:** Clarify units and inputs.

#### Design Specs
*   **Input Field:**
    *   Size: Large text (`text-xl`).
    *   Align: Right-aligned numbers.
*   **Unit Label:** Fixed label (e.g., "mL/hr") *inside* the input wrapper on the right edge, gray background (`bg-gray-100`).
*   **Tools:** "Open Calculator" button placed directly next to the question stem for immediate access.

---

## 2. Tools & Interface Standards

### 2.1 The Toolbar & Sticky Note (Files: 99, 100)
**Goal:** Enhance utility and visual distinctiveness.

#### Toolbar Specs
*   **Active State:** Inverted colors (Dark Background, White Icon) for clear "On" status.
*   **Tooltips:** High-contrast (Black/White) showing shortcut names (e.g., "Calculator (Alt+C)").

#### Sticky Note Specs
*   **Visuals:**
    *   Background: `bg-yellow-200` (Post-it style).
    *   Shadow: Subtle bottom-right `shadow-md`.
    *   Font: Handwriting style (Caveat/Kalam).
*   **Functionality:**
    *   **Multiple Instances:** Allow spawning multiple independent notes.
    *   **Draggable:** Fully movable via `react-draggable`.
    *   **Minimizable:** "-" button shrinks note to a small icon/tab.

### 2.2 Global UI & Navigation (Files: 97, 98)
**Goal:** Better progress tracking and feedback.

#### Progress Bar
*   **Position:** Thin bar at the very top.
*   **Segments:**
    *   Grey: Unseen.
    *   Blue: Current.
    *   Green: Answered/Reviewed.
    *   Orange: Marked for Review (Flagged).

#### Interactions
*   **Mark for Review:** Flag icon toggles Orange state in progress bar.
*   **Submit Button:** Micro-interaction required ⇒ Button transforms to "Spinner" -> "Checkmark" -> Transition.

---

## 3. Premium "Look & Feel" Enhancements (The "Pro" Factor)

To complete the transformation to a premium platform, implement these 5 architectural changes:

### 3.1 Glassmorphism & Depth
*   **Main Background:** Light Cool Grey (`#F3F4F6`).
*   **Panels:** White with multi-layered shadows:
    *   `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
*   **Overlays:** `backdrop-filter: blur(8px)` with `rgba(255, 255, 255, 0.9)` background.

### 3.2 Animated Transitions
*   **Library:** Framer Motion (or CSS Transitions).
*   **Tab Switching:** Slide-Fade effect (Slide in 10px from right, Opacity 0->100, 200ms).
*   **Wrong Answer:** Horizontal Shake animation on Submit button.

### 3.3 Intelligent Split-Screen
*   **Component:** Resizable Panel Group (React-Resizable-Panels or similar).
*   **Handle:** Visible grip handle between EHR and Question.
*   **Hover:** Handle turns Blue line on hover.
*   **Function:** User can drag to widen EHR for reading, then shrink for questioning.

### 3.4 Dark Mode Support
*   **Toggle:** Sun/Moon icon in header.
*   **Palette:**
    *   Background: `#0F172A` (Deep Blue-Grey).
    *   Cards: `#1E293B` (Dark Slate).
    *   Text: `#E2E8F0` (Light Grey).
    *   Accents: `#38BDF8` (Sky Blue) for contrast.

### 3.5 Skeleton Loading States
*   **Never Blank:** Displays pulsing grey shapes while data fetches.
*   **EHR:** Skeleton timeline blocks.
*   **Question:** Skeleton paragraph and option bars.

---

## 4. Implementation Checklist

### Immediate Actions
- [ ] Install `font-handwriting` (Caveat/Kalam) for Sticky Notes.
- [ ] Add `backdrop-blur` utilities to overlays.
- [ ] Define `dark:` variants in Tailwind config.
- [ ] Create `SkeletonCard` component using `animate-pulse`.
- [ ] Refactor Matrix table to use `<thead>` with sticky positioning.

### Component Updates
- [ ] **HighlightQuestion.tsx**: Update styling to Marker effect.
- [ ] **DropdownQuestion.tsx**: Replace native select with Headless UI/Custom Div.
- [ ] **DragDropBowtie.tsx**: Add scaling/shadow on DragStart.
- [ ] **AccessibilityTools.tsx**: Ensure contrasts match new specs.
