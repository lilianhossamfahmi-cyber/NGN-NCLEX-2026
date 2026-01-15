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

## Getting Started
1. `npm install`
2. Configure `.env`
3. `npm run dev`
