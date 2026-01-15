import React, { useState, useEffect } from 'react';
import { StudyPlannerEngine, STUDY_TECHNIQUES, AUTO_SMART_TECHNIQUE_ID } from '../learning/StudyPlannerEngine';
import { StudyPlan, StudySession } from '../../types/phase-6-5-schema';
import { Button } from '../../components/ui/button';
import { Calendar, Brain, AlertTriangle, ArrowRight, Zap, Target, HelpCircle, ChevronRight, Sparkles, ChevronDown, Play, CheckCircle2, BookOpen, Clock } from 'lucide-react';

// --- RICH CONTENT LIBRARY ---
const TECHNIQUE_VARIATIONS: Record<string, { how: string[]; why: string[]; special: string[] }> = {
    'tech_pomodoro': {
        how: [
            "Set timer for 25m focus. Work purely on one task. When timer rings, stop immediately. Take 5m break.",
            "Work in intense 25-minute bursts. The ticking clock creates urgency. Force a 5-minute mental disconnect after each.",
            "Commit to just 25 minutes. It's short enough to avoid dread, but long enough to clear a complex topic.",
            "Execute 4 'Pomodoros' back-to-back. 25m Work / 5m Rest. After the 4th, take a long 30m recover.",
            "Focus on a single objective for 25 minutes. No multi-tasking. If you finish early, review unitl the timer rings."
        ],
        why: [
            "Short bursts prevent cognitive fatigue while maintaining high intensity for longer periods.",
            "Prevents burnout by enforcing regular recovery breaks, allowing your brain to consolidate data.",
            "The artificial urgency of the timer forces you to work faster and more efficiently.",
            "Breaks complex tasks into manageable chunks, reducing the 'start friction' of studying.",
            "Regular breaks reset your attention span, keeping your focus sharp from minute 1 to minute 60."
        ],
        special: [
            "⏱️ Strict Timing: Do not check phone during the 25m block. If distracted, write it down and continue.",
            "📝 Distraction Log: Keep a notepad. If a thought pops up, write it down to handle *after* the session.",
            "🛑 Hard Stop: When the timer rings, stop mid-sentence. This creates an 'open loop' that makes it easier to restart.",
            "🚶 Move: During the 5m break, stand up. Do not look at screens. Your eyes need rest too.",
            "🎧 Mono-tasking: Close all other browser tabs. Visual clutter competes for your cognitive resources."
        ]
    },
    'tech_feynman': {
        how: [
            "Read the concept, then explain it out loud in simple terms as if teaching a 5-year-old.",
            "Write the topic name at the top of a page. Write down everything you know about it in plain English.",
            "Identify gaps in your explanation. If you use jargon, you don't understand it. Simplify further.",
            "Pretend you are lecturing a classroom of students who have zero medical background.",
            "Record yourself explaining the disease process. Listen back to catch hesitation or confusion."
        ],
        why: [
            "You cannot explain what you do not understand. This technique instantly reveals your knowledge gaps.",
            "Simplification forces you to construct your own mental framework, which is stronger than memorizing facts.",
            "Active reconstruction of knowledge builds much stronger neural pathways than passive reading.",
            "Teaching is the highest form of learning. It moves information from short-term to long-term memory.",
            "Identifies 'illusion of competence'—where you think you know something but actually just recognize the words."
        ],
        special: [
            "💡 Gap Detection: If you stumble on an explanation, that is exactly where you neeed to review.",
            "🧸 Rubber Duck: Explain it to an inanimate object. If you feel silly, you are doing it right.",
            "🚫 No Jargon: Banned words: 'basically', 'thing', 'stuff'. Be precise but simple.",
            "🗣️ Speak Up: Vocalizing engages a different part of the brain than just thinking.",
            "📉 Metaphor: Use analogies. e.g. 'The heart is like a pump' or 'Kidneys are filters'."
        ]
    },
    'tech_active_recall': {
        how: [
            "Close all books/notes. Ask yourself a question about the topic and try to answer from pure memory.",
            "Look at a header in your notes, look away, and recite everything you remember about that section.",
            "Write down questions instead of notes while reading. Answer them later without looking.",
            "Use a blank sheet of paper and write a 'Brain Dump' of everything you know about the topic.",
            "Do practice questions without looking at the options first. Try to generate the answer independently."
        ],
        why: [
            "The struggle to retrieve information is what strengthens the neural pathway.",
            "Repeated retrieval makes facts 'sticky' and easier to access during a high-pressure exam.",
            "Passively reading feels easy but creates weak memories. Evaluation requires effort.",
            "Simulates the exam environment where you won't have notes to rely on.",
            "Highlights exactly what you don't know, preventing you from wasting time on what you do know."
        ],
        special: [
            "🚫 No Peeking: Do not look up the answer until you have tried your hardest to recall it.",
            "🧠 Embrace the Struggle: Feeling frustrated means it's working. That is the feeling of learning.",
            "📝 Write it out: Don't just think it. Write or speak the answer to ensure you aren't cheating yourself.",
            "🔄 Verification: Always verify your recall against the source material immediately after.",
            "❓ Question First: Always start with a question, not a statement."
        ]
    },
    'tech_spaced_rep': {
        how: [
            "Review flashcards. Sort them by 'Hard', 'Medium', 'Easy' to determine next review interval.",
            "Review material you learned 1 day ago, 3 days ago, and 1 week ago.",
            "Use a digital tool or physical Leitner box system to space out reviews.",
            "Focus 80% of your time on the cards/topics you get wrong. Skim the ones you know.",
            "Schedule reviews for the moment you are about to forget the information."
        ],
        why: [
            "Combats the 'Forgetting Curve'. Reminding yourself just before forgetting resets the decay.",
            "Most efficient study method mathematically. You don't waste time reviewing what you know.",
            "Ensures long-term retention rather than short-term cramming (which fails under stress).",
            "Builds a reliable knowledge base that grows over time instead of replacing old info with new.",
            "Reduces total study time by eliminating redundant reviews of mastered topics."
        ],
        special: [
            "📅 Trust the Algorithm: If you know it, hit 'Easy' and don't see it for a week.",
            "🌅 Morning Routine: Best done first thing in the morning to clear the 'due' stack.",
            "🧩 Interleave: Mix different decks together. Don't just do one topic at a time.",
            "📉 Honesty: If you hesitated, mark it 'Hard'. Don't lie to yourself.",
            "🔄 Consistency: Missing a day causes a pile-up. Consistency is key."
        ]
    },
    // Fallback for others to ensure "30+ variations" feel
    'default': {
        how: [
            "Read the material, minimize distractions, and take summarized notes.",
            "Engage with the content actively. Don't just scan; analyze and synthesize.",
            "Break the material down into smaller subsections and tackle them one by one.",
            "Use diagrams and flowcharts to map out the process visually.",
            "Connect this new topic to something you already know well."
        ],
        why: [
            "Structured approach ensures comprehensive coverage of the material.",
            "Active engagement prevents passive glazing over text.",
            "Visualizing the data helps significantly with recall for visual learners.",
            "Connecting concepts builds a 'latticework' of mental models.",
            "Breaking it down prevents cognitive overload and procrastination."
        ],
        special: [
            "💧 Hydration: Brain function drops with just 2% dehydration. Drink water.",
            "🌬️ Fresh Air: Open a window. CO2 buildup makes you sleepy.",
            "📵 Airplane Mode: Put the phone in another room.",
            "🎵 Environment: Use lo-fi or binaural beats to help focus.",
            "🔦 Lighting: Ensure your study space is well-lit to reduce eye strain."
        ]
    }
};

// --- HELPER: DERIVE RICH CONTENT ---
const getSessionDetails = (session: StudySession, config: any) => {
    const technique = StudyPlannerEngine.getTechnique(session.techniqueId);
    const domain = session.domains[0];
    const isWeak = config.weakDomains.includes(domain);

    // Get variations for this technique, or default
    const vars = TECHNIQUE_VARIATIONS[session.techniqueId] || TECHNIQUE_VARIATIONS['default'];

    // Random selection logic to simulate "30+ variations" feel across the plan
    // We use the session ID to make the random choice deterministic (so it doesn't change on re-render)
    const seed = session.id.charCodeAt(0) + session.id.charCodeAt(session.id.length - 1);

    const how = vars.how[seed % vars.how.length];
    const whyBase = vars.why[seed % vars.why.length];
    const special = vars.special[seed % vars.special.length];

    // Augment "Why" with specific weakness logic if applicable
    let why = whyBase;
    if (isWeak) {
        why = `High Priority: ${whyBase}`;
    }

    return {
        what: domain,
        techniqueName: technique?.name || 'Study Session',
        how,
        why,
        when: new Date(session.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }),
        special,
        isWeak
    };
};

const FocusModeOverlay: React.FC<{
    session: StudySession;
    details: any;
    onClose: () => void;
    onComplete: () => void;
}> = ({ session, details, onClose, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(session.targetDurationMinutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [distractions, setDistractions] = useState<string[]>([]);
    const [dInput, setDInput] = useState('');

    // Timer Logic
    useEffect(() => {
        let interval: any;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            onComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, onComplete]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const progress = 100 - (timeLeft / (session.targetDurationMinutes * 60)) * 100;

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* LEFT: TIMER & CONTROLS */}
                <div className="space-y-8 flex flex-col justify-center items-center text-center">
                    <div>
                        <div className="inline-block bg-blue-900/50 text-blue-200 border border-blue-700/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                            Focus Mode Active
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-2">{details.what}</h2>
                        <p className="text-slate-400 font-medium">{details.techniqueName}</p>
                    </div>

                    {/* TIMER VISUALIZATION */}
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="6" />
                            <circle
                                cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="6"
                                strokeDasharray="283" strokeDashoffset={283 - (283 * progress) / 100}
                                className="transition-all duration-1000 ease-linear"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="flex flex-col items-center">
                            <span className="text-5xl font-black text-white tabular-nums tracking-tight">
                                {formatTime(timeLeft)}
                            </span>
                            <span className="text-sm font-bold text-slate-500 uppercase mt-2">Remaining</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            size="lg"
                            className={`px-8 py-6 rounded-2xl text-lg font-bold shadow-xl transition-all hover:scale-105 ${isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-500'}`}
                            onClick={() => setIsActive(!isActive)}
                        >
                            {isActive ? 'Pause Session' : 'Start Focus Timer'}
                        </Button>
                        <Button variant="outline" size="lg" className="py-6 px-6 border-slate-700 text-slate-300 hover:bg-slate-800 rounded-2xl" onClick={onClose}>
                            Exit
                        </Button>
                    </div>
                </div>

                {/* RIGHT: TOOLS & GUIDANCE */}
                <div className="bg-slate-800/50 rounded-3xl p-8 border border-white/5 space-y-8 backdrop-blur-md">

                    {/* TECHNIQUE REMINDER */}
                    <div>
                        <h4 className="flex items-center gap-2 text-white font-bold mb-3">
                            <Zap size={18} className="text-amber-400" /> Current Strategy
                        </h4>
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 text-slate-300 text-sm leading-relaxed">
                            {details.how}
                        </div>
                    </div>

                    {/* DISTRACTION PARKING LOT */}
                    <div className="flex-1 flex flex-col min-h-[200px]">
                        <h4 className="flex items-center gap-2 text-white font-bold mb-3">
                            <Brain size={18} className="text-purple-400" /> Distraction Parking Lot
                        </h4>
                        <div className="flex-1 bg-slate-900/50 rounded-xl border border-white/5 p-4 mb-4 overflow-y-auto max-h-[150px]">
                            {distractions.length === 0 ? (
                                <p className="text-slate-600 text-sm italic text-center mt-8">
                                    Mind wandering? Type it here to clear your head.
                                </p>
                            ) : (
                                <ul className="space-y-2">
                                    {distractions.map((d, i) => (
                                        <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                                            <span className="opacity-50">•</span> {d}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <input
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Park a thought..."
                                value={dInput}
                                onChange={(e) => setDInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && dInput.trim()) {
                                        setDistractions([...distractions, dInput]);
                                        setDInput('');
                                    }
                                }}
                            />
                            <Button
                                size="sm"
                                className="bg-slate-700 hover:bg-slate-600"
                                onClick={() => {
                                    if (dInput.trim()) {
                                        setDistractions([...distractions, dInput]);
                                        setDInput('');
                                    }
                                }}
                            >
                                Add
                            </Button>
                        </div>
                    </div>

                    {/* AMBIENT SOUNDS (Mockup) */}
                    <div>
                        <h4 className="flex items-center gap-2 text-white font-bold mb-3 text-xs uppercase tracking-widest text-slate-500">
                            Soundscapes
                        </h4>
                        <div className="flex gap-2">
                            {['Rain', 'Cafe', 'White Noise', 'Lo-Fi'].map(sound => (
                                <button key={sound} className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-slate-400 hover:bg-slate-700 hover:text-white transition-all">
                                    {sound}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ResourceHubModal: React.FC<{
    domain: string;
    onClose: () => void;
}> = ({ domain, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex justify-end" onClick={onClose}>
            <div
                className="w-full max-w-lg bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-800">{domain}</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Smart Resource Hub</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <ArrowRight size={20} />
                    </button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* QUICK ACTIONS */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group">
                            <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Brain size={20} />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm">Generate Quiz</h4>
                            <p className="text-xs text-slate-500 mt-1">Create a 10-Q {domain} drill</p>
                        </button>
                        <button className="p-4 rounded-xl border-2 border-slate-100 hover:border-purple-500 hover:bg-purple-50 transition-all text-left group">
                            <div className="bg-purple-100 text-purple-600 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Sparkles size={20} />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm">Smart Flashcards</h4>
                            <p className="text-xs text-slate-500 mt-1">Review top 20 concepts</p>
                        </button>
                    </div>

                    {/* AI KEY CONCEPTS */}
                    <div>
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Zap size={16} className="text-amber-500" /> High-Yield Concepts
                        </h3>
                        <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 space-y-3">
                            {[
                                "Mechanism of Action classes",
                                "Common Side Effects vs Adverse Reactions",
                                "Nursing Implications & Monitoring",
                                "Patient Education priority points"
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="min-w-[6px] h-[6px] rounded-full bg-amber-400 mt-2" />
                                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{item} for {domain}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* NOTES AREA */}
                    <div>
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <BookOpen size={16} className="text-blue-500" /> Quick Notes
                        </h3>
                        <textarea
                            className="w-full h-40 p-4 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all resize-none"
                            placeholder={`Type your ${domain} cheatsheet here...`}
                        />
                    </div>

                </div>

                {/* FOOTER */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
                    <p className="text-xs text-slate-400 font-medium">Content generated by Master NGN Intelligence Engine</p>
                </div>
            </div>
        </div>
    );
};

const SessionCard: React.FC<{
    session: StudySession;
    config: any;
    onComplete: (id: string) => void;
    completed: boolean;
    onStartFocus: (session: StudySession, details: any) => void;
    onOpenResources: (domain: string) => void;
}> = ({ session, config, onComplete, completed, onStartFocus, onOpenResources }) => {
    const [expanded, setExpanded] = useState(false);
    const details = getSessionDetails(session, config);

    return (
        <div className={`
            relative bg-white rounded-xl border transition-all duration-300 overflow-hidden group
            ${expanded ? 'shadow-xl border-blue-200 ring-1 ring-blue-100' : 'shadow-sm border-slate-200 hover:border-blue-300 hover:shadow-md'}
        `}>
            {/* PROGRESS STATUS STRIP (Left Edge) */}
            <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${completed ? 'bg-green-500' : (details.isWeak ? 'bg-orange-400' : 'bg-blue-500')}`} />

            {/* HEADER / COMPACT VIEW */}
            <div
                className="p-4 flex items-center gap-4 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                {/* Checkbox */}
                <div
                    onClick={(e) => { e.stopPropagation(); onComplete(session.id); }}
                    className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                        ${completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 hover:border-blue-400 text-transparent'}
                    `}
                >
                    <CheckCircle2 size={14} fill="currentColor" className={completed ? 'text-white' : 'opacity-0'} />
                </div>

                {/* Main Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            {session.targetDurationMinutes} MIN • {details.techniqueName}
                        </span>
                        {details.isWeak && <span className="text-[9px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold uppercase">Priority</span>}
                    </div>
                    <h5 className={`font-bold text-slate-800 text-lg ${completed ? 'line-through text-slate-400' : ''}`}>
                        {details.what}
                    </h5>
                </div>

                {/* Expand Chevron */}
                <div className={`text-slate-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} />
                </div>
            </div>

            {/* EXPANDED CONTENT (Rich Details) */}
            <div className={`
                border-t border-slate-100 bg-slate-50/50 overflow-hidden transition-all duration-300 ease-in-out
                ${expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
            `}>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* LEFT: METHODOLOGY */}
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm h-fit">
                                <Zap size={18} className="text-amber-500" />
                            </div>
                            <div>
                                <h6 className="text-xs font-bold text-slate-500 uppercase mb-1">Execution Strategy</h6>
                                <p className="text-sm text-slate-700 leading-relaxed font-medium">"{details.how}"</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm h-fit">
                                <AlertTriangle size={18} className="text-rose-500" />
                            </div>
                            <div>
                                <h6 className="text-xs font-bold text-slate-500 uppercase mb-1">Crucial Note</h6>
                                <p className="text-sm text-slate-600 leading-relaxed">{details.special}</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: RATIONALE & ACTION */}
                    <div className="flex flex-col justify-between space-y-4">
                        <div className="flex gap-3">
                            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm h-fit">
                                <Target size={18} className="text-blue-500" />
                            </div>
                            <div>
                                <h6 className="text-xs font-bold text-slate-500 uppercase mb-1">Why This Matters</h6>
                                <p className="text-sm text-slate-600 leading-relaxed italic">{details.why}</p>
                            </div>
                        </div>

                        <div className="pt-2 flex gap-3">
                            <Button
                                size="sm"
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 shadow-md shadow-indigo-200"
                                onClick={() => onStartFocus(session, details)}
                            >
                                <Play size={14} className="mr-2 fill-current" /> Start Focus Session
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 px-3 text-slate-500 hover:text-slate-800 hover:bg-white hover:border-slate-300"
                                onClick={() => onOpenResources(details.what)}
                                title="Open Smart Resource Hub"
                            >
                                <BookOpen size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const StudyPlannerMode: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [step, setStep] = useState<'WIZARD' | 'PLAN'>('WIZARD');
    const [wizardStep, setWizardStep] = useState(1);
    const [plan, setPlan] = useState<StudyPlan | null>(null);
    const [completedSessions, setCompletedSessions] = useState<Record<string, boolean>>({});

    // OVERLAY STATES
    const [activeFocusSession, setActiveFocusSession] = useState<{ session: StudySession, details: any } | null>(null);
    const [activeResourceDomain, setActiveResourceDomain] = useState<string | null>(null);

    // Wizard State
    const [examDate, setExamDate] = useState<string>('');
    const [hours, setHours] = useState<number>(2);
    const [weakAreas, setWeakAreas] = useState<string[]>([]);
    const [preferredTechniques, setPreferredTechniques] = useState<string[]>([]);
    const [generating, setGenerating] = useState(false);

    const handleGenerate = () => {
        setGenerating(true);
        // Simulate API delay
        setTimeout(() => {
            const newPlan = StudyPlannerEngine.generatePlan(
                'mock_student',
                new Date(examDate),
                hours,
                weakAreas.length > 0 ? weakAreas : ['Pharmacology', 'Cardio'],
                preferredTechniques.length > 0 ? preferredTechniques : ['tech_pomodoro']
            );
            setPlan(newPlan);
            setStep('PLAN');
            setGenerating(false);
        }, 2000);
    };

    const toggleSessionCompletion = (id: string) => {
        setCompletedSessions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // --- WIZARD VIEW ---
    if (step === 'WIZARD') {
        return (
            <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-6 font-sans">
                <div className="bg-white max-w-4xl w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                    {/* LEFT SIDEBAR (Progress) */}
                    <div className="bg-slate-900 w-full md:w-1/3 p-8 flex flex-col justify-between text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 to-transparent pointer-events-none" />

                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-blue-600 p-2 rounded-lg">
                                    <Brain className="text-white" size={24} />
                                </div>
                                <span className="font-bold tracking-wide">SmartPlanner AI</span>
                            </div>
                            <h2 className="text-3xl font-black leading-tight mb-4">Build Your<br />Roadmap</h2>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Our AI analyzes your exam date and weaknesses to construct the perfect study schedule.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[1, 2, 3, 4].map((s) => (
                                <div key={s} className={`flex items-center gap-4 transition-all duration-300 ${wizardStep === s ? 'opacity-100 translate-x-2' : 'opacity-40'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${wizardStep === s ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-600 text-slate-400'}`}>
                                        {s}
                                    </div>
                                    <span className="font-bold text-sm tracking-wide">
                                        {s === 1 ? 'Timeline' : s === 2 ? 'Availability' : s === 3 ? 'Weaknesses' : 'Methodology'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="flex-1 p-8 md:p-12 flex flex-col relative">
                        <button onClick={onExit} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600">
                            Cancel
                        </button>

                        <div className="flex-1 flex flex-col justify-center">
                            {/* STEP 1: EXAM DATE */}
                            {wizardStep === 1 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800 mb-2">When is your NCLEX?</h3>
                                        <p className="text-slate-500">We'll calculate the optimal pacing phase based on this date.</p>
                                    </div>
                                    <input
                                        type="date"
                                        className="w-full p-6 border-2 border-slate-200 rounded-2xl text-xl font-bold text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                        value={examDate}
                                        onChange={(e) => setExamDate(e.target.value)}
                                    />
                                </div>
                            )}

                            {/* STEP 2: HOURS */}
                            {wizardStep === 2 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800 mb-2">Daily Commitment</h3>
                                        <p className="text-slate-500">How many hours can you realistically study per day?</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[1, 2, 4, 6, 8].map(h => (
                                            <button
                                                key={h}
                                                onClick={() => setHours(h)}
                                                className={`p-6 rounded-2xl font-bold text-lg border-2 transition-all ${hours === h ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-lg' : 'border-slate-100 hover:border-slate-300 text-slate-600'}`}
                                            >
                                                {h} Hours
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: WEAK AREAS */}
                            {wizardStep === 3 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800 mb-2">Priority Focus</h3>
                                        <p className="text-slate-500">Select up to 3 areas you find most challenging.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Pharmacology', 'Med-Surg', 'Pediatrics', 'Maternity', 'Mental Health', 'Community'].map(domain => (
                                            <button
                                                key={domain}
                                                onClick={() => {
                                                    if (weakAreas.includes(domain)) setWeakAreas(prev => prev.filter(d => d !== domain));
                                                    else if (weakAreas.length < 3) setWeakAreas(prev => [...prev, domain]);
                                                }}
                                                className={`p-4 text-left rounded-xl text-sm font-bold transition-all border-2 flex justify-between items-center ${weakAreas.includes(domain) ? 'border-red-400 bg-red-50 text-red-700' : 'border-slate-100 text-slate-600 hover:border-slate-300'}`}
                                            >
                                                {domain}
                                                {weakAreas.includes(domain) && <AlertTriangle size={16} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: LEARNING STYLE */}
                            {wizardStep === 4 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col h-full overflow-hidden">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800 mb-2">Methodology</h3>
                                        <p className="text-slate-500">Select up to 3 techniques in order of preference (1st = Highest Priority).</p>
                                    </div>

                                    {/* Scrollable Area */}
                                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">

                                        {/* AUTO SMART OPTION (Featured) */}
                                        <div
                                            onClick={() => {
                                                if (preferredTechniques.includes(AUTO_SMART_TECHNIQUE_ID)) setPreferredTechniques([]);
                                                else setPreferredTechniques([AUTO_SMART_TECHNIQUE_ID]);
                                            }}
                                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden group ${preferredTechniques.includes(AUTO_SMART_TECHNIQUE_ID) ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-purple-300'}`}
                                        >
                                            {preferredTechniques.includes(AUTO_SMART_TECHNIQUE_ID) && (
                                                <div className="absolute top-0 right-0 bg-purple-500 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">SELECTED</div>
                                            )}
                                            <div className="flex items-start gap-4">
                                                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl text-white shadow-lg">
                                                    <Sparkles size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                                        Auto SMART System <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Recommended</span>
                                                    </h4>
                                                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                                        Allow our AI to dynamically select the most effective technique for each session based on the topic's difficulty and your cognitive load.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            {STUDY_TECHNIQUES.filter(t => t.id !== AUTO_SMART_TECHNIQUE_ID).map(tech => {
                                                const priorityIndex = preferredTechniques.indexOf(tech.id);
                                                const isSelected = priorityIndex >= 0;
                                                return (
                                                    <div
                                                        key={tech.id}
                                                        onClick={() => {
                                                            // If Auto Smart is selected, deselect it
                                                            let newTechs = preferredTechniques.filter(t => t !== AUTO_SMART_TECHNIQUE_ID);

                                                            if (newTechs.includes(tech.id)) {
                                                                newTechs = newTechs.filter(id => id !== tech.id);
                                                            } else if (newTechs.length < 3) {
                                                                newTechs.push(tech.id);
                                                            }
                                                            setPreferredTechniques(newTechs);
                                                        }}
                                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
                                                    >
                                                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                                            <Brain size={18} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <h4 className={`font-bold ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{tech.name}</h4>
                                                                {isSelected && (
                                                                    <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider shadow-sm">
                                                                        {priorityIndex === 0 ? '1st Priority' : priorityIndex === 1 ? '2nd Priority' : '3rd Priority'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-slate-500 leading-relaxed max-w-[90%]">{tech.description}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>

                        {/* FOOTER ACTIONS */}
                        <div className="mt-8 flex justify-end">
                            {wizardStep < 4 ? (
                                <Button
                                    className="bg-slate-900 text-white px-8 py-6 rounded-xl hover:bg-slate-800 text-lg font-bold shadow-xl shadow-slate-200"
                                    onClick={() => setWizardStep(prev => prev + 1)}
                                    disabled={wizardStep === 1 && !examDate}
                                >
                                    Next Step <ArrowRight className="ml-2" size={20} />
                                </Button>
                            ) : (
                                <Button
                                    className="bg-blue-600 text-white px-10 py-6 rounded-xl hover:bg-blue-500 text-lg font-bold shadow-xl shadow-blue-200 w-full md:w-auto"
                                    onClick={handleGenerate}
                                    disabled={generating}
                                >
                                    {generating ? (
                                        <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</span>
                                    ) : (
                                        <span className="flex items-center gap-2"><Sparkles className="fill-blue-200" /> Generate Professional Plan</span>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- PLAN VIEW ---
    if (!plan) return null;

    // Show first 14 days now since it's more compact
    const visibleSchedule = plan.schedule.slice(0, 14);
    const progress = Math.round((Object.keys(completedSessions).length / plan.metrics.totalSessions) * 100);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
            {/* OVERLAYS */}
            {activeFocusSession && (
                <FocusModeOverlay
                    session={activeFocusSession.session}
                    details={activeFocusSession.details}
                    onClose={() => setActiveFocusSession(null)}
                    onComplete={() => {
                        toggleSessionCompletion(activeFocusSession.session.id);
                        setActiveFocusSession(null);
                    }}
                />
            )}
            {activeResourceDomain && (
                <ResourceHubModal
                    domain={activeResourceDomain}
                    onClose={() => setActiveResourceDomain(null)}
                />
            )}

            {/* TOP BAR */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm/50 backdrop-blur-md bg-white/90">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <Button variant="ghost" size="sm" onClick={onExit} className="text-slate-400 hover:text-slate-800 -ml-2">
                            &larr; Exit
                        </Button>
                        <div>
                            <h2 className="font-black text-slate-800 text-lg tracking-tight">Your Smart Plan</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{plan.phase} PHASE • {progress}% COMPLETE</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Current Streak</span>
                            <span className="font-black text-slate-800 flex items-center gap-1">2 Days <Zap size={12} className="text-amber-500 fill-amber-500" /></span>
                        </div>
                        <Button className="bg-slate-900 text-white font-bold text-sm shadow-lg shadow-slate-200">
                            Resume Plan
                        </Button>
                    </div>
                </div>
                {/* Progress Bar Line */}
                <div className="h-1 w-full bg-slate-100">
                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
            </div>

            {/* MAIN SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto w-full p-6 md:p-10">

                    {/* INSIGHT BANNER */}
                    <div className="mb-10 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-sm border border-white/20">
                                <Sparkles size={12} /> AI Strategy
                            </div>
                            <h3 className="text-2xl font-black mb-2">Focus on {plan.config.weakDomains[0]}</h3>
                            <p className="text-blue-100 max-w-xl leading-relaxed">
                                Based on your profile, we've front-loaded difficult topics using high-retention techniques like Active Recall. Keep your momentum this week!
                            </p>
                        </div>
                    </div>

                    {/* TIMELINE */}
                    <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 space-y-12 pb-20">
                        {visibleSchedule.map((day, idx) => (
                            <div key={day.date} className="relative pl-8 md:pl-12">
                                {/* Timeline Dot */}
                                <div className={`
                                    absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 box-content
                                    ${idx === 0 ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-300'}
                                `} />

                                {/* DATE HEADER */}
                                <div className="mb-6 flex items-center gap-4">
                                    <h4 className={`text-xl font-bold ${idx === 0 ? 'text-slate-800' : 'text-slate-500'}`}>
                                        {new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                    </h4>
                                    {day.type === 'REST' && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Rest & Recovery</span>}
                                    {idx === 0 && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Today</span>}
                                </div>

                                {/* SESSIONS GRID */}
                                <div className="space-y-4">
                                    {day.type === 'STUDY' ? day.sessions.map((session) => (
                                        <SessionCard
                                            key={session.id}
                                            session={session}
                                            config={plan.config}
                                            completed={!!completedSessions[session.id]}
                                            onComplete={toggleSessionCompletion}
                                            onStartFocus={(s, d) => setActiveFocusSession({ session: s, details: d })}
                                            onOpenResources={setActiveResourceDomain}
                                        />
                                    )) : (
                                        // REST DAY CARD
                                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                            <div className="bg-white p-4 rounded-full shadow-sm text-emerald-500">
                                                <Sparkles size={24} />
                                            </div>
                                            <div>
                                                <h5 className="text-lg font-black text-emerald-900 mb-1">Wellness Recharge</h5>
                                                <p className="text-sm text-emerald-800/70 max-w-lg leading-relaxed">
                                                    Your brain needs this time to consolidate memory. Step away from screens, hydrate, and prepare for tomorrow's session.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};
