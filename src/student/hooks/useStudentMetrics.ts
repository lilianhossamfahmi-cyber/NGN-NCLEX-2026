import { Attempt, StudentStats, BiometricData, DashboardData, RecommendedAction } from '../../types/student-schema';
import { AnalyticsEngine, MockAnalyticsData } from '../services/AnalyticsEngine';
import { useState, useEffect } from 'react';

// In-memory cache for dev; replace with API + React Query later
let cachedAttempts: Attempt[] | null = null;

export const useStudentMetrics = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);

                // 1. Fetch Attempts (Mock for now, will be API fetch)
                // TODO: Replace with fetch('/api/student/attempts')
                if (!cachedAttempts) {
                    cachedAttempts = MockAnalyticsData.generateAttempts(50); // Sim 50 past quizzes
                }
                const attempts = cachedAttempts;

                // 2. Calculate Metrics
                const stats: StudentStats = {
                    accuracy: AnalyticsEngine.calculateAccuracy(attempts),
                    passProbability: AnalyticsEngine.calculatePassProbability(attempts),
                    foundationAcc: AnalyticsEngine.calculateFoundationQuality(attempts),
                    timeEfficiency: AnalyticsEngine.calculateTimeEfficiency(attempts),
                    trend: AnalyticsEngine.calculateTrend(attempts),
                    domains: AnalyticsEngine.calculateDomainMastery(attempts),
                    cjmm: AnalyticsEngine.calculateCjmmBreakdown(attempts)
                };

                // 3. Generate Recommendations (Rule Engine)
                const recommendations: RecommendedAction[] = [];
                if (stats.passProbability < 60) {
                    recommendations.push({
                        id: 'rec_1', type: 'drill', title: 'Foundation Drills',
                        reason: 'Pass Probability is low. Build core knowledge.', actionLink: '/drill/foundation'
                    });
                }
                if (stats.timeEfficiency > 1.2) {
                    recommendations.push({
                        id: 'rec_2', type: 'sim', title: 'Speed Run',
                        reason: 'You are answering slowly. Practice pacing.', actionLink: '/exam/speed'
                    });
                }
                // Find weakest domain
                const weakestDomain = Object.entries(stats.domains).sort((a, b) => a[1] - b[1])[0];
                if (weakestDomain && weakestDomain[1] < 70) {
                    recommendations.push({
                        id: 'rec_3', type: 'review', title: `Review ${weakestDomain[0]}`,
                        reason: `Your lowest area is ${weakestDomain[0]} (${weakestDomain[1]}%).`, actionLink: `/review/${weakestDomain[0]}`
                    });
                }

                // 4. Mock HUD Data
                const biometrics: BiometricData = {
                    avgFocus: 78,
                    stressEvents: 3,
                    calmTrend: [65, 70, 68, 75, 80, 82, 85]
                };

                setData({
                    stats,
                    recentAttempts: attempts.slice(0, 5), // last 5
                    biometrics,
                    recommendations,
                    srsDueCount: 12 // Mock value for now
                });

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    return { data, loading, error };
};
