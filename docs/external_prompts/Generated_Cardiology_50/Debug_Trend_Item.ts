import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * DEBUG ITEM: Mating the User's "Section 3" Rationale Structure
 */

export const Debug_Trend_Item: MasterQuestionItem = {
    id: "DEBUG-TREND-STRICT-001",
    typeId: "trend",
    metadata: {
        title: "Strict Structure Validation",
        authorId: "AI-Debug",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        sourceOrigin: "ai",
        sourceReferences: [],
        qualityScore: 100,
        hasStudentPreview: true
    },
    pedagogy: {
        difficultyLevel: 5,
        clinicalFocus: "Management of Care",
        cjmmPhase: "Take Action",
        clinicalFocusTopics: ["Delegation"]
    },
    content: {
        // SECTION 1: The 6 Student Preview Tabs
        clinicalData: {
            historyPhysical: {
                chiefComplaint: "Mental Status Change",
                hpi: "Client admitted for pneumonia. Shift change report indicates stable night. At 0800, family reports client is 'acting funny'.",
                pmh: ["COPD", "HTN"],
                medications: ["Lisinopril", "Albuterol"]
            },
            history: [ // Nurses Notes
                { time: "0700", author: "Night RN", note: "Patient sleeping. Vitals stable. O2 sat 94% on 2L." },
                { time: "0800", author: "Day RN", note: "Patient confused. Disoriented to place. Trying to remove IV." },
                { time: "0815", author: "Day RN", note: "Security called for standby. Restraints discussed." }
            ],
            vitals: [ // Vital Signs
                { time: "0700", tempF: "98.6", hr: 82, rr: 18, bp: "124/72", o2: "94", o2_device: "2L NC", pain: 0 },
                { time: "0800", tempF: "98.6", hr: 110, rr: 24, bp: "148/90", o2: "88", o2_device: "2L NC", pain: 0 },
                { time: "0815", tempF: "99.0", hr: 115, rr: 26, bp: "152/94", o2: "85", o2_device: "REM", pain: 0 }
            ],
            labs: [ // Laboratory Results
                { test: "WBC", value: "11.2", flag: "H", ref: "4.5-11.0", unit: "k/cumm" },
                { test: "pH", value: "7.30", flag: "L", ref: "7.35-7.45", unit: "" },
                { test: "pCO2", value: "65", flag: "H", ref: "35-45", unit: "mmHg" }
            ],
            orders: [ // Orders
                { order: "ABG Stat", status: "Completed", indication: "Hypoxia" },
                { order: "Soft Wrist Restraints", status: "Pending", indication: "Safety" }
            ],
            radiology: [
                { study: "CXR", findings: "RLL Infiltrate worsening.", impression: "Pneumonia", date: "Today" }
            ]
        },
        // SECTION 2: The Question
        structure: {
            type: "trend",
            questionFormat: "sata",
            prompt: "Review the client's progression from 0700 to 0815. Which actions should the nurse prioritize?",
            options: [
                { id: "o1", text: "Apply wrist restraints immediately", isCorrect: false, rationale: "Restraints are a last resort." },
                { id: "o2", text: "Assess lung sounds and airway patency", isCorrect: true, rationale: "ABC priority - Hypoxia is the likely cause of confusion." },
                { id: "o3", text: "Increase Oxygen to 4L NC", isCorrect: true, rationale: "Hypoxia (88%, 85%) requires immediate correction." },
                { id: "o4", text: "Administer Lorazepam (Ativan) 2mg IV", isCorrect: false, rationale: "Sedating a hypoxic patient with high CO2 (respiratory acidosis) can cause arrest." },
                { id: "o5", text: "Notify the Provider of change in status", isCorrect: true, rationale: "Significant deterioration requires medical intervention." },
                { id: "o6", text: "Reorient the patient to time and place", isCorrect: false, rationale: "Reorientation will not fix the underlying physiological hypoxia." }
            ]
        },
        // SECTION 3: The Strict Rationale Structure
        rationale: {
            itemOverviewAndActions: "The client is experiencing acute respiratory acidosis and hypoxia, leading to behavioral changes (confusion). The priority is to treat the 'Hypoxia' (Cause) rather than the 'Confusion' (Symptom). Correct actions involve Assessment (Lung sounds), Intervention (Increase O2), and Notification.",
            optionReview: "Option 1 (Restraints) is inappropriate before treating the cause. Option 2 (Assess) is critical for Airway/Breathing. Option 3 (Oxygen) treats the hypoxia. Option 4 (Sedation) is dangerous in a patient retaining CO2. Option 5 (Notify) is required for unstable patients. Option 6 (Reorient) is futile without oxygenation.",
            clinicalLogic: "Hypoxia (Low O2) and Hypercapnia (High CO2) are potent CNS depressants/irritants. In a COPD/Pneumonia patient, confusion is often the *first* sign of respiratory failure. The 0800 vitals (O2 88%, HR 110) confirm the physiological stress.",
            strategy: "Use the 'ABCs' (Airway, Breathing, Circulation) strategy. The patient's behavior is a 'Breathing' problem masquerading as a 'Safety' problem. Fix the Breathing, and the Safety issue resolves.",
            knowledge: "Key Concept: 'Hypoxia causes Restlessness'. Always check O2 sats in a suddenly confused patient before considering restraints or antipsychotics."
        }
    }
};
