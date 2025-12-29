import React, { useState, useRef, useEffect } from 'react';
import { GenericRendererProps } from './types';

// Initialize AI (Note: In a production app, calls should go through backend to hide key)
// For this Local Tool user request:
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export const HotSpotRenderer: React.FC<GenericRendererProps> = ({ config, answers, setAnswers, isSubmitted }) => {
    // config.imageUrl: string
    // config.areas: { id, x, y, radius, rationale }[]
    // config.imageGenPrompt: string (Simulated field)

    // Local override state for editing
    const [localImage, setLocalImage] = useState<string | null>(null);
    const [imageSource, setImageSource] = useState<string | null>(null); // For Copyright/Attribution
    const [isEditing, setIsEditing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Zoom State (Default 100%)
    const [zoomLevel, setZoomLevel] = useState<number>(100);
    // Retry state for auto-rescuing broken URLs
    const [retryCount, setRetryCount] = useState(0);


    const [editTarget, setEditTarget] = useState<{ x: number, y: number } | null>(null);

    // Initial state setup
    const initialTarget = config.areas?.find((a: any) => a.isCorrect);
    // Use localImage > config.imageUrl > Placeholder
    const displayedImage = localImage || config.imageUrl || "https://placehold.co/600x400/e2e8f0/64748b?text=Medical+Image+Diagram+(Chest/Abdomen)";

    function apiAnswerToMarker(ans: any) {
        if (ans && typeof ans.x === 'number') return ans;
        return null;
    }

    // User Answer Marker
    const [marker, setMarker] = useState<{ x: number, y: number } | null>(apiAnswerToMarker(answers));

    // --- AI SMART IMAGE SOURCING (Strict Validation Mode) ---
    const handleGenerateImage = async () => {
        const promptToUse = config.imageGenPrompt || config.prompt;
        if (!promptToUse) {
            alert("No prompt available to search for.");
            return;
        }

        setIsGenerating(true);
        setImageSource(null);
        try {
            let strategy = "strict_keyword";
            let searchQueries = [`${promptToUse} diagram English`]; // Default safe query
            let validationKeywords: string[] = [];

            // STEP 1: AI BRAIN - Generate Queries AND Validation Rules
            if (API_KEY) {
                try {
                    const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
                    const listData = await listResponse.json();
                    const validModel = listData.models?.find((m: any) => m.supportedGenerationMethods?.includes("generateContent"));

                    if (validModel) {
                        strategy = "ai_strict";
                        const genUrl = `https://generativelanguage.googleapis.com/v1beta/${validModel.name}:generateContent?key=${API_KEY}`;

                        // Strict Prompt for Gemini
                        const aiPrompt = `
                            Task: Find a perfectly relevant, specific medical diagram for: "${promptToUse}".
                            
                            Return a valid JSON object (NO Markdown) with:
                            1. "queries": Array of 2 distinct search strings for Wikimedia.
                               - Query 1: Very specific (e.g. "Gray532.png" or "Coronal section of heart diagram").
                               - Query 2: Broader but strict (e.g. "Heart anatomy diagram English").
                               - ALWAYS append "diagram" or "plate" to avoid photos.
                            2. "must_contain": Array of 2-3 key anatomical terms that MUST appear in the image title/description to be accepted.
                               - Example for 'Femur': ["Femur", "Bone"]
                            
                            Example: { "queries": ["Gray245.png", "Femur anatomy diagram English"], "must_contain": ["Femur", "Thigh"] }
                        `;

                        const response = await fetch(genUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ contents: [{ parts: [{ text: aiPrompt }] }] })
                        });

                        const data = await response.json();
                        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
                        const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

                        try {
                            const aiResult = JSON.parse(cleanJson);
                            if (Array.isArray(aiResult.queries)) searchQueries = aiResult.queries;
                            if (Array.isArray(aiResult.must_contain)) validationKeywords = aiResult.must_contain;
                            console.log("AI Validation Rules:", validationKeywords);
                        } catch (e) {
                            console.warn("AI JSON parse failed, using safer defaults.");
                        }
                    }
                } catch (ignore) {
                    console.warn("AI enhancement failed, falling back to raw search.");
                }
            }

            console.log(`Sourcing Strategy: ${strategy}. Queries:`, searchQueries);

            // STEP 2: EXECUTE SEARCH with STRICT FILTERING
            let foundUrl: string | null = null;
            let foundDescrUrl: string | null = null;

            // Iterate through AI-suggested queries
            for (const query of searchQueries) {
                console.log(`Executing strict search for: "${query}"...`);

                // Fetch top 5 results to allow for filtering
                // prop=imageinfo&iiprop=url|extmetadata (to get description/categories for validation)
                const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|extmetadata&format=json&origin=*&gsrsearch=${encodeURIComponent(query)}`;

                const wikiRes = await fetch(searchUrl);
                const wikiData = await wikiRes.json();
                const pages = wikiData?.query?.pages;

                if (pages && Object.keys(pages).length > 0) {
                    // Filter results
                    const candidates = Object.values(pages) as any[];

                    for (const candidate of candidates) {
                        const info = candidate?.imageinfo?.[0];
                        if (!info?.url) continue;

                        const meta = info.extmetadata || {};
                        const title = candidate.title || "";
                        const description = (meta.ImageDescription?.value || "") + " " + (meta.ObjectName?.value || "");
                        const combinedText = (title + " " + description).toLowerCase();

                        // VALIDATION CHECK
                        // 1. Must contain specific validation keywords (if AI provided them)
                        const hasKeywords = validationKeywords.length === 0 || validationKeywords.every((k: string) => combinedText.includes(k.toLowerCase()));

                        // 2. Additional Heuristics (prefer 'diagram', avoid 'photo' if possible?) 
                        // For now, rely on AI queries including "diagram".

                        if (hasKeywords) {
                            console.log(`Passed Strict Validation: ${title}`);
                            foundUrl = info.url;
                            foundDescrUrl = info.descriptionurl;
                            break; // Found a valid one!
                        } else {
                            console.log(`Rejected Candidate: ${title} (Missing keywords: ${validationKeywords.join(', ')})`);
                        }
                    }

                    if (foundUrl) break; // Found matches in this query batch
                }
            }

            // Fallback: If strict validation killed all results, just take the first result of the *last* query (Desperation Mode)
            if (!foundUrl && searchQueries.length > 0) {
                console.warn("Strict validation failed for all candidates. Falling back to top result.");
                // Re-run last query simply or use cached? Let's just re-fetch top 1 of the safest query.
                const fallbackQuery = searchQueries[searchQueries.length - 1]; // usually the broader one
                const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url|extmetadata&format=json&origin=*&gsrsearch=${encodeURIComponent(fallbackQuery)}`;
                const r = await fetch(searchUrl);
                const d = await r.json();
                const p = d?.query?.pages;
                if (p) {
                    const first = Object.values(p)[0] as any;
                    if (first?.imageinfo?.[0]?.url) {
                        foundUrl = first.imageinfo[0].url;
                        foundDescrUrl = first.imageinfo[0].descriptionurl;
                    }
                }
            }

            // STEP 3: RESULT
            if (foundUrl) {
                setLocalImage(foundUrl);
                setImageSource(foundDescrUrl || "https://commons.wikimedia.org"); // Set Attribution
                setMarker(null);
            } else {
                throw new Error("No strictly relevant images found.");
            }

        } catch (e: any) {
            console.error("Sourcing Error", e);
            alert(`Could not auto-find an image. Please search Google Images manually and upload the file.\n\nError: ${e.message}`);
            // Fallback
            setLocalImage("https://placehold.co/600x400/e2e8f0/64748b?text=Image+Search+Failed+(Upload+Manually)");
        } finally {
            setIsGenerating(false);
        }
    };

    // Auto-trigger image search on mount or when prompt changes
    // We need a persistent ref for the async function to check
    const isMountedRef = useRef(true);
    useEffect(() => {
        isMountedRef.current = true;
        return () => { isMountedRef.current = false; };
    }, []);

    // Auto-trigger image search on mount (Parse -> Preview flow)
    useEffect(() => {
        const promptToUse = config.imageGenPrompt || config.prompt;
        const isPlaceholder = !config.imageUrl || config.imageUrl.includes('placehold');

        // Reset retry count for new questions
        setRetryCount(0);

        // Only run if we need an image AND (it's a placeholder OR we haven't failed yet)
        if (promptToUse && !localImage && isPlaceholder) {
            handleGenerateImage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.imageGenPrompt, config.prompt]);

    const imgRef = useRef<HTMLImageElement>(null);

    const handleClick = (e: React.MouseEvent) => {
        if (isSubmitted && !isEditing) return;
        if (!imgRef.current) return;

        const rect = imgRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100; // %
        const y = ((e.clientY - rect.top) / rect.height) * 100; // %

        if (isEditing) {
            // In Edit Mode, clicking sets the TARGET AREA, not an answer
            setEditTarget({ x, y });
        } else {
            // Normal Student Mode
            const newMarker = { x, y };
            setMarker(newMarker);
            setAnswers(newMarker);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setLocalImage(ev.target?.result as string);
                setImageSource(null); // Uploaded image has no auto-source
                setMarker(null); // Reset user answer
            };
            reader.readAsDataURL(file);
        }
    };

    // Use current or edited target zone
    const targetZone = isEditing && editTarget ? { ...initialTarget, x: editTarget.x, y: editTarget.y } : (initialTarget || { x: 50, y: 50, radius: 10 });

    // Validation Logic
    let feedbackClass = '';
    let isHit = false;

    if (isSubmitted && marker) {
        // Simple distance check (assuming circular zone)
        // Adjust for aspect ratio if needed, but simplistic % distance is often okay for simple boxes
        const dist = Math.sqrt(Math.pow(marker.x - targetZone.x, 2) + Math.pow(marker.y - targetZone.y, 2));
        isHit = dist <= (targetZone.radius || 10);
        feedbackClass = isHit ? 'correct' : 'incorrect';
    }

    // JSON Export Snippet
    const getUpdatedJson = () => {
        return JSON.stringify({
            ...config,
            imageUrl: "YOUR_UPLOADED_URL_HERE",
            areas: [{ ...targetZone, x: parseFloat(targetZone.x.toFixed(1)), y: parseFloat(targetZone.y.toFixed(1)) }]
        }, null, 2);
    };

    // Zoom Helpers
    const handleZoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setZoomLevel(parseInt(e.target.value));
    };

    return (
        <div className="hotspot-renderer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

            {/* EDITOR CONTROLS (Only visible if you hover top right or via explicit toggle in prod) */}
            {!isSubmitted && (
                <div style={{ width: '100%', marginBottom: '12px', padding: '8px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>🛠️ Creator Tools:</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <label style={{ cursor: 'pointer', padding: '4px 12px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 500 }}>
                            📷 Upload
                            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                        </label>

                        {/* ZOOM CONTROL */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                            <span>🔍 Zoom:</span>
                            <select
                                value={zoomLevel}
                                onChange={handleZoomChange}
                                style={{ padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            >
                                <option value={25}>25%</option>
                                <option value={50}>50%</option>
                                <option value={75}>75%</option>
                                <option value={100}>100% (Default)</option>
                                <option value={125}>125%</option>
                                <option value={150}>150%</option>
                                <option value={200}>200%</option>
                                <option value={300}>300%</option>
                            </select>
                        </div>

                        <button
                            onClick={handleGenerateImage}
                            disabled={isGenerating}
                            style={{
                                padding: '4px 12px',
                                background: isGenerating ? '#e2e8f0' : '#8b5cf6',
                                color: isGenerating ? '#94a3b8' : 'white',
                                border: '1px solid #7c3aed',
                                borderRadius: '4px',
                                fontSize: '0.8rem', cursor: isGenerating ? 'wait' : 'pointer'
                            }}>
                            {isGenerating ? 'Finding English Ver...' : '✨ Auto-Find (Strict)'}
                        </button>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            style={{
                                padding: '4px 12px',
                                background: isEditing ? '#3b82f6' : 'white',
                                color: isEditing ? 'white' : '#1e293b',
                                border: '1px solid #cbd5e1',
                                borderRadius: '4px',
                                fontSize: '0.8rem', cursor: 'pointer'
                            }}>
                            {isEditing ? 'Define Target' : '📍 Calibrate Target'}
                        </button>
                    </div>
                </div>
            )}

            {isEditing && (
                <div style={{ width: '100%', padding: '12px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '6px', marginBottom: '12px', fontSize: '0.85rem' }}>
                    <strong>Create/Update JSON:</strong> Copy this snippet to update your file.
                    <textarea
                        readOnly
                        value={getUpdatedJson()}
                        style={{ width: '100%', height: '80px', marginTop: '8px', fontFamily: 'monospace', fontSize: '0.8rem', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                        onClick={(e) => e.currentTarget.select()}
                    />
                </div>
            )}

            <div style={{
                width: '100%',
                overflowX: 'auto', // Allow scroll if zoom > 100%
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
            }}>
                {/* Image Wrapper */}
                <div
                    style={{
                        position: 'relative',
                        cursor: isEditing ? 'crosshair' : (isSubmitted ? 'default' : 'pointer'),
                        width: `${zoomLevel}%`, // ZOOM APPLIED HERE
                        minWidth: '200px', // Prevent too small
                        border: isEditing ? '2px dashed #3b82f6' : '1px solid #cbd5e1',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        lineHeight: 0,
                        transition: 'width 0.3s ease-in-out',
                        alignSelf: 'center' // Keep image centered in the container
                    }}
                    onClick={handleClick}
                >
                    {/* Image */}
                    <img
                        ref={imgRef}
                        src={displayedImage}
                        alt="Clinical Diagram"
                        onError={(e) => {
                            // AUTO-RESCUE: If image fails (404), try to Auto-Find ONE TIME.
                            if (retryCount === 0 && !localImage) {
                                console.warn("Image load failed. Attempting Auto-Rescue...");
                                setRetryCount(1);
                                e.currentTarget.src = "https://placehold.co/600x400/e2e8f0/64748b?text=Searching...";
                                handleGenerateImage();
                            } else {
                                e.currentTarget.src = "https://placehold.co/600x400/e2e8f0/64748b?text=Image+Load+Error";
                            }
                        }}
                        style={{
                            display: 'block',
                            width: '100%', // Fills the variable width wrapper
                            height: 'auto',
                            pointerEvents: 'none',
                            userSelect: 'none'
                        }}
                    />

                    {/* The User's Pin (Student Mode) */}
                    {!isEditing && marker && (
                        <div
                            style={{
                                position: 'absolute',
                                left: `${marker.x}%`,
                                top: `${marker.y}%`,
                                width: '24px',
                                height: '24px',
                                marginLeft: '-12px',
                                marginTop: '-12px',
                                background: feedbackClass === 'correct' ? '#22c55e' : (feedbackClass === 'incorrect' ? '#ef4444' : '#3b82f6'),
                                border: '3px solid white',
                                borderRadius: '50%',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                                pointerEvents: 'none',
                                transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                transform: 'scale(1)',
                                zIndex: 10
                            }}
                        >
                            {isSubmitted && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-34px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: '#1e293b',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}>
                                    {feedbackClass === 'correct' ? 'Correct' : 'Incorrect'}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Target Zone (Visible if Submitted OR Editing) */}
                    {(isSubmitted || isEditing) && targetZone && (
                        <div
                            style={{
                                position: 'absolute',
                                left: `${targetZone.x}%`,
                                top: `${targetZone.y}%`,
                                width: `${(targetZone.radius || 10) * 2}%`, // Approximate width conversion based on parent %
                                height: 'auto',
                                aspectRatio: '1/1', // Keep circle circular regardless of parent rect
                                minWidth: '40px', // Min touch size
                                marginLeft: `-${targetZone.radius || 10}%`,
                                marginTop: `-${targetZone.radius || 10}%`, // This centering is imperfect with %. Better to use Translation.
                                transform: 'translate(-50%, -50%)', // Better Centering

                                // Visuals
                                border: isEditing ? '2px dashed #3b82f6' : '2px dashed #22c55e',
                                borderRadius: '50%',
                                background: isEditing ? 'rgba(59, 130, 246, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                pointerEvents: 'none',
                                zIndex: 5
                            }}
                        >
                            {(isEditing || isSubmitted) && (
                                <span style={{
                                    position: 'absolute',
                                    bottom: '-24px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    color: isEditing ? '#1e40af' : '#166534',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    background: 'rgba(255,255,255,0.9)',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    whiteSpace: 'nowrap',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    {isEditing ? 'New Target' : 'Correct Area'}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Attribution Footer - LEFT ALIGNED */}
                {imageSource && (
                    <div style={{
                        width: `${zoomLevel}%`,
                        alignSelf: 'center', // Match the image width
                        marginTop: '4px',
                        textAlign: 'left', // LEFT ALIGNED
                        paddingLeft: '2px'
                    }}>
                        <a href={imageSource} target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', color: '#64748b', textDecoration: 'none', fontStyle: 'italic' }}>
                            Reference: Wikimedia Commons (Public Domain) ↗
                        </a>
                    </div>
                )}
            </div>

            {/* Legend/Helper */}
            <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>
                {isEditing
                    ? "Click anywhere on the image to set the new correct Answer Zone."
                    : (isSubmitted ? "Review the target area." : "Click on the image to place your answer marker.")}
            </p>
        </div>
    );
};
