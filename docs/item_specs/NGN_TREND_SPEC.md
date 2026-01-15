# NGN TREND: PERFECT CONTENT SPECIFICATION (100% MASTERY)

This document defines the **"Platinum Standard"** for a fully generated NGN Trend item. This visualizes data over time and asks for recognition of patterns (e.g. Sepsis progression).

## 1. 📂 ASSOCIATED FILES MAP
| Component | File Path | Purpose |
|-----------|-----------|---------|
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-Trend-Item.md` | Generation instructions. |

---

## 2. 🧠 METADATA
| Field | Requirement | Example |
|-------|-------------|---------|
| **difficulty** | `number` (1-5) | `4` (Analysis) |
| **topic** | `string` | `"Shock Progression"` |

---

## 3. ❓ QUESTION STEM & MECHANICS

### The Stem (`prompt`)
**Requirement:** Ask for trend analysis.
**Perfect Example:**
> "Click to specify if the client's condition is improving, declining, or unchanged based on the 12:00 assessment."

### The Data (`content.vitalSigns` / `content.laboratory`)
**Strict Rule:** Must have **Minimum 3 timepoints**.
- t1: Baseline
- t2: Deterioration
- t3: Current (Decision point)

### The Answer (`structure`)
Often a **Matrix** format asking "Trend" per parameter.
Row: "Blood Pressure" -> Col: "Declining".

---

## 4. 🏥 CLINICAL DATA
- **Trend Requirement:** The numbers MUST mathematically show the trend (e.g. BP 120 -> 100 -> 80).

---

## 5. 🎓 RATIONALE
- **pathophysiology:** Explain the physiological cause of the trend (e.g. "Vasodilation in shock causes progressive hypotension").

---

## 6. ✅ PASS CRITERIA CHECKLIST
1. [ ] 3+ Timepoints in Vitals/Labs.
2. [ ] Clear mathematical trend (No ambiguous fluctuations).
3. [ ] Question focuses on *Change* not just static values.
