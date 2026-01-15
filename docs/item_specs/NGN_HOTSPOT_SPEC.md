# NGN HOTSPOT: PERFECT CONTENT SPECIFICATION (100% MASTERY)

This document defines the **"Platinum Standard"** for a fully generated NGN HotSpot item. Used for verifying anatomical locations or identifying visual findings.

## 1. 📂 ASSOCIATED FILES MAP
| Component | File Path | Purpose |
|-----------|-----------|---------|
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-HotSpot-Item.md` | Generation instructions. |
| **Zod Schema** | `src/schemas/hotspot.ts` | Validates coordinate logic. |
| **Ingestion Logic** | `src/services/ingestion/ItemIngestionService.ts` | Handles image assets. |

---

## 2. 🧠 METADATA (EXPERT HUD COMPLIANCE)
| Field | Requirement | Perfect Content Example |
|-------|-------------|-------------------------|
| **difficulty** | `number` (1-5) | `3` (Competent) |
| **topic** | `string` | `"Injection Sites"`, `"Auscultation Points"` |

---

## 3. ❓ QUESTION STEM & MECHANICS

### The Stem (`prompt`)
**Requirement:** Directive to click a specific area.
**Perfect Example:**
> "Click the location on the chest wall where the nurse should auscultate the Mitral Valve."

### The structure (`structure`)
**Strict Rule:** Must define the image and the *target zones*.
- The AI usually returns a *description* of the zone, or a standard coordinate set If it uses a pre-defined map.
- **Spec:** We use `mediaId` to prompt the UI to load the correct anatomical SVG.

```json
"structure": {
  "mediaId": "anterior_chest_auscultation",
  "prompt": "Click the Apical Pulse area.",
  "areas": [
    { "id": "zone_mitral", "coordinates": "coords_here", "isCorrect": true },
    { "id": "zone_aortic", "coordinates": "coords_here", "isCorrect": false }
  ]
}
```

---

## 4. 🏥 CLINICAL DATA (CONTEXT)
- **HPI/Notes:** Should justify *why* the exam is happening (e.g. "Assess for murmurs").

---

## 5. 🎓 RATIONALE
| Key | Content Requirement |
|-----|---------------------|
| **general** | Location definition (e.g. "5th Intercostal Space, Mid-Clavicular Line"). |
| **pathophysiology** | Why this spot? (Point of Maximum Impulse). |

---

## 6. ✅ PASS CRITERIA CHECKLIST
1. [ ] Prompt asks for a specific anatomical location.
2. [ ] Rationale defines the landmarks (Intercostal spaces).
3. [ ] Image context is clear.
