import { useRef } from 'react';

type SwipeCallback = () => void;

interface UseSwipeOptions {
    onSwipeLeft?: SwipeCallback;
    onSwipeRight?: SwipeCallback;
    onSwipeUp?: SwipeCallback;
    onSwipeDown?: SwipeCallback;
    threshold?: number; // Minimum distance to trigger swipe
}

export const useSwipe = ({ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold = 50 }: UseSwipeOptions) => {
    const touchStart = useRef<{ x: number, y: number } | null>(null);
    const touchEnd = useRef<{ x: number, y: number } | null>(null);

    const onTouchStart = (e: React.TouchEvent) => {
        touchEnd.current = null;
        touchStart.current = {
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        };
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEnd.current = {
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        };
    };

    const onTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return;

        const distanceX = touchStart.current.x - touchEnd.current.x;
        const distanceY = touchStart.current.y - touchEnd.current.y;
        const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);

        if (isHorizontal) {
            // Horizontal Swipe
            if (distanceX > threshold) {
                // Swiped Left
                onSwipeLeft && onSwipeLeft();
            } else if (distanceX < -threshold) {
                // Swiped Right
                onSwipeRight && onSwipeRight();
            }
        } else {
            // Vertical Swipe
            if (distanceY > threshold) {
                // Swiped Up
                onSwipeUp && onSwipeUp();
            } else if (distanceY < -threshold) {
                // Swiped Down
                onSwipeDown && onSwipeDown();
            }
        }
    };

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
};
