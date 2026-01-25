# NCLEX-NGN Generator

## Security Configuration

### API Key Protection
This project uses **Environment Variables** to manage sensitive credentials. API keys are **never** hardcoded in the source code.

1.  **Setup**:
    *   Copy `.env.example` to `.env`.
    *   Add your `VITE_GEMINI_API_KEY` to `.env`.
    *   Never commit `.env` to version control (it is ignored by git).

2.  **Rate Limiting**:
    *   Client-side rate limiting is enforced in `src/config/apiConfig.ts`.
    *   Default limit: **10 requests per minute**.
    *   This prevents accidental API quota exhaustion and potential abuse.

3.  **Strict Validation**:
    *   The application will refuse to initialize AI services if the API key is missing or invalid.
    *   Check `src/config/apiConfig.ts` for security logic.

### Safety Checks
*   **Duplicate Detection**: AI generated content is checked against existing items.
*   **Copyright Safety**: (Placeholder) Implementation for copyright checks.
*   **Request Interceptors**: API keys are stripped from logs (via `apiConfig` centralization).

## Clinical Reasoning System (Rationale Master Fix)

The application features a standardized, industrial-strength clinical reasoning system designed to provide high-quality feedback for NCLEX-NGN items. This system uses a unified data pipeline to extract and validate rationales across all item types (BowTie, Matrix, SATA, etc.).

### 📐 Architecture Overview
The system follows a strict data flow hierarchy:
`StudentPreviewModal` → `RationaleDrawer` → `RationaleSheet` → `UltimateRationale`

### 📚 Documentation
- [Architecture Documentation](./docs/RATIONALE_ARCHITECTURE.md) - Deep dive into system design and data flow.
- [Component Integration Guide](./docs/COMPONENT_INTEGRATION_GUIDE.md) - How to use and extend the rationale components.
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md) - Procedures for staging and production releases.
- [Troubleshooting Guide](./docs/TROUBLESHOOTING.md) - Solutions for common issues and diagnostic steps.
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Final verification before release.

## Getting Started
1. `npm install`
2. Configure `.env`
3. `npm run dev`
4. `npm run type-check` to verify integrity.
5. `npm test` to run clinical reasoning integration tests.
