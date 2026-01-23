import dotenv from 'dotenv';
dotenv.config();

import { saveBatchToBank } from '../src/services/itemApiService.ts';

const batch4 = [
    {
        "id": "Cardiology-Trend-S1P2C4",
        "typeId": "trend",
        "metadata": { "title": "Subacute Bacterial Endocarditis", "status": "published", "qualityScore": 95 },
        "content": {
            "clinicalData": { "history": [{ "note": "Osler nodes, nail splinters, IVDU history, new murmur." }] },
            "structure": {
                "prompt": "Which findings support the IE diagnosis?",
                "options": [
                    { "id": "o1", "text": "Osler nodes (painful fingertips)", "isCorrect": true },
                    { "id": "o2", "text": "Splinter hemorrhages", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Endocarditis", "goldenRule": "Painful nodes = Osler; Painless = Janeway." }
        }
    },
    {
        "id": "Cardiology-Trend-A1B2N5",
        "typeId": "trend",
        "metadata": { "title": "Aortic Stenosis Progression", "status": "published", "qualityScore": 92 },
        "content": {
            "clinicalData": { "history": [{ "note": "Syncope on exertion, angina, dyspnea. Harsh murmur radiating to carotids." }] },
            "structure": {
                "prompt": "Which are part of the 'Classic Triad' for symptomatic AS?",
                "options": [
                    { "id": "o1", "text": "Syncope", "isCorrect": true },
                    { "id": "o2", "text": "Angina", "isCorrect": true },
                    { "id": "o3", "text": "Dyspnea", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Aortic Stenosis", "goldenRule": "SAD = Syncope, Angina, Dyspnea." }
        }
    },
    {
        "id": "Cardiology-Trend-M3R3A3",
        "typeId": "trend",
        "metadata": { "title": "Mitral Regurgitation to AFib", "status": "published", "qualityScore": 93 },
        "content": {
            "clinicalData": { "radiology": [{ "study": "Echo", "findings": "Severe MR, Left atrial diameter 5.2 cm (enlarged)." }] },
            "structure": {
                "prompt": "Why does MR lead to AFib?",
                "options": [
                    { "id": "o1", "text": "Left Atrial enlargement and stretching", "isCorrect": true },
                    { "id": "o2", "text": "Multiple re-entry circuits from remodeling", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Valvular AFib", "goldenRule": "Mitral Disease = Big LA = AFib." }
        }
    },
    {
        "id": "Cardiology-Trend-T3I3L3",
        "typeId": "trend",
        "metadata": { "title": "Tricuspid IE with Lung Emboli", "status": "published", "qualityScore": 95 },
        "content": {
            "clinicalData": { "radiology": [{ "study": "CXR", "findings": "Cavitating nodular opacities in lungs." }] },
            "structure": {
                "prompt": "Which confirm Right-sided IE over Left-sided?",
                "options": [
                    { "id": "o1", "text": "Carvallo's sign (murmur louder with inspiration)", "isCorrect": true },
                    { "id": "o2", "text": "Septic Lung Emboli", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Right-Sided IE", "goldenRule": "Right Heart = Lungs; Left Heart = Systemic (Brain/Fingers)." }
        }
    },
    {
        "id": "Cardiology-Trend-A4R4G4",
        "typeId": "trend",
        "metadata": { "title": "Aortic Regurgitation (AR) Signs", "status": "published", "qualityScore": 92 },
        "content": {
            "clinicalData": { "vitals": [{ "time": "0900", "bp": "162/48" }] },
            "structure": {
                "prompt": "Which confirm Wide Pulse Pressure in AR?",
                "options": [
                    { "id": "o1", "text": "BP of 162/48 (PP = 114)", "isCorrect": true },
                    { "id": "o2", "text": "Corrigan's Pulse (bounding)", "isCorrect": true },
                    { "id": "o3", "text": "De Musset's sign (head bobbing)", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Aortic Regurgitation", "goldenRule": "AR = Wide Pulse Pressure + Bounding Pulses." }
        }
    },
    {
        "id": "Cardiology-Trend-B2A2V2",
        "typeId": "trend",
        "metadata": { "title": "Bicuspid Aortic Valve (BAV) + TAA", "status": "published", "qualityScore": 94 },
        "content": {
            "clinicalData": { "radiology": [{ "study": "CT", "findings": "Bicuspid valve + 5.2 cm ascending aorta dilation." }] },
            "structure": {
                "prompt": "Why the high correlation between BAV and Aneurysm?",
                "options": [
                    { "id": "o1", "text": "Shared neural crest developmental origin", "isCorrect": true },
                    { "id": "o2", "text": "Turbulent flow shearing against aortic wall", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Aortopathy", "goldenRule": "Bicuspid Valve = Check the entire Aorta for Aneurysm." }
        }
    },
    {
        "id": "Cardiology-Trend-M2V2P2",
        "typeId": "trend",
        "metadata": { "title": "Mitral Valve Prolapse (MVP)", "status": "published", "qualityScore": 92 },
        "content": {
            "clinicalData": { "history": [{ "note": "Mid-systolic click. Loud/early with standing. Late/soft with squatting." }] },
            "structure": {
                "prompt": "Which maneuvers distinguish the MVP click?",
                "options": [
                    { "id": "o1", "text": "Click occurs EARLIER/louder with standing", "isCorrect": true },
                    { "id": "o2", "text": "Click occurs LATER/softer with squatting", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "MVP Maneuvers", "goldenRule": "MVP: More volume in LV = Later/Softer Click." }
        }
    },
    {
        "id": "Cardiology-Trend-C2P2C2",
        "typeId": "trend",
        "metadata": { "title": "Constrictive Pericarditis vs Tamponade", "status": "published", "qualityScore": 96 },
        "content": {
            "clinicalData": { "history": [{ "note": "Kussmaul's sign, pericardial knock, calcified pericardium on CT." }] },
            "structure": {
                "prompt": "Which confirms Constriction over Tamponade?",
                "options": [
                    { "id": "o1", "text": "Kussmaul's Sign (JVD increases with inspiration)", "isCorrect": true },
                    { "id": "o2", "text": "Pericardial Knock", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Pericardial Disease", "goldenRule": "Kussmaul's = Constriction; Pulsus Paradoxus = Tamponade." }
        }
    },
    {
        "id": "Cardiology-Trend-G2C2A2",
        "typeId": "trend",
        "metadata": { "title": "Giant Cell Arteritis (GCA) + Aorta", "status": "published", "qualityScore": 94 },
        "content": {
            "clinicalData": { "labs": [{ "test": "ESR", "value": "95" }], "history": [{ "note": "Jaw pain, scalp tenderness, new Aortic Regurgitation." }] },
            "structure": {
                "prompt": "Why is there an aortic risk in GCA?",
                "options": [
                    { "id": "o1", "text": "Large-vessel vasculitis targets the elastic aorta", "isCorrect": true },
                    { "id": "o3", "text": "New AR due to aortic root dilation", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Aortitis in GCA", "goldenRule": "GCA = Risk for Aortic Aneurysm/Root dilation." }
        }
    },
    {
        "id": "Cardiology-Trend-S9A2N2",
        "typeId": "trend",
        "metadata": { "title": "Cardiac Sarcoidosis", "status": "published", "qualityScore": 96 },
        "content": {
            "clinicalData": { "vitals": [{ "time": "1800", "hr": 32, "bp": "88/44" }], "radiology": [{ "study": "MRI", "findings": "Granulomas in basal septum." }] },
            "structure": {
                "prompt": "Why is cardiac sarcoid particularly dangerous?",
                "options": [
                    { "id": "o1", "text": "Granulomas in conduction system cause sudden heart block", "isCorrect": true },
                    { "id": "o2", "text": "High risk for VT/SCD", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Cardiac Sarcoid", "goldenRule": "Sarcoid + Syncope = Cardiac/Electrical involvement." }
        }
    }
];

async function pushBatch4() {
    console.log('📦 Pushing Batch 4 (31-40)...');
    const savedCount = await saveBatchToBank(batch4);
    console.log(`✅ Batch 4 Success: ${savedCount} items live.`);
}

pushBatch4();
