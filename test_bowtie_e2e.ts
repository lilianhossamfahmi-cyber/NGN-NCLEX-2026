/**
 * BOW-TIE END-TO-END VALIDATION TEST
 * 
 * This test simulates the complete pipeline:
 * 1. Mock AI output (V4 format)
 * 2. Ingestion & Normalization
 * 3. Zod Schema Validation
 * 4. Field Verification
 */

import { ItemIngestionService } from './src/services/ingestion/ItemIngestionService';

// ============================================
// MOCK BOW-TIE JSON (V4 Format - As AI would generate)
// ============================================
const mockBowTieV4 = {
    "type": "bow-tie",
    "prompt": "Analyze the findings in the nurses' notes and vital signs. Complete the diagram by identifying the potential condition, two appropriate actions, and two parameters to monitor.",
    "metadata": {
        "topic": "Septic Shock",
        "difficulty": 5,
        "clientNeeds": "Physiological Integrity",
        "cjmmStep": "Generate Solutions",
        "targetScore": 90
    },
    "content": {
        "patient": {
            "name": "J.D.",
            "age": 68,
            "gender": "Male",
            "allergies": "Penicillin",
            "weightKg": 82,
            "codeStatus": "Full Code"
        },
        "nursesNotes": [
            { "time": "0800", "author": "RN Smith", "entry": "Client admitted from ED with fever and confusion. Family reports client has been increasingly lethargic over past 24 hours." },
            { "time": "0830", "author": "RN Smith", "entry": "BP dropping despite 1L NS bolus. Skin is warm and flushed. Notified provider." },
            { "time": "0845", "author": "RN Smith", "entry": "Client now altered, responding only to painful stimuli. Lactate pending. Preparing for central line." }
        ],
        "vitalSigns": [
            { "time": "0800", "tempF": "102.4", "hr": 118, "rr": 24, "bp": "98/60", "o2": "94", "pain": 6 },
            { "time": "0845", "tempF": "103.1", "hr": 132, "rr": 28, "bp": "84/48", "o2": "90", "pain": 8 }
        ],
        "orders": [
            { "time": "0810", "order": "Blood cultures x2 from separate sites", "status": "completed" },
            { "time": "0815", "order": "Lactate level STAT", "status": "pending" },
            { "time": "0820", "order": "NS bolus 30 mL/kg", "status": "active" }
        ],
        "historyPhysical": {
            "chiefComplaint": "Fever and confusion",
            "hpi": "68-year-old male with history of Type 2 DM and COPD presenting with fever, confusion, and hypotension. Family notes 2-day history of productive cough.",
            "pmh": ["Type 2 Diabetes", "COPD", "Hypertension"],
            "medications": ["Metformin 1000mg BID", "Lisinopril 20mg daily", "Albuterol inhaler PRN"],
            "allergies": "Penicillin (rash)",
            "reviewOfSystems": {
                "constitutional": "Fever, chills, fatigue",
                "respiratory": "Productive cough with yellow sputum"
            }
        },
        "laboratory": [],
        "radiology": []
    },
    "rationale": {
        "general": "Septic shock is a life-threatening condition caused by a dysregulated host response to infection, leading to circulatory and cellular/metabolic abnormalities.",
        "pathophysiology": "Bacterial toxins trigger systemic inflammatory response, causing vasodilation, capillary leak, and myocardial depression, resulting in hypoperfusion and organ dysfunction.",
        "safetyCheck": "CRITICAL: Do not delay antibiotics while awaiting culture results. Every hour of delay increases mortality by 7%.",
        "clinicalTakeaway": "Sepsis management follows the Surviving Sepsis Campaign: Early recognition, cultures, antibiotics within 1 hour, and aggressive fluid resuscitation."
    },
    "structure": {
        "actions": [
            { "id": "a1", "text": "Administer broad-spectrum IV antibiotics", "isCorrect": true },
            { "id": "a2", "text": "Initiate vasopressor therapy (Norepinephrine)", "isCorrect": true },
            { "id": "a3", "text": "Apply cooling blanket for fever", "isCorrect": false },
            { "id": "a4", "text": "Administer oral antipyretics", "isCorrect": false },
            { "id": "a5", "text": "Restrict fluids to prevent overload", "isCorrect": false }
        ],
        "conditions": [
            { "id": "c1", "text": "Septic Shock", "isCorrect": true },
            { "id": "c2", "text": "Cardiogenic Shock", "isCorrect": false },
            { "id": "c3", "text": "Anaphylactic Shock", "isCorrect": false },
            { "id": "c4", "text": "Heat Stroke", "isCorrect": false }
        ],
        "parameters": [
            { "id": "p1", "text": "Serum Lactate Level", "isCorrect": true },
            { "id": "p2", "text": "Mean Arterial Pressure (MAP)", "isCorrect": true },
            { "id": "p3", "text": "Serum Calcium Level", "isCorrect": false },
            { "id": "p4", "text": "Pupillary Response", "isCorrect": false },
            { "id": "p5", "text": "Capillary Blood Glucose", "isCorrect": false }
        ]
    }
};

// ============================================
// RUN TEST
// ============================================
console.log("========================================");
console.log("🧪 BOW-TIE END-TO-END VALIDATION TEST");
console.log("========================================\n");

try {
    // Step 1: Run through Ingestion Service
    console.log("📥 Step 1: Running through ItemIngestionService...");
    const result = ItemIngestionService.ingest(mockBowTieV4);

    // Step 2: Check Result Type
    console.log("\n📋 Step 2: Checking Result...");
    if (result.type === 'error') {
        console.log("❌ FAILED: Item returned as ERROR type");
        console.log("Error Details:", JSON.stringify(result, null, 2));
        process.exit(1);
    }

    console.log("✅ Type:", result.type);

    // Step 3: Verify Critical Fields
    console.log("\n🔍 Step 3: Verifying Critical Fields...");

    const checks = [
        { name: "Prompt exists", pass: !!result.prompt },
        { name: "Difficulty is 5", pass: result.metadata?.difficulty === 5 },
        { name: "Actions count = 5", pass: result.structure?.actions?.length === 5 },
        { name: "Actions correct = 2", pass: result.structure?.actions?.filter((a: any) => a.isCorrect).length === 2 },
        { name: "Conditions count >= 4", pass: result.structure?.conditions?.length >= 4 },
        { name: "Conditions correct = 1", pass: result.structure?.conditions?.filter((c: any) => c.isCorrect).length === 1 },
        { name: "Parameters count = 5", pass: result.structure?.parameters?.length === 5 },
        { name: "Parameters correct = 2", pass: result.structure?.parameters?.filter((p: any) => p.isCorrect).length === 2 },
        { name: "Nurses Notes >= 2", pass: result.content?.nursesNotes?.length >= 2 },
        { name: "Vitals >= 2", pass: result.content?.vitalSigns?.length >= 2 },
        { name: "Rationale is object", pass: typeof result.rationale === 'object' },
        { name: "Rationale has general", pass: !!result.rationale?.general },
        { name: "Rationale has pathophysiology", pass: !!result.rationale?.pathophysiology },
        { name: "Rationale has safetyCheck", pass: !!result.rationale?.safetyCheck }
    ];

    let allPass = true;
    checks.forEach(check => {
        const icon = check.pass ? "✅" : "❌";
        console.log(`  ${icon} ${check.name}`);
        if (!check.pass) allPass = false;
    });

    // Step 4: Final Verdict
    console.log("\n========================================");
    if (allPass) {
        console.log("🎉 ALL TESTS PASSED! Bow-Tie is PRODUCTION READY.");
    } else {
        console.log("⚠️ SOME TESTS FAILED. Review the items marked with ❌.");
    }
    console.log("========================================\n");

} catch (error) {
    console.error("💥 CRITICAL ERROR:", error);
    process.exit(1);
}
