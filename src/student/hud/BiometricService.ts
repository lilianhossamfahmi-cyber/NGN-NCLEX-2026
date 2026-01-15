/**
 * BiometricService.ts
 * Simulates tracking of user behavior (since we lack real sensors)
 */

export interface BiometricSnapshot {
    timestamp: number;
    focusScore: number;
    stressIndex: number;
    mouseVelocity: number;
}

export class BiometricService {
    private isTracking = false;
    private listeners: ((data: BiometricSnapshot) => void)[] = [];
    private intervalId: any = null;

    // Derived State
    private currentFocus = 100;
    private currentStress = 0;

    startTracking() {
        if (this.isTracking) return;
        this.isTracking = true;

        // In a real app, we'd attach mousemove/scroll listeners here
        // For MVP, we simulate fluctuations
        this.intervalId = setInterval(() => {
            this.simulateFluctuation();
            this.emit();
        }, 3000); // Update every 3s
    }

    stopTracking() {
        this.isTracking = false;
        if (this.intervalId) clearInterval(this.intervalId);
    }

    onUpdate(callback: (data: BiometricSnapshot) => void) {
        this.listeners.push(callback);
    }

    private simulateFluctuation() {
        // Random walk for demo purposes
        // Focus naturally decays over time without interaction (simulated)
        const decay = Math.random() > 0.7 ? -2 : 1;
        this.currentFocus = Math.min(100, Math.max(20, this.currentFocus + decay));

        // Stress spikes randomly
        const stressSpike = Math.random() > 0.9 ? 10 : -2;
        this.currentStress = Math.min(100, Math.max(0, this.currentStress + stressSpike));
    }

    private emit() {
        const snapshot: BiometricSnapshot = {
            timestamp: Date.now(),
            focusScore: this.currentFocus,
            stressIndex: this.currentStress,
            mouseVelocity: Math.random() * 100 // Mock
        };
        this.listeners.forEach(l => l(snapshot));
    }
}
