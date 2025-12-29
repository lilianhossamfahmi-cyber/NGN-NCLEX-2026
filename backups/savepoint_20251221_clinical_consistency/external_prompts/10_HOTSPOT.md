# NGN Standalone Hot Spot Prompt

**Copy and Paste the ENTIRE text below into your AI (ChatGPT, Claude, Gemini, Perplexity, etc).**

**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **IMAGE STRATEGY (DUAL PATH)**:
    - **PATH A (Search)**: Search for a public domain medical image (Wikimedia/Gray's Anatomy). Use strict `.jpg` or `.png` URLs.
    - **PATH B (Generate)**: Always provide a detailed `imageGenPrompt` field describing exactly what the image should look like (for DALL-E/Midjourney).
2. **RAW JSON ONLY**: Output *only* the code block.
3. **NO CITATION LINKS**: Do not insert markdown links like `[1]` in values.

---

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Medical Illustrator.
**TASK:** Generate **[QUANTITY]** (default: 1) Standalone Hot Spot Item(s) with robust image sourcing.
**CONSTRAINTS:**
1. **CLINICAL CONSISTENCY:** The "Left Side" `clinicalData` MUST be relevant to the `question`. Additionally, the `imageGenPrompt` MUST align perfectly with these details. If the patient has "Right Lower Lobe Pneumonia", the image prompt MUST request a "Chest X-ray with Right Lower Lobe opacity".
2. **Image Validation**: If you find a URL, ensure it is likely stable (e.g. upload.wikimedia.org).
3. **Generator Prompt**: You MUST write a high-fidelity image generation prompt (e.g. "Medical vector illustration of...").
4. Follow the strict schema below.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item.
2.  **Double Quotes Only**: All JSON keys and string values use `"`.
3.  **No Markdown**: Do NOT wrap output in ` ```json `.

## 📄 2. Content Guidelines
- **imageUrl**: 
    - *Best*: Real URL (Wikimedia).
    - *Fallback*: `https://placehold.co/600x600?text=Upload+Medical+Image`.
- **imageGenPrompt**: A specific description for finding/generating the image. **CRITICAL:** This must match the clinical scenario. 
    - *Example (Condition)*: "Anterior view of the heart showing coronary arteries" (if case is MI).
    - *Example (Location)*: "Posterior thoracic wall surface anatomy" (if case is CVA tenderness).
- **Target Area**: Define the correct area (x, y, radius) in percentages.

## ⚠️ 3. RATIONALE REQUIREMENTS
- Explain the ANATOMY and CLINICAL SIGNIFICANCE of the target area.

## 📝 4. Complete JSON Schema

```json
{
  "type": "hot-spot",
  "content": {
    "rationale": "Global explanation: The Point of Maximum Impulse (PMI) is located at the 5th Intercostal Space, Midclavicular Line.",
    "clinicalData": {
      "patientInfo": { 
        "name": "Jo...Sm...", 
        "age": "55", 
        "sex": "Male", 
        "mrn": "99228833", 
        "codeStatus": "Full Code", 
        "allergies": "Sulfa", 
        "provider": "Dr. Cardio", 
        "ward": "Tele" 
      },
      "history": "<table style='width:100%;border-collapse:collapse'><thead><tr style='background:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px'>0800</td><td style='border:1px solid #ddd;padding:6px'><b>Situation:</b> Assessment required.<br><b>Objective:</b> Irregular heart rate.<br><b>Actions:</b> Auscultation planned.</td><td style='border:1px solid #ddd;padding:6px;text-align:center'>RN.X99</td></tr></tbody></table>",
      "historyPhysical": "<b>Chief Complaint:</b> Palpitations.<br><b>History of Present Illness:</b> 55yo male with history of AFib.<br><br><hr style='margin-top:1em; border-top:1px solid #ccc'><div style='font-size:0.75em'><b>Approved Abbreviations List:</b><br>PMI: Point of Maximum Impulse</div>",
      "vitals": [{ "time": "0800", "tempF": "98.6°F (37.0°C)", "hr": "112", "rr": "18", "bp": "128/78", "o2": "96%" }],
      "radiology": "<b>CXR:</b><br><div style='font-family:monospace'>Mild cardiomegaly.</div>"
    },
    "structure": {
      "type": "hot-spot",
      "prompt": "Click the area on the chest wall where the nurse would best assess the Point of Maximum Impulse (PMI).",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e5/Surface_anatomy_of_the_heart_and_great_vessels.png",
      "imageGenPrompt": "Professional medical vector illustration of the anterior male chest wall, showing the outline of the rib cage, clavicles, and sternum. Clean white background, minimalist educational style. No labels.",
      "areas": [
        {
          "id": "area1",
          "x": 55,
          "y": 60,
          "radius": 8,
          "isCorrect": true,
          "rationale": "The PMI (Apex) is found at the intersection of the 5th Intercostal Space and the Midclavicular Line.[1]"
        }
      ]
    }
  }
}
```

