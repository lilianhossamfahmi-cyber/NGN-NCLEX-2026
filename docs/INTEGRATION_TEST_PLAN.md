# Master NGN Question Creator - Integration Testing Plan
*Version 1.0 - Post-Implementation Phase*

## 1. Overview
This document outlines the integration testing strategy for the Master NGN Question Creator (v2.0). The goal is to verify the seamless interaction between the UI shell (MasterCreatorEngine), the Service Layer (Generation, Validation, Quality), and the Data Layer (Registry, Schema).

---

## 2. Test Environment
*   **Framework**: Jest + React Testing Library (RTL)
*   **API Mocking**: MSW (Mock Service Worker)
*   **Environment**: JSDOM-simulated browser
*   **Viewport**: 1280x800 (Desktop)

---

## 3. Critical Integration Flows

### Flow A: Hybrid Generation (The "Golden Path")
**Scenario**: User generates questions using Reference + Manual Data + AI Prompt.
1.  **Configure**:
    *   Set Mode to `Hybrid`.
    *   Upload/Select a Reference (Mocked file).
    *   Enter Manual text ("Patient has pH 7.25").
    *   Enter Prompt ("Sepsis case").
2.  **Parameters**:
    *   Select `Case Study` and `Trend`.
    *   Set Qty: 2.
    *   Set Temp: 0.7.
3.  **Action**: Click "Generate".
4.  **Verify**:
    *   Spinner appears.
    *   Service `generateQuestions` is called with merged context.
    *   Result Grid determines quality scores.
    *   4 items appear (2 types * 2 qty).

### Flow B: AI Safety & Deduplication
**Scenario**: User tries to generate unsafe or duplicate content.
1.  **Trigger**: Generate item that triggers `CopyrightService` mock (e.g. prompt contains "Copyrighted Text").
2.  **Verify**:
    *   Generation completes but item flagged Amber/Red.
    *   `aiSafetyChecks` in object contains flagged entry.
    *   ResultsGrid displays warning badge.

### Flow C: Export Workflow
**Scenario**: User approves and exports valid items.
1.  **Select**: 2 items from results.
2.  **Action**: Click "Export All" -> "PDF".
3.  **Verify**:
    *   `exportService` invoked with format 'pdf'.
    *   Download trigger mechanism (anchor tag click) executed.

### Flow D: Session Resilience
**Scenario**: User refreshes page mid-workflow.
1.  **Setup**: Fill inputs, generate batch.
2.  **Action**: Simulate Page Refresh (reload component).
3.  **Verify**:
    *   `sessionService.loadSession()` retrieves state.
    *   Dashboard restores to "Review" view (not empty dashboard).

---

## 4. Test Case Inventory

| ID | Component | Test Description | Expected Result |
|----|-----------|------------------|-----------------|
| **INT-01** | `MasterCreatorEngine` | Hybrid Mode Setup | Mode switches, all 3 input areas visible. |
| **INT-02** | `GenerationService` | Retry Logic | Svc calls mock 3 times on failure then throws. |
| **INT-03** | `ValidationService` | Invalid Config | "Generate" button disabled or alerts error if Qty > 100. |
| **INT-04** | `ResultsGrid` | Scoring Display | Item with score 95 starts green; 50 starts red. |
| **INT-05** | `ReferencePanel` | Toggle Reference | References array updates; Inactive ref excludes from API payload. |
| **INT-06** | `ItemAuthoring` | Form Switching | Opening Case Study shows Tabs; Trend shows Single Page. |
| **INT-07** | `ExportService` | PDF Export | Returns Blob of type 'application/pdf'. |

---

## 5. Required Mocks
To support these tests, the following MSW handlers are required:
*   `POST /api/generate` -> Returns `[{ id: '1', type: 'case-study', ... }]`
*   `POST /api/copyright` -> Returns `status: 'clean'` or `flagged`
*   `POST /api/export` -> Returns dummy Blob.

## 6. Execution Strategy
1.  Install dependencies: `npm install --save-dev jest @testing-library/react msw`
2.  Create `setupTests.ts`
3.  Implement Scaffolding (see `src/__tests__`).
4.  Run `npm test`.
