
const STORAGE_KEY_PREFIX = 'ngn_student_history_';

export const StudentHistoryService = {
    /**
     * Get all answered question IDs for a specific student.
     */
    getAnsweredIds: (studentId: string): string[] => {
        try {
            const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${studentId}`);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Failed to load student history', e);
            return [];
        }
    },

    /**
     * Get all answered content signatures (hashes) to prevent duplicate content.
     */
    getAnsweredSignatures: (studentId: string): string[] => {
        try {
            const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}sigs_${studentId}`);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    /**
     * Add a question ID and its content signature to history.
     */
    markAsAnswered: (studentId: string, questionId: string, contentSignature?: string) => {
        try {
            // 1. Save ID
            const currentIds = StudentHistoryService.getAnsweredIds(studentId);
            if (!currentIds.includes(questionId)) {
                const updated = [...currentIds, questionId];
                localStorage.setItem(`${STORAGE_KEY_PREFIX}${studentId}`, JSON.stringify(updated));
            }

            // 2. Save Signature (if provided)
            if (contentSignature) {
                const currentSigs = StudentHistoryService.getAnsweredSignatures(studentId);
                if (!currentSigs.includes(contentSignature)) {
                    const updatedSigs = [...currentSigs, contentSignature];
                    localStorage.setItem(`${STORAGE_KEY_PREFIX}sigs_${studentId}`, JSON.stringify(updatedSigs));
                }
            }
        } catch (e) {
            console.error('Failed to save student history', e);
        }
    },

    /**
     * Clear history for a student (useful for resetting).
     */
    clearHistory: (studentId: string) => {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${studentId}`);
    }
};
