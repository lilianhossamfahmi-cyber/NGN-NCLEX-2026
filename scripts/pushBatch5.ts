import dotenv from 'dotenv';
dotenv.config();

import { saveBatchToBank } from '../src/services/itemApiService.ts';

const batch5 = [
    {
        "id": "Cardiology-Trend-M9X1O2",
        "typeId": "trend",
        "metadata": { "title": "Atrial Myxoma", "status": "published", "qualityScore": 95 },
        "content": {
            "clinicalData": { "history": [{ "note": "Positional syncope (leaning forward), tumor plop, fever/high ESR." }] },
            "structure": {
                "prompt": "Which features are characteristic of Atrial Myxoma?",
                "options": [
                    { "id": "o1", "text": "Positional syncope", "isCorrect": true },
                    { "id": "o2", "text": "Tumor Plop in early diastole", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Atrial Myxoma", "goldenRule": "Positional Change = Blockage = Myxoma." }
        }
    },
    {
        "id": "Cardiology-Trend-P9D3A4",
        "typeId": "trend",
        "metadata": { "title": "PDA Eisenmenger's", "status": "published", "qualityScore": 94 },
        "content": {
            "clinicalData": { "vitals": [{ "o2": "94 (Hands), 82 (Feet)" }], "history": [{ "note": "Differential cyanosis (blue toes, pink hands)." }] },
            "structure": {
                "prompt": "Why the differential cyanosis?",
                "options": [
                    { "id": "o1", "text": "PDA connects distal to left subclavian", "isCorrect": true },
                    { "id": "o2", "text": "R-to-L shunt reversal (Eisenmenger's)", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Congenital Shunts", "goldenRule": "Blue Toes + Pink Fingers = PDA Eisenmenger's." }
        }
    },
    {
        "id": "Cardiology-Trend-A1B2N6",
        "typeId": "trend",
        "metadata": { "title": "Coarctation of the Aorta (Adult)", "status": "published", "qualityScore": 92 },
        "content": {
            "clinicalData": { "vitals": [{ "bp": "168/94 (Arm), 108/70 (Leg)" }], "radiology": [{ "study": "CXR", "findings": "Rib notching." }] },
            "structure": {
                "prompt": "Which distinguish Adult Coarctation?",
                "options": [
                    { "id": "o1", "text": "BP difference > 20 mmHg (Up vs Down)", "isCorrect": true },
                    { "id": "o2", "text": "Rib Notching (collaterals)", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Coarctation", "goldenRule": "High Arm BP + Low Leg BP = Coarctation." }
        }
    },
    {
        "id": "Cardiology-Trend-A1B2N7",
        "typeId": "trend",
        "metadata": { "title": "ARVD (Right Ventricular Dysplasia)", "status": "published", "qualityScore": 96 },
        "content": {
            "clinicalData": { "history": [{ "note": "Epsilon wave in V1-V3, athlete, brother died suddenly." }, { "note": "MRI: Fatty replacement of RV." }] },
            "structure": {
                "prompt": "Which EKG finding is hallmark of ARVD?",
                "options": [
                    { "id": "o1", "text": "Epsilon Wave", "isCorrect": true },
                    { "id": "o2", "text": "T-wave inversion in V1-V3", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "ARVD/C", "goldenRule": "Athlete + Epsilon Wave + Family SCD = ARVD." }
        }
    },
    {
        "id": "Cardiology-Trend-A1B2N8",
        "typeId": "trend",
        "metadata": { "title": "LVAD Failure / Pump Thrombosis", "status": "published", "qualityScore": 97 },
        "content": {
            "clinicalData": { "labs": [{ "test": "INR", "value": "1.2", "flag": "L" }], "history": [{ "note": "Alarm beeping, no pulse (normal), controller low flow." }] },
            "structure": {
                "prompt": "Which are NORMAL features of a functioning LVAD?",
                "options": [
                    { "id": "o1", "text": "Absence of palpable peripheral pulse", "isCorrect": true },
                    { "id": "o3", "text": "Continuous whirring sound over heart", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "LVAD Management", "goldenRule": "LVAD: No Pulse = Normal. Alarm = Emergency." }
        }
    },
    {
        "id": "Cardiology-Trend-B1R2U3",
        "typeId": "trend",
        "metadata": { "title": "Brugada Syndrome (Febrile Trigger)", "status": "published", "qualityScore": 95 },
        "content": {
            "clinicalData": { "vitals": [{ "tempF": "103.2" }], "history": [{ "note": "Coved ST elevation in V1-V2 (Type 1)." }] },
            "structure": {
                "prompt": "Why is Brugada unmasked by fever?",
                "options": [
                    { "id": "o1", "text": "Heat alters mutated sodium channel kinetics", "isCorrect": true },
                    { "id": "o2", "text": "Fever acts as a provocative stress test", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Channelopathy", "goldenRule": "Coved ST in V1-V2 + Fever = Brugada." }
        }
    },
    {
        "id": "Cardiology-Trend-L1Q2S3",
        "typeId": "trend",
        "metadata": { "title": "Long QT Syndrome", "status": "published", "qualityScore": 96 },
        "content": {
            "clinicalData": { "vitals": [{ "note": "QTc 520ms, torsades on monitor." }, { "note": "Fainted while swimming, congenital deafness." }] },
            "structure": {
                "prompt": "Which are primary risk factors for Torsades in this patient?",
                "options": [
                    { "id": "o1", "text": "QTc > 500ms", "isCorrect": true },
                    { "id": "o4", "text": "Activity triggered by swimming (LQT-1)", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Congenital LQTS", "goldenRule": "Deafness + Long QT = Jervell and Lange-Nielsen Syndrome." }
        }
    },
    {
        "id": "Cardiology-Trend-A1P2C4",
        "typeId": "trend",
        "metadata": { "title": "Alcohol Cardiomyopathy", "status": "published", "qualityScore": 93 },
        "content": {
            "clinicalData": { "radiology": [{ "study": "Echo", "findings": "Global dilation, LVEF 22%." }], "history": [{ "note": "Daily heavy drinking, improved with abstinence." }] },
            "structure": {
                "prompt": "Important teaching point for prognosis?",
                "options": [
                    { "id": "o1", "text": "Abstinence can lead to EF recovery", "isCorrect": true },
                    { "id": "o2", "text": "Requirement for Thiamine (B1)", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Alcohol-Induced Heart Failure", "goldenRule": "Unlike most DCMs, Alcohol-induced is often REVERSIBLE with sobriety." }
        }
    },
    {
        "id": "Cardiology-Trend-A1B2N9",
        "typeId": "trend",
        "metadata": { "title": "Anthracycline Cardiotoxicity", "status": "published", "qualityScore": 95 },
        "content": {
            "clinicalData": { "radiology": [{ "study": "Echo", "findings": "EF 38% after Doxorubicin." }], "history": [{ "note": "Lifetime dose limit 450-550 mg/m2." }] },
            "structure": {
                "prompt": "Define Anthracycline (Type 1) toxicity.",
                "options": [
                    { "id": "o1", "text": "Dose-dependent risk (Lifetime limit)", "isCorrect": true },
                    { "id": "o2", "text": "Irreversible myocyte damage", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Chemo Toxicity", "goldenRule": "Adriamycin = Type 1 (Permanent); Herceptin = Type 2 (Reversible)." }
        }
    },
    {
        "id": "Cardiology-Trend-M3M3M3",
        "typeId": "trend",
        "metadata": { "title": "Amiodarone Pulmonary Toxicity", "status": "published", "qualityScore": 94 },
        "content": {
            "clinicalData": { "radiology": [{ "study": "CXR", "findings": "Diffuse interstitial infiltrates." }], "history": [{ "note": "Metalic taste, cough, chronic Amiodarone for AFib." }] },
            "structure": {
                "prompt": "Which indicates Amiodarone toxicity over HF?",
                "options": [
                    { "id": "o1", "text": "CXR: Diffuse interstitial infiltrates / fibrosis", "isCorrect": true },
                    { "id": "o2", "text": "Normal BNP and wedge pressure", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Drug Toxicity", "goldenRule": "Amiodarone = Lungs, Liver, Thyroid, Eyes, Skin." }
        }
    }
];

async function pushBatch5() {
    console.log('📦 Pushing Batch 5 (41-50)...');
    const savedCount = await saveBatchToBank(batch5);
    console.log(`✅ Batch 5 Success: ${savedCount} items live.`);
    console.log('🎉 PUSH COMPLETE. ALL 50 ITEMS ARE IN THE BANK.');
}

pushBatch5();
