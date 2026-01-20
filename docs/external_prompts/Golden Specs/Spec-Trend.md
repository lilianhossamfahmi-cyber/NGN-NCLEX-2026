# GOLDEN ITEM SPECIFICATION: TREND
## 1. UNIQUE CHARACTERISTICS
The Trend item focuses on the *evolution* of data over time, requiring the user to identify regression or improvement. Usually a Single Response or Multiple Response interaction.

### ID Code
*   **Type Code**: `TRD`
*   **Example**: `ENDO-TRD-1234`

## 2. STRUCTURAL REQUIREMENTS
Structurally, a Trend item is often just a Multiple Response or Single Response item, BUT the **Content** is key.

*   **Type**: `trend` (Mapped to `multiple-response` or `single-response` by rendering, but logic is Trend).
*   **Clinical Data**: MUST have multiple time-stamped entries.

### Visual Representation
The generator must emphasize the **Time Series**.
*   **Vitals**: Minimum 3 time points.
*   **Labs**: Minimum 2 sequential draws.

## 3. JSON STRUCTURE
```json
{
  "type": "trend",
  "structure": {
    "type": "multiple-response", // The interaction mechanism
    "options": [...] 
  }
}
```

## 4. VALIDATION CHECKLIST
- [ ] ID includes `TRD`.
- [ ] `content.clinicalData.vitals` has >= 3 entries.
- [ ] `content.clinicalData.nursesNotes` has >= 2 entries.
- [ ] `structure.type` is defined (e.g., `multiple-response`).
