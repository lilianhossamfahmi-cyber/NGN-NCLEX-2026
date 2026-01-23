import dotenv from 'dotenv';
dotenv.config();

import { saveBatchToBank } from '../src/services/itemApiService.ts';

const batch2 = [
    {
        "id": "Cardiology-Trend-R1T2Y3",
        "typeId": "trend",
        "metadata": { "title": "Post-Valve Replacement Anticoagulation Trend", "status": "published", "qualityScore": 94 },
        "content": {
            "clinicalData": {
                "vitals": [{ "time": "1200", "bp": "130/82" }],
                "labs": [{ "test": "INR", "value": "1.4", "flag": "L", "ref": "2.5-3.5" }]
            },
            "structure": {
                "prompt": "Which findings correlate with the client's current neuro deficit?",
                "options": [
                    { "id": "o1", "text": "Sub-therapeutic INR (1.4)", "isCorrect": true },
                    { "id": "o2", "text": "Report of 3 missed doses of Warfarin", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Valve Anticoagulation", "goldenRule": "Mechanical Mitral = 2.5-3.5 goal." }
        }
    },
    {
        "id": "Cardiology-Trend-G1B2N3",
        "typeId": "trend",
        "metadata": { "title": "Dressler's Syndrome Progression", "status": "published", "qualityScore": 95 },
        "content": {
            "clinicalData": {
                "vitals": [{ "time": "0900", "tempF": "100.2", "pain": 6 }],
                "labs": [{ "test": "ESR", "value": "65", "flag": "H" }]
            },
            "structure": {
                "prompt": "Which characteristics distinguish Dressler's Syndrome from recurrent MI?",
                "options": [
                    { "id": "o1", "text": "Pain relieved by leaning forward", "isCorrect": true },
                    { "id": "o2", "text": "Negative Troponin levels", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Dressler's Syndrome", "goldenRule": "Dressler's = Pleuritic pain relieved by leaning forward." }
        }
    },
    {
        "id": "Cardiology-Trend-A1B2C3",
        "typeId": "trend",
        "metadata": { "title": "Bacterial Endocarditis Signs", "status": "published", "qualityScore": 96 },
        "content": {
            "clinicalData": {
                "vitals": [{ "time": "1200", "tempF": "102.8", "hr": 110 }],
                "history": [{ "note": "Osler nodes, splinter hemorrhages, new holosystolic murmur." }]
            },
            "structure": {
                "prompt": "Which findings support the diagnosis of Infective Endocarditis?",
                "options": [
                    { "id": "o1", "text": "Osler nodes (painful nodules)", "isCorrect": true },
                    { "id": "o3", "text": "New heart murmur", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Infective Endocarditis", "goldenRule": "Endocarditis = Fever + New Murmur." }
        }
    },
    {
        "id": "Cardiology-Trend-C1L2M3",
        "typeId": "trend",
        "metadata": { "title": "Cardiorenal Syndrome", "status": "published", "qualityScore": 93 },
        "content": {
            "clinicalData": {
                "vitals": [{ "time": "1600", "bp": "92/52", "hr": 108 }],
                "labs": [
                    { "test": "Creatinine", "value": "2.8", "flag": "H" },
                    { "test": "Urine Output", "value": "10 mL/hr" }
                ]
            },
            "structure": {
                "prompt": "Which finding indicates Type 1 Cardiorenal Syndrome?",
                "options": [
                    { "id": "o1", "text": "Sudden increase in Creatinine", "isCorrect": true },
                    { "id": "o2", "text": "Sharp decline in urine output", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Cardiorenal Syndrome", "goldenRule": "Too much Furosemide can crush the kidneys in HF." }
        }
    },
    {
        "id": "Cardiology-Trend-A1Z0P9",
        "typeId": "trend",
        "metadata": { "title": "Papillary Muscle Rupture", "status": "published", "qualityScore": 97 },
        "content": {
            "clinicalData": {
                "vitals": [{ "time": "1100", "bp": "80/40", "hr": 122 }],
                "history": [{ "note": "New high-pitched holosystolic murmur at APEX radiating to axilla." }]
            },
            "structure": {
                "prompt": "Which finding is diagnostic of papillary muscle rupture?",
                "options": [
                    { "id": "o1", "text": "Murmur at the apex radiating to axilla", "isCorrect": true },
                    { "id": "o3", "text": "History of recent Inferior MI (RCA)", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Mechanical Post-MI Failure", "goldenRule": "Inferior MI = Posteromedial papillary muscle risk." }
        }
    },
    {
        "id": "Cardiology-Trend-C2Z4X8",
        "typeId": "trend",
        "metadata": { "title": "Cocaine-Induced MI", "status": "published", "qualityScore": 94 },
        "content": {
            "clinicalData": {
                "vitals": [{ "time": "2330", "bp": "210/118", "hr": 142 }],
                "history": [{ "note": "Young male, cocaine use, dilated pupils, agitation." }]
            },
            "structure": {
                "prompt": "Which medication should be questioned?",
                "options": [
                    { "id": "o2", "text": "Propranolol 10mg IV", "isCorrect": true, "rationale": "Causes unopposed alpha-stimulation." }
                ]
            },
            "rationale": { "coreConcept": "Sympathomimetic Crisis", "goldenRule": "Cocaine + Beta Blocker = Unopposed Alpha (Death)." }
        }
    },
    {
        "id": "Cardiology-Trend-T1M8V9",
        "typeId": "trend",
        "metadata": { "title": "Takotsubo Cardiomyopathy", "status": "published", "qualityScore": 95 },
        "content": {
            "clinicalData": {
                "vitals": [{ "time": "1900", "bp": "102/60", "hr": 108 }],
                "radiology": [{ "study": "Ventriculogram", "findings": "Apical ballooning, clean coronaries." }]
            },
            "structure": {
                "prompt": "Which findings distinguish this from a traditional STEMI?",
                "options": [
                    { "id": "o1", "text": "Apical ballooning of the left ventricle", "isCorrect": true },
                    { "id": "o2", "text": "Absence of obstructive coronary disease", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Stress Cardiomyopathy", "goldenRule": "Clean Pipes + Ballooned Heart = Takotsubo." }
        }
    },
    {
        "id": "Cardiology-Trend-P4L1V2",
        "typeId": "trend",
        "metadata": { "title": "Peripartum Cardiomyopathy", "status": "published", "qualityScore": 96 },
        "content": {
            "clinicalData": {
                "vitals": [{ "time": "0800", "o2": "92", "rr": 24 }],
                "radiology": [{ "study": "Echo", "findings": "EF 28% postpartum." }]
            },
            "structure": {
                "prompt": "Which features define PPCM?",
                "options": [
                    { "id": "o1", "text": "HF in month 9 of pregnancy to month 5 postpartum", "isCorrect": true },
                    { "id": "o3", "text": "LVEF < 45%", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "PPCM Criteria", "goldenRule": "Symptomatic HF + Postpartum + No prior history = PPCM." }
        }
    },
    {
        "id": "Cardiology-Trend-B9U3H7",
        "typeId": "trend",
        "metadata": { "title": "Cor Pulmonale", "status": "published", "qualityScore": 92 },
        "content": {
            "clinicalData": {
                "vitals": [{ "time": "1000", "hr": 104, "o2": "90" }],
                "history": [{ "note": "Chronic COPD, JVD, liver enlargement, clear lungs." }]
            },
            "structure": {
                "prompt": "Which confirms Cor Pulmonale over L-sided HF?",
                "options": [
                    { "id": "o2", "text": "Clear breath sounds with edema/JVD", "isCorrect": true },
                    { "id": "o3", "text": "Hepatomegaly and ascites", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "R-Sided Failure", "goldenRule": "Lung Disease causes Cor Pulmonale; Lungs are usually clear of HF fluid." }
        }
    },
    {
        "id": "Cardiology-Trend-E5R1W4",
        "typeId": "trend",
        "metadata": { "title": "Massive Pulmonary Embolism", "status": "published", "qualityScore": 98 },
        "content": {
            "clinicalData": {
                "vitals": [
                    { "time": "1400", "bp": "118/74", "hr": 112 },
                    { "time": "1600", "bp": "84/48", "hr": 142 }
                ],
                "radiology": [{ "study": "CT", "findings": "Saddle embolus." }]
            },
            "structure": {
                "prompt": "Which distinguishes this as a Massive PE?",
                "options": [
                    { "id": "o1", "text": "Sustained hypotension (SBP < 90) and shock", "isCorrect": true },
                    { "id": "o4", "text": "Requirement for tPA or vasopressors", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Massive PE", "goldenRule": "Massive PE = PE + Shock (Hemodynamic Collapse)." }
        }
    }
];

async function pushBatch2() {
    console.log('📦 Pushing Batch 2 (11-20)...');
    const savedCount = await saveBatchToBank(batch2);
    console.log(`✅ Batch 2 Success: ${savedCount} items live.`);
}

pushBatch2();
