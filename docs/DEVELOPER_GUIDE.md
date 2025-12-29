# Master NGN Creator - Developer Guide  
*v2.0 Architecture & Setup*

## 1. Project Overview
The **Master NGN Question Creator** is a React + TypeScript application designed to generate, validate, and export NCLEX-Next Gen exams. It uses a metadata-driven architecture (`src/registry`) to support new question types without core engine rewrites.

### key Directories
*   `src/engine/`: Core application shell (`MasterCreatorEngine`).
*   `src/registry/`: Definitions for all NGN item types (Case Study, Bowtie, etc.).
*   `src/services/`: Logic for Generation, Validation, Copyright, and Export.
*   `src/types/`: Central TypeScript schemas (`master-schema.ts`).
*   `src/components/`: Reusable UI library (Panels, Grids, Form Engines).

## 2. Setup & Installation

### Prerequisites
*   Node.js v20+
*   NPM v10+

### env Configuration
Create a `.env` file in root:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_GEMINI_API_KEY=AIza... (Optional for dev)
VITE_FEATURE_AI=true
```

### Commands
```bash
# Install dependencies
npm install

# Start Dev Server (Port 7000)
npm run dev

# Run Tests
npm test

# Build for Production
npm run build
```

## 3. Architecture Deep Dive

### A. The Registry Pattern
Every NGN item type is defined in `src/registry/<type>/config.ts`.
To add a new type (e.g., "Highlighter"):
1.  Create `src/registry/highlighter/config.ts`.
2.  Define `QuestionTypeConfig` (JSON Schema for UI).
3.  Register it in `src/registry/index.ts`.
4.  The Engine automatically renders it!

### B. Service Layer
*   **Generation**: Handles the AI loop. Mocked in `questionGenerationService.ts` for local dev.
*   **Copyright**: Checks formatting and attribution.
*   **Export**: Generates Blobs for download.

## 4. Troubleshooting
**Issue**: "Generate" button is stuck.
**Fix**: Ensure `src/config/apiConfig.ts` timeouts match your network speed. Default is 60s.

**Issue**: Validation errors on "Manual Mode".
**Fix**: Manual mode requires at least 10 characters of input in the textarea.

---
*Maintained by the Platform Engineering Team*
