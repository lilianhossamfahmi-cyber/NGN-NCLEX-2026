// api/generate-image.ts
// Vercel Serverless Function for AI Image Generation using Gemini Imagen

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt, context } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Missing prompt' });
        }

        const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ error: 'Gemini API key not configured' });
        }

        const genAI = new GoogleGenerativeAI(API_KEY);

        // Build a detailed prompt for medical/clinical image generation
        const enhancedPrompt = `Create a professional medical/clinical educational image:
    
Context: ${context || 'NCLEX nursing exam preparation material'}
Request: ${prompt}

Requirements:
- Professional, clean, educational style
- Suitable for nursing students
- Clear labeling if anatomical
- No graphic/disturbing content
- High quality, vector-style preferred`;

        console.log(`🎨 Image Generation Request: ${prompt.substring(0, 50)}...`);

        // Try using Gemini's image generation model
        // Note: Imagen 3 is available via gemini-pro-vision or dedicated imagen endpoint
        try {
            // Method 1: Use Imagen 3 model if available
            const imagenModel = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });

            const result = await imagenModel.generateContent({
                contents: [{ role: "user", parts: [{ text: enhancedPrompt }] }],
            });

            const response = await result.response;
            const candidates = response.candidates;

            if (candidates && candidates.length > 0) {
                // Check for inline data (base64 image)
                const parts = candidates[0].content?.parts || [];
                for (const part of parts) {
                    if ((part as any).inlineData) {
                        const imageData = (part as any).inlineData;
                        return res.status(200).json({
                            success: true,
                            image: `data:${imageData.mimeType};base64,${imageData.data}`,
                            format: 'base64'
                        });
                    }
                }
            }

            throw new Error('No image generated');

        } catch (imagenError: any) {
            console.log('Imagen model not available, trying alternative...');

            // Method 2: Fallback - Generate a description and suggest using external service
            const textModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

            const descResult = await textModel.generateContent(`
        You are a medical illustrator assistant. 
        Create a detailed description of an image that would be suitable for this request:
        "${prompt}"
        
        Provide:
        1. Detailed visual description (what the image should show)
        2. Style recommendations
        3. Key elements to include
        4. A simple ASCII art representation if possible
        
        Format as JSON: { "description": "...", "style": "...", "elements": [...], "ascii": "..." }
      `);

            const descText = descResult.response.text();
            let description;
            try {
                description = JSON.parse(descText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim());
            } catch {
                description = { description: descText, style: 'medical illustration', elements: [] };
            }

            // Return a placeholder with description
            // User can use this description with an external image generator
            return res.status(200).json({
                success: true,
                type: 'description',
                description: description.description,
                style: description.style,
                elements: description.elements,
                ascii: description.ascii,
                message: 'Imagen model not available. Use this description with an image generator like Canva, DALL-E, or Midjourney.',
                suggestedServices: [
                    'https://www.canva.com/ai-image-generator/',
                    'https://openai.com/dall-e-3',
                    'https://www.midjourney.com/'
                ]
            });
        }

    } catch (error: any) {
        console.error('❌ Image Generation Error:', error.message);
        return res.status(500).json({
            error: error.message || 'Image generation failed',
            details: error.toString()
        });
    }
}
