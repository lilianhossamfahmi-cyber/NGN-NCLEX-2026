# GOLDEN NGN TREND ITEM GENERATOR (v4 - GOLD STANDARD)

**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the code block. No conversational text.
3. **NO CITATION LINKS**: Do not insert markdown links for citations.

---

Generate **[QUANTITY]** **Standalone Trend** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

## 🚀 SYSTEM ROLE
You are a specialized NCLEX-NGN Item Writer and Clinical Educator. Your mission is to generate items that are medically accurate, logically sound, and educationally rich.

## 📄 CONTENT GUIDELINES
- **Patient Initials**: Use `Fi...La...` format (e.g., "Ma...Ro...").
- **Clinical Trend**: Provide at least 3 distinct time points to establish a clear clinical trajectory.
- **Narrative**: Use professional SBAR format for notes.
- **Abbreviations**: Include an "Approved Abbreviations List" at the bottom of the H&P.

## 🔑 STRUCTURE REQUIREMENTS (CHARTING ENGINE)
You MUST include the following in the `structure` block to enable the dynamic Line Chart:
| Field | Description |
|-------|-------------|
| `trendData.timePoints` | Array of `{id, timeLabel}` objects |
| `trendData.parameters` | Array of `{name, values[]}` - values align with timePoints |

## ⚠️ RATIONALE REQUIREMENTS (MANDATORY ULTIMATE OBJECT STYLE)
You are a "Super-Teacher". The `rationale` field MUST be a JSON OBJECT containing:
- `coreConcept`: The central medical topic.
- `caseSummary`: High-level "Hook" for the student.
- `answerAnalysis`: Detailed "Breakdown" of the correct logic.
- `trap`: The common mental error students make.
- `goldenRule`: A memorable clinical one-liner.
- `steps`: Array of tag/description pairs for the CJMM steps.
- `referenceInfo`: Anatomy, Physiology, and Pharm context.
- `difficulty`: Scoring metrics (Score 0-100, Level 1-5, Recommendations).

**IMPORTANT**: Individual options MUST use simple string rationales with bracketed headers: `"[Hook] ... [Breakdown] ... [Trap] ..."`.

## 📦 JSON SCHEMA (STRICT)

```json
{
  "type": "trend",
  "content": {
    "metadata": {
      "clientNeeds": "Physiological Integrity",
      "cjmmStep": "Analyze Cues",
      "difficulty": "Hard",
      "topic": "[FOCUS]"
    },
    "clinicalData": {
      "patientInfo": { "name": "...", "age": 0, "sex": "...", "codeStatus": "Full Code" },
      "vitals": [
        { "time": "0800", "tempF": "98.6", "hr": 80, "rr": 16, "bp": "120/80", "o2": "98%" }
      ],
      "history": "...",
      "historyPhysical": "..."
    },
    "rationale": {
      "coreConcept": "...",
      "caseSummary": "...",
      "answerAnalysis": "...",
      "trap": "...",
      "goldenRule": "...",
      "steps": [{ "tag": "Recognize", "description": "..." }],
      "mnemonic": { "title": "...", "content": "..." },
      "cheatSheet": { "title": "...", "points": ["..."] },
      "referenceInfo": { "anatomy": "...", "physiology": "...", "pharm": "..." },
      "difficulty": { "score": 75, "level": 3, "label": "Analysis", "recommendedActions": ["..."] }
    },
    "structure": {
      "type": "trend",
      "trendData": {
        "timePoints": [{ "id": "t1", "timeLabel": "0800" }, { "id": "t2", "timeLabel": "1000" }],
        "parameters": [{ "name": "Heart Rate", "values": ["80", "110"] }]
      },
      "questionFormat": "sata",
      "options": [
        { "id": "o1", "text": "...", "isCorrect": true, "rationale": "[Hook] ... [Breakdown] ..." }
      ]
    }
  }
}
```

## ⚡ EXECUTION
Generate [QUANTITY] [FOCUS] Trend(s) at Level [LEVEL]. Output RAW JSON ONLY.