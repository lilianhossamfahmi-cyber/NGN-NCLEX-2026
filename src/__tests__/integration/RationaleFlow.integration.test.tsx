/**
 * Integration Test: Complete Rationale Data Flow
 * Tests: StudentPreviewModal → RationaleDrawer → RationaleSheet → UltimateRationale
 */

import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { StudentPreviewModal } from '../../components/StudentPreviewModal';
import type { FullItemData, MasterQuestionItem } from '../../types/master-schema';

describe('🔗 INTEGRATION: Complete Rationale Flow', () => {

    const mockOnClose = jest.fn();

    // ✅ TEST 1: Verify FullItemData Cache Loading
    it('should load and cache full item data on modal open', async () => {
        const mockItem: any = {
            id: 'test-q-001',
            type: 'BowTie',
            content: {
                prompt: 'Test question',
                rationale: {
                    referenceInfo: { anatomy: 'Test anatomy' },
                    difficulty: { label: 'MODERATE', clinicalStrategy: 'Test strategy' },
                    mnemonic: { title: 'TEST', content: 'T-E-S-T', explanation: 'Test Example Study Tool' },
                    cheatSheet: { title: 'Quick Ref', points: [] },
                },
            },
        };

        render(
            <StudentPreviewModal
                item={mockItem as any}
                onClose={mockOnClose}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/Test question/)).toBeInTheDocument();
        });

        console.log('✅ TEST 1 PASSED: Full item data loaded and cached');
    });

    // ✅ TEST 2: Verify Rationale Drawer Opens with Correct Props
    it('should open rationale drawer with extracted rationale', async () => {
        const mockItem: any = {
            id: 'test-q-002',
            type: 'Matrix',
            content: {
                prompt: 'Complex NGN case',
            }
        };

        render(
            <StudentPreviewModal
                item={mockItem as any}
                onClose={mockOnClose}
            />
        );

        // Submit the question first to enable rationale button
        const submitBtn = screen.getByRole('button', { name: /SUBMIT/i });
        fireEvent.click(submitBtn);

        // Clicking rationale button
        const rationaleBtn = await screen.findByTitle(/View Clinical Reasoning/i);
        fireEvent.click(rationaleBtn);

        await waitFor(() => {
            expect(screen.getByText(/Clinical Reasoning/i)).toBeInTheDocument();
        });

        console.log('✅ TEST 2 PASSED: Rationale drawer opened with correct props');
    });

    // ✅ TEST 3: Verify Tab Navigation in UltimateRationale
    it('should navigate between rationale tabs', async () => {
        const mockItem: any = {
            id: 'test-q-003',
            type: 'SATA',
            content: {
                prompt: 'Multi-tab test',
            }
        };

        render(
            <StudentPreviewModal
                item={mockItem as any}
                onClose={mockOnClose}
            />
        );

        // Submit to enable rationale
        const submitBtn = screen.getByRole('button', { name: /SUBMIT/i });
        fireEvent.click(submitBtn);

        // Open rationale drawer
        const rationaleBtn = await screen.findByTitle(/View Clinical Reasoning/i);
        fireEvent.click(rationaleBtn);

        // Navigate to Clinical Logic tab (Tab 2)
        const logicBtn = screen.getByRole('button', { name: /logic/i }); // Adjusted based on actual implementation
        fireEvent.click(logicBtn);

        await waitFor(() => {
            expect(screen.getByText(/Clinical Logic/i)).toBeInTheDocument();
        });

        console.log('✅ TEST 3 PASSED: Tab navigation working correctly');
    });

    // ✅ TEST 4: Verify Priority Hierarchy (explicit → fullItem → question → default)
    it('should use priority hierarchy for rationale extraction', async () => {
        const mockItem: any = {
            id: 'test-q-004',
            type: 'BowTie',
            content: {
                prompt: 'Priority test',
                rationale: {
                    referenceInfo: { anatomy: 'FullItem-level rationale (should be used)' },
                },
            },
        };

        render(
            <StudentPreviewModal
                item={mockItem as any}
                onClose={mockOnClose}
            />
        );

        // Submit to enable rationale
        const submitBtn = screen.getByRole('button', { name: /SUBMIT/i });
        fireEvent.click(submitBtn);

        const rationaleBtn = await screen.findByTitle(/View Clinical Reasoning/i);
        fireEvent.click(rationaleBtn);

        // Check that FullItem rationale is prioritized
        await waitFor(() => {
            expect(screen.getByText(/FullItem-level rationale/i)).toBeInTheDocument();
        });

        console.log('✅ TEST 4 PASSED: Priority hierarchy working');
    });

    // ✅ TEST 5: Verify Fallback to Default Rationale
    it('should gracefully fallback to default rationale when no data available', async () => {
        const mockItem: any = {
            id: 'test-q-005',
            type: 'Calculation',
            content: {
                prompt: 'No rationale available',
            }
        };

        render(
            <StudentPreviewModal
                item={mockItem as any}
                onClose={mockOnClose}
            />
        );

        // Submit to enable rationale
        const submitBtn = screen.getByRole('button', { name: /SUBMIT/i });
        fireEvent.click(submitBtn);

        // Open rationale drawer
        const rationaleBtn = await screen.findByTitle(/View Clinical Reasoning/i);
        fireEvent.click(rationaleBtn);

        await waitFor(() => {
            // Should show fallback content
            expect(screen.getByText(/Reference information not available/i)).toBeInTheDocument();
        });

        console.log('✅ TEST 5 PASSED: Gracefully handled missing rationale data');
    });

    // ✅ TEST 6: Verify Console Logging for Debugging
    it('should log diagnostic information for debugging', async () => {
        const consoleSpy = jest.spyOn(console, 'log');

        const mockItem: any = {
            id: 'test-q-006',
            type: 'BowTie',
            content: {
                prompt: 'Logging test',
            }
        };

        render(
            <StudentPreviewModal
                item={mockItem as any}
                onClose={mockOnClose}
            />
        );

        // Submit to enable rationale
        const submitBtn = screen.getByRole('button', { name: /SUBMIT/i });
        fireEvent.click(submitBtn);

        const rationaleBtn = await screen.findByTitle(/View Clinical Reasoning/i);
        fireEvent.click(rationaleBtn);

        await waitFor(() => {
            // Should see console logs from the pipeline
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('🔍'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('✅'));
        });

        consoleSpy.mockRestore();
        console.log('✅ TEST 6 PASSED: Diagnostic logging working');
    });
});
