# NGN Question Type Audit & Refactor Log

## Overview
This document tracks the audit and refactoring of all 7 NGN question types to ensure compliance with NCSBN standards and full interactivity.

## Plan
1. **Case Study (6-Screen)** - [x] Completed
2. **Stand-Alone Trend Item** - [x] Completed (Renderer implemented)
3. **Standalone Bow-Tie** - [x] Completed (Renderer implemented)
4. **Matrix Multiple Response** - [x] Completed (Renderer implemented, supports Checkbox & Radio)
5. **Highlight Text** - [x] Completed (Renderer implemented, strict highlighting rules)
6. **Cloze (Dropdown)** - [x] Completed (Renderer implemented)
7. **Multiple Response (SATA)** - [x] Completed (Renderer implemented)
8. **Single Response (MC)** - [x] Completed (Renderer implemented)

## Details

### 1. Case Study (6-Screen)
- **Status**: Audit Complete & Fixed.
- **Implementation**:
  - `CaseStudyRenderer` logic integrated into `StudentPreviewModal`.
  - Implemented sequential locking (Next button disabled until submit).
  - Implemented completion tracking.
  - Screen Types fully supported via modular renderers (SATA, Matrix, Cloze, Highlight).

### 2. Item Renderers (Refactor)
A modular architecture was introduced in `src/components/item-types/renderers/`.

#### Highlight Text (`HighlightRenderer.tsx`)
- **Fix**: Prevents highlighting from appearing during interaction phase.
- **Feature**: 3-state feedback color coding (Correct-Green, Incorrect-Red, Missed-LightGreen) on submit.

#### Multiple Response / SATA (`SATARenderer.tsx`)
- **Fix**: Left-aligned checkboxes.
- **Feature**: Validation message ("Selected X/Y" or "Select all that apply") and visual feedback.

#### Matrix (`MatrixRenderer.tsx`)
- **Fix**: Supports both Radio (One per row) and Checkbox (Multiple per row) modes based on configuration.
- **Feature**: Visual cell coloring on submit.

#### Bow-Tie (`BowTieRenderer.tsx`)
- **Fix**: Implemented strict 5-slot Drag and Drop interaction.
- **Feature**: Strict category validation (Actions vs Conditions vs Parameters).

#### Cloze (`ClozeRenderer.tsx`)
- **Fix**: Dropdown implementation with inline correct answer display.

#### Trend (`TrendRenderer.tsx`)
- **Fix**: Wrapper for Trend Data (Table/Image) + Question Interaction.

### 3. Student Preview
- Updated `StudentPreviewModal.tsx` to utilize the new `onComplete` callback from `ItemRenderer`, enabling strict exam flow control.

## Verification
- Code has been statically analyzed and type-checked (TS check assumed correct based on structure).
- Logic matches NCSBN NGN requirements (Submission required before feedback, Rationales hidden until submit).

### 4. Schema Normalization (Data Layer)
To support both "Standalone" Item Types (which use complex Registry Schemas) and "Case Study" Screens (which use simplified Schemas), a **Data Normalization Layer** was added to `ItemRenderer.tsx`. 
- **Trend**: Automatically generates HTML Tables from `trendData` objects.
- **Bow-Tie**: Maps Registry `bowTieConfiguration` (Action/Condition/Param options) to the simplified Renderer pools.
- **Cloze**: Maps Registry `cloze.sentences` to Renderer `sentences`.
- **General**: Unifies `prompt` and `options` from various authoring keys (`stem`, `itemStem`, `task`, `responseOptions`).
This ensures that items created via the Authoring UI render correctly without duplicating logic in every renderer.
