import {
    generateDistractors,
    generateDistractorsWithRationales,
    validateDistractorQuality,
    type DistractorOptions,
    type DistractorContext
} from './distractorGenerator';

describe('Distractor Generator', () => {
    describe('Basic Distractor Generation', () => {
        test('Should generate correct quantity of distractors', async () => {
            const options: DistractorOptions = {
                correct: 'Administer oxygen at 2 L/min via nasal cannula',
                context: {
                    diagnosis: 'COPD',
                    symptoms: ['dyspnea', 'wheezing'],
                    patientAge: 68,
                    clinicalFocus: 'respiratory'
                },
                difficultyLevel: 3,
                quantity: 3
            };

            const distractors = await generateDistractors(options);
            expect(distractors).toHaveLength(3);
        });

        test('Should generate unique distractors', async () => {
            const options: DistractorOptions = {
                correct: 'Increase IV fluids to 125 mL/hr',
                context: {
                    diagnosis: 'Sepsis',
                    symptoms: ['fever', 'hypotension'],
                    patientAge: 45,
                    clinicalFocus: 'cardiac'
                },
                difficultyLevel: 2,
                quantity: 4
            };

            const distractors = await generateDistractors(options);
            const uniqueSet = new Set(distractors);
            expect(uniqueSet.size).toBe(distractors.length);
        });
    });

    describe('Difficulty-Based Generation', () => {
        const baseContext: DistractorContext = {
            diagnosis: 'Heart Failure',
            symptoms: ['dyspnea', 'edema'],
            patientAge: 72,
            clinicalFocus: 'cardiac'
        };

        test('Level 1-2 should generate surface-level distractors', async () => {
            const options: DistractorOptions = {
                correct: 'Elevate head of bed to 45 degrees',
                context: baseContext,
                difficultyLevel: 2,
                quantity: 3
            };

            const distractors = await generateDistractors(options);
            expect(distractors.length).toBeGreaterThan(0);
            // Should contain simpler distractors
        });

        test('Level 4-5 should generate critical thinking distractors', async () => {
            const options: DistractorOptions = {
                correct: 'Administer furosemide 40 mg IV',
                context: baseContext,
                difficultyLevel: 5,
                quantity: 3
            };

            const distractors = await generateDistractors(options);
            expect(distractors.length).toBeGreaterThan(0);
            // Should contain contraindicated options
        });
    });

    describe('Distractors with Rationales', () => {
        test('Should include rationale for each distractor', () => {
            const options: DistractorOptions = {
                correct: 'Administer insulin as ordered',
                context: {
                    diagnosis: 'Diabetes Mellitus Type 2',
                    symptoms: ['hyperglycemia'],
                    patientAge: 55,
                    clinicalFocus: 'endocrine'
                },
                difficultyLevel: 3,
                quantity: 3
            };

            const distractors = generateDistractorsWithRationales(options);

            expect(distractors.length).toBeGreaterThan(0);
            distractors.forEach(d => {
                expect(d).toHaveProperty('text');
                expect(d).toHaveProperty('rationale');
                expect(d).toHaveProperty('category');
                expect(d.isCorrect).toBe(false);
                expect(d.rationale.length).toBeGreaterThan(10);
            });
        });

        test('Should categorize distractors correctly', () => {
            const options: DistractorOptions = {
                correct: 'Monitor for signs of infection',
                context: {
                    diagnosis: 'Sepsis',
                    symptoms: ['fever'],
                    patientAge: 40,
                    clinicalFocus: 'infection'
                },
                difficultyLevel: 4,
                quantity: 4
            };

            const distractors = generateDistractorsWithRationales(options);

            const categories = distractors.map(d => d.category);
            expect(categories).toContain('critical-thinking');
        });
    });

    describe('Distractor Quality Validation', () => {
        test('Should detect identical distractor and correct answer', () => {
            const correct = 'Administer morphine 2 mg IV';
            const distractor = 'Administer morphine 2 mg IV';

            const validation = validateDistractorQuality(distractor, correct);
            expect(validation.plausible).toBe(false);
            expect(validation.issues.length).toBeGreaterThan(0);
        });

        test('Should detect obviously wrong distractors', () => {
            const correct = 'Monitor vital signs every 4 hours';
            const distractor = 'Never check vital signs';

            const validation = validateDistractorQuality(distractor, correct);
            expect(validation.plausible).toBe(false);
            expect(validation.issues).toContain(
                expect.stringContaining('absolute language')
            );
        });

        test('Should accept plausible distractors', () => {
            const correct = 'Administer oxygen at 2 L/min';
            const distractor = 'Administer oxygen at 10 L/min';

            const validation = validateDistractorQuality(distractor, correct);
            expect(validation.plausible).toBe(true);
            expect(validation.issues).toHaveLength(0);
        });
    });

    describe('Contraindicated Interventions', () => {
        test('Should generate contraindicated intervention for sepsis', async () => {
            const options: DistractorOptions = {
                correct: 'Administer broad-spectrum antibiotics immediately',
                context: {
                    diagnosis: 'Sepsis',
                    symptoms: ['fever', 'hypotension'],
                    patientAge: 50,
                    clinicalFocus: 'infection'
                },
                difficultyLevel: 5,
                quantity: 3
            };

            const distractors = await generateDistractors(options);
            // Should include contraindicated options like restricting fluids
            expect(distractors.length).toBeGreaterThan(0);
        });

        test('Should generate contraindicated intervention for COPD', async () => {
            const options: DistractorOptions = {
                correct: 'Administer oxygen at 2 L/min via nasal cannula',
                context: {
                    diagnosis: 'COPD',
                    symptoms: ['dyspnea'],
                    patientAge: 70,
                    clinicalFocus: 'respiratory'
                },
                difficultyLevel: 5,
                quantity: 3
            };

            const distractors = await generateDistractors(options);
            // Should include high-flow oxygen (contraindicated)
            expect(distractors.length).toBeGreaterThan(0);
        });
    });

    describe('Edge Cases', () => {
        test('Should handle empty correct answer gracefully', async () => {
            const options: DistractorOptions = {
                correct: '',
                context: {
                    diagnosis: 'Unknown',
                    symptoms: [],
                    patientAge: 40,
                    clinicalFocus: 'general'
                },
                difficultyLevel: 3,
                quantity: 3
            };

            const distractors = await generateDistractors(options);
            expect(Array.isArray(distractors)).toBe(true);
        });

        test('Should handle unknown diagnosis gracefully', async () => {
            const options: DistractorOptions = {
                correct: 'Monitor client closely',
                context: {
                    diagnosis: 'Rare Disease XYZ',
                    symptoms: [],
                    patientAge: 45,
                    clinicalFocus: 'general'
                },
                difficultyLevel: 3,
                quantity: 3
            };

            const distractors = await generateDistractors(options);
            expect(distractors.length).toBeGreaterThan(0);
        });
    });
});
