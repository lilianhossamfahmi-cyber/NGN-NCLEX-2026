# GOLDEN ITEM SPECIFICATION: GENERAL / COMMON
## 1. IDENTITY & METADATA
Every item traversing the pipeline MUST adhere to this metadata structure to ensure correct routing, indexing, and display in the Admin Dashboard.

### ID Generation Rule
*   **Format**: `[TOPIC_CODE]-[TYPE_CODE]-[RANDOM_HEX]`
*   **Example**: `CARDIO-BOW-A1B9`, `RESP-CS-99X2`
*   **Constraint**: Must be unique string. Never null.

### Topics (Clinical Focus)
The Admin Panel recognizes these exact keys. Use these for `pedagogy.clinicalFocus`:
*   `General`
*   `Cardiology`
*   `Respiratory`
*   `Neurology`
*   `Endocrine`
*   `Gastrointestinal`
*   `Musculoskeletal`
*   `Renal`
*   `Hematology`
*   `Integumentary`
*   `Reproductive`
*   `Mental Health`
*   `Pediatrics`
*   `Critical Care`

## 2. PURE JSON ARCHITECTURE
Errors often occur when AI "stringifies" nested objects. The pipeline expects **PURE JSON OBJECTS**, not strings containing JSON.

**❌ BAD (Causes .split errors):**
```json
"vitals": "[{\"temp\": 99}]"  <-- String representation
```

**✅ GOOD (Golden):**
```json
"vitals": [ { "tempF": 99 } ] <-- Actual Array of Objects
```

## 3. CLINICAL DATA SCHEMA
All items share this common clinical data structure (`content.clinicalData`).

| Field | Type | Constraint |
|-------|------|------------|
| `patientInfo` | Object | Must include `name`, `age`, `gender`, `codeStatus`. |
| `vitals` | Array | Must be Array of Objects. Each object must have `time`. |
| `nursesNotes` | Array | Must be Array of Objects {`time`, `entry`}. |
| `labs` | Array | Must be Array of Objects {`test`, `value`, `flag`}. |
| `orders` | Array | Must be Array of Objects {`drug`, `dose`, ...}. |
| `historyPhysical` | Object | Must include `chiefComplaint`, `hpi`. |

## 4. VALIDATION CHECKLIST
- [ ] ID follows `TOPIC-TYPE-HEX` pattern.
- [ ] JSON is valid (no trailing commas).
- [ ] No "markdown" code blocks inside string values.
- [ ] Clinical Focus is from the approved list.
- [ ] `type` matches one of: `bow-tie`, `case-study`, `matrix`, `multiple-response`, `single-response`, `trend`, `highlight`, `drop-cloze`.
