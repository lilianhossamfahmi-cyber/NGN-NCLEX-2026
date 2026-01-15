# NGN ITEM-BANK SPECIFICATION (MASTER TEMPLATE)

This is the **Single Source of Truth** for how every NGN item is stored, versioned, and validated. An Item-Bank entry is a self-contained JSON object that extends the core schema with type-specific structures defined in the `NGN_<TYPE>_SPEC.md` files.

## 1. 📂 FILE STRUCTURE
The Item Bank is stored as a **Newline-Delimited JSON (JSONL)** file or a Monolithic JSON Array.
Each line (or array entry) represents **one** complete item.

**File Path:** `data/item-bank.jsonl` (or similar)

---

## 2. 🧱 CORE SCHEMA (REQUIRED FOR ALL)
Every item, regardless of type, MUST have these top-level fields:

| Field | Type | Description |
|-------|------|-------------|
| **id** | `UUID` | Global Unique Identifier (v4). |
| **type** | `Enum` | One of: `bow-tie`, `matrix`, `highlight`, `ordered-response`, `cloze`, `sata`, `calculation`, `hotspot`, `single-response`, `trend`, `case-study`. |
| **topic** | `String` | Clinical topic (e.g., "Sepsis Management"). |
| **metadata** | `Object` | See Section 2.1. |
| **content** | `Object` | Clinical Data (Patient, Vitals, Notes). See Section 2.2. |
| **rationale** | `Object` | Educational reasoning (4-Key Schema). |
| **structure** | `Object` | The Type-Specific "Payload" (See Individual Specs). |
| **tags** | `String[]` | Search keywords. |
| **version** | `String` | Semver (e.g., "1.0.0"). |
| **source** | `Enum` | `ai` | `manual` | `imported` |
| **createdAt** | `ISO Date` | Creation timestamp. |

### 2.1 Metadata Schema
```json
"metadata": {
  "difficulty": 5,                // Number (1-5)
  "targetScore": 90,              // Number (0-100)
  "clientNeeds": "Physiological Integrity",
  "cjmmStep": "Generate Solutions"
}
```

### 2.2 Content Schema (The Clinical Chart)
Must be present even if empty.
```json
"content": {
  "patient": { ... },             // PatientSchema
  "nursesNotes": [ ... ],         // Array of NoteSchema
  "vitalSigns": [ ... ],          // Array of VitalSignSchema
  "orders": [ ... ],              // Array of OrderSchema
  "historyPhysical": { ... },     // Rich Object or String
  "laboratory": [ ... ],          // Labs Array
  "radiology": [ ... ]            // Radiology Array
}
```

---

## 3. 🔌 TYPE-SPECIFIC EXTENSIONS
The `structure` object determines the interactivity. Refer to the specific `NGN_<TYPE>_SPEC.md` for exact details.

| Type | Key Structure Fields | Reference Spec |
|------|----------------------|----------------|
| **Bow-Tie** | `actions`, `conditions`, `parameters` | `NGN_BOWTIE_SPEC.md` |
| **Matrix** | `rows`, `columns` | `NGN_MATRIX_SPEC.md` |
| **Highlight** | `tokens` (or text + correctIds) | `NGN_HIGHLIGHT_SPEC.md` |
| **Ordered** | `options` (with `rank`) | `NGN_ORDERED_RESPONSE_SPEC.md` |
| **Cloze** | `sentence`, `options` (per drop) | `NGN_CLOZE_SPEC.md` |
| **SATA** | `options` (isCorrect flags) | `NGN_SATA_SPEC.md` |
| **Calc** | `inputLabel`, `correctValue` | `NGN_CALCULATION_SPEC.md` |
| **HotSpot** | `mediaId`, `areas` | `NGN_HOTSPOT_SPEC.md` |
| **Single** | `options` (1 correct) | `NGN_SINGLE_RESPONSE_SPEC.md` |
| **Trend** | Trend Matrix + Timepoints | `NGN_TREND_SPEC.md` |
| **Case** | `items` (Array of 6) | `NGN_CASE_STUDY_SPEC.md` |

---

## 4. ✅ VALIDATION RULES (THE GATEKEEPER)
Before saving to the bank, the **Ingestion Service** must verify:
1.  **ID Uniqueness:** No duplicates.
2.  **Type Integrity:** `type` field matches the `structure` contents.
3.  **Completeness:** All required Clinical Data keys exist (even if empty arrays).
4.  **Rationale:** Must be the 4-Key Object, not a string.
5.  **Difficulty:** Must be a Number.

---

## 5. 📄 EXAMPLE ENTRY (BOW-TIE)
```json
{
  "id": "uuid-1234",
  "type": "bow-tie",
  "topic": "Sepsis",
  "metadata": { "difficulty": 5, "cjmmStep": "Generate Solutions" },
  "content": {
    "patient": { "name": "J.D.", "age": 65, "gender": "Male" },
    "nursesNotes": [ { "entry": "..." } ],
    "vitalSigns": [ { "bp": "90/50" } ],
    "orders": [],
    "historyPhysical": { "hpi": "..." }
  },
  "rationale": { "general": "...", "pathophysiology": "...", "safetyCheck": "..." },
  "structure": {
    "actions": [ ... ],
    "conditions": [ ... ],
    "parameters": [ ... ]
  },
  "source": "ai",
  "createdAt": "2026-01-01T12:00:00Z"
}
```
