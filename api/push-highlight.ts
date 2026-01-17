// api/push-highlight.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ItemIngestionService } from '../src/services/ingestion/ItemIngestionService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers (same as other API routes)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { item } = req.body;
    if (!item) {
        return res.status(400).json({ error: 'Missing item payload' });
    }

    try {
        const normalized = ItemIngestionService.normalize(item);
        return res.status(200).json({ success: true, item: normalized });
    } catch (e: any) {
        console.error('Push Highlight error:', e);
        return res.status(500).json({ error: e.message || 'Normalization failed' });
    }
}
