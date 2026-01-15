# FIX PLAN: FILL-IN-THE-BLANK CALCULATION ITEM TYPE

## 📊 CURRENT STATUS: 🔴 FAIL (NO SCHEMA, REVIEW NEEDED)

This is a **text-entry variant** of the Calculation item type where the user types a numeric answer into a blank field within a sentence context.

---

## 1️⃣ CONNECTED FILES (DEPENDENCY MAP)

| Layer | File Path | Purpose | Status |
|-------|-----------|---------|--------|
| **Specification** | `docs/item_specs/NGN_CALCULATION_SPEC.md` | Base Calculation spec | ✅ Complete |
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/12. Fill-in-the-Blank Calculation.md` | Variant prompt | ⚠️ Review |
| **Zod Schema** | `src/schemas/calculation.ts` | May need extension | ⚠️ Extend |
| **Ingestion Service** | `src/services/ingestion/ItemIngestionService.ts` | Routes `calculation` | ⚠️ Check |

---

## 2️⃣ VARIANT DIFFERENCES

### Standard Calculation
- Single input field
- User enters numeric value
- Validated against `correctValue` with `acceptableRange`

### Fill-in-the-Blank Calculation
- Answer embedded in a sentence context
- Example: "The nurse should administer _____ mL."
- May have multiple blanks (rare)
- Still validates against `correctValue`

---

## 3️⃣ SCHEMA CONSIDERATIONS

The existing `CalculationItemSchema` may work if the variant uses the same validation. However, if the prompt generates a different structure (e.g., `blanks` array), a schema extension is needed.

### Potential Schema Extension
```typescript
// Add to calculation.ts or create fill-in-blank.ts

export const FillInBlankCalculationSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.union([z.literal('fill-in-blank'), z.literal('fill-blank-calculation')]),
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema.optional(),
    structure: z.object({
        sentenceTemplate: z.string(), // "Administer _____ mL"
        correctValue: z.number(),
        units: z.string(),
        acceptableRange: z.tuple([z.number(), z.number()]).optional()
    })
});
```

---

## 4️⃣ FIX PLAN (STEP-BY-STEP)

### Step 1: Review Existing Prompt
**File:** `docs/external_prompts/Golden Prompts/12. Fill-in-the-Blank Calculation.md`

**Check:**
1. What `type` does it generate?
2. Does it use V4 structure?
3. Does it use 4-Key Rationale?
4. How does it format the blank (_____ or %{blank})?

### Step 2: Decide Schema Strategy
**Options:**
- **A)** Use existing `CalculationItemSchema` if structure matches.
- **B)** Extend with `sentenceTemplate` field.
- **C)** Create separate `fill-in-blank.ts` schema.

### Step 3: Update Ingestion Routing
If new type is created, add routing in `ItemIngestionService.ts`.

### Step 4: Align Prompt to V4
Apply standard V4 fixes (root-level fields, 4-Key Rationale, numeric difficulty).

---

## 5️⃣ AI PROMPT TO FIX

```
You are an expert TypeScript/React developer working on the NGN Item Generator.

**Context:**
The Fill-in-the-Blank Calculation is a variant of the standard Calculation item type where the numeric answer is embedded within a sentence context (e.g., "Administer _____ mL").

**Files to Review:**
1. `docs/external_prompts/Golden Prompts/12. Fill-in-the-Blank Calculation.md` - The variant prompt.
2. `src/schemas/calculation.ts` - The existing Calculation schema.
3. `docs/external_prompts/Golden Prompts/Golden-NGN-Calculation-Item.md` - Standard Calculation prompt.

**Task:**
1. **Analyze** the Fill-in-the-Blank prompt:
   - What `type` does it generate?
   - What structure does it use (sentenceTemplate, blanks, etc.)?
   - Is it V4 aligned?

2. **Decide** schema strategy:
   - Can it reuse `CalculationItemSchema`?
   - Does it need a `sentenceTemplate` field extension?
   - Should it be a separate schema?

3. **Fix** the prompt:
   - Upgrade to V4 structure (root-level fields).
   - Use 4-Key Rationale.
   - Numeric difficulty.
   - Standard clinical keys.

4. **Update** ingestion if new type is introduced.

**Deliverables:**
- Analysis report.
- Updated prompt content.
- Schema changes (if needed).
- Ingestion routing (if needed).

Fix the issue permanently at its source.
```
