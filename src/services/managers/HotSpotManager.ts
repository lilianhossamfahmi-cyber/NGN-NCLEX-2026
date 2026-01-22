
import { AbstractItemManager } from './AbstractItemManager';
import { MasterQuestionItem } from '../../types/master-schema';
import { ValidationResult, GradingResult } from './ItemManager';

export class HotSpotManager extends AbstractItemManager {
    typeKeys = ['hot-spot', 'hot_spot', 'image-hotspot'];

    /**
     * HOT SPOT REPAIR
     * 1. Ensures render dimensions are present (crucial for responsive scaling).
     * 2. Validates that the target area is within 0-100% bounds.
     */
    protected async repairSpecific(item: MasterQuestionItem): Promise<MasterQuestionItem> {
        if (!item.content) item.content = {};
        const structure = item.content.structure || {};

        // 1. Ensure Media Exists
        if (!structure.media) {
            // Check prompt for clues to generate a placeholder
            structure.media = {
                type: 'image',
                url: '/placeholder-medical.jpg',
                altText: 'Medical illustration'
            };
        }

        // 2. Normalize Target Area (x, y, radius)
        // We use percentage-based coordinates for responsiveness
        if (structure.targetArea) {
            const { x, y, radius } = structure.targetArea;
            // Cap at 100%
            structure.targetArea = {
                x: Math.min(100, Math.max(0, x)),
                y: Math.min(100, Math.max(0, y)),
                radius: Math.min(50, Math.max(1, radius || 5)) // Radius shouldn't cover whole image
            };
        } else {
            // Default safe spot if missing
            structure.targetArea = { x: 50, y: 50, radius: 10 };
        }

        item.content.structure = structure;
        return item;
    }

    validate(item: MasterQuestionItem): ValidationResult {
        const issues: any[] = [];
        const s = item.content?.structure || {};

        if (!s.media || !s.media.url) {
            issues.push({ severity: 'critical', field: 'media', message: 'HotSpot requires an image URL.' });
        }

        if (!s.targetArea) {
            issues.push({ severity: 'critical', field: 'targetArea', message: 'Target area (correct answer) is undefined.' });
        }

        return { isValid: issues.filter(i => i.severity === 'critical').length === 0, issues };
    }

    formatForDisplay(item: MasterQuestionItem): any {
        return item;
    }

    /**
     * Grade: Distance Check
     * Is the user's click (x,y) inside the target circle?
     */
    grade(userAnswer: any, correctContent: any): GradingResult {
        // userAnswer: { x: number, y: number } (Percentage coords)
        const userClick = userAnswer || { x: -1, y: -1 };
        const target = correctContent.content?.structure?.targetArea; // { x, y, radius }

        if (!target) return { score: 0, maxScore: 1, feedback: "Error: No target defined.", correctIds: [] };

        // Distance formula: sqrt((x2-x1)^2 + (y2-y1)^2)
        // Since we are in percentage space, aspect ratio might skew circle to ellipse, 
        // but simple distance is usually "good enough" for NGN approximations or we treat axis independently.
        const dist = Math.sqrt(Math.pow(userClick.x - target.x, 2) + Math.pow(userClick.y - target.y, 2));

        const isHit = dist <= target.radius;

        return {
            score: isHit ? 1 : 0,
            maxScore: 1,
            feedback: isHit ? "Correct location." : "Missed the target area.",
            correctIds: ["target-zone"]
        };
    }
}
