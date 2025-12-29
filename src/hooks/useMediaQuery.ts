import { useState, useEffect } from 'react';

/**
 * Hook to detect if a media query matches.
 * Useful for switching between Mobile/Desktop layouts in JS.
 * @param query CSS media query string (e.g., '(max-width: 768px)')
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }

        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);

        return () => media.removeEventListener('change', listener);
    }, [matches, query]);

    return matches;
}
