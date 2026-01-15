# Master NGN Backend Infrastructure - Phase 1 Specifications

**Version:** 1.0 (Phase 1 Draft)
**Date:** 2026-01-11
**Target Infrastructure:** PostgreSQL (Supabase/AWS RDS), Node.js (Next.js API Routes)

---

## 1. Database Schema Design (PostgreSQL)

This schema covers the core requirements: Items, Students, Responses, Sessions, and Metrics. It is designed for high-scale querying and analytics.

### A. Tables

```sql
-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- 1. NGN_STUDENTS (User Profile Extension)
-- Maps 1:1 with auth.users if using Supabase, or stands alone
CREATE TABLE ngn_students (
    student_id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
    
    -- Enrollment / Subscription
    institution_id UUID, 
    subscription_status TEXT DEFAULT 'active',
    subscription_tier TEXT DEFAULT 'free',
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE -- Soft delete
);

-- 2. NGN_ITEMS ( The "Item Bank")
CREATE TABLE ngn_items (
    item_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Core Content (JSON output from Generator)
    -- Stored as JSONB for high-performance querying of nested fields
    content JSONB NOT NULL,
    
    -- Metadata (extracted from JSON for Indexing)
    item_type TEXT NOT NULL, -- 'case-study', 'bow-tie', etc.
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    topic_focus TEXT,        -- 'Sepsis', 'Cardio', etc.
    expert_score INTEGER,    -- 0-100 score of item quality
    
    -- Lifecycle
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    version INTEGER DEFAULT 1,
    author_id UUID REFERENCES ngn_students(student_id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. NGN_SESSIONS (Quiz/Exam Attempts)
CREATE TABLE ngn_sessions (
    session_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES ngn_students(student_id),
    
    -- Session Config
    mode TEXT NOT NULL, -- 'tutorial', 'exam', 'cat' (Computer Adaptive)
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    
    -- Analytics Snapshot
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration_seconds INTEGER,
    total_items INTEGER DEFAULT 0,
    score_raw INTEGER DEFAULT 0,
    score_percentage NUMERIC(5,2),
    
    -- For CAT (Adaptive Testing)
    current_difficulty_theta NUMERIC(4,2)
);

-- 4. NGN_RESPONSES (Granular Answers)
CREATE TABLE ngn_responses (
    response_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES ngn_sessions(session_id),
    student_id UUID REFERENCES ngn_students(student_id),
    item_id UUID REFERENCES ngn_items(item_id),
    
    -- The Answer
    student_answer JSONB NOT NULL, -- e.g., ["id1", "id2"] or ordered list
    is_correct BOOLEAN,
    score_awarded NUMERIC(4,2),    -- Partial credit support
    
    -- Timing & Behavior
    time_spent_seconds INTEGER,
    changed_answer_count INTEGER DEFAULT 0,
    
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 5. NGN_METRICS (Computed Analytics)
-- Aggregated daily or per-session for dashboard speed
CREATE TABLE ngn_metrics (
    metric_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES ngn_students(student_id),
    
    -- Dimensions
    domain TEXT, -- 'Physiological Integrity', 'Sepsis', etc.
    metric_date DATE DEFAULT CURRENT_DATE,
    
    -- Stats
    items_attempted INTEGER DEFAULT 0,
    items_correct INTEGER DEFAULT 0,
    average_time_seconds NUMERIC(6,2),
    difficulty_average NUMERIC(4,2),
    
    -- Trend
    performance_index NUMERIC(4,2) -- Custom calculated score
);
```

### B. Index Strategy (Optimization)

To handle 10,000+ students and 1000+ items, we need targeted indices:

```sql
-- Searching Items by Metadata
CREATE INDEX idx_items_type_difficulty ON ngn_items (item_type, difficulty_level, status);
CREATE INDEX idx_items_topic ON ngn_items USING GIN ((content -> 'metadata' -> 'clinicalFocus'));

-- Student Dashboard Lookups
CREATE INDEX idx_sessions_student ON ngn_sessions (student_id, start_time DESC);
CREATE INDEX idx_responses_session ON ngn_responses (session_id);

-- Analytics Aggregation
CREATE INDEX idx_metrics_student_domain ON ngn_metrics (student_id, domain);
```

---

## 2. Data Pipeline Architecture

### Flow Diagram (Text Description)
`Generator` → `Transformation` → `DB (ngn_items)` → `Client App` → `Evaluator` → `DB (ngn_responses/metrics)`

### Pipeline Steps:

1.  **Ingestion (Generator Output)**:
    *   **Source**: The JSON output from `generateQuestions()` (MasterQuestionItem[]).
    *   **Transform**: Verify JSON schema. Extract `difficulty`, `topic`, and `cjmmStep` to top-level SQL columns for indexing.
    *   **Idempotency**: Check `content->metadata->'batchInfo'->'batchId'` to prevent re-inserting the same AI batch.
    *   **Storage**: Insert into `ngn_items` with status `published`.

2.  **Delivery (Quiz Session)**:
    *   **Query**: Client requests 10 random items of "Sepsis" topic, Level 3.
    *   **DB**: `SELECT * FROM ngn_items WHERE topic_focus='Sepsis' AND difficulty_level=3 ORDER BY RANDOM() LIMIT 10`.

3.  **Submission & Evaluation**:
    *   Client submits `ngn_responses`.
    *   **Backend Logic**: Calculate partial credit (NGN +/- scoring rules) immediately.
    *   Update `ngn_sessions` running score.

4.  **Analytics (Async)**:
    *   Trigger (or cron) updates `ngn_metrics`.
    *   Recalculate "Weakness Areas" based on missed `cjmmStep` tags in responses.

---

## 3. API Endpoint Specification

### Base URL: `/api/v1`

| Method | Endpoint | Description | Auth (Role) | Performance Note |
| :--- | :--- | :--- | :--- | :--- |
| **Items** | | | | |
| `POST` | `/items/batch` | Bulk insert generated items | Admin/System | Max 50 items/req. Transactional. |
| `GET` | `/items/random` | Get random set (params: topic, difficulty, count) | Student | Uses `TABLESAMPLE` or indexed random query. |
| `GET` | `/items/:id` | Get single item details | Student | Cached 1hr. |
| **Sessions** | | | | |
| `POST` | `/sessions/start` | Initialize a new quiz session | Student | Creates `ngn_session` record. Returns `session_id`. |
| `POST` | `/sessions/:id/submit` | Submit an answer for an item | Student | Scoring logic runs here. Updates `ngn_responses`. |
| `POST` | `/sessions/:id/finish` | End session, calculate final score | Student | Finalizes `ngn_session`. |
| **Analytics** | | | | |
| `GET` | `/student/stats` | Get dashboard metrics (Global) | Student | Aggregated from `ngn_metrics`. |
| `GET` | `/student/history` | List past sessions | Student | Paginated (limit=20). |

---

## 4. Authentication & Authorization

### Architecture: JWT (Supabase Auth / NextAuth)

1.  **Signup/Login**:
    *   User enters email/password.
    *   System validates credentials.
    *   Returns **Access Token (JWT)** (Short lived, e.g., 1h) and **Refresh Token**.
    *   **Trigger**: `on_auth_user_created` (SQL Trigger) creates row in `ngn_students`.

2.  **Role Based Access Control (RBAC)**:
    *   **Students**: Read-only `ngn_items`, Read/Write own `ngn_sessions/responses`.
    *   **Instructors**: Read all `ngn_students` (in their institution), Read all `ngn_metrics`.
    *   **Admins**: Full CRUD on `ngn_items`.

### Authorization Middleware (Pseudocode)
```typescript
async function requireRole(req, allowedRoles) {
  const token = getToken(req);
  const user = await verifyToken(token);
  
  if (!user || user.role not in allowedRoles) {
    throw new Error("403 Forbidden");
  }
  return user;
}
```

---

## 5. Data Validation Framework

We will use **Zod** for runtime schema validation.

### A. Item Schema (Ingestion)
```typescript
const ItemIngestSchema = z.object({
  type: z.enum(['case-study', 'bow-tie', 'matrix', ...]),
  content: z.object({
    clinicalData: z.object({
      vitals: z.array(z.object({
        bp: z.string(),
        hr: z.number(),
        // ... must have all 7
      })).min(1)
    }),
    structure: z.object({ /*...*/ }),
    rationale: z.object({ /*...*/ })
  }),
  metadata: z.object({
    difficulty: z.number().min(1).max(5),
    topic: z.string()
  })
});
```

### B. Response Schema (Submission)
```typescript
const SubmitAnswerSchema = z.object({
  sessionId: z.string().uuid(),
  itemId: z.string().uuid(),
  answer: z.union([
    z.array(z.string()), // Multiple response
    z.string(),         // Single choice
    z.record(z.string()) // Matrix/Bowtie
  ]),
  timeSpent: z.number().min(0)
});
```

---

## 6. Error Handling & Logging

### Error Response Standard
All API errors will return:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR", // System Code
    "message": "Vitals array must contain 'pain' field", // Human Msg
    "details": [...] // Zod error stack
  },
  "requestId": "req_123xyz" // Trace ID
}
```

### Logging Strategy
*   **Database**: Log all critical mutations (Item creation, deletions) to an `audit_logs` table.
*   **Application**: Use a structured logger (e.g., Pino/Winston) to log API latency, 4xx/5xx errors, and auth failures.

---

## 7. Implementation Checklist (Phase 1)

- [ ] **DB**: Execute SQL script to create `ngn_*` tables.
- [ ] **DB**: Verify indices and triggers.
- [ ] **Code**: Create `src/lib/db.ts` (Supabase/Prisma client).
- [ ] **Code**: Create `src/pages/api/v1/items/batch.ts` (Batch Import).
- [ ] **Code**: Create `src/pages/api/v1/sessions/start.ts` (Session Logic).
- [ ] **Validation**: Implement Zod schemas in `src/utils/validation.ts`.
- [x] **Sanitizer**: Use `src/lib/DataSanitizer.ts` for input cleaning.
- [ ] **Test**: Run `npm run test:api` to verify endpoints.

---

## 8. Backup & Recovery Strategy

To ensure data durability for the target 99.9% uptime:

### A. Point-in-Time Recovery (PITR)
*   **Provider**: Supabase/AWS RDS Automated Backups.
*   **Frequency**: Continuous WAL archiving (allows restoration to any second).
*   **Retention**: 7 Days for Production, 1 Day for Dev.

### B. Daily Snapshots
*   **Schedule**: 03:00 UTC Daily.
*   **Storage**: S3 / Cold Storage (for disaster recovery).
*   **Script**: `pg_dump -Fc > backup_$(date +%F).dump`

### C. JSON Export Strategy (Portable Backup)
*   **Tool**: Custom script `scripts/backup_items.ts`
*   **Action**: Exports `ngn_items` -> `items_backup.json` weekly.
*   **Purpose**: Vendor independence (JSON is generator-native format).

### D. Recovery Drill
*   **Quarterly**: Restore production snapshot to `staging` environment.
*   **Verify**: Check integrity of `ngn_items` JSONB content and Student/Session linkage.
