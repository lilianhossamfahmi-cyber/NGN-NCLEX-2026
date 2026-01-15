# MASTER PROMPT SEQUENCE
## How to generate items using an External AI (ChatGPT, Claude, Gemini)

To generate a full batch of 25 items for a specific Topic and Type, simply Copy & Paste these three blocks into the AI chat window.

---

### BLOCK 1: THE SYSTEM INSTRUCTION
(Copy/Paste this first)

> "I am building an NCLEX NGN Item Bank. I need you to act as the Generator Engine. I will provide you with a 'Schema' (JSON Rules) and a 'Batch Protocol' (Content Instructions). You must follow the Schema strictly for valid JSON formatting, and the Protocol strictly for clinical differentiation."

---

### BLOCK 2: THE SCHEMA (The Rules)
(Copy/Paste the content of the **Golden Prompt** for your desired type)

> *Example: Open `docs/external_prompts/Golden Prompts/Golden-NGN-BowTie-Item.md`, copy all text, and paste it here.*

---

### BLOCK 3: THE WORK ORDER (The Content)
(Copy/Paste the content of the **Template** or **Batch File**, and specify your topic)

> *Example: Open `docs/external_prompts/templates/Template_Gen_BowTie.md`.*
> *Action: Change `[INSERT TOPIC HERE]` to `Pediatrics` (or your desired topic).*
> *Copy all text and paste it here.*

---

### BLOCK 4: THE TRIGGER
(Copy/Paste this final command)

> "Now, generate the full batch of 25 items as a single valid JSON array. Ensure every item follows the JSON structure from Block 2, and covers the specific clinical scenarios outlined in Block 3."
