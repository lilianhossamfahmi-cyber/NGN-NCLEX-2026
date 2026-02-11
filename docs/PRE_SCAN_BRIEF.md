# PRE_SCAN_BRIEF.md
## Audit Baseline: Master NGN Generator (2026-02-08)

This document provides a structured pre-scan audit profile of the Master NGN Generator project, summarizing its identity, technical foundation, domain compliance, and current health.

---

### 1. Project Identity Card
| Metric | Details |
| :--- | :--- |
| **App Name** | **Master NGN Generator** |
| **Core Problem** | Automates the creation of high-fidelity NGN items using AI while maintaining clinical accuracy and standardized scoring. |
| **Dev Start Date** | **December 2025** |
| **Current Stage** | **Production-Ready / Polish Phase** |
| **Development Team** | **Solo/Small Agile Team** (High velocity, vertical integration). |
| **Business Model** | **B2B / SaaS / Institutional** (Admin Dashboard focus). |
| **Major Rewrites** | **3 Major Architectural Shifts** (Evolution from simple generator to Zero-Error Ecosystem). |
| **Milestones** | 1. Kanban Implementation; 2. Gemini Integration; 3. NGN Renderer Suite; 4. Zero-Error Architecture; 5. Bio-feedback & UX Spotlight. |
| **Vision Alignment** | **Target Met.** Current system exceeds original generation goals by including real-time biometric analytics. |
| **Project Mgmt** | **Internal Kanban + GitHub.** Backlog is managed via structured progress logs in `/docs`. |
| **Documentation** | **High Consistency.** 60+ technical specifications and fix logs available. |

---

### 2. Tech Stack Inventory
| Layer | technology | Notes |
| :--- | :--- | :--- |
| **Frontend** | **React 18 + Vite** | Functional component architecture with strict TS typing. |
| **Language** | **TypeScript 5.9.3** | High type safety; enforced schema validation. |
| **Styling** | **Tailwind CSS + Radix UI** | Premium aesthetics with high accessibility standards. |
| **State** | **Service-Layer Pattern** | `itemStorageService`, `UnifiedDataPipeline` logic-driven state. |
| **Database** | **Supabase (PostgreSQL)** | Persistent storage with transactional integrity. |
| **AI Layer** | **Google Gemini SDK** | Advanced multi-prompt generation hierarchy. |
| **Infrastructure** | **Vercel** | Automated CI/CD, Edge functions, and Production logs. |
| **Quality Control** | **Jest + Zod** | Runtime and build-time schema enforcement. |

---

### 3. NGN Domain Profile
| Area | Status/Rules |
| :--- | :--- |
| **Item Bank Size** | **~200-500+ Items** across multiple medical domains. |
| **Supported Types** | Bow-Tie, Highlight, Trend, Matrix, Cloze, SATA, Case Studies. |
| **Content Creation** | **AI-Generated (Gemini)** with active human-in-the-loop tuning. |
| **Approval Flow** | **Draft → Review → Approved** (Kanban enforced). |
| **Case Study Size** | **6-Screen Standard** (EHR-accurate tabs). |
| **Scoring Rules** | **0/1, +/- (Polytomous), Linked Rationale, Sequence All-or-Nothing.** |
| **CJMM Alignment** | **Strict.** Items tagged and validated per clinical judgment phases. |
| **Clinical Safety** | Enforced via `qualityService` and clinically plausible distractor requirements. |

---

### 4. Issue Landscape Report
#### **Severity Heat Map**
| Priority | Category | Status |
| :--- | :--- | :--- |
| 🔥 **CRITICAL** | **AI Data Integrity** | **Managed** via `PerfectFillService` and `SmartManagerRepair`. |
| 🟠 **HIGH** | **Scoring Accuracy** | **Resolved** in late Dec (SATA/Matrix edge cases fixed). |
| 🟡 **MEDIUM** | **Performance** | **Optimized** (EHR tab switching & large JSON rendering). |
| 🟢 **LOW** | **UI Glitches** | **Ongoing** (Minor responsive quirks in mobile view). |

**Top 3 Pain Points:**
1. **JSON Hallucinations:** AI sometimes ignores field structures (Solved by industrial-strength repair logic).
2. **Schema Drift:** Keeping AI prompts synced with backend DB schema changes.
3. **Rationale Display:** Ensuring specific feedback keys are preserved across data transformations.

---

### 5. QA Maturity Assessment
| Area | Maturity (1-5) | Summary |
| :--- | :--- | :--- |
| **Automated Testing** | 🟢 **4** | Strong suite of integration and smoke tests; type-checking on build. |
| **Manual QA** | 🟢 **5** | High-fidelity preview modals allow instant verification of clinical logic. |
| **Release Process** | 🟢 **4** | Clean Vercel pipeline; schema migration checks integrated. |
| **Rollback Plan** | 🟢 **5** | Instant deployment reversion and DB point-in-time snapshots. |
| **Content Testing** | 🟢 **5** | `qualityService` validates NGN compliance before item approval. |

---

### 6. Available Evidence Inventory
| Artifact | Available (Y/N) | Format | Notes |
| :--- | :--- | :--- | :--- |
| Codebase | **Y** | Source | Full Git history and local source available. |
| Crash Logs | **Y** | Markdown | Documented in `/docs/fix_plans`. |
| DB Schema | **Y** | SQL/Zod | Visible in `supabase_schema.sql` and `/src/schemas`. |
| Analytics | **Y** | TS/JSON | Bio-feedback logic and session trackers available. |
| AI Prompts | **Y** | Markdown | All current prompts documented in `/docs/external_prompts`. |

---

### 7. Audit Readiness Score
**Overall Score: 9.3 / 10**

| Dimension | Score (1-10) | Highlight |
| :--- | :--- | :--- |
| **Documentation** | **10** | Unusually detailed log history and architectural maps. |
| **Observability** | **8** | Good log coverage via Vercel; bio-feedback analytics are robust. |
| **Issue Tracking** | **9** | Clear Kanban state and "Fix Plan" pattern. |
| **Testing** | **8** | Strong types; good integration tests. Could expand E2E visually. |
| **Arch Clarity** | **10** | Metadata-driven UI pattern is consistently applied. |
| **Domain Compliance** | **10** | Scoring and CJMM logic are industrially standardized. |

#### **Gaps to Address Before Deep Scan:**
- [ ] **Cross-Device E2E:** Verify EHR scrolling on physical tablets.
- [ ] **API Load Testing:** Stress test the Gemini generation pipeline for bulk requests (>50 items).
- [ ] **Schema Export:** Finalize the "Bank to QTI" export module for external platform compatibility.

---
*End of PRE_SCAN_BRIEF.md*
