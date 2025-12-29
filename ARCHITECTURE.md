# Master NGN Question Creator - Architecture & Design

## 1. High-Level Architecture

The Master NGN Question Creator is designed as a **Metadata-Driven UI Framework**. Instead of hardcoding forms for each question type, the engine consumes individual **Configuration Modules**.

### Core Modules
1.  **The Registry (`QuestionTypeRegistry`)**:
    *   A singleton or state-aware store that holds the definition of all available question types.
    *   Tracks status: `Planned`, `In Progress`, `Completed`.
    *   Dynamically loads the configuration (Schema + UI Layout) for each type.

2.  **The Master Creator Engine (`MasterCreatorEngine`)**:
    *   **Entry Screen**: Renders the specific "Type Selection" UI based on the Registry.
    *   **Form Engine**: A generic component that takes a `QuestionTypeConfig` and renders the appropriate fields (Inputs, Rich Text, Arrays, Matrices).
    *   **Shared Services**:
        *   `SubmissionService`: Handles validation and saving.
        *   `AIReviewService`: Interface for the "Check & Fix" AI agents.
        *   `ExportService`: Tranforms internal JSON to generic NGN output format.

3.  **Question Type Modules (Plugins)**:
    *   Each specific NGN item (e.g., Case Study, Bow-Tie) is a separate module containing:
        *   `config.json`: Metadata, UI layout definitions, validation rules.
        *   `schema.ts`: TypeScript interface for the specific data model.
        *   `transform.ts`: (Optional) Logic to map raw form data to the final NGN JSON structure.

### Key Screens
1.  **Dashboard / Status Center**:
    *   Grid view of all 8 Question Types.
    *   Indicators for `Completed` (Green), `In Progress` (Amber), `Planned` (Grey).
    *   "Create New" button triggering the flow.

2.  **Unified Authoring Interface**:
    *   **Header**: Global Item Metadata (ID, Title, Difficulty, CJMM Phase).
    *   **Dynamic Body**: Injected based on the selected Type Config (e.g., 6 Steps for Case Study, Split Screen for Bow-Tie).
    *   **Footer**: Shared Actions (AI Review, Preview, Save, Publish).

---

## 2. Proposed Data Model

### Registry Schema
The registry tracks what the system *knows* how to build.

```typescript
type ImplementationStatus = 'Planned' | 'In Progress' | 'Completed';

interface QuestionTypeRegistration {
  typeId: string;         // e.g., 'case-study-6-screen'
  typeName: string;       // e.g., '6-Screen Case Study'
  description: string;
  status: ImplementationStatus;
  version: string;
  lastUpdated: string;    // ISO Date
  
  // The Configuration Object (loaded if Completed/InProgress)
  config?: QuestionTypeConfig; 
}
```

### Generic Question Item Schema
All items, regardless of type, share this envelope.

```typescript
interface MasterQuestionItem {
  id: string;
  typeId: string;         // Links back to Registry
  metadata: {
    title: string;
    authorId: string;
    createdAt: string;
    status: 'draft' | 'review' | 'published';
  };
  
  // Shared NGN Attributes
  pedagogy: {
    difficulty: number;
    cjmmPhase?: string;
    bloomTaxonomy?: string;
  };

  // Type-Specific Content (The "Payload")
  // This structure is enforced by the specific Type Config
  content: Record<string, any>; 
}
```

### Modular Configuration Pattern (The "Prompt" Target)
When you provide a new prompt, we generate this config object.

```typescript
interface QuestionTypeConfig {
  typeId: string;
  uiLayout: {
    // Defines the steps/tabs or sections
    sections: FormSection[]; 
  };
  dataSchema: JSONSchema; // Or a custom schema definition
  validationRules: Rule[];
}

interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

interface FormField {
  key: string;            // Path in data model e.g. "screens[0].nursesNotes"
  label: string;
  componentType: 'text' | 'rich-text' | 'number' | 'matrix' | 'array' | 'select' | 'custom';
  props?: Record<string, any>; // Component specific props (options, min/max)
}
```

---

## 3. UI Flow & Navigation

### Entry Screen: The Type Selector
*   **User Action**: Clicks "Create New Item".
*   **System Action**: Fetches `Registry.getAllTypes()`.
*   **Display**: Card grid.
    *   *Case Study*: "Ready to Author" (Button enabled).
    *   *Bow-Tie*: "Coming Soon" (Button disabled or "Vote for Next").
    *   *Status Badge*: Shows Version and Last Updated.

### Dynamic Authoring Flow
1.  **Selection**: User selects "Case Study".
2.  **Bootstrap**: System initializes a new Draft JSON with `typeId: 'case-study-6-screen'` and default `content` structure from the config.
3.  **Render**:
    *   Master Creator reads `config.uiLayout`.
    *   Detects `sections` (Setup, Screen 1, Screen 2...).
    *   Renders the "Tabbed Navigation" because Case Study config says `layout: 'step-by-step'`.
4.  **Interaction**:
    *   User fills fields.
    *   "AI Draft" button (if configured) is available in the toolbar.
    *   Validation runs against `config.validationRules`.

### Status Dashboard
*   Located at `/admin/question-types`.
*   Lists the 8 slots.
*   Shows the health of the "Master Creator" plugin ecosystem.

---

## 4. Pattern for Adding New Types
When you provide a subsequent prompt (e.g., "Prompt 2: Bow-Tie"):
1.  **Analyze**: I extract the specific Data Model and UI needs.
2.  **Generate Module**: I create `src/registry/bow-tie/config.ts`.
3.  **Register**: I add an entry to `src/registry/index.ts` with `status: 'Completed'`.
4.  **No Core Changes**: The `MasterCreatorEngine` does not change code; it just renders the new config.

---

# Implementation: Case Study Module (Prompt 1)

**Status**: Completed
**Type ID**: `case-study-6-screen`

(See `src/registry/case-study/config.ts` for the generated configuration based on your specification).
