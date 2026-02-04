export interface HighYieldTopic {
    id: string;
    category: 'Physiological Integrity' | 'Safe & Effective Care' | 'Health Promotion' | 'Psychosocial Integrity' | 'Pharm & Parenteral';
    label: string;
    subTopics: string[];
    description: string;
    clinicalAnchors: string[];
    requiredLabs?: string[];
    suggestedVitals?: string[];
}

export const HIGH_YIELD_TOPICS: HighYieldTopic[] = [
    {
        id: 'sepsis-shock',
        category: 'Physiological Integrity',
        label: 'Sepsis & Septic Shock',
        subTopics: ['Sepsis-3 Guidelines', 'Vasopressors', 'MAP Monitoring', 'Lactate Trends'],
        description: 'Focus on Sepsis-3 guidelines, early fluid resuscitation, and vasopressor titration.',
        clinicalAnchors: [
            'Suspected infection source (Pneumonia, UTI)',
            'MAP < 65 mmHg despite initial bolus',
            'Serum Lactate > 2 mmol/L',
            'SIRS criteria (Tachycardia, Tachypnea, Fever)'
        ],
        requiredLabs: ['Serum Lactate', 'WBC with differential', 'Blood Cultures x2', 'Procalcitonin'],
        suggestedVitals: ['BP 88/54', 'HR 124', 'RR 28', 'T 102.4 F']
    },
    {
        id: 'ards-respiratory',
        category: 'Physiological Integrity',
        label: 'Respiratory Failure / ARDS',
        subTopics: ['Ventilator Settings', 'Prone Positioning', 'ABG Interpretation (Mixed)'],
        description: 'Focus on oxygenation/ventilation mismatch, PEEP titration, and prone positioning.',
        clinicalAnchors: [
            'Refractory hypoxemia (SpO2 not responding to O2)',
            'Ground-glass opacities on CXR',
            'Increased work of breathing / accessory muscle use',
            'P/F ratio < 200'
        ],
        requiredLabs: ['ABG (pH, PaO2, PaCO2, HCO3)', 'CXR results', 'BNP (to rule out heart failure)'],
        suggestedVitals: ['SpO2 86% on 100% NRB', 'RR 34', 'HR 118']
    },
    {
        id: 'dka-hhs',
        category: 'Physiological Integrity',
        label: 'DKA vs. HHS',
        subTopics: ['K+ replacement protocols', 'Insulin Drips', 'Fluid Resuscitation (Isotonic)'],
        description: 'Focus on fluid resuscitation, potassium management, and insulin titration.',
        clinicalAnchors: [
            'Blood Glucose > 250 (DKA) or > 600 (HHS)',
            'Metabolic acidosis (Low pH/HCO3) for DKA',
            'Presence of Ketones (DKA)',
            'High serum osmolality (HHS)'
        ],
        requiredLabs: ['Fingerstick Glucose', 'Basic Metabolic Panel (BMP)', 'Urinalysis (Ketones)', 'Serum Osmolality'],
        suggestedVitals: ['Kussmaul respirations', 'BP 102/64', 'HR 110']
    },
    {
        id: 'prioritization-delegation',
        category: 'Safe & Effective Care',
        label: 'Prioritization & Delegation',
        subTopics: ['Assigning care to LPN/UAP', 'Multi-patient triage', 'Ethics of Care'],
        description: 'Critical NGN focus on nursing leadership, scope of practice, and resource management.',
        clinicalAnchors: [
            'Differentiating between stable and unstable patients',
            'Applying the "TAPE" acronym for delegation',
            'Evaluating patient care outcomes after task assignment',
            'Prioritizing based on ABCs and Maslow'
        ],
        suggestedVitals: ['Varied patient vitals (e.g., BP 110/70 and BP 80/40)']
    },
    {
        id: 'obstetric-emergencies',
        category: 'Health Promotion',
        label: 'Obstetric Emergencies',
        subTopics: ['Preeclampsia/Eclampsia', 'Post-partum Hemorrhage', 'Fetal Monitoring'],
        description: 'High-risk OB emergencies requiring rapid stabilization and pharmacological intervention.',
        clinicalAnchors: [
            'BP > 160/110 in pregnancy',
            'Boggy uterus / excessive vaginal bleeding',
            'Late decelerations on fetal heart rate monitor',
            'Magnesium Sulfate toxicity signs'
        ],
        requiredLabs: ['Liver Enzymes', 'Coagulation studies', 'Platelets'],
        suggestedVitals: ['BP 164/112', 'FHR 105 (Late decels)']
    },
    {
        id: 'mental-health-crisis',
        category: 'Psychosocial Integrity',
        label: 'Acute Mental Health Crisis',
        subTopics: ['Suicidality Assessment', 'Lithium Toxicity', 'De-escalation Strategies'],
        description: 'Focus on behavioral emergencies, safety protocols, and medication toxicity.',
        clinicalAnchors: [
            'Suicidal ideation with plan/means',
            'Coarse hand tremors / Diarrhea (Lithium toxicity)',
            'Environmental safety and ligand-free rooms',
            'Crisis intervention and non-violent communication'
        ],
        requiredLabs: ['Lithium Level', 'Toxicology Screen', 'UDS'],
        suggestedVitals: ['HR 96', 'BP 130/85']
    },
    {
        id: 'high-risk-meds',
        category: 'Pharm & Parenteral',
        label: 'High-Risk Medication Mgt',
        subTopics: ['Heparin/Warfarin titration', 'Digoxin Toxicity', 'IV Electrolyte Safety'],
        description: 'Strict management of safety-critical medications and reversal agents.',
        clinicalAnchors: [
            'aPTT/INR titration based on clinical data',
            'Visual disturbances / Yellow halos (Digoxin)',
            'Potassium administration rate safety',
            'Reverse-antidote identification (Protamine, Vit K)'
        ],
        requiredLabs: ['aPTT', 'INR', 'Digoxin Level', 'Potassium'],
        suggestedVitals: ['HR 52 (Bradycardia in Digoxin)', 'BP 118/72']
    }
];
