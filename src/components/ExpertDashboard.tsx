import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
    PassProbabilityMetric,
    ClientNeedStat,
    CJMMMetric,
    ScoreRuleResult,
} from '../utils/scoringEngine';
import { InteractionData } from '../utils/stressEngine';
import { ItemScoreWidget } from './ItemScoreWidget';
import { StressMonitorWidget } from './StressMonitorWidget';

interface ExpertDashboardProps {
    passProbability: PassProbabilityMetric;
    clientNeeds: ClientNeedStat[];
    cjmmGrid: CJMMMetric[];
    currentItemResult?: ScoreRuleResult | null;
    pace?: PaceMetric;
    stress?: InteractionData;
}

export interface PaceMetric {
    userTime: number;
    peerTime: number;
}

const ExpertDashboard: React.FC<ExpertDashboardProps> = ({
    passProbability,
    clientNeeds,
    cjmmGrid,
    currentItemResult,
    pace,
    stress
}) => {
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
    const [activeDetail, setActiveDetail] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

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

    const GaugeWidget = () => {
        const val = passProbability?.value;
        const safeVal = (typeof val === 'number' && !isNaN(val)) ? val : 0;
        const hasData = safeVal > 0;

        let bgColor = '#10b981';
        if (safeVal < 50) bgColor = '#f43f5e';
        else if (safeVal < 75) bgColor = '#f59e0b';

        // Return placeholder if no data (avoids NaN charts)
        if (!hasData) {
            return (
                <div style={{ background: '#f1f5f9', borderRadius: 12, padding: '12px 16px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80 }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Insufficient Data</div>
                </div>
            );
        }

        const data = [{ name: 'Score', value: safeVal }, { name: 'Remaining', value: 100 - safeVal }];

        return (
            <div
                onClick={() => setActiveDetail('gauge')}
                onMouseEnter={() => setActiveTooltip('gauge')} onMouseLeave={() => setActiveTooltip(null)}
                style={{ background: bgColor, borderRadius: 12, padding: '12px 16px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', cursor: 'pointer', height: 80 }}>
                {renderHoverOverlay('gauge')}
                <div style={{ zIndex: 10 }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff', opacity: 0.9 }}>PROBABILITY</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>{safeVal}%</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'white', opacity: 0.8 }}>{passProbability.label}</div>
                </div>
                <div style={{ width: 80, height: 80, marginRight: -8 }}><ResponsiveContainer><PieChart><Pie data={data} cx="50%" cy="50%" innerRadius={25} outerRadius={35} dataKey="value" stroke="none"><Cell fill="rgba(255,255,255,0.9)" /> <Cell fill="rgba(255,255,255,0.2)" /></Pie></PieChart></ResponsiveContainer></div>
            </div>
        );
    };

    const PaceMakerWidget = () => {
        // Use props or default to "Optimal" if no data (Zero Error approach: don't show "Slower" without evidence)
        const uTime = pace ? pace.userTime : 60;
        const pTime = pace ? pace.peerTime : 60;
        const diff = uTime - pTime;

        let isSlower = diff > 10;
        let isFaster = diff < -10;
        let paceId = 'pace_optimal';
        let bgGradient = 'linear-gradient(135deg, #10b981 0%, #059669 100%)'; // Emerald
        let label = 'Optimal';
        let subLabel = 'Perfect Rhythm';
        let icon = '⏱️';

        if (isSlower) {
            paceId = 'pace_slow';
            bgGradient = 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)'; // Rose
            label = `+${Math.round(diff)}s Slower`;
            subLabel = 'Hesitation Detected';
            icon = '🐢';
        } else if (isFaster) {
            paceId = 'pace_fast';
            bgGradient = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'; // Amber
            label = `${Math.round(Math.abs(diff))}s Faster`;
            subLabel = 'Rushing Risk';
            icon = '🐇';
        }

        // Calculate Position: Center 50%, 40% range either side
        const range = 40;
        const rawPos = 50 + ((diff / range) * 40);
        const dotPosition = Math.max(10, Math.min(90, rawPos));

        return (
            <div
                onClick={() => setActiveDetail(paceId)}
                onMouseEnter={() => setActiveTooltip('pace')} onMouseLeave={() => setActiveTooltip(null)}
                style={{
                    background: bgGradient,
                    borderRadius: 16,
                    padding: '16px 20px',
                    marginBottom: 12,
                    position: 'relative',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    minHeight: 110,
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                }}>
                {renderHoverOverlay(paceId, getContent(paceId).title)}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 10, position: 'relative' }}>
                    <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.05em' }}>PACE ANALYSIS</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', lineHeight: 1.1, marginTop: 4, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{label}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>{subLabel}</div>
                    </div>
                    <div style={{ fontSize: '1.5rem', opacity: 0.8, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>{icon}</div>
                </div>

                {/* Timeline Visualizer */}
                <div style={{ marginTop: 20, position: 'relative', height: 24, display: 'flex', alignItems: 'center' }}>
                    {/* Track */}
                    <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.3)', borderRadius: 1 }}></div>

                    {/* Center Mark */}
                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 2, height: 8, background: 'rgba(255,255,255,0.6)' }}></div>
                    <div style={{ position: 'absolute', left: '50%', top: 20, transform: 'translateX(-50%)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>PEER AVG</div>

                    {/* User Dot */}
                    <div style={{
                        position: 'absolute',
                        left: `${dotPosition}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 12, height: 12,
                        background: 'white',
                        borderRadius: '50%',
                        boxShadow: '0 0 0 4px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.2)',
                        transition: 'left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}></div>
                </div>
            </div>
        );
    };

    const ClientNeedsWidget = () => {
        return (
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
                <div style={{ padding: '8px 16px', background: '#f8fafc', fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>CLIENT NEEDS</div>
                {clientNeeds.length > 0 ? clientNeeds.map((item, idx) => (
                    <div key={idx}
                        onClick={() => setActiveDetail(item.category)}
                        onMouseEnter={() => setActiveTooltip(`cn_${idx}`)} onMouseLeave={() => setActiveTooltip(null)}
                        style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', position: 'relative', cursor: 'pointer' }}>
                        {renderHoverOverlay(`cn_${idx}`, item.category)}
                        <span style={{ fontSize: '0.75rem', color: '#334155', maxWidth: '65%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.category}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: item.score >= 60 ? '#6366f1' : '#f43f5e' }}>{item.score}%</span>
                    </div>
                )) : <div style={{ padding: 12, textAlign: 'center', fontSize: '0.7rem', color: '#cbd5e1' }}>No Data</div>}
            </div>
        );
    };

    const CognitiveGridWidget = () => (
        <div>
            <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', marginBottom: 8, marginLeft: 2 }}>CLINICAL JUDGMENT</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {cjmmGrid.map((step, idx) => (
                    <div key={idx}
                        onClick={() => setActiveDetail(step.step)}
                        onMouseEnter={() => setActiveTooltip(`cjmm_${idx}`)} onMouseLeave={() => setActiveTooltip(null)}
                        style={{ background: step.score < 50 ? '#fff1f2' : 'white', border: `1px solid ${step.score < 50 ? '#fecdd3' : '#e2e8f0'}`, borderRadius: 8, padding: '8px 4px', textAlign: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                        {renderHoverOverlay(`cjmm_${idx}`, step.step)}
                        <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#94a3b8' }}>{step.step.split(' ')[0]}</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: step.score < 50 ? '#e11d48' : '#334155' }}>{step.score}%</div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div style={{ fontFamily: '"Inter", sans-serif', padding: '12px', background: '#f8fafc', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <style>{`
            @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
            @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); } 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); } }
            @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `}</style>

            {/* Header Panel - ANIMATED & PULSATING */}
            <div
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, cursor: 'pointer',
                    padding: '8px 12px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    animation: 'pulse-ring 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite'
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.4rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>🎓</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{
                            fontSize: '0.95rem', fontWeight: 900, color: 'transparent',
                            backgroundImage: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
                            backgroundSize: '200% auto', backgroundClip: 'text', WebkitBackgroundClip: 'text',
                            animation: 'shimmer 3s linear infinite', letterSpacing: '-0.02em', textTransform: 'uppercase'
                        }}>
                            Expert Analytics
                        </span>
                        <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 600 }}>Click to Toggle</span>
                    </div>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
            </div>

            {/* Global Detail Overlay (covers widgets when active) */}
            {renderDetailOverlay()}

            {/* Content Area */}
            {!isCollapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, overflowY: 'auto', paddingRight: 4 }}>
                    {/* Stress Monitor Wrapper */}
                    <div onClick={() => setActiveDetail('stress')} style={{ cursor: 'pointer' }}>
                        <StressMonitorWidget data={stress || { changeCount: 0, timeSpent: 45, peerAvg: 60 }} />
                    </div>

                    {/* Item Score Wrapper */}
                    <div onClick={() => setActiveDetail('scoring')} style={{ cursor: 'pointer' }}>
                        <ItemScoreWidget score={currentItemResult?.score || 0} maxScore={currentItemResult?.maxScore || 0} correctCount={currentItemResult?.correctCount || 0} incorrectCount={currentItemResult?.incorrectCount || 0} isVisible={!!currentItemResult} />
                    </div>

                    <GaugeWidget />
                    <PaceMakerWidget />
                    <ClientNeedsWidget />
                    <CognitiveGridWidget />
                </div>
            )}
        </div>
    );
};

export default ExpertDashboard;
