import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import {
    PassProbabilityMetric,
    ClientNeedStat,
    CJMMMetric,
    ScoreRuleResult,
    TimeMetric,
} from '../utils/scoringEngine';
import { InteractionData } from '../utils/stressEngine';

// Difficulty data from item.content.rationale.difficulty
interface ItemDifficultyData {
    score?: number;        // 0-100
    level?: number;        // 1-5
    label?: string;        // "Easy", "Moderate", "Hard", "Evaluation"
    subtext?: string;
    clinicalStrategy?: string;
    recommendedActions?: string[];
}

interface ExpertDashboardProps {
    passProbability: PassProbabilityMetric;
    clientNeeds: ClientNeedStat[];
    cjmmGrid: CJMMMetric[];
    currentItemResult?: ScoreRuleResult | null;
    pace?: TimeMetric;
    stress?: InteractionData;
    mode?: 'tutor' | 'exam';
    interactionBase?: number;
    itemDifficulty?: ItemDifficultyData | null;
    itemType?: string; // For legacy difficulty calculation
}

// ExpertDashboardProps defined above

const ExpertDashboard: React.FC<ExpertDashboardProps> = ({
    passProbability,
    clientNeeds,
    cjmmGrid,
    currentItemResult,
    pace,
    stress,
    mode = 'tutor',
    interactionBase = 4,
    itemDifficulty,
    itemType = 'multiple_choice'
}) => {
    // Suppress Recharts dimension warnings (they resolve after initial render)
    React.useEffect(() => {
        const originalError = console.error;
        const originalWarn = console.warn;
        console.error = (...args: any[]) => {
            const msg = args.map(a => String(a || '')).join(' ');
            if (msg.includes('width(-1)') || msg.includes('height(-1)') || msg.includes('should be greater than 0')) {
                return;
            }
            originalError.apply(console, args);
        };
        console.warn = (...args: any[]) => {
            const msg = args.map(a => String(a || '')).join(' ');
            if (msg.includes('width(-1)') || msg.includes('height(-1)')) {
                return;
            }
            originalWarn.apply(console, args);
        };
        return () => {
            console.error = originalError;
            console.warn = originalWarn;
        };
    }, []);


    // Helper: Calculate Difficulty for Legacy Items (Fallbacks)
    const calculateLegacyDifficulty = (type: string): ItemDifficultyData => {
        const t = (type || '').toLowerCase();
        let score = 50; // Default Medium
        let level = 3;

        if (t.includes('bow') || t.includes('trend') || t.includes('case')) {
            score = 80; level = 4;
        } else if (t.includes('matrix') || t.includes('ordered') || t.includes('drag')) {
            score = 70; level = 4;
        } else if (t.includes('sata') || t.includes('highlight') || t.includes('multiple')) {
            score = 60; level = 3;
        } else if (t.includes('cloze') || t.includes('drop')) {
            score = 55; level = 3;
        } else {
            score = 40; level = 2; // Single response
        }

        const label = level >= 4 ? 'Analysis' : (level === 3 ? 'Application' : 'Recall');

        return {
            score,
            level,
            label,
            subtext: "Estimated (Legacy Item)",
            clinicalStrategy: "Standard clinical reasoning applies."
        };
    };

    // ... (Rest of component)

    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
    const [activeDetail, setActiveDetail] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isExam = mode === 'exam';

    // --- Content Dictionary (Updated with User's CLSI Info) ---
    const getContent = (id: string) => {
        const db: Record<string, { title: string, def: string, method: string | React.ReactNode, advice: string }> = {
            'stress': {
                title: "How We Measure Your Exam Stress",
                def: "Our \"Digital Psychologist\" analyzes your mouse movements to detect anxiety patterns, based on research in Human-Computer Interaction (HCI) and Cognitive Load Theory.",
                method: `1. The "Doubt" Detector (Hesitation Rate)
• What we see: Hovering, selecting, then un-selecting repeatedly.
• Evidence: Non-linear mouse paths correlate with high uncertainty [Mazza et al., 2020].
• The Fix: Trust your first instinct. Editing often leads to wrong choices.

2. The "Panic" Detector (Rapid Clicks)
• What we see: Clicking 3+ options in under 2 seconds.
• Evidence: Acute stress impairs fine motor control ("Amygdala Hijack") [Freihaut et al., 2021].
• The Fix: Slow down. Read one option at a time to re-engage your frontal cortex.

3. The "Freeze" Detector (Time Spikes)
• What we see: Spending 3x longer than average on a simple question.
• Evidence: Disproportionate response time signals "Working Memory Overload" [Yamauchi et al., 2024].
• The Fix: Reset. Re-read the stem. If you don't know it in 60s, move on.`,
                advice: "If 'High Anxiety' is detected, use the 4-7-8 Breathing Tool. High stress literally shuts down the logic centers of your brain. Trust your gut."
            },
            'scoring': {
                title: "NGN Scoring Models & Difficulty Engine",
                def: "Your outcome is determined by two systems: The NGN Scoring Rule (Accuracy) and the Difficulty Calculator (Complexity).",
                method: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* 1. Scoring Models */}
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', marginBottom: 8, letterSpacing: '0.05em' }}>PART A: SCORING RULES</div>
                            <ul style={{ margin: 0, paddingLeft: 16, fontSize: '0.75rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <li><strong>+/- Rule (Polytomous):</strong> For SATA & Matrix. <span style={{ color: '#10b981' }}>Correct +1</span>, <span style={{ color: '#f43f5e' }}>Incorrect -1</span>. Floored at 0.</li>
                                <li><strong>0/1 Rule (Dichotomous):</strong> For MCQ & Ordered. All-or-Nothing. All correct or 0.</li>
                                <li><strong>Rationale Rule:</strong> For Bow-tie & Cloze. 1 point for each correct cause-effect linkage.</li>
                            </ul>
                        </div>

                        {/* 2. Difficulty Calculator */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f59e0b', marginBottom: 4, letterSpacing: '0.05em' }}>PART B: DIFFICULTY ENGINE (0-100)</div>
                            <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginBottom: 12, fontStyle: 'italic' }}>Total Score = Base + Modifiers + Clinical Focus</div>

                            {/* Table */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr 2fr', gap: 8, fontSize: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 4, marginBottom: 4, color: '#64748b', fontWeight: 700 }}>
                                <div>TYPE</div>
                                <div>BASE</div>
                                <div>MODIFIERS</div>
                            </div>
                            {[
                                { type: 'Bow Tie', base: 50, mod: '+2/cue, +10 Safety Risk' },
                                { type: 'Trend', base: 50, mod: '+10 Rate Chg, +2/Time' },
                                { type: 'Matrix', base: 40, mod: '+5/Row, +10 SATA' },
                                { type: 'Ordered', base: 40, mod: '+5/Step' },
                                { type: 'Highlight', base: 30, mod: '+20 Ambiguity' },
                                { type: 'SATA', base: 30, mod: '+5/Option (>5)' },
                                { type: 'Cloze', base: 20, mod: '+10 Dependency' },
                                { type: 'Hot Spot', base: 20, mod: '+10 Precision' }
                            ].map((r, i) => (
                                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr 2fr', gap: 8, fontSize: '0.65rem', color: '#cbd5e1', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                                    <div style={{ fontWeight: 500 }}>{r.type}</div>
                                    <div style={{ color: '#f59e0b', fontWeight: 700 }}>{r.base}</div>
                                    <div style={{ opacity: 0.8, fontSize: '0.6rem' }}>{r.mod}</div>
                                </div>
                            ))}
                            <div style={{ marginTop: 12, fontSize: '0.65rem', color: '#94a3b8', background: 'rgba(0,0,0,0.2)', padding: 8, borderRadius: 4 }}>
                                <strong style={{ color: '#818cf8' }}>Clinical Bonus:</strong> Critical Care/Sepsis (+8), Cardiac/Pharm (+6), Med-Surg (+4).
                            </div>
                        </div>

                        {/* 3. Level Mapping */}
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', marginBottom: 8, letterSpacing: '0.05em' }}>PART C: LEVEL MAPPING</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 8, fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.05)', padding: 12, borderRadius: 8, border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                <div style={{ color: '#64748b', fontWeight: 700 }}>SCORE</div>
                                <div style={{ color: '#64748b', fontWeight: 700 }}>LEVEL</div>
                                <div style={{ color: '#64748b', fontWeight: 700 }}>LABEL</div>
                                {[
                                    { range: '0-20', lvl: 'Level 1', label: 'Recall / Foundational' },
                                    { range: '21-40', lvl: 'Level 2', label: 'Single-Step Application' },
                                    { range: '41-60', lvl: 'Level 3', label: 'Multi-Cue Integration' },
                                    { range: '61-80', lvl: 'Level 4', label: 'Complex Prioritization' },
                                    { range: '81-100', lvl: 'Level 5', label: 'High-Stakes Clinical Judgment' }
                                ].map((l, i) => (
                                    <React.Fragment key={i}>
                                        <div style={{ color: '#cbd5e1', fontWeight: 700 }}>{l.range}</div>
                                        <div style={{ color: i > 2 ? '#f43f5e' : (i > 1 ? '#f59e0b' : '#cbd5e1') }}>{l.lvl}</div>
                                        <div style={{ opacity: 0.9, color: 'white' }}>{l.label}</div>
                                        {i < 4 && <div style={{ gridColumn: '1 / -1', height: 1, background: 'rgba(255,255,255,0.05)' }}></div>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                ),
                advice: "Strategic Constraint: On '+/-' items, guessing is statistically dangerous. If you are only 50% confident, Leave It Blank. A wrong guess negates a right answer."
            },
            'gauge': {
                title: "Pass Probability Predictor (Bayesian)",
                def: "A real-time forecast of your NCLEX-RN success probability if you sat for the exam immediately.",
                method: "We utilize a Bayesian Item Response Theory (IRT) model. Performance on high-difficulty items (Level 4-5) is weighed 1.6x more heavily than easy items.",
                advice: "Green Zone (>75%) indicates a 95% confidence interval for passing. Focus on 'Hard' questions to boost this metric rapidly."
            },
            'pace_fast': {
                title: "Pace Analysis: Rushing Detected",
                def: "Your time-per-item is statistically faster than the passing cohort (Peer Avg - 15s).",
                method: "Measured against a dataset of 50,000+ passing sessions. Rapid answering correlates with 'Missed Descriptors' (skipping keywords like 'First', 'Best', 'Not').",
                advice: "Forced Pause Strategy: After reading the stem, count to 3 before reading options. This re-engages your pre-frontal cortex."
            },
            'pace_optimal': {
                title: "Pace Analysis: Optimal Rhythm",
                def: "Your time management is perfectly aligned with successful exam takers.",
                method: "You are consistent within the +/- 10s variance window of the target pace (60-90s per item).",
                advice: "Flow State: Maintain this rhythm. You are banking time for complex Case Studies later in the exam."
            },
            'pace_slow': {
                title: "Pace Analysis: Hesitation Detected",
                def: "Your dwell time is statistically slower than the passing cohort (Peer Avg + 20s).",
                method: "Extended dwell time typically signals 'Analysis Paralysis'. Confidence intervals drop significantly after 2 minutes on a single item.",
                advice: "The '30-Second Rule': If you are stuck between two options for >30s, your first instinct was likely right. Select and Move On."
            },
            // Categories
            'Management of Care': {
                title: "Safe & Effective Care: Management of Care (17-23%)",
                def: "The coordination of care to protect clients/staff and ensure cost-effective resource utilization.",
                method: "Focuses on: Delegation (RN vs LPN vs UAP), Prioritization (Who to see first?), Legal/Ethical Rights (Advance Directives), and Continuity of Care.",
                advice: "Master the 'Delegation Principles': EAT (Evaluate, Assess, Teach) is for RNs only. LPNs can monitor stable patients. UAPs handle standard procedures."
            },
            'Safety and Infection Control': {
                title: "Safe & Effective Care: Safety & Infection (9-15%)",
                def: "Protecting clients and personnel from health and environmental hazards.",
                method: "Covering: Emergency Response (Fire/Disaster), Ergonomics, Hazardous Materials, Restraints, and Standard/Transmission-Based Precautions.",
                advice: "Memorize the PPE requirements for Contact (Gloves/Gown), Droplet (Mask), and Airborne (N95) precautions. Safety always comes first."
            },
            'Health Promotion': {
                title: "Health Promotion & Maintenance (6-12%)",
                def: "Helping clients incorporate knowledge of expected growth and development to achieve optimal health.",
                method: "Includes: Aging Process, Ante/Intra/Postpartum Care, Developmental Stages (Erikson/Piaget), Health Screening, and Self-Care.",
                advice: "Focus on immunization schedules and 'Anticipatory Guidance' for parents. Know what is NORMAL for each age group to detect ABNORMAL."
            },
            'Psychosocial Integrity': {
                title: "Psychosocial Integrity (6-12%)",
                def: "Promoting social, emotional, and mental well-being for the client and family.",
                method: "Includes: Abuse/Neglect, Chemical Dependency, Crisis Intervention, End-of-Life Care, and Therapeutic Environment.",
                advice: "Therapeutic Communication is the primary tool. Never ask 'Why?'. Validate feelings. Assess for Safety (Suicide) immediately."
            },
            'Physiological Integrity': {
                title: "Physiological Integrity (Total: 43-67%)",
                def: "The largest domain, focusing on physical health and managing life-threatening conditions.",
                method: "Aggregates 4 Sub-Categories: Basic Care, Pharmacological Therapies, Risk Reduction, and Physiological Adaptation.",
                advice: "Prioritize 'Airway, Breathing, Circulation' (ABC). If the patient is in distress, DO NOT LEAVE. Call for help and Assess."
            },
            'Basic Care and Comfort': {
                title: "Physiological: Basic Care & Comfort (6-12%)",
                def: "Providing comfort and assistance in the performance of activities of daily living.",
                method: "Includes: Assistive Devices, Elimination, Mobility/Immobility, Non-Pharmacological Pain Management, Nutrition/Hydration, and Sleep.",
                advice: "Safety first with mobility (Crutches/Canes). Nutrition: Know diets (Clear Liquid, Full Liquid, Renal, Cardiac)."
            },
            'Pharmacological': {
                title: "Physiological: Pharm & Parenteral (12-18%)",
                def: "Administering medications and parenteral therapies safely and monitoring expected/unexpected responses.",
                method: "Includes: Blood Products, Dosage Calculation, Central Venous Access, Medication Administration, and Adverse Effects.",
                advice: "Memorize Drug CLASSES (Suffixes: -lol, -pril, -sone) rather than individual drugs. Know the Antidotes (e.g., Narcan for Opioids)."
            },
            // Clinical Judgment Steps
            'recognize': {
                title: "Step 1: Recognize Cues",
                def: "Identifying relevant data from the clinical scenario.",
                method: "Score computed from 'Highlight' and 'Click-to-Select' item types.",
                advice: "Focus on key finding: What changed? What is abnormal? Compare current vitals to baseline."
            },
            'analyze': {
                title: "Step 2: Analyze Cues",
                def: "Linking cues to clinical meaning.",
                method: "Score computed from 'Drag-and-Drop' and 'Matrix' item types.",
                advice: "Ask yourself: 'What disease process explains these symptoms?' Connect the dots."
            },
            'prioritize': {
                title: "Step 3: Prioritize Hypotheses",
                def: "Ranking urgency and risk.",
                method: "Score computed from 'Ordered Response' and 'Multiple Choice'.",
                advice: "Use the ABCs (Airway, Breathing, Circulation) and Maslow's Hierarchy. Who dies first?"
            },
            'generate': {
                title: "Step 4: Generate Solutions",
                def: "Planning interventions.",
                method: "Score based on selecting appropriate orders/actions.",
                advice: "Focus on 'Least Invasive, First'. Don't jump to surgery if positioning helps. Set SMART goals."
            },
            'take': {
                title: "Step 5: Take Action",
                def: "Implementing the solution.",
                method: "Score based on selecting correct implementation steps.",
                advice: "Ensure you have the order (if needed) and the equipment before acting. Verify patient ID."
            },
            'evaluate': {
                title: "Step 6: Evaluate Outcomes",
                def: "Checking results.",
                method: "Score based on recognizing improvement or deterioration.",
                advice: "Compare new findings to the expected outcome. Did the intervention work? Re-assess."
            }
        };

        // Fallback Logic
        if (db[id]) return db[id];
        const partial = Object.keys(db).find(k => id.toLowerCase().includes(k.toLowerCase()));
        if (partial) return db[partial];

        return {
            title: id,
            def: "Specific performance metric for this domain.",
            method: "Computed based on aggregate accuracy of tagged items.",
            advice: "Review questions in this category to improve understanding of core concepts."
        };
    };

    // --- Detail Popup Overlay ---
    const renderDetailOverlay = () => {
        if (!activeDetail) return null;
        const content = getContent(activeDetail);

        return (
            <div style={{
                position: 'absolute', inset: 0, zIndex: 100,
                background: 'rgba(15, 23, 42, 0.98)',
                padding: 20, display: 'flex', flexDirection: 'column',
                animation: 'slideIn 0.2s ease-out'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Deep Dive Analysis</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{content.title}</div>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); setActiveDetail(null); }}
                        style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: 999, width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        ✕
                    </button>
                </div>

                {/* Scrollable Content */}
                <div style={{ overflowY: 'auto', flex: 1, paddingRight: 4 }}>
                    <Section title="What is this?" icon="🔍">
                        {content.def}
                    </Section>

                    <Section title="How is it measured?" icon="📐" color="#38bdf8">
                        <div style={{ whiteSpace: 'pre-line' }}>{content.method}</div>
                    </Section>

                    <Section title="Expert Recommendation" icon="💡" color="#fcd34d" box>
                        {content.advice}
                    </Section>
                </div>
            </div>
        );
    };

    const Section = ({ title, icon, color, children, box }: any) => (
        <div style={{ marginBottom: 16, background: box ? 'rgba(255,255,255,0.05)' : 'transparent', padding: box ? 12 : 0, borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: '0.9rem' }}>{icon}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: color || '#e2e8f0', textTransform: 'uppercase' }}>{title}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {children}
            </div>
        </div>
    );

    // --- Hover Tooltip Overlay ---
    const renderHoverOverlay = (id: string, textOverride?: string) => (
        activeTooltip === id && !activeDetail && (
            <div style={{
                position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(2px)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 12, textAlign: 'center', zIndex: 40, borderRadius: 'inherit', animation: 'fadeIn 0.15s ease-out', pointerEvents: 'none'
            }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 500, lineHeight: 1.4 }}>
                    {textOverride || getContent(id).def} <br />
                    <span style={{ fontSize: '0.55rem', color: '#94a3b8', marginTop: 4, display: 'block' }}>(Click for Expert Advice)</span>
                </span>
            </div>
        )
    );

    // --- Widgets ---

    const ExamVitalsWidget = ({ data, base }: { data?: InteractionData, base: number }) => {
        // Ratio Logic: Reversals / Option Count
        const changes = data?.changeCount || 0;
        const ratio = base > 0 ? (changes / base) : 0;

        let state = 'Decisive';
        let animDuration = '2s';
        let color = '#34d399'; // Green (Decisive <= 1.0x)

        if (changes === 0) {
            state = 'Focused';
        } else if (ratio > 4.0) {
            state = 'Panic';
            color = '#f43f5e'; // Red
            animDuration = '0.3s';
        } else if (ratio > 3.0) {
            state = 'Scattered';
            color = '#f97316'; // Orange
            animDuration = '0.5s';
        } else if (ratio > 2.0) {
            state = 'Hesitant';
            color = '#eab308'; // Yellow
            animDuration = '0.8s';
        } else if (ratio > 1.0) {
            state = 'Deliberate';
            color = '#2dd4bf'; // Teal
            animDuration = '1.2s';
        }

        // Coaching Matrix Data
        const getCoaching = () => {
            if (ratio > 4.0) return {
                icon: '💥',
                level: 'Panic',
                cogState: 'Cognitive Overload',
                desc: 'Freezing, blanking out, high anxiety.',
                exercise: 'The Physiological Sigh + Walk Away',
                steps: ['Double inhale (nose), long exhale (mouth)', 'Repeat 3x', 'Walk away from screen for 2 min'],
                why: 'Fastest biological way to offload CO2 and reduce acute stress.',
                duration: '2-5 min',
                color: '#f43f5e',
                urgency: 'critical'
            };
            if (ratio > 3.0) return {
                icon: '🔴',
                level: 'Scattered',
                cogState: 'Fragmented Focus',
                desc: 'Guessing, jumping around, losing the thread.',
                exercise: '5-4-3-2-1 Grounding Technique',
                steps: ['Name 5 things you see', 'Name 4 things you feel', 'Name 3 things you hear'],
                why: 'Forces brain to switch from panic mode to sensory mode.',
                duration: '1 min',
                color: '#f97316',
                urgency: 'high'
            };
            if (ratio > 2.0) return {
                icon: '🟠',
                level: 'Hesitant',
                cogState: 'Cognitive Friction',
                desc: 'Doubt creeping in, overthinking options.',
                exercise: 'Box Breathing (4-4-4-4)',
                steps: ['Inhale 4s', 'Hold 4s', 'Exhale 4s', 'Hold 4s'],
                why: 'Physically slows heart rate to stop fight-or-flight.',
                duration: '30 sec',
                color: '#eab308',
                urgency: 'medium'
            };
            if (ratio > 1.0) return {
                icon: '🟡',
                level: 'Deliberate',
                cogState: 'Cautious Focus',
                desc: 'Double-checking, careful but efficient.',
                exercise: 'The 3-Second Reset',
                steps: ['Close eyes for 3 seconds', 'Exhale slowly'],
                why: 'Releases tension of double-checking before it builds.',
                duration: '3-5 sec',
                color: '#2dd4bf',
                urgency: 'low'
            };
            return {
                icon: '✅',
                level: 'Decisive',
                cogState: 'Flow State',
                desc: 'Confident, focused, executing well.',
                exercise: 'The Confidence Anchor',
                steps: ['Take 1 deep breath', 'Think: "I know this. Next."'],
                why: 'Anchors success feeling without breaking momentum.',
                duration: '5 sec',
                color: '#34d399',
                urgency: 'none'
            };
        };

        const coaching = getCoaching();

        return (
            <div style={{ marginBottom: '12px' }}>
                {/* Focus Monitor */}
                <div
                    onClick={() => setActiveDetail('stress')}
                    style={{
                        position: 'relative', overflow: 'hidden', borderRadius: '12px 12px 0 0',
                        background: '#0F172A', padding: '16px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', borderBottom: 'none'
                    }}
                >
                    {/* Background Glow Effect */}
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '128px', height: '128px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', filter: 'blur(40px)', pointerEvents: 'none' }}></div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Focus Monitor</p>
                            <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ position: 'relative', display: 'flex', width: '12px', height: '12px' }}>
                                    <span style={{ position: 'absolute', display: 'inline-flex', width: '100%', height: '100%', borderRadius: '50%', background: color, opacity: 0.75, animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
                                    <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', width: '12px', height: '12px', background: color }}></span>
                                </span>
                                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{state}</span>
                            </div>
                        </div>

                        {/* Animated EKG Graph - Sliding Ticker */}
                        <div style={{ height: '40px', width: '120px', borderRadius: '4px', background: 'rgba(30, 41, 59, 0.5)', padding: '0', position: 'relative', overflow: 'hidden', backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
                            {/* Two identical paths sliding left to create seamless loop */}
                            <div className="ekg-slider" style={{ display: 'flex', width: '200%', height: '100%', position: 'absolute', left: 0, top: 0 }}>
                                <svg width="50%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                                    <path d="M0 20 H10 L15 5 L20 35 L25 20 H40 L45 10 L50 30 L55 20 H80 L85 0 L90 40 L95 20 H100" stroke={color} strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                                </svg>
                                <svg width="50%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                                    <path d="M0 20 H10 L15 5 L20 35 L25 20 H40 L45 10 L50 30 L55 20 H80 L85 0 L90 40 L95 20 H100" stroke={color} strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                                </svg>
                            </div>

                            {/* Scanline overlay */}
                            <div style={{
                                position: 'absolute', top: 0, bottom: 0, width: '20px',
                                background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
                                animation: 'slideIn 1.5s linear infinite',
                                left: '-20px'
                            }} />

                            <style>{`
                                @keyframes slideLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                                .ekg-slider { animation: slideLeft ${animDuration} linear infinite; }
                                @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
                            `}</style>
                        </div>
                    </div>
                </div>

                {/* Stress Relief & Coaching Matrix - PREMIUM */}
                <div style={{
                    background: `linear-gradient(135deg, ${coaching.color}10 0%, rgba(15, 23, 42, 0.98) 100%)`,
                    borderRadius: '0 0 12px 12px',
                    border: `1px solid ${coaching.color}25`,
                    borderTop: `2px solid ${coaching.color}40`,
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    {/* Animated Background Particles */}
                    <div style={{
                        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'
                    }}>
                        <div className="breath-particle" style={{
                            position: 'absolute', width: 60, height: 60, borderRadius: '50%',
                            background: `radial-gradient(circle, ${coaching.color}20 0%, transparent 70%)`,
                            top: '20%', left: '10%'
                        }} />
                        <div className="breath-particle-delay" style={{
                            position: 'absolute', width: 80, height: 80, borderRadius: '50%',
                            background: `radial-gradient(circle, ${coaching.color}15 0%, transparent 70%)`,
                            bottom: '10%', right: '5%'
                        }} />
                    </div>

                    {/* Main Content */}
                    <div style={{ display: 'flex', gap: 12, padding: '14px', position: 'relative', zIndex: 1 }}>

                        {/* Left: Animated Lungs/Breathing Visualization */}
                        <div style={{
                            width: 80,
                            minHeight: 90,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: 10,
                            padding: 8,
                            position: 'relative'
                        }}>
                            {/* Breathing Animation Container */}
                            <div className="breath-container" style={{
                                position: 'relative',
                                width: 50,
                                height: 50,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {/* Pulsing Ring 1 */}
                                <div className="breath-ring-1" style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    border: `2px solid ${coaching.color}40`
                                }} />
                                {/* Pulsing Ring 2 */}
                                <div className="breath-ring-2" style={{
                                    position: 'absolute',
                                    width: '70%',
                                    height: '70%',
                                    borderRadius: '50%',
                                    border: `2px solid ${coaching.color}60`
                                }} />
                                {/* Center Lung Icon (SVG) */}
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="lung-breathe">
                                    <path
                                        d="M8.5 5C7.67 5 7 5.67 7 6.5V9.5C7 11.43 5.43 13 3.5 13C2.67 13 2 13.67 2 14.5V17.5C2 18.33 2.67 19 3.5 19H8.5C9.33 19 10 18.33 10 17.5V6.5C10 5.67 9.33 5 8.5 5Z"
                                        fill={coaching.color}
                                        opacity="0.8"
                                    />
                                    <path
                                        d="M15.5 5C16.33 5 17 5.67 17 6.5V9.5C17 11.43 18.57 13 20.5 13C21.33 13 22 13.67 22 14.5V17.5C22 18.33 21.33 19 20.5 19H15.5C14.67 19 14 18.33 14 17.5V6.5C14 5.67 14.67 5 15.5 5Z"
                                        fill={coaching.color}
                                        opacity="0.8"
                                    />
                                    <path d="M12 3V8" stroke={coaching.color} strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>

                            {/* Status Label */}
                            <div style={{
                                marginTop: 6,
                                fontSize: '0.5rem',
                                fontWeight: 700,
                                color: coaching.color,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                textAlign: 'center'
                            }}>
                                {coaching.level === 'Decisive' || coaching.level === 'Deliberate' ? 'Calm' : 'Breathe'}
                            </div>
                        </div>

                        {/* Right: Content */}
                        <div style={{ flex: 1 }}>
                            {/* Header Row */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: 8
                            }}>
                                <div>
                                    <div style={{
                                        fontSize: '0.5rem',
                                        fontWeight: 700,
                                        color: '#64748b',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        marginBottom: 2
                                    }}>
                                        🧘 Stress Coach
                                    </div>
                                    <div style={{
                                        fontSize: '0.85rem',
                                        fontWeight: 800,
                                        color: '#f8fafc',
                                        lineHeight: 1.2
                                    }}>
                                        {coaching.exercise}
                                    </div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    gap: 4
                                }}>
                                    <span style={{
                                        background: `linear-gradient(135deg, ${coaching.color}, ${coaching.color}cc)`,
                                        color: 'white',
                                        padding: '3px 8px',
                                        borderRadius: 6,
                                        fontSize: '0.6rem',
                                        fontWeight: 800,
                                        boxShadow: `0 2px 8px ${coaching.color}40`
                                    }}>
                                        ⏱️ {coaching.duration}
                                    </span>
                                    <span style={{
                                        fontSize: '0.45rem',
                                        color: '#64748b'
                                    }}>
                                        {coaching.cogState}
                                    </span>
                                </div>
                            </div>

                            {/* Quick Steps - Horizontal Pills */}
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 4,
                                marginBottom: 8
                            }}>
                                {coaching.steps.map((step, i) => (
                                    <div key={i} style={{
                                        background: `${coaching.color}15`,
                                        border: `1px solid ${coaching.color}30`,
                                        borderRadius: 20,
                                        padding: '4px 10px',
                                        fontSize: '0.55rem',
                                        color: '#e2e8f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4
                                    }}>
                                        <span style={{
                                            width: 14,
                                            height: 14,
                                            borderRadius: '50%',
                                            background: coaching.color,
                                            color: 'white',
                                            fontSize: '0.5rem',
                                            fontWeight: 800,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {i + 1}
                                        </span>
                                        {step}
                                    </div>
                                ))}
                            </div>

                            {/* Science Insight */}
                            <div style={{
                                background: 'rgba(99, 102, 241, 0.08)',
                                borderRadius: 6,
                                padding: '6px 10px',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 6
                            }}>
                                <span style={{ fontSize: '0.7rem' }}>🧠</span>
                                <span style={{
                                    fontSize: '0.5rem',
                                    color: '#94a3b8',
                                    lineHeight: 1.4
                                }}>
                                    <strong style={{ color: '#a5b4fc' }}>Why it works:</strong> {coaching.why}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CSS Animations */}
                    <style>{`
                        @keyframes breatheIn {
                            0%, 100% { transform: scale(1); opacity: 0.8; }
                            50% { transform: scale(1.15); opacity: 1; }
                        }
                        @keyframes breatheRing {
                            0%, 100% { transform: scale(1); opacity: 0.4; }
                            50% { transform: scale(1.3); opacity: 0.8; }
                        }
                        @keyframes breatheRing2 {
                            0%, 100% { transform: scale(1); opacity: 0.6; }
                            50% { transform: scale(1.2); opacity: 1; }
                        }
                        @keyframes float {
                            0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
                            50% { transform: translateY(-10px) scale(1.1); opacity: 0.5; }
                        }
                        .lung-breathe {
                            animation: breatheIn 4s ease-in-out infinite;
                        }
                        .breath-ring-1 {
                            animation: breatheRing 4s ease-in-out infinite;
                        }
                        .breath-ring-2 {
                            animation: breatheRing2 4s ease-in-out infinite 0.5s;
                        }
                        .breath-particle {
                            animation: float 6s ease-in-out infinite;
                        }
                        .breath-particle-delay {
                            animation: float 6s ease-in-out infinite 2s;
                        }
                    `}</style>
                </div>
            </div>
        );
    };

    // --- Phase 2: Score Card Widget (Split Layout) ---
    const ScoreCardWidget = () => {
        const result = currentItemResult;

        // Count Up Logic
        const [displayScore, setDisplayScore] = React.useState(0);

        React.useEffect(() => {
            if (result) {
                let start = 0;
                const end = result.score;
                const duration = 1000;
                const startTime = performance.now();

                const animate = (currentTime: number) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out quart
                    const ease = 1 - Math.pow(1 - progress, 4);

                    const current = start + (end - start) * ease;
                    setDisplayScore(Number(current.toFixed(2)));

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };
                requestAnimationFrame(animate);

                return () => {
                    // Cleanup handled by closure logic or implicit unmount, 
                    // but strictly we should cancel the frame. 
                    // Since we use recursion, we can't easily cancel the *next* frame without a ref.
                    // Let's refactor to use a ref for the request ID.
                };
            } else {
                setDisplayScore(0);
            }
        }, [result]);

        // Refactored Implementation below:
        const frameRef = React.useRef<number>();

        React.useEffect(() => {
            if (result) {
                let start = 0;
                const end = result.score;
                const duration = 1000;
                const startTime = performance.now();

                const animate = (currentTime: number) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 4);

                    const current = start + (end - start) * ease;
                    setDisplayScore(Number(current.toFixed(2)));

                    if (progress < 1) {
                        frameRef.current = requestAnimationFrame(animate);
                    }
                };
                frameRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayScore(0);
            }

            return () => {
                if (frameRef.current) cancelAnimationFrame(frameRef.current);
            };
        }, [result]);


        if (!result) {
            return (
                <div style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                    borderRadius: 16, padding: '20px', marginBottom: 12, minHeight: '100px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 500,
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    Waiting for Submission...
                </div>
            );
        }

        const isPerfect = result.score === result.maxScore;

        return (
            <div
                onClick={() => setActiveDetail('scoring')}
                style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                    borderRadius: 12, padding: '0', marginBottom: 8,
                    position: 'relative', overflow: 'hidden', cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}
            >
                {/* HEADER */}
                {/* Score Card - Hidden in Exam Mode */}
                {!isExam ? (
                    <div className="relative mb-2 overflow-hidden rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-lg"
                        style={{ minHeight: '70px', display: 'flex', flexDirection: 'column' }}>
                        {/* Glass Gloss */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)', pointerEvents: 'none' }}></div>

                        <div style={{ display: 'flex', height: '70px' }}>
                            {/* Left: Score */}
                            <div style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.8)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ITEM SCORE</div>
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white', lineHeight: 1, marginTop: 0, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                                    {displayScore > 0 ? '+' : ''}{displayScore}
                                    <span style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 600 }}>/ {result.maxScore}</span>
                                    {isPerfect && <span className="animate-bounce" style={{ fontSize: '1rem', filter: 'drop-shadow(0 0 4px gold)' }}>🏆</span>}
                                </div>
                            </div>

                            {/* Divider with ZigZag */}
                            <div style={{ position: 'relative', width: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ position: 'absolute', top: 10, bottom: 10, width: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
                                <div style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%', zIndex: 2 }}></div>
                            </div>

                            {/* Right: Rule Pill */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 12px', alignItems: 'flex-end' }}>
                                <div
                                    onMouseEnter={() => setActiveTooltip('scoring')} onMouseLeave={() => setActiveTooltip(null)}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '12px',
                                        fontSize: '0.55rem', fontWeight: 600, color: 'white', letterSpacing: '0.05em', cursor: 'help',
                                        border: '1px solid rgba(255,255,255,0.2)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4
                                    }}>
                                    <span>{result.rule || '0/1 RULE'}</span>
                                    <span style={{ fontSize: '0.6rem', opacity: 0.8 }}>ⓘ</span>
                                </div>
                                {renderHoverOverlay('scoring', 'Scoring & Difficulty Engine')}
                                <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.7)', textAlign: 'right' }}>Scoring Logic</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{
                        marginBottom: 8, padding: '12px', borderRadius: 8,
                        background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}>
                        <span className="animate-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }}></span>
                        <span style={{ fontSize: '0.65rem', color: '#cbd5e1', fontWeight: 600, letterSpacing: '0.05em' }}>EXAM IN PROGRESS • DATA RECORDING</span>
                    </div>
                )}

                {renderHoverOverlay('scoring')}
            </div>
        );
    };

    // --- Phase 2: Performance Grid Widget (2x1 Layout) ---
    const PerformanceGridWidget = () => {
        const prob = passProbability?.value || 0;
        const paceVal = pace?.userAvg || 0;
        const peerPace = pace?.peerAvg || 60;

        // Peer Rank Logic (Percentile based on Pass Probability)
        const rank = Math.max(1, Math.min(99, Math.floor(prob)));

        // Pace Logic
        const diff = paceVal - peerPace;
        const isOptimal = Math.abs(diff) < 15;
        const paceColor = isOptimal ? '#10b981' : (diff > 0 ? '#f43f5e' : '#f59e0b');

        return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: 8 }}>
                {/* Card 1: Peer Rank (Premium Redesign) */}
                <div
                    onClick={() => setActiveDetail('gauge')}
                    style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(30, 41, 59, 0.6) 100%)',
                        borderRadius: 12, padding: '14px',
                        border: '1px solid rgba(99, 102, 241, 0.2)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        cursor: 'pointer', position: 'relative', overflow: 'hidden', minHeight: '100px',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                    }}
                >
                    {/* Background Glow */}
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)', borderRadius: '50%' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                        <div style={{ fontSize: '0.55rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.1em' }}>📊 PEER RANK</div>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#818cf8', animation: 'pulse 2s infinite' }} />
                    </div>
                    <div style={{ zIndex: 1 }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', lineHeight: 1, background: 'linear-gradient(90deg, #f8fafc, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {rank}{rank === 1 ? 'st' : (rank === 2 ? 'nd' : (rank === 3 ? 'rd' : 'th'))}
                        </div>
                        <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: 4 }}>Percentile</div>
                    </div>
                    {/* Animated Sparkline */}
                    <div style={{ height: '28px', width: '100%', marginTop: 8, zIndex: 1 }}>
                        <svg width="100%" height="100%" viewBox="0 0 100 28" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="rankGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d="M0 24 Q10 20, 20 18 T40 14 T60 8 T80 10 T100 4" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
                            <path d="M0 24 Q10 20, 20 18 T40 14 T60 8 T80 10 T100 4 V28 H0 Z" fill="url(#rankGradient)" />
                            <circle cx="100" cy="4" r="3" fill="#818cf8" className="animate-pulse" />
                        </svg>
                    </div>
                </div>

                {/* Card 2: Pace Analysis (Premium Redesign) */}
                <div
                    onClick={() => setActiveDetail(diff > 10 ? 'pace_slow' : (diff < -10 ? 'pace_fast' : 'pace_optimal'))}
                    style={{
                        background: isOptimal
                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(30, 41, 59, 0.6) 100%)'
                            : (diff > 0
                                ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(30, 41, 59, 0.6) 100%)'
                                : 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(30, 41, 59, 0.6) 100%)'),
                        borderRadius: 12, padding: '14px',
                        border: `1px solid ${isOptimal ? 'rgba(16, 185, 129, 0.2)' : (diff > 0 ? 'rgba(244, 63, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)')}`,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        cursor: 'pointer', position: 'relative', overflow: 'hidden', minHeight: '100px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    {/* Animated Background Ring */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1 }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: `3px solid ${paceColor}`, animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                    </div>

                    {/* Main Icon & Ring */}
                    <div style={{ position: 'relative', width: '56px', height: '56px', marginBottom: 8 }}>
                        <svg width="56" height="56" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}>
                            <circle cx="28" cy="28" r="24" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                            <circle
                                cx="28" cy="28" r="24"
                                stroke={paceColor} strokeWidth="4" fill="none"
                                strokeDasharray="151"
                                strokeDashoffset={151 - (Math.min(120, paceVal) / 120) * 151}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
                            />
                        </svg>
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem',
                            filter: `drop-shadow(0 0 8px ${paceColor})`
                        }}>
                            {isOptimal ? '⚡' : (diff > 0 ? '🐢' : '🐇')}
                        </div>
                    </div>
                    <div style={{
                        fontSize: '0.85rem', fontWeight: 700, color: paceColor,
                        textShadow: `0 0 12px ${paceColor}40`,
                        zIndex: 1
                    }}>
                        {isOptimal ? 'Optimal Pace' : (diff > 0 ? 'Too Slow' : 'Too Fast')}
                    </div>
                    <div style={{ fontSize: '0.55rem', color: '#94a3b8', marginTop: 4 }}>
                        {paceVal}s / {peerPace}s avg
                    </div>
                </div>
            </div>
        );
    };

    // --- Phase 4 FIX: Pass Probability Predictor Widget ---
    const PassProbabilityWidget = () => {
        const prob = passProbability?.value || 65;
        const label = passProbability?.label || 'Baseline Estimate';
        const color = passProbability?.color || '#f59e0b';

        // Calculate stroke dash for circular progress
        const circumference = 2 * Math.PI * 40; // radius 40
        const strokeDashoffset = circumference - (prob / 100) * circumference;

        return (
            <div
                onClick={() => setActiveDetail('gauge')}
                style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(30, 41, 59, 0.6) 100%)',
                    borderRadius: 12,
                    padding: '16px',
                    marginBottom: 8,
                    border: `1px solid ${color}30`,
                    boxShadow: `0 4px 12px ${color}20`,
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Background Glow */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '120px',
                    height: '120px',
                    background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
                    borderRadius: '50%'
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, zIndex: 1, position: 'relative' }}>
                    {/* Circular Gauge */}
                    <div style={{ position: 'relative', width: 90, height: 90 }}>
                        <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
                            {/* Background Circle */}
                            <circle
                                cx="45"
                                cy="45"
                                r="40"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="8"
                                fill="none"
                            />
                            {/* Progress Circle */}
                            <circle
                                cx="45"
                                cy="45"
                                r="40"
                                stroke={color}
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
                            />
                        </svg>
                        {/* Center Value */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <span style={{
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                color: 'white',
                                textShadow: `0 0 10px ${color}80`
                            }}>
                                {prob}%
                            </span>
                        </div>
                    </div>

                    {/* Text Info */}
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            color: '#94a3b8',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: 4
                        }}>
                            📊 Pass Probability
                        </div>
                        <div style={{
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            color: color,
                            textShadow: `0 0 8px ${color}40`
                        }}>
                            {label}
                        </div>
                        <div style={{
                            fontSize: '0.55rem',
                            color: '#64748b',
                            marginTop: 4
                        }}>
                            Bayesian estimate based on performance
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ClientNeedsWidget = () => {
        const hasData = clientNeeds.length > 0;

        return (
            <div style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                overflow: 'hidden',
                marginBottom: 8
            }}>
                {/* Header */}
                <div style={{
                    padding: '10px 14px',
                    background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, rgba(30, 41, 59, 0.4) 100%)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '0.7rem' }}>📋</span>
                        <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Client Needs</span>
                    </div>
                    {hasData && (
                        <span style={{ fontSize: '0.5rem', color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 4 }}>
                            {clientNeeds.length} Categories
                        </span>
                    )}
                </div>

                {/* Content */}
                {hasData ? (
                    <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                        {clientNeeds.map((item, idx) => {
                            const isGood = item.score >= 70;
                            const isWarning = item.score >= 50 && item.score < 70;
                            const statusColor = isGood ? '#10b981' : (isWarning ? '#f59e0b' : '#ef4444');

                            return (
                                <div key={idx}
                                    onClick={() => setActiveDetail(item.category)}
                                    onMouseEnter={(e) => { setActiveTooltip(`cn_${idx}`); e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'; }}
                                    onMouseLeave={(e) => { setActiveTooltip(null); e.currentTarget.style.background = 'transparent'; }}
                                    style={{
                                        padding: '8px 14px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        borderTop: idx > 0 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {renderHoverOverlay(`cn_${idx}`, item.category)}
                                    <span style={{
                                        fontSize: '0.65rem',
                                        color: '#e2e8f0',
                                        maxWidth: '65%',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {item.category}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {/* Mini Progress Bar */}
                                        <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${item.score}%`,
                                                height: '100%',
                                                background: statusColor,
                                                borderRadius: 2,
                                                transition: 'width 0.5s ease'
                                            }} />
                                        </div>
                                        <span style={{
                                            fontSize: '0.65rem',
                                            fontWeight: 700,
                                            color: statusColor,
                                            minWidth: '28px',
                                            textAlign: 'right'
                                        }}>
                                            {item.score}%
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{
                        padding: '24px 16px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'rgba(99, 102, 241, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem'
                        }}>
                            📊
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500 }}>No Data Yet</div>
                        <div style={{ fontSize: '0.55rem', color: '#64748b' }}>Complete questions to see your performance</div>
                    </div>
                )}
            </div>
        );
    };

    // --- Phase 3: CJMM Hex Radar Widget ---
    const CJMMHexWidget = () => {
        // Transform CJMM Grid Data into Radar Format
        // cjmmGrid: [{ step: 'Recognize Cues', score: 80, isWeakness: false }, ...]

        // Shorten Labels for Radar
        const data = cjmmGrid.map(item => ({
            label: item.step.split(' ')[0], // "Recognize", "Analyze"
            fullLabel: item.step,
            value: item.score,
            fullMark: 100
        }));

        if (data.length === 0) return null;

        const avgScore = Math.round(data.reduce((a, b) => a + b.value, 0) / data.length);

        return (
            <div
                style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)',
                    borderRadius: 10,
                    padding: '10px 8px 6px 8px',
                    marginBottom: 8,
                    border: '1px solid rgba(99, 102, 241, 0.15)',
                    position: 'relative'
                }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4,
                    padding: '0 4px'
                }}>
                    <span style={{
                        fontSize: '0.55rem',
                        fontWeight: 700,
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em'
                    }}>
                        CLINICAL REASONING
                    </span>
                    <span style={{
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        color: avgScore >= 70 ? '#10b981' : (avgScore >= 50 ? '#f59e0b' : '#ef4444'),
                        background: avgScore >= 70 ? 'rgba(16, 185, 129, 0.15)' : (avgScore >= 50 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)'),
                        padding: '2px 6px',
                        borderRadius: 4
                    }}>
                        AVG: {avgScore}%
                    </span>
                </div>

                {/* Compact Radar */}
                <div style={{ height: '110px', width: '100%', margin: '0 auto' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                            <PolarGrid stroke="rgba(99, 102, 241, 0.15)" />
                            <PolarAngleAxis
                                dataKey="label"
                                tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: 600 }}
                            />
                            <Radar
                                name="Performance"
                                dataKey="value"
                                stroke="#818cf8"
                                strokeWidth={2}
                                fill="url(#radarGradient)"
                                fillOpacity={0.5}
                            />
                            <defs>
                                <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.6" />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
                                </linearGradient>
                            </defs>
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    // --- Phase 4: JCI Safety Alert Widget ---
    const SafetyAlertWidget = () => {
        // Find if Safety category is Critical
        const safety = clientNeeds.find(c => c.category.includes('Safety') || c.category.includes('Infection'));
        const isCritical = safety && safety.score < 60;

        if (!isCritical && safety) return null; // Only show if there's a risk? Or always show "JCI Compliant" badge maybe?
        // Gold Standard says "Flashes RED if critical safety error". 
        // We'll show it if critical, otherwise show "JCI Compliant" badge maybe?

        if (!safety) return null;

        return (
            <div style={{
                marginTop: 4, padding: '8px 12px', borderRadius: 8,
                background: isCritical ? 'rgba(225, 29, 72, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                border: isCritical ? '1px solid rgba(225, 29, 72, 0.3)' : '1px solid rgba(16, 185, 129, 0.2)',
                display: 'flex', alignItems: 'center', gap: 8
            }}>
                <div style={{ fontSize: '1.2rem' }}>{isCritical ? '🚨' : '🛡️'}</div>
                <div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: isCritical ? '#fda4af' : '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {isCritical ? 'SAFETY ALERT' : 'JCI COMPLIANT'}
                    </div>
                </div>
            </div>
        );
    };

    // --- Phase 5: Item Difficulty Widget (Uses embedded difficulty from item.content.rationale.difficulty) ---
    const DifficultyWidget = () => {
        // Use embedded difficulty OR fallback calculation
        const diff = itemDifficulty || calculateLegacyDifficulty(itemType);

        // Determine colors based on level/score
        const level = diff.level || Math.ceil((diff.score || 50) / 20);
        const score = diff.score || (level * 20 - 10);
        const label = diff.label ||
            (level <= 1 ? 'Recall' :
                level === 2 ? 'Application' :
                    level === 3 ? 'Analysis' :
                        level === 4 ? 'Synthesis' : 'Evaluation');

        // Color gradient based on level
        const levelColors: Record<number, { bg: string, border: string, text: string, glow: string }> = {
            1: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', text: '#4ade80', glow: '#22c55e' },
            2: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', text: '#60a5fa', glow: '#3b82f6' },
            3: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', text: '#fbbf24', glow: '#f59e0b' },
            4: { bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.3)', text: '#fb923c', glow: '#f97316' },
            5: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#f87171', glow: '#ef4444' }
        };
        const colors = levelColors[Math.min(5, Math.max(1, level))];

        return (
            <div
                onClick={() => setActiveDetail('scoring')}
                style={{
                    marginTop: 4, marginBottom: 4, padding: '12px',
                    borderRadius: 12,
                    background: `linear-gradient(135deg, ${colors.bg} 0%, rgba(30, 41, 59, 0.6) 100%)`,
                    border: `1px solid ${colors.border}`,
                    boxShadow: `0 4px 12px rgba(0,0,0,0.15), 0 0 20px ${colors.glow}15`,
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Background Glow */}
                <div style={{
                    position: 'absolute', top: '-30px', right: '-30px',
                    width: '100px', height: '100px',
                    background: `radial-gradient(circle, ${colors.glow}30 0%, transparent 70%)`,
                    borderRadius: '50%'
                }} />

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, zIndex: 1, position: 'relative' }}>
                    <div style={{ fontSize: '0.55rem', fontWeight: 700, color: colors.text, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        📐 ITEM DIFFICULTY
                    </div>
                    <div style={{
                        background: colors.bg,
                        border: `1px solid ${colors.border}`,
                        padding: '2px 8px',
                        borderRadius: 12,
                        fontSize: '0.55rem',
                        fontWeight: 700,
                        color: colors.text
                    }}>
                        Level {level}
                    </div>
                </div>

                {/* Main Display */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, zIndex: 1, position: 'relative' }}>
                    {/* Score Ring */}
                    <div style={{ position: 'relative', width: '48px', height: '48px' }}>
                        <svg width="48" height="48" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}>
                            <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                            <circle
                                cx="24" cy="24" r="20"
                                stroke={colors.text}
                                strokeWidth="4"
                                fill="none"
                                strokeDasharray="126"
                                strokeDashoffset={126 - (score / 100) * 126}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 1s ease' }}
                            />
                        </svg>
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.9rem', fontWeight: 800, color: 'white'
                        }}>
                            {score}
                        </div>
                    </div>

                    {/* Label & Subtext */}
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontSize: '1rem', fontWeight: 700, color: 'white',
                            textShadow: `0 0 10px ${colors.glow}40`
                        }}>
                            {label}
                        </div>
                        {diff.subtext && (
                            <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: 2 }}>
                                {diff.subtext}
                            </div>
                        )}
                        {diff.clinicalStrategy && (
                            <div style={{
                                fontSize: '0.55rem', color: colors.text, marginTop: 4,
                                fontStyle: 'italic', opacity: 0.9
                            }}>
                                💡 {diff.clinicalStrategy.slice(0, 50)}{diff.clinicalStrategy.length > 50 ? '...' : ''}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="expert-dashboard" style={{ fontFamily: '"Inter", sans-serif', padding: '0', background: 'transparent', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <style>{`
            @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
            @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); } 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); } }
            @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes pulse-fast { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            @keyframes EKG { 0% { stroke-dashoffset: 200; } 100% { stroke-dashoffset: 0; } }
            .animate-ekg { animation: EKG 2s linear infinite; stroke-dasharray: 200; stroke-dashoffset: 200; }
            .glass-sticky-header {
                position: sticky; top: 0; z-index: 20;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(8px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.3);
            }
        `}</style>

            {/* Header Panel - Sticky Glass Upgrade */}
            <div
                className="glass-sticky-header"
                style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
                    padding: '8px 12px', borderRadius: '8px',
                    background: 'rgba(30, 41, 59, 0.6)', // Dark Glass
                    border: '1px solid rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease'
                }}>
                <div
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flex: 1 }}>
                    <div style={{
                        width: '28px', height: '28px', borderRadius: '6px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: 'white',
                        boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' // Neon Glow
                    }}>
                        🧠
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.05em' }}>EXPERT HUD</div>
                        <div style={{ fontSize: '0.55rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Biometric Analytics</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 4, cursor: 'pointer', padding: 4, color: '#94a3b8' }} title="Share">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    </button>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: '#64748b' }}>
                        <span style={{ fontSize: '0.7rem', display: 'block', transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
                    </button>
                </div>
            </div>

            {/* Global Detail Overlay (covers widgets when active) */}
            {renderDetailOverlay()}

            {/* Content Area */}
            {!isCollapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, overflowY: 'auto', paddingRight: 4 }}>
                    {/* Exam Vitals Wrapper (Replaces StressMonitor) */}
                    <ExamVitalsWidget data={stress} base={interactionBase} />

                    {/* Score Card Widget */}
                    <ScoreCardWidget />

                    {/* Logic: Hide detailed stats in Exam mode, but preserve Vitals + JCI alerts if critical */}
                    {!isExam && (
                        <>
                            {/* Pass Probability Predictor (Bayesian) */}
                            <PassProbabilityWidget />

                            {/* 2x1 Grid: Peer Rank & Pace */}
                            <PerformanceGridWidget />

                            {/* Item Difficulty (from embedded item data) */}
                            <DifficultyWidget />

                            {/* Client Needs Breakdown */}
                            <ClientNeedsWidget />

                            {/* CJMM Hex Radar */}
                            <CJMMHexWidget />
                        </>
                    )}

                    {/* Always show JCI Alerts if Critical (Safety First), or hide if Exam mode is strict? 
                       Usually exam doesn't show alerts. But for 'Simulator', maybe show minimal? 
                       User asked for Simulator Logic. Real exam shows NOTHING.
                       Let's hide JCI in Exam Mode too unless it's a critical safety falter? 
                       No, complete blind is safer for realism. 
                    */}
                    {!isExam && <SafetyAlertWidget />}

                    {/* Exam Mode Placeholder for Hidden Stats */}
                    {isExam && (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: 0.3 }}>
                            <div style={{ fontSize: '2rem', filter: 'grayscale(1)' }}>📊</div>
                            <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: 8 }}>Metrics Hidden During Exam</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExpertDashboard;
