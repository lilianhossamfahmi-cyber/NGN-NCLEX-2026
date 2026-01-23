import dotenv from 'dotenv';
dotenv.config();

import { saveBatchToBank } from '../src/services/itemApiService.ts';

const batch3 = [
    {
        "id": "Cardiology-Trend-W2P1H9",
        "typeId": "trend",
        "metadata": { "title": "WPW with Rapid AFib", "status": "published", "qualityScore": 95 },
        "content": {
            "clinicalData": { "vitals": [{ "time": "2230", "bp": "88/44", "hr": 220 }] },
            "structure": {
                "prompt": "Why is Diltiazem/Verapamil contraindicated for this rhythm (Wide-Complex AFib in WPW)?",
                "options": [
                    { "id": "o1", "text": "Blocking AV node forces all impulses through the accessory pathway", "isCorrect": true },
                    { "id": "o2", "text": "Can cause paradoxical acceleration and V-Fib", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "WPW Pathophysiology", "goldenRule": "WPW + Wide AFib = NO AV blockers (ABCD)." }
        }
    },
    {
        "id": "Cardiology-Trend-H7B8C9",
        "typeId": "trend",
        "metadata": { "title": "HOCM vs Aortic Stenosis", "status": "published", "qualityScore": 96 },
        "content": {
            "clinicalData": { "history": [{ "note": "Murmur LOUDER with standing or Valsalva, QUIETER with squatting." }] },
            "structure": {
                "prompt": "Which features distinguish HOCM from Aortic Stenosis?",
                "options": [
                    { "id": "o1", "text": "Murmur increases with Valsalva", "isCorrect": true },
                    { "id": "o5", "text": "Murmur decreases with squatting", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Hypertrophic Cardiomyopathy", "goldenRule": "HOCM: Less volume in heart = Worse blockage/Loud murmur." }
        }
    },
    {
        "id": "Cardiology-Trend-A1M2Y3",
        "typeId": "trend",
        "metadata": { "title": "Cardiac Amyloidosis", "status": "published", "qualityScore": 94 },
        "content": {
            "clinicalData": {
                "history": [{ "note": "Raccoon eyes, carpal tunnel history, low voltage EKG, thick walls on Echo." }]
            },
            "structure": {
                "prompt": "Which are characteristic clues for Cardiac Amyloidosis?",
                "options": [
                    { "id": "o1", "text": "Periorbital ecchymosis (Raccoon Eyes)", "isCorrect": true },
                    { "id": "o2", "text": "Low voltage on EKG despite thick walls", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Amyloid Heart Disease", "goldenRule": "Thick Heart + Low Voltage = Amyloid." }
        }
    },
    {
        "id": "Cardiology-Trend-V1M2H3",
        "typeId": "trend",
        "metadata": { "title": "Fulminant Viral Myocarditis", "status": "published", "qualityScore": 96 },
        "content": {
            "clinicalData": {
                "vitals": [{ "time": "1200", "bp": "88/44", "tempF": "101.2" }],
                "history": [{ "note": "Recent flu, chest pain worse lying flat, global hypokinesis on Echo." }]
            },
            "structure": {
                "prompt": "Which distinguishes Myocarditis from traditional MI in a young patient?",
                "options": [
                    { "id": "o1", "text": "Recent viral prodrome", "isCorrect": true },
                    { "id": "o2", "text": "Global hypokinesis rather than regional wall abnormality", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Myocarditis", "goldenRule": "Viral history + Global failure = Myocarditis." }
        }
    },
    {
        "id": "Cardiology-Trend-P1A2Z3",
        "typeId": "trend",
        "metadata": { "title": "Prinzmetal (Vasospastic) Angina", "status": "published", "qualityScore": 94 },
        "content": {
            "clinicalData": {
                "history": [{ "note": "Rest pain at 3AM, transient ST elevation, normal coronary arteries, relived by Nitroglycerin." }]
            },
            "structure": {
                "prompt": "Which features distinguish Prinzmetal from atherosclerotic disease?",
                "options": [
                    { "id": "o1", "text": "Pain occurs at rest and at night", "isCorrect": true },
                    { "id": "o2", "text": "Transient ST elevation resolves with Nitrates", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Coronary Vasospasm", "goldenRule": "Night rest pain + ST elevation + normal Cath = Prinzmetal." }
        }
    },
    {
        "id": "Cardiology-Trend-B9V8R7",
        "typeId": "trend",
        "metadata": { "title": "Retroperitoneal Hematoma Post-Cath", "status": "published", "qualityScore": 97 },
        "content": {
            "clinicalData": {
                "vitals": [{ "time": "1530", "bp": "82/48", "pain": 9 }],
                "history": [{ "note": "Post-femoral Cath, severe back/flank pain, groin site appears dry." }]
            },
            "structure": {
                "prompt": "Which distinguishes a Retroperitoneal bleed?",
                "options": [
                    { "id": "o1", "text": "Deep back or flank pain", "isCorrect": true },
                    { "id": "o2", "text": "Dry groin site (hidden bleeding)", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "RP Bleed Recognition", "goldenRule": "Post-Cath + Back Pain + Shock = Retroperitoneal Bleed until proven otherwise." }
        }
    },
    {
        "id": "Cardiology-Trend-A1B2N4",
        "typeId": "trend",
        "metadata": { "title": "Tachycardia-Induced Cardiomyopathy", "status": "published", "qualityScore": 93 },
        "content": {
            "clinicalData": {
                "vitals": [{ "time": "0800", "hr": 148, "bp": "118/74" }],
                "radiology": [{ "study": "Echo", "findings": "EF 32% (baseline 55%) with AFib/RVR for 72 hours." }]
            },
            "structure": {
                "prompt": "Which indicates failure secondary to rhythm?",
                "options": [
                    { "id": "o1", "text": "Sustained rate > 130 for over 48 hours", "isCorrect": true },
                    { "id": "o2", "text": "Falling EF without regional wall abnormalities", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "TIC", "goldenRule": "Prolonged high HR literally 'stuns' the heart; EF can recover with rate control." }
        }
    },
    {
        "id": "Cardiology-Trend-R1M2S3",
        "typeId": "trend",
        "metadata": { "title": "Mitral Stenosis / Rheumatic Heart Disease", "status": "published", "qualityScore": 92 },
        "content": {
            "clinicalData": {
                "history": [{ "note": "Childhood rheumatic fever, malar flush, diastolic rumbling murmur with opening snap." }]
            },
            "structure": {
                "prompt": "Which indicate Mitral Stenosis?",
                "options": [
                    { "id": "o2", "text": "Low-pitched diastolic rumble with opening snap", "isCorrect": true },
                    { "id": "o3", "text": "Malar Flush (plum-colored cheeks)", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Valvular Heart Disease", "goldenRule": "Malar Flush + Opening Snap = Mitral Stenosis." }
        }
    },
    {
        "id": "Cardiology-Trend-I1E2S3",
        "typeId": "trend",
        "metadata": { "title": "Endocarditis with Embolic Stroke", "status": "published", "qualityScore": 95 },
        "content": {
            "clinicalData": {
                "vitals": [{ "time": "1400", "tempF": "100.4" }],
                "history": [{ "note": "IE patient with new facial droop/hemiplegia. 1.5cm vegetation on TEE." }]
            },
            "structure": {
                "prompt": "Which TEE finding links the infection to the stroke?",
                "options": [
                    { "id": "o1", "text": "Presence of a > 10mm mobile vegetation", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "IE Complications", "goldenRule": "Large vegetation (>10mm) + Neuro deficit = Embolic Stroke." }
        }
    },
    {
        "id": "Cardiology-Trend-N8U3M1",
        "typeId": "trend",
        "metadata": { "title": "BNP in Cardiopulmonary Differentiator", "status": "published", "qualityScore": 94 },
        "content": {
            "clinicalData": {
                "vitals": [{ "time": "0800", "bp": "148/92", "o2": "91" }],
                "labs": [{ "test": "BNP", "value": "1850", "flag": "H" }]
            },
            "structure": {
                "prompt": "Which definitively shows CARDIAC over PULMONARY cause?",
                "options": [
                    { "id": "o1", "text": "BNP level > 400-500", "isCorrect": true },
                    { "id": "o3", "text": "Orthopnea history", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "BNP Utility", "goldenRule": "BNP > 500 = Heart Failure until proven otherwise." }
        }
    }
];

async function pushBatch3() {
    console.log('📦 Pushing Batch 3 (21-30)...');
    const savedCount = await saveBatchToBank(batch3);
    console.log(`✅ Batch 3 Success: ${savedCount} items live.`);
}

pushBatch3();
