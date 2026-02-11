/**
 * CaseStudyEngine.ts
 * 
 * Manages the state and logic for the 6-Screen NGN Unfolding Case Study Mode.
 * Handles progressive information reveal (EHR updates) and scoring.
 */

import { MasterQuestionItem } from '../../types/master-schema';

// Define the 6 NGN Steps
export type NGMStep = 'RECOGNIZE' | 'ANALYZE' | 'PRIORITIZE' | 'GENERATE' | 'ACTION' | 'EVALUATE';

export interface CaseState {
    currentScreenIndex: number; // 0-5
    screens: CaseScreen[];
    patientState: PatientState; // Current visible state of EHR
    history: CaseDecision[];
    totalScore: number;
    maxPossibleScore: number;
}

export interface CaseScreen {
    id: string;
    step: NGMStep;
    title: string;
    description: string;
    content: MasterQuestionItem; // The actual question item
    timeOffset: string; // e.g. "08:00", "10:00"
    newInfo: {
        type: 'VITALS' | 'LABS' | 'NOTES' | 'ORDERS';
        summary: string; // "New labs received"
        data: any;
    }[];
}

export interface PatientState {
    demographics: any;
    vitals: any[];
    labs: any[];
    notes: any[];
    orders: any[];
    medications: any[];
}

export interface CaseDecision {
    screenIndex: number;
    answer: any;
    isCorrect: boolean;
    score: number;
    maxScore: number;
    timestamp: number;
}

export class CaseStudyEngine {

    /**
     * Initialize a new Case Study Session
     * Mocks a 6-screen structure for immediate usage
     */
    static initializeCase(): CaseState {
        // In a real app, this would fetch 6 linked items and their metadata
        // For now, we return the initial state container
        return {
            currentScreenIndex: 0,
            screens: [], // Will be populated by the UI/Service fetching items
            patientState: {
                demographics: { name: "Alex R.", age: 45, gender: "M", admitReason: "Chest Pain" },
                vitals: [],
                labs: [],
                notes: [],
                orders: [],
                medications: []
            },
            history: [],
            totalScore: 0,
            maxPossibleScore: 0
        };
    }

    /**
     * Unfold Information based on Screen Index
     * Simulates the arrival of new clinical data over time
     */
    static unfoldPatientState(baseState: PatientState, screenIndex: number): PatientState {
        // Deep copy
        const visibleState = JSON.parse(JSON.stringify(baseState));

        // This logic simulates "progressive reveal". 
        // In a real DB, each screen would have "attached" EHR data updates.
        // Here we simulate it based on index.

        // 1. RECOGNIZE (08:00) - Initial
        if (screenIndex >= 0) {
            visibleState.notes.push({ time: "08:00", text: "Patient admitted via ED with crushing substernal chest pain 8/10." });
            visibleState.vitals.push({ time: "08:00", hr: 110, bp: "158/92", rr: 22, o2: 94, temp: 37.1 });
        }

        // 2. ANALYZE (08:30) - Labs return
        if (screenIndex >= 1) {
            visibleState.labs.push({ time: "08:30", type: "Cardiac", tropes: "0.04 (Elevated)", ck: "180" });
            visibleState.notes.push({ time: "08:35", text: "Provided aspirin 324mg and nitro SL x1." });
        }

        // 3. PRIORITIZE (09:00) - Decline/Improve
        if (screenIndex >= 2) {
            visibleState.vitals.push({ time: "09:00", hr: 105, bp: "140/85", rr: 20, o2: 95, temp: 37.1 });
            visibleState.notes.push({ time: "09:00", text: "Pain decreased to 4/10 after nitro. ECG shows ST elevation in V2-V4." });
        }

        // 4. GENERATE (09:15) - Orders
        if (screenIndex >= 3) {
            visibleState.orders.push({ time: "09:15", order: "Heparin Drip Protocol", provider: "Dr. Smith" });
            visibleState.orders.push({ time: "09:15", order: "Prepare for Cath Lab", provider: "Dr. Smith" });
        }

        // 5. ACTION (09:30) - Intervention
        if (screenIndex >= 4) {
            visibleState.medications.push({ time: "09:30", drug: "Heparin", dose: "5000 units IV Bolus", status: "Given" });
        }

        // 6. EVALUATE (10:30) - Outcome
        if (screenIndex >= 5) {
            visibleState.notes.push({ time: "10:30", text: "Patient returned from Cath Lab. 1 stent placed in LAD. Pain 0/10." });
            visibleState.vitals.push({ time: "10:30", hr: 82, bp: "122/78", rr: 16, o2: 98, temp: 37.0 });
        }

        return visibleState;
    }

    /**
     * Score a user response for a given screen
     */
    static scoreScreen(
        step: NGMStep,
        userResponse: any,
        correctResponse: any
    ): { score: number, maxScore: number, feedback: string } {
        // Simplified scoring logic for MVP
        // In real NGN:
        // +/- scoring for SATA
        // 0/1 for Radio

        // Mock logic:
        const isCorrect = JSON.stringify(userResponse) === JSON.stringify(correctResponse); // Naive check

        switch (step) {
            case 'RECOGNIZE': // SATA typically
                return { score: isCorrect ? 1 : 0, maxScore: 1, feedback: "Correctly identified cues." };
            case 'PRIORITIZE': // Drag drop
                return { score: isCorrect ? 2 : 0, maxScore: 2, feedback: "Correct priority established." };
            default:
                return { score: isCorrect ? 1 : 0, maxScore: 1, feedback: "Action correct." };
        }
    }
}
