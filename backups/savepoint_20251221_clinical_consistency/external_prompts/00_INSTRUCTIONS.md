# External AI Prompt Library

This directory contains specialized prompts for generating NCLEX-NGN items using external AI tools (ChatGPT, Claude, Gemini).

## 🚀 How to Use
1.  **Select the item type** you want to generate from the list below.
2.  **Open the file** and copy its **entire content**.
3.  **Paste** it into your AI chat window.
4.  **Copy the JSON response** from the AI.
5.  **Paste** it into the "**Parse & Import**" panel in the NGN Generator App.
6.  If you see any error, click the **🪄 Local Auto-Fix** button.
7.  **Batch Generation**: To generate multiple items (e.g., 10), simply append **"Generate 10 distinct items"** to the prompt. The AI will output a JSON Array `[...]`.

## ⚡ Batch Generation Tips
- **Quantity**: Requesting 5-10 items is optimal for standalone types. For Case Studies, stick to 1-2 due to length.
- **Diversity**: The prompts are now updated to enforce "Different Topics" (Cardiac, Neuro, Peds, etc.) to prevent duplicates.

| File | Item Type | Key Features |
|------|-----------|--------------|
| [01_CASE_STUDY.md](./01_CASE_STUDY.md) | 6-Screen Case Study | Multiple question types, shared clinical data |
| [02_BOW_TIE.md](./02_BOW_TIE.md) | Bow-Tie Diagram | Actions, Condition, Parameters |
| [03_TREND.md](./03_TREND.md) | Trend Analysis | Time-series vitals, single/SATA response |
| [04_CLOZE.md](./04_CLOZE.md) | Cloze (Dropdown) | Sentence completion with dropdowns |
| [05_HIGHLIGHT.md](./05_HIGHLIGHT.md) | Highlight Text | Click-to-select clinical cues |
| [06_MATRIX.md](./06_MATRIX.md) | Matrix Grid | Row/Column categorization |
| [07_ORDERED_RESPONSE.md](./07_ORDERED_RESPONSE.md) | Ordered Response | Drag-and-drop prioritization |

## ⚠️ Critical Schema Rules (All Types)
Every JSON output **MUST** include:
1. **`type`**: The item type identifier
2. **`content.clinicalData`**: Patient info, history, vitals, labs
3. **`content.structure`**: The question configuration
4. **`content.rationale`**: Global explanation for the entire case/question
5. **Option `rationale`**: Detailed feedback for EVERY choice (Correct & Incorrect)
6. **Citations**: Use `[1]`, `[2]` format for references (renders as superscript)

## ⚡ Troubleshooting
| Error | Solution |
|-------|----------|
| `Expected ',' or '}'` | Click **🪄 Local Auto-Fix** button |
| `Expected property name` | Remove any text before the `{` |
| Empty rationale section | Re-generate with explicit rationale requirement |
| Wrong color coding | Ensure `isCorrect: true/false` is set on all options |
