export type ClinicalCategory =
    | 'Safe & Effective Care Environment'
    | 'Health Promotion & Maintenance'
    | 'Psychosocial Integrity'
    | 'Physiological Integrity';

export interface SubTopic {
    label: string;
    isHighYield: boolean;
}

export interface ClinicalTopic {
    id: string;
    category: ClinicalCategory;
    label: string;
    isHighYield: boolean;
    subTopics: SubTopic[];
    description: string;
    clinicalAnchors: string[];
    requiredLabs?: string[];
    suggestedVitals?: string[];
}

export const CLINICAL_TOPICS: ClinicalTopic[] = [
    // --- SAFE & EFFECTIVE CARE ENVIRONMENT ---
    {
        id: 'mci-disaster',
        category: 'Safe & Effective Care Environment',
        label: 'Management: Mass Casualty (MCI)',
        isHighYield: true,
        subTopics: [
            { label: 'Triage: Red (Immediate)', isHighYield: true },
            { label: 'Triage: Black (Expectant)', isHighYield: true },
            { label: 'Primary vs Secondary Triage', isHighYield: true },
            { label: 'Chemical Decontamination', isHighYield: false },
            { label: 'Bioterrorism Tagging', isHighYield: false },
            { label: 'Resource Allocation Ethics', isHighYield: true },
            { label: 'Hospital Surge Capacity', isHighYield: false },
            { label: 'Personal Protective Equipment', isHighYield: true }
        ],
        description: 'Disaster Triage: Color-coded tagging (Red=Immediate, Black=Expectant).',
        clinicalAnchors: ['Color-coded tagging', 'Red=Immediate', 'Black=Expectant']
    },
    {
        id: 'delegation-ngn',
        category: 'Safe & Effective Care Environment',
        label: 'Management: Assignment & Delegation',
        isHighYield: true,
        subTopics: [
            { label: 'LPN: Meds for Stable Patients', isHighYield: true },
            { label: 'UAP: ADLs & Vitals', isHighYield: true },
            { label: 'RN Scope: EAT (Evaluate, Assess, Teach)', isHighYield: true },
            { label: 'Float Nurse Assignments', isHighYield: true },
            { label: 'New Grad Preceptorship', isHighYield: false },
            { label: 'Five Rights of Delegation', isHighYield: true },
            { label: 'Supervision & Feedback', isHighYield: false },
            { label: 'Complexity of Task assessment', isHighYield: false }
        ],
        description: 'Scope: LPNs (Stable/Meds) vs. UAP (ADLs/Vitals) vs. RN (EAT).',
        clinicalAnchors: ['Evaluate, Assess, Teach (RN only)', 'Stable vs Unstable']
    },
    {
        id: 'informed-consent-ngn',
        category: 'Safe & Effective Care Environment',
        label: 'Management: Informed Consent',
        isHighYield: true,
        subTopics: [
            { label: 'Barriers to Understanding', isHighYield: true },
            { label: 'Nurse Role: Witnessing signature', isHighYield: true },
            { label: 'Provider Responsibility: Procedure info', isHighYield: true },
            { label: 'Minors & Emancipated status', isHighYield: false },
            { label: 'Withdrawal of Consent', isHighYield: false },
            { label: 'Emergency Surgery protocols', isHighYield: true },
            { label: 'Cognitive Impairment status', isHighYield: true },
            { label: 'Translator/Interpreter needs', isHighYield: false }
        ],
        description: 'Legal/ethical requirements for clinical procedures.',
        clinicalAnchors: ['Witnessing signature', 'Provider info verification']
    },
    {
        id: 'advance-directives-ngn',
        category: 'Safe & Effective Care Environment',
        label: 'Management: Advance Directives',
        isHighYield: true,
        subTopics: [
            { label: 'Living Will vs Durable POA', isHighYield: true },
            { label: 'DNR/DNI Code Status', isHighYield: true },
            { label: 'Ethical Dilemmas: Autonomy', isHighYield: false },
            { label: 'Self-Determination Act', isHighYield: false },
            { label: 'Barriers to Discharge planning', isHighYield: true },
            { label: 'Surrogate Decision Makers', isHighYield: true },
            { label: 'Financial/Social blocks', isHighYield: false },
            { label: 'Palliative vs Hospice goals', isHighYield: false }
        ],
        description: 'Barriers: Identifying social/financial blocks to discharge.',
        clinicalAnchors: ['Living Will', 'POA', 'Code Status']
    },
    {
        id: 'hai-infection',
        category: 'Safe & Effective Care Environment',
        label: 'Safety: Hospital-Acquired Infections (HAI)',
        isHighYield: true,
        subTopics: [
            { label: 'VAP (Ventilator-Assoc)', isHighYield: false },
            { label: 'CAUTI (Catheter-Assoc)', isHighYield: true },
            { label: 'CLABSI (Central Line-Assoc)', isHighYield: true },
            { label: 'Surgical Site Infection (SSI)', isHighYield: false },
            { label: 'Hand Hygiene Compliance', isHighYield: true },
            { label: 'Environmental Cleaning', isHighYield: false },
            { label: 'Reporting Trends', isHighYield: false },
            { label: 'Antibiotic Stewardship', isHighYield: true }
        ],
        description: 'Preventing systemic infections within the hospital setting.',
        clinicalAnchors: ['CLABSI prevention', 'Hand hygiene']
    },
    {
        id: 'restraints-ngn',
        category: 'Safe & Effective Care Environment',
        label: 'Safety: Restraints & Seclusion',
        isHighYield: true,
        subTopics: [
            { label: 'Physical vs Chemical restraints', isHighYield: false },
            { label: 'Monitoring: Q15m Vitals/Skin', isHighYield: true },
            { label: 'Restraint Order Renewal (Q4h)', isHighYield: true },
            { label: 'Alternative interventions', isHighYield: true },
            { label: 'Ethical: Least Restrictive', isHighYield: true },
            { label: 'Hydration & Toileting needs', isHighYield: false },
            { label: 'Documentation rigor', isHighYield: false },
            { label: 'Safety: Two-finger breadth', isHighYield: false }
        ],
        description: 'Reducing environmental risks and ensuring patient safety/rights.',
        clinicalAnchors: ['Order renewal', 'Least restrictive alternative']
    },
    {
        id: 'sepsis-bundle',
        category: 'Safe & Effective Care Environment',
        label: 'Safety: Sepsis Bundle & Isolation',
        isHighYield: true,
        subTopics: [
            { label: 'The "Golden Hour": Lactate/Cultures', isHighYield: true },
            { label: 'Transmission: Airborne (Measles)', isHighYield: true },
            { label: 'Transmission: Droplet (Flu)', isHighYield: true },
            { label: 'Transmission: Contact (C. Diff)', isHighYield: true },
            { label: 'Standard Precautions (Soap & Water)', isHighYield: true },
            { label: 'Fluid Resuscitation timing', isHighYield: true },
            { label: 'Antibiotic timing', isHighYield: true },
            { label: 'Vasopressor initiation', isHighYield: true }
        ],
        description: 'Sepsis Bundle: The "Golden Hour" (Lactate, Cultures, Abx, Fluids). Correct PPE rules.',
        clinicalAnchors: ['Golden Hour', 'PPE Airborne/Droplet/Contact']
    },
    {
        id: 'emergency-response-ngn',
        category: 'Safe & Effective Care Environment',
        label: 'Safety: Emergency Response (Fire/Spill)',
        isHighYield: true,
        subTopics: [
            { label: 'Fire Safety: RACE/PASS', isHighYield: true },
            { label: 'Hazardous Spill management', isHighYield: true },
            { label: 'Radiation Safety distance/shield', isHighYield: false },
            { label: 'Internal vs External Disaster', isHighYield: false },
            { label: 'Evacuation prioritization', isHighYield: true },
            { label: 'Incident Reporting workflow', isHighYield: false },
            { label: 'Just Culture (Error analysis)', isHighYield: true },
            { label: 'Root Cause Analysis (RCA)', isHighYield: true }
        ],
        description: '"Just Culture": Root cause analysis of errors. Fire/Spill protocols.',
        clinicalAnchors: ['RACE/PASS', 'Root Cause Analysis']
    },

    // --- HEALTH PROMOTION & MAINTENANCE ---
    {
        id: 'pph-ngn',
        category: 'Health Promotion & Maintenance',
        label: 'OB: Postpartum Hemorrhage (PPH)',
        isHighYield: true,
        subTopics: [
            { label: 'Quantification: Weighing pads (1g = 1mL)', isHighYield: true },
            { label: 'Fundal Massage & Uterine Atony', isHighYield: true },
            { label: 'Uterotonic Meds (Oxytocin, Methergine)', isHighYield: true },
            { label: 'Bladder Distention Assessment', isHighYield: false },
            { label: 'Vitals: Early Shock Recognition', isHighYield: true },
            { label: 'Bakri Balloon Management', isHighYield: false },
            { label: 'Bimanual Compression assistance', isHighYield: false },
            { label: 'Laceration vs Atony signs', isHighYield: false }
        ],
        description: 'Quantification: Weighing pads for blood loss (1g = 1mL). Early intervention for uterine atony.',
        clinicalAnchors: ['1g = 1mL blood loss', 'Boggy fundus = Massage']
    },
    {
        id: 'preeclampsia-ngn',
        category: 'Health Promotion & Maintenance',
        label: 'OB: Preeclampsia / Eclampsia',
        isHighYield: true,
        subTopics: [
            { label: 'Warning: Headache + Blurred Vision', isHighYield: true },
            { label: 'Impending Seizure monitoring', isHighYield: true },
            { label: 'Magnesium Sulfate titration safety', isHighYield: true },
            { label: 'Calcium Gluconate readiness', isHighYield: true },
            { label: 'Deep Tendon Reflexes (DTR)', isHighYield: false },
            { label: 'HELLP Syndrome lab assessment', isHighYield: true },
            { label: 'Activity/Stimuli reduction', isHighYield: false },
            { label: 'Antihypertensives (Labetalol)', isHighYield: false }
        ],
        description: 'Warning Signs: Headache + Blurred Vision = Impending Seizure. Magnesium safety.',
        clinicalAnchors: ['Headache/Blurred vision', 'Magnesium toxicity']
    },
    {
        id: 'shoulder-dystocia-ngn',
        category: 'Health Promotion & Maintenance',
        label: 'OB: Shoulder Dystocia',
        isHighYield: true,
        subTopics: [
            { label: 'McRoberts Maneuver', isHighYield: true },
            { label: 'Suprapubic Pressure (NOT Fundal)', isHighYield: true },
            { label: 'Newborn Brachial Plexus injury', isHighYield: true },
            { label: 'Time tracking: Goal < 5 mins', isHighYield: true },
            { label: 'Maternal Trauma assessment', isHighYield: false },
            { label: 'Turtle Sign recognition', isHighYield: false }
        ],
        description: 'Emergent management of difficult birth. Suprapubic pressure vs Fundal pressure.',
        clinicalAnchors: ['McRoberts Maneuver', 'Suprapubic pressure only']
    },
    {
        id: 'newborn-transition-ngn',
        category: 'Health Promotion & Maintenance',
        label: 'OB: Newborn Transition',
        isHighYield: true,
        subTopics: [
            { label: 'Cold Stress: Preventing hypoglycemia', isHighYield: true },
            { label: 'Thermoregulation (Skin-to-Skin)', isHighYield: true },
            { label: 'APGAR Scoring (1m & 5m)', isHighYield: true },
            { label: 'Vitamin K & Erythromycin timing', isHighYield: false },
            { label: 'Umbilical Cord care', isHighYield: false },
            { label: 'Neonatal Resp Distress signs', isHighYield: true },
            { label: 'Glucose monitoring (Low weight)', isHighYield: true },
            { label: 'Bilirubin/Jaundice screening', isHighYield: false }
        ],
        description: 'Cold Stress: Preventing hypoglycemia in newborns via thermoregulation.',
        clinicalAnchors: ['Thermoregulation', 'Prevent Hypoglycemia']
    },
    {
        id: 'pedi-resp-ngn',
        category: 'Health Promotion & Maintenance',
        label: 'Peds: RSV / Bronchiolitis',
        isHighYield: true,
        subTopics: [
            { label: 'Resp Distress: "Silent Chest" vs Wheeze', isHighYield: true },
            { label: 'Suctioning: Bulbs & Wall pressure', isHighYield: true },
            { label: 'Hydration: I/O & Fontanelles', isHighYield: true },
            { label: 'Nasal Flaring & Retractions', isHighYield: true },
            { label: 'Isolation: Droplet/Contact', isHighYield: true },
            { label: 'Oxygen Saturation targets', isHighYield: false },
            { label: 'Caregiver Education: Hydration', isHighYield: false }
        ],
        description: 'Respiratory Distress: Recognizing "Silent Chest" (ominous) vs. Wheezing.',
        clinicalAnchors: ['Silent Chest = Ominous', 'Retractions']
    },
    {
        id: 'pedi-asthma-ngn',
        category: 'Health Promotion & Maintenance',
        label: 'Peds: Asthma Exacerbation',
        isHighYield: true,
        subTopics: [
            { label: 'Albuterol Rescue: Side effects', isHighYield: true },
            { label: 'Peak Flow Meter education', isHighYield: true },
            { label: 'Steroid initiation (Prednisolone)', isHighYield: false },
            { label: 'Trigger identification (Dust/Pollen)', isHighYield: false },
            { label: 'Status Asthmaticus emergency', isHighYield: true },
            { label: 'Inhaler Spacer technique', isHighYield: true }
        ],
        description: 'Acute management and long-term control of pediatric asthma.',
        clinicalAnchors: ['Rescue inhaler priority', 'Trigger avoidance']
    },
    {
        id: 'pedi-cf-ngn',
        category: 'Health Promotion & Maintenance',
        label: 'Peds: Cystic Fibrosis',
        isHighYield: true,
        subTopics: [
            { label: 'Enzyme placement (With Snacks)', isHighYield: true },
            { label: 'Chest Physio (CPT) timing', isHighYield: true },
            { label: 'High-Calorie / High-Protein diet', isHighYield: true },
            { label: 'Meconium Ileus (Newborn)', isHighYield: true },
            { label: 'Sweat Chloride Test info', isHighYield: false },
            { label: 'Infection risk (Pseudomonas)', isHighYield: false },
            { label: 'Fat-Soluble Vitamins (A,D,E,K)', isHighYield: false }
        ],
        description: 'Multisystem chronic disease management (GI & Resp).',
        clinicalAnchors: ['Enzymes with every meal', 'Chest CPT']
    },
    {
        id: 'pedi-milestones-ngn',
        category: 'Health Promotion & Maintenance',
        label: 'Peds: Developmental Milestones',
        isHighYield: true,
        subTopics: [
            { label: 'SIDS: "Back to Sleep" rules', isHighYield: true },
            { label: 'Age-appropriate toys (Choking)', isHighYield: true },
            { label: 'Pincer Grasp (9 months)', isHighYield: true },
            { label: 'Walking (12-15 months)', isHighYield: false },
            { label: 'Regression during stress', isHighYield: false },
            { label: 'Autonomy vs Shame (Toddlers)', isHighYield: false },
            { label: 'Safety: Pool/Stair gates', isHighYield: true }
        ],
        description: 'Safety: Age-appropriate toys and SIDS prevention (Back to Sleep).',
        clinicalAnchors: ['Back to Sleep', 'Choking hazards']
    },
    {
        id: 'geri-delirium-ngn',
        category: 'Health Promotion & Maintenance',
        label: 'Geri: Delirium vs. Dementia',
        isHighYield: true,
        subTopics: [
            { label: 'Rule out UTI/Hypoxia first', isHighYield: true },
            { label: 'Acute Confusion: Reversibility', isHighYield: true },
            { label: 'Safety: Reorientation techniques', isHighYield: false },
            { label: 'Sundowning Management', isHighYield: false },
            { label: 'CAM Assessment tool', isHighYield: true },
            { label: 'Sleep/Wake cycle disruption', isHighYield: false }
        ],
        description: 'Acute Confusion: Always rule out UTI or Hypoxia first (Delirium is reversible).',
        clinicalAnchors: ['Rule out UTI first', 'Acute shift = Delirium']
    },
    {
        id: 'geri-safety-ngn',
        category: 'Health Promotion & Maintenance',
        label: 'Geri: Polypharmacy & Falls',
        isHighYield: true,
        subTopics: [
            { label: 'Prescribing Cascade awareness', isHighYield: true },
            { label: 'Digoxin Toxicity (Visual halos)', isHighYield: true },
            { label: 'BEERS Criteria Medications', isHighYield: true },
            { label: 'Falls: Frailty & Orthostatics', isHighYield: true },
            { label: 'Med Reconciliation basics', isHighYield: true },
            { label: 'Safety: Home hazard assessment', isHighYield: false },
            { label: 'Elder Abuse: Direct screening', isHighYield: true }
        ],
        description: 'Prescribing Cascade: Treating side effects with more meds. Falls & Frailty.',
        clinicalAnchors: ['Digoxin Halos', 'Polypharmacy review']
    },

    // --- PSYCHOSOCIAL INTEGRITY ---
    {
        id: 'depression-suicide-ngn',
        category: 'Psychosocial Integrity',
        label: 'Mental Health: Major Depressive Disorder',
        isHighYield: true,
        subTopics: [
            { label: 'Suicide Risk: Direct questioning', isHighYield: true },
            { label: 'Safety: 1-to-1 observation', isHighYield: true },
            { label: 'Ligature-free environment check', isHighYield: true },
            { label: 'Psychotropic Med initiation (SSRIs)', isHighYield: false },
            { label: 'Anhedonia & Vegetative symptoms', isHighYield: false },
            { label: 'Therapeutic: Validating feelings', isHighYield: true },
            { label: 'Crisis Intervention: Safety plan', isHighYield: true },
            { label: 'Electroconvulsive Therapy (ECT)', isHighYield: false }
        ],
        description: 'Suicide Risk: Direct questioning ("Do you have a plan?"). Therapeutic Communication: Validating feelings.',
        clinicalAnchors: ['Direct questioning about suicide', 'Validating feelings']
    },
    {
        id: 'schizo-safety-ngn',
        category: 'Psychosocial Integrity',
        label: 'Mental Health: Schizophrenia',
        isHighYield: true,
        subTopics: [
            { label: 'Command Hallucinations management', isHighYield: true },
            { label: 'Delusion management: Present reality', isHighYield: true },
            { label: 'Therapeutic: Acknowledging feeling of delusion', isHighYield: true },
            { label: 'Extrapyramidal Side Effects (EPS)', isHighYield: true },
            { label: 'Neuroleptic Malignant Syndrome (NMS)', isHighYield: true },
            { label: 'Agranulocytosis monitoring (Clozapine)', isHighYield: true },
            { label: 'Social Skill training basics', isHighYield: false }
        ],
        description: 'Therapeutic Communication: Validating feelings, avoiding "Why" questions.',
        clinicalAnchors: ['Presenting reality', 'NMS signs']
    },
    {
        id: 'mania-safety-ngn',
        category: 'Psychosocial Integrity',
        label: 'Mental Health: Bipolar Mania',
        isHighYield: true,
        subTopics: [
            { label: 'Safety: Milieu Management', isHighYield: true },
            { label: 'High-calorie finger foods', isHighYield: true },
            { label: 'Lithium Toxicity monitoring', isHighYield: true },
            { label: 'Low stimuli environment', isHighYield: true },
            { label: 'Valproic Acid level checks', isHighYield: false },
            { label: 'Sleep/Rest prioritization', isHighYield: true },
            { label: 'Grandiosity redirection', isHighYield: false }
        ],
        description: 'Safety: Milieu management during manic episodes (finger foods, low stimuli).',
        clinicalAnchors: ['High-calorie finger foods', 'Low stimuli']
    },
    {
        id: 'personality-boundaries-ngn',
        category: 'Psychosocial Integrity',
        label: 'Mental Health: Personality Disorders',
        isHighYield: true,
        subTopics: [
            { label: 'Boundaries: Limit-setting (BPD)', isHighYield: true },
            { label: 'Splitting behavior identification', isHighYield: true },
            { label: 'Self-Harm (NSSI) management', isHighYield: true },
            { label: 'Manipulation: Team consistency', isHighYield: true },
            { label: 'Impulsivity control training', isHighYield: false },
            { label: 'Antisocial safety rules', isHighYield: true }
        ],
        description: 'Therapeutic boundaries and limit-setting in personality disorders.',
        clinicalAnchors: ['Limit-setting', 'Splitting behavior']
    },
    {
        id: 'alcohol-withdrawal-ngn',
        category: 'Psychosocial Integrity',
        label: 'Addiction: Alcohol Withdrawal (DTs)',
        isHighYield: true,
        subTopics: [
            { label: 'Timeline: Seizures (48-72h post-drink)', isHighYield: true },
            { label: 'Cues: CIWA scoring interpretation', isHighYield: true },
            { label: 'Chlordiazepoxide (Librium) taper', isHighYield: true },
            { label: 'Wernicke Encephalopathy safety', isHighYield: true },
            { label: 'Thiamine & Magnesium replacement', isHighYield: false },
            { label: 'Delirium Tremens emergency', isHighYield: true }
        ],
        description: 'Timeline: Knowing when seizures happen (48-72h post-drink). Cues: CIWA scoring.',
        clinicalAnchors: ['Seizure timeline (48-72h)', 'CIWA Score']
    },
    {
        id: 'opioid-overdose-ngn',
        category: 'Psychosocial Integrity',
        label: 'Addiction: Opioid Overdose',
        isHighYield: true,
        subTopics: [
            { label: 'Reversal: Naloxone (Narcan) dosing', isHighYield: true },
            { label: 'Narcan half-life monitoring', isHighYield: true },
            { label: 'Resp Depression assessment', isHighYield: true },
            { label: 'COWS Score for withdrawal', isHighYield: true },
            { label: 'Methadone vs Buprenorphine', isHighYield: false },
            { label: 'Safety: Secondary OD risk', isHighYield: true }
        ],
        description: 'Reversal: Narcan (Naloxone) dosing and half-life monitoring.',
        clinicalAnchors: ['Naloxone timing', 'COWS Score']
    },
    {
        id: 'neonatal-abstinence-ngn',
        category: 'Psychosocial Integrity',
        label: 'Addiction: Neonatal Abstinence (NAS)',
        isHighYield: true,
        subTopics: [
            { label: 'Cues: High-pitched cry', isHighYield: true },
            { label: 'Poor feeding / projectile vomit', isHighYield: true },
            { label: 'Finnegan Scoring assessment', isHighYield: true },
            { label: 'Swaddling & Vertical rocking', isHighYield: true },
            { label: 'Pharmacologic: Morphine drops', isHighYield: false },
            { label: 'Seizure monitoring (Safe sleep)', isHighYield: true }
        ],
        description: 'Cues: Recognizing high-pitched cry and jitteriness in NAS.',
        clinicalAnchors: ['High-pitched cry', 'Finnegan Score']
    },

    // --- PHYSIOLOGICAL INTEGRITY ---
    {
        id: 'copd-exacerbation-ngn',
        category: 'Physiological Integrity',
        label: 'Resp: COPD / Emphysema',
        isHighYield: true,
        subTopics: [
            { label: 'Chronic: Pursed-lip breathing', isHighYield: true },
            { label: 'Acute: BiPAP Management', isHighYield: true },
            { label: 'Oxygen Toxicity / Drive', isHighYield: true },
            { label: 'Nutrition: Small freq meals', isHighYield: false },
            { label: 'ABGs: Respiratory Acidosis', isHighYield: true },
            { label: 'Sputum color & Infection', isHighYield: false }
        ],
        description: 'Chronic: Pursed-lip breathing and small frequent meals. Acute: BiPAP management.',
        clinicalAnchors: ['Pursed-lip breathing', 'Respiratory Acidosis']
    },
    {
        id: 'pe-emergency-ngn',
        category: 'Physiological Integrity',
        label: 'Resp: Pulmonary Embolism',
        isHighYield: true,
        subTopics: [
            { label: 'Sudden onset Dyspnea / CP', isHighYield: true },
            { label: 'Triage: High-Fowler priority', isHighYield: true },
            { label: 'D-Dimer vs Spiral CT scan', isHighYield: true },
            { label: 'Heparin GTT titration', isHighYield: true },
            { label: 'Warfarin initiation / Bridge', isHighYield: false },
            { label: 'Fat Embolism vs PE diffs', isHighYield: true }
        ],
        description: 'Sudden onset Dyspnea/CP. High-Flow O2 and Fowler position.',
        clinicalAnchors: ['Sudden onset Dyspnea', 'Heparin titration']
    },
    {
        id: 'pneumothorax-ngn',
        category: 'Physiological Integrity',
        label: 'Resp: Pneumothorax',
        isHighYield: true,
        subTopics: [
            { label: 'Tension: Tracheal Deviation', isHighYield: true },
            { label: 'Chest Tube: Bubbling rules', isHighYield: true },
            { label: 'Water Seal integrity checks', isHighYield: true },
            { label: 'Absent breath sounds signs', isHighYield: false },
            { label: 'Sucking Chest Wound (3 sides)', isHighYield: true },
            { label: 'Crepitus / Sub-Q Emphysema', isHighYield: false }
        ],
        description: 'Tension: Tracheal deviation (late). Chest Tube: Bubbling in water seal (leak).',
        clinicalAnchors: ['Tracheal deviation', 'Continuous bubbling = Leak']
    },
    {
        id: 'ventilator-mgmt-ngn',
        category: 'Physiological Integrity',
        label: 'Resp: Ventilator Management',
        isHighYield: true,
        subTopics: [
            { label: 'Alarms: High Pressure (Bite/Kink)', isHighYield: true },
            { label: 'Alarms: Low Pressure (Disconnect)', isHighYield: true },
            { label: 'VAP Bundle: Oral care Q2', isHighYield: true },
            { label: 'Cuff Pressure monitoring', isHighYield: false },
            { label: 'Weaning Readiness criteria', isHighYield: false },
            { label: 'ET Tube suctioning rules', isHighYield: true }
        ],
        description: 'Alarms: High (Biting/Kink) vs. Low (Disconnect). VAP Bundle rules.',
        clinicalAnchors: ['High pressure alarm', 'Low pressure alarm']
    },
    {
        id: 'heart-failure-ngn',
        category: 'Physiological Integrity',
        label: 'Cardiac: Heart Failure',
        isHighYield: true,
        subTopics: [
            { label: 'Left: Pulmonary Edema / Crackles', isHighYield: true },
            { label: 'Right: JVD / Peripheral Edema', isHighYield: true },
            { label: 'BNP > 100 Lab significance', isHighYield: true },
            { label: 'Furosemide: K+ loss priority', isHighYield: true },
            { label: 'Daily Weights (2lb/day rule)', isHighYield: true },
            { label: 'Digoxin for Contractility', isHighYield: false }
        ],
        description: 'Left (Crackles) vs Right (JVD). BNP > 100. Furosemide K+ monitoring.',
        clinicalAnchors: ['Crackles = Left HF', 'BNP Lab']
    },
    {
        id: 'mi-stemi-ngn',
        category: 'Physiological Integrity',
        label: 'Cardiac: Myocardial Infarction',
        isHighYield: true,
        subTopics: [
            { label: 'Troponin: High specificity lab', isHighYield: true },
            { label: 'MONA Protocol titration', isHighYield: true },
            { label: 'PCI timing (Goal < 90m)', isHighYield: true },
            { label: 'STEMI vs NSTEMI EKG diffs', isHighYield: true },
            { label: 'Post-cath verification (Pedal)', isHighYield: true },
            { label: 'Dressing check / Hematoma', isHighYield: false }
        ],
        description: 'Troponin: High specificity. MONA protocol. PCI Timing (Goal < 90 mins).',
        clinicalAnchors: ['Troponin elevation', 'Goal < 90m PCI']
    },
    {
        id: 'afib-crisis-ngn',
        category: 'Physiological Integrity',
        label: 'Cardiac: Atrial Fibrillation',
        isHighYield: true,
        subTopics: [
            { label: 'Rate Control: Diltiazem/Metop', isHighYield: true },
            { label: 'Rhythm: Cardioversion rules', isHighYield: true },
            { label: 'Clot Risk: Anticoagulation', isHighYield: true },
            { label: 'Pulse Deficit assessment', isHighYield: false },
            { label: 'TEE for Mural Thrombus', isHighYield: true },
            { label: 'CHADS2 Score basics', isHighYield: false }
        ],
        description: 'Rate control vs Rhythm control. Stroke prevention (Thrombus).',
        clinicalAnchors: ['Rhythm vs Rate', 'Stroke risk']
    },
    {
        id: 'dkahhs-emergency-ngn',
        category: 'Physiological Integrity',
        label: 'Endo: Diabetes (DKA / HHS)',
        isHighYield: true,
        subTopics: [
            { label: 'DKA: Kussmaul / Fruity Breath', isHighYield: true },
            { label: 'DKA: Metabolic Acidosis (K+!)', isHighYield: true },
            { label: 'HHS: Severe Dehydration (800+)', isHighYield: true },
            { label: 'Fluid Resuscitation (NS first)', isHighYield: true },
            { label: 'Regular Insulin IV Drip rules', isHighYield: true },
            { label: 'Switch to D5 when BS < 250', isHighYield: true }
        ],
        description: 'DKA: Kussmaul breath, Metabolic Acidosis. HHS: Severe dehydration.',
        clinicalAnchors: ['Kussmaul breathing', 'IV Insulin transition']
    },
    {
        id: 'thyroid-crisis-ngn',
        category: 'Physiological Integrity',
        label: 'Endo: Thyroid Crisis (Storm)',
        isHighYield: true,
        subTopics: [
            { label: 'Hyperthermia & Tachycardia', isHighYield: true },
            { label: 'PTU / Methimazole admin', isHighYield: false },
            { label: 'Iodine Solution rules', isHighYield: false },
            { label: 'Beta Blockers for HR control', isHighYield: true },
            { label: 'Myxedema Coma (Cold/Brady)', isHighYield: true },
            { label: 'Post-Thyroidectomy: Calcium!', isHighYield: true }
        ],
        description: 'Hyperthermia & Tachycardia (Storm) vs Hypothermia/Brady (Myxedema).',
        clinicalAnchors: ['Storm = Heat/Fast', 'Myxedema = Cold/Slow']
    },
    {
        id: 'adrenal-crisis-ngn',
        category: 'Physiological Integrity',
        label: 'Endo: Adrenal Crisis (Addison)',
        isHighYield: true,
        subTopics: [
            { label: 'Hydrocortisone IV emergency', isHighYield: true },
            { label: 'Cues: Hyperkalemia / Hyponatr', isHighYield: true },
            { label: 'Hypotensin / Vascular collapse', isHighYield: true },
            { label: 'Addison: Low Steroids (Tanned)', isHighYield: false },
            { label: 'Cushing: High Steroids (Moon)', isHighYield: false },
            { label: 'Lifelong replacement teaching', isHighYield: true }
        ],
        description: 'Cues: Hyperkalemia, Hyponatremia, Hypotension. Hydrocortisone priority.',
        clinicalAnchors: ['Addisonian Crisis', 'Steroid priority']
    },
    {
        id: 'stroke-acute-ngn',
        category: 'Physiological Integrity',
        label: 'Neuro: Stroke (CVA)',
        isHighYield: true,
        subTopics: [
            { label: 'Ischemic: tPA Window (< 4.5h)', isHighYield: true },
            { label: 'Hemorrhagic: NO Aspirin/Thrombo', isHighYield: true },
            { label: 'Cues: Facial Droop / Slur', isHighYield: true },
            { label: 'NIHSS Scoring importance', isHighYield: true },
            { label: 'Aspiration: NPO till swallow', isHighYield: true },
            { label: 'Left vs Right sided deficits', isHighYield: false }
        ],
        description: 'Ischemic: tPA window (< 4.5h). Hemorrhagic: Blood pressure control.',
        clinicalAnchors: ['tPA Window', 'FACIAL Droop']
    },
    {
        id: 'spinal-cord-ngn',
        category: 'Physiological Integrity',
        label: 'Neuro: Spinal Cord Injury',
        isHighYield: true,
        subTopics: [
            { label: 'Autonomic Dysreflexia (T6+)', isHighYield: true },
            { label: 'Cues: Headache & Severe HTN', isHighYield: true },
            { label: 'Intervention: Bladder/Bowel check', isHighYield: true },
            { label: 'Neurogenic Shock (Bradycardia)', isHighYield: true },
            { label: 'Cervical: Airway / C3-C4-C5', isHighYield: true },
            { label: 'Log-rolling technique', isHighYield: false }
        ],
        description: 'Autonomic Dysreflexia: Bladder/Bowel cause. Neurogenic Shock: Bradycardia.',
        clinicalAnchors: ['Autonomic Dysreflexia', 'Bradycardia = Neurogenic']
    },
    {
        id: 'increased-icp-ngn',
        category: 'Physiological Integrity',
        label: 'Neuro: Increased ICP',
        isHighYield: true,
        subTopics: [
            { label: 'Cushing Triad (Widening Pulse)', isHighYield: true },
            { label: 'Mannitol / Hypertonic Saline', isHighYield: true },
            { label: 'Positioning: HOB 30 (Neutral)', isHighYield: true },
            { label: 'Avoid Clusters of care', isHighYield: true },
            { label: 'Glasgow Coma Scale (GCS)', isHighYield: true },
            { label: 'Pupillary response change', isHighYield: true }
        ],
        description: 'Cushing Triad: Widening pulse pressure + Bradycardia. Mannitol safety.',
        clinicalAnchors: ['Widening pulse pressure', 'Mannitol admin']
    },
    {
        id: 'aki-renal-ngn',
        category: 'Physiological Integrity',
        label: 'Renal: Acute Kidney Injury',
        isHighYield: true,
        subTopics: [
            { label: 'Prerenal: Hypotension / Volume', isHighYield: true },
            { label: 'Intrarenal: Nephrotoxins / Dye', isHighYield: true },
            { label: 'Postrenal: Obstruction / BPH', isHighYield: false },
            { label: 'Hyperkalemia: Kayexalate / D50', isHighYield: true },
            { label: 'Oliguric phase: Fluid restrict', isHighYield: true },
            { label: 'Creatinine: Best indicator', isHighYield: true }
        ],
        description: 'Prerenal (Volume) vs Intrarenal (Toxins). Hyperkalemia management.',
        clinicalAnchors: ['Creatinine elevation', 'Hyperkalemia priority']
    },
    {
        id: 'hemodialysis-ngn',
        category: 'Physiological Integrity',
        label: 'Renal: Hemodialysis',
        isHighYield: true,
        subTopics: [
            { label: 'Fistula: Bruit & Thrill check', isHighYield: true },
            { label: 'No BP / Sticks on fistula arm', isHighYield: true },
            { label: 'Disequilibrium Syndrome', isHighYield: true },
            { label: 'Med Hold: Antihypertensives', isHighYield: true },
            { label: 'Pre-Weights vs Post-Weights', isHighYield: false },
            { label: 'Peritoneal: Cloudy fluid = Sepsis', isHighYield: true }
        ],
        description: 'Fistula: Bruit and Thrill validation. Med Hold: Antihypertensives.',
        clinicalAnchors: ['Bruit/Thrill', 'Cloudy dialysate = Peritonitis']
    },
    {
        id: 'sepsis-shock-ngn',
        category: 'Physiological Integrity',
        label: 'Shock: Septic & Hypovolemic',
        isHighYield: true,
        subTopics: [
            { label: 'Cold Shock vs Warm Shock', isHighYield: true },
            { label: 'Lactate > 4 = Severe Hypoxia', isHighYield: true },
            { label: 'Fluid Resuscitation 30mL/kg', isHighYield: true },
            { label: 'Vasopressors: Map > 65 goal', isHighYield: true },
            { label: 'Early Antibiotic initiation', isHighYield: true },
            { label: 'Blood Cultures first!', isHighYield: true }
        ],
        description: 'Lactate > 4: Severe tissue hypoxia. MAP > 65 goal for vasopressors.',
        clinicalAnchors: ['Lactate level', 'MAP > 65']
    },
    {
        id: 'burns-resuscitation-ngn',
        category: 'Physiological Integrity',
        label: 'Trauma: Burns / Resuscitation',
        isHighYield: true,
        subTopics: [
            { label: 'Parkland Formula calculation', isHighYield: true },
            { label: 'Urine Output: 30-50mL/hr goal', isHighYield: true },
            { label: 'Inhalation Injury (Soot)', isHighYield: true },
            { label: 'Phase: Emergent Hyperkalemia', isHighYield: true },
            { label: 'Infection: Protective Isolation', isHighYield: false },
            { label: 'Rule of Nines assessment', isHighYield: true }
        ],
        description: 'Parkland Formula. Urine Output: 30-50mL/hr (Primary success indicator).',
        clinicalAnchors: ['Urine output 0.5mL/kg', 'Parkland Formula']
    },
    {
        id: 'liver-cirrhosis-ngn',
        category: 'Physiological Integrity',
        label: 'GI: Liver Failure / Cirrhosis',
        isHighYield: true,
        subTopics: [
            { label: 'Ammonia: Lactulose titration', isHighYield: true },
            { label: 'Esophageal Varices bleeding', isHighYield: true },
            { label: 'Ascites: Respiratory distress', isHighYield: true },
            { label: 'Paracentesis: Bladder check', isHighYield: true },
            { label: 'Clotting Factors (PT/INR)', isHighYield: true },
            { label: 'Asterixis / Hand Flapping', isHighYield: true }
        ],
        description: 'Ammonia: Lactulose titration (2-3 soft stools). Varices: Blakemore tube.',
        clinicalAnchors: ['Lactulose stools', 'High Ammonia']
    },
    {
        id: 'blood-react-ngn',
        category: 'Physiological Integrity',
        label: 'Pharm: Blood Reactions',
        isHighYield: true,
        subTopics: [
            { label: 'Hemolytic: Low back pain', isHighYield: true },
            { label: 'STOP Infusion immediately', isHighYield: true },
            { label: 'NS Flush to stay open', isHighYield: true },
            { label: 'Verification (2 RNs) rules', isHighYield: true },
            { label: 'Circulatory Overload (TACO)', isHighYield: true },
            { label: 'Allergic: Diphenhydramine role', isHighYield: false }
        ],
        description: 'Hemolytic: Low back pain/Fever. Action: Stop infusion, return bag to lab.',
        clinicalAnchors: ['Back pain = Hemolytic', 'Stop Infusion']
    },
    {
        id: 'digoxin-tox-ngn',
        category: 'Physiological Integrity',
        label: 'Pharm: Digoxin Toxicity',
        isHighYield: true,
        subTopics: [
            { label: 'Visual: Yellow/Green Halos', isHighYield: true },
            { label: 'GI: Nausea / Anorexia', isHighYield: true },
            { label: 'Apical Pulse (1 full minute)', isHighYield: true },
            { label: 'Hypokalemia increases tox', isHighYield: true },
            { label: 'Level > 2.0 = Toxic', isHighYield: true },
            { label: 'Digibind reverse agent', isHighYield: false }
        ],
        description: 'Visual Halos (Yellow/Green). Apical pulse: Hold if < 60.',
        clinicalAnchors: ['Yellow halos', 'Pulse < 60']
    },
    {
        id: 'lithium-tox-ngn',
        category: 'Physiological Integrity',
        label: 'Pharm: Lithium Toxicity',
        isHighYield: true,
        subTopics: [
            { label: 'Cues: Hand Tremors / Ataxia', isHighYield: true },
            { label: 'Sodium level interaction', isHighYield: true },
            { label: 'Dehydration: Water/Salt intake', isHighYield: true },
            { label: 'Level > 1.5 = Toxic', isHighYield: true },
            { label: 'Interaction with NSAIDs', isHighYield: true },
            { label: 'Thyroid function baseline', isHighYield: false }
        ],
        description: 'Cues: Hand tremors/Ataxia. Sodium depletion = Toxicity.',
        clinicalAnchors: ['Hand tremors', 'Low Sodium = Toxicity']
    },
    {
        id: 'heparin-safety-ngn',
        category: 'Physiological Integrity',
        label: 'Pharm: Anticoagulation Safety',
        isHighYield: true,
        subTopics: [
            { label: 'aPTT titration goals (1.5-2.5x)', isHighYield: true },
            { label: 'HIT: Platelet drop > 50%', isHighYield: true },
            { label: 'Warfarin: INR goals (2-3)', isHighYield: true },
            { label: 'Antidote: Vitamin K / Protamine', isHighYield: true },
            { label: 'Argatroban for HIT patients', isHighYield: true },
            { label: 'Bridging: Heparin to Warfarin', isHighYield: false }
        ],
        description: 'HIT: Platelet drop > 50%. aPTT vs INR monitoring ranges.',
        clinicalAnchors: ['Platelets < 150k (HIT)', 'aPTT Titration']
    },
    {
        id: 'antibiotic-peak-ngn',
        category: 'Physiological Integrity',
        label: 'Pharm: Antibiotic Monitoring',
        isHighYield: true,
        subTopics: [
            { label: 'Vancomycin: Trough goals', isHighYield: true },
            { label: 'Red Man Syndrome vs Allergy', isHighYield: true },
            { label: 'Aminoglycosides: Ototoxicity', isHighYield: true },
            { label: 'Renal: BUN/Creatinine check', isHighYield: true },
            { label: 'Linezolid: Serotonin Syndrome', isHighYield: true },
            { label: 'Cross-Sensitivity (PCN/Ceph)', isHighYield: true }
        ],
        description: 'Trough: Measured 30 mins before dose. Ototoxicity/Nephrotoxicity.',
        clinicalAnchors: ['Trough level', 'Ototoxicity']
    }
];
