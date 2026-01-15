# Phase 2: Item Bank & Generator Enhancement
**Duration:** 3 Weeks | **Dates:** Jan 28 - Feb 17, 2026
**Target:** 1000+ Production-Ready NGN Items

## 1. Item Bank Schema & Optimization
To handle 10,000+ items efficiently, we need a robust indexing strategy on top of the Phase 1 schema.

```sql
-- Phase 2 Optimized Schema Additions

-- 1. Full Text Search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE INDEX idx_items_content_search ON ngn_items USING GIN ((content->>'text') gin_trgm_ops);
CREATE INDEX idx_items_rationale_search ON ngn_items USING GIN ((content->'rationale'->>'answerAnalysis') gin_trgm_ops);

-- 2. Metadata Indexing for Fast Filtering
CREATE INDEX idx_items_tags ON ngn_items USING GIN ((content->'metadata'->'tags'));
CREATE INDEX idx_items_domain ON ngn_items ((content->'metadata'->>'clientNeeds'));
CREATE INDEX idx_items_created ON ngn_items (created_at DESC);

-- 3. Analytics Partitioning (Preparation)
-- We will partition responses by month to keep queries fast as data grows
-- (Note: Implementation depends on specific PostgreSQL version, usually easiest to start mono-table and migrate later)
```

## 2. Bulk Generation Orchestration
We will create a script `scripts/bulkGenerator.ts` to manage the lifecycle of producing 500 items/week.

### Workflow:
1.  **Config**: Define batch size, topic list, and difficulty distribution.
2.  **Generate**: Call AI API (parallel promises with rate limiting).
3.  **Validate**: Run `DataSanitizer` and `ZodSchema`.
4.  **Score**: Calculate "Auto-Quality Score" (see logic below).
5.  **Persist**: Insert valid items into `ngn_items` with status `draft`.
6.  **Report**: Output success/failure counts and cost estimation.

## 3. Auto-Quality Assurance (AQA) Logic
Before an item enters the bank, it receives a score (0-100).
*   **Critical Checks (Pass/Fail)**:
    *   Valid JSON?
    *   Has correct answer path?
    *   Vitals present and valid range?
*   **Scoring Factors**:
    *   Length of Rationale (>50 words = +10pts)
    *   Has "Trap" field? (+10pts)
    *   Has formatted HTML tables in Labs? (+5pts)
    *   Has non-generic distractors? (+10pts)

**Action**:
*   Score > 90: Auto-publish (Optional)
*   Score < 70: Flag "REVIEW_NEEDED"
*   Score < 40: Auto-Delete/Fail

## 4. Tagging System & Taxonomy
We implement a 3-layer tagging system:

1.  **Primary (Structural)**:
    *   `type:case-study`, `level:3`, `domain:phys-integrity`
2.  **Secondary (Clinical)**:
    *   `topic:sepsis`, `system:cardiac`, `drug:beta-blocker`
3.  **Adaptive (Behavioral)**:
    *   `weakness:critical-care`, `foundation:safety`

**Automation Rule Example**:
`IF difficulty=5 AND cjmm="Evaluate Outcomes"` -> Auto-tag `advanced-evaluation`

## 5. Admin Panel Specifications
We will build a `/admin` route group protected by `role='admin'`.

**Screens needed:**
1.  **Item Bank Grid**:
    *   DataGrid with columns: ID, Type, Topic, Level, Score, Status.
    *   Filters: Status (Draft/Published), Author, Date.
    *   Actions: Edit, Delete, Bulk Publish.
2.  **Item Editor (Visual)**:
    *   Split screen: Form editor (left) vs Preview (right).
    *   "Regenerate Rationale" button using AI.
3.  **Batch Operations**:
    *   Upload JSON/CSV.
    *   Trigger Bulk Generation.
4.  **Analytics View**:
    *   "Bad Item Hunter": Show items with <10% or >90% pass rate (too hard/easy).
    *   "Drift Alert": Items where difficulty rating doesn't match student performance.

## 6. Dashboard Extraction Rules
How we pick questions for students:

*   **Mode: Practice Drill**
    *   Rule: `Random(10) WHERE topic IN (User.WeekFocus) AND level NEAR (User.AvgLevel)`
    *   Exclusion: `NOT attempted_last_30_days`
*   **Mode: Weakness Attack**
    *   Rule: `Random(10) WHERE tag IN (User.WorstTags) ORDER BY difficulty ASC` (Scaffolding)
*   **Mode: CAT Sim**
    *   Rule: Start Level 3. `IF correct THEN Level + 1 ELSE Level - 1`.
    *   Constraint: Must cover Client Needs distribution (e.g. 20% Pharm).

## 7. Implementation Plan (Weeks 1-3)

### Week 1: Foundation & First Batch
- [ ] Implement `AQA` (Auto-Quality Assurance) logic in code.
- [ ] Build basic Admin Grid (Read-Only).
- [ ] Run Batch #1 (250 items: Sepsis, HF, COPD).

### Week 2: CRUD & Tagging
- [ ] Build Admin Editor (Update capabilities).
- [ ] Implement Auto-Tagging logic.
- [ ] Run Batch #2 (250 items: Pharm, Peds, Psych).

### Week 3: Analytics & Scale
- [ ] Build "Bad Item Hunter" query.
- [ ] Optimize indices for 1000 items.
- [ ] Run Batch #3 (500 items: Mixed/Review).
- [ ] Final Data Export test.

