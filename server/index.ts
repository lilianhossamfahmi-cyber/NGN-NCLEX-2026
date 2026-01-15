// server/index.ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import { initDb, getBankItems, saveItemToBank, saveBatchToBank, deleteItemFromBank, clearBank, ItemQueryOptions } from '../src/services/itemDbService.ts';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: '*', // Allow all origins (for now)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'apikey', 'x-client-info']
}));
app.use(express.json({ limit: '10mb' }));

// Health Check Endpoint (Vital for Railway)
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Ensure DB is ready before handling requests (Non-blocking)
initDb()
    .then(() => console.log('✅ DB initialized successfully'))
    .catch(err => console.error('❌ DB Initialization Failed (Server will continue):', err));

// GET all items (with optional query params for filtering)
app.get('/api/items', async (req: Request, res: Response) => {
    try {
        const { page, limit, search, topic, type, status, sortField, sortDir } = req.query;

        const options: ItemQueryOptions = {
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 50,
            search: search ? String(search) : undefined,
            topic: topic ? String(topic) : undefined,
            type: type ? String(type) : undefined,
            status: status ? String(status) : undefined,
            sortField: sortField ? String(sortField) : undefined,
            sortDir: sortDir === 'asc' || sortDir === 'desc' ? sortDir : 'desc'
        };

        const result = await getBankItems(options);
        res.json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// GET single item by id
app.get('/api/items/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await getBankItems({ limit: 100000 }); // Fetch all to find one (or implement getById in DB service)
        const items = Array.isArray(result) ? result : result.items;
        const item = items.find((i: any) => String(i.id) === id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch item' });
    }
});

// POST a single item (create or update)
app.post('/api/items', async (req: Request, res: Response) => {
    const item = req.body;
    if (!item) return res.status(400).json({ error: 'Missing item payload' });
    try {
        await saveItemToBank(item);
        res.status(200).json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to save item' });
    }
});

// PUT a single item (update)
app.put('/api/items/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = req.body;
    if (!item) return res.status(400).json({ error: 'Missing item payload' });
    if (String(item.id) !== id) return res.status(400).json({ error: 'ID mismatch' });

    try {
        await saveItemToBank(item);
        res.status(200).json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// POST batch of items
app.post('/api/items/batch', async (req: Request, res: Response) => {
    const items = req.body as any[];
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Expected an array of items' });
    try {
        const added = await saveBatchToBank(items);
        res.json({ added });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to save batch', details: e instanceof Error ? e.message : String(e) });
    }
});

// DELETE a single item
app.delete('/api/items/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await deleteItemFromBank(id as string);
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

// DELETE batch (ids passed as JSON array in body)
app.delete('/api/items', async (req: Request, res: Response) => {
    const ids = req.body as string[];
    if (!Array.isArray(ids)) return res.status(400).json({ error: 'Expected array of ids' });
    try {
        for (const id of ids) await deleteItemFromBank(id);
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to delete batch' });
    }
});

// Utility endpoint to clear the whole bank (dev only)
app.delete('/api/clear', async (_req: Request, res: Response) => {
    try {
        await clearBank();
        res.json({ cleared: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to clear bank' });
    }
});

// --- SESSION GENERATION ENDPOINTS ---

import { generateFlexibleSession, SessionRequest } from '../src/services/SessionGeneratorService.ts';

// TUTOR MODE: User specifies distribution
app.post('/api/sessions/tutor', async (req: Request, res: Response) => {
    try {
        const body = req.body;
        // Expect body to match SessionRequest partial
        const sessionReq: SessionRequest = {
            mode: 'tutor',
            totalItems: body.totalItems || 10,
            difficultyDistribution: body.difficultyDistribution || { 3: 10 }, // Default L3
            filters: body.filters,
            config: {
                maxDistance: 2,
                allowDriftWarning: true
            }
        };

        const result = await generateFlexibleSession(sessionReq);
        res.json(result);
    } catch (e) {
        console.error("Session Gen Error", e);
        res.status(500).json({ error: 'Failed to generate tutor session' });
    }
});

// EXAM MODE: Strict Blueprint (Bell Curve Difficulty)
app.post('/api/sessions/exam', async (_req: Request, res: Response) => {
    try {
        // Standard 75 Item Blueprint
        // L1: 5, L2: 15, L3: 35, L4: 15, L5: 5
        const BLUEPRINT_75 = { 1: 5, 2: 15, 3: 35, 4: 15, 5: 5 };
        const TOTAL = 75;

        const sessionReq: SessionRequest = {
            mode: 'exam',
            totalItems: TOTAL,
            difficultyDistribution: BLUEPRINT_75,
            filters: {
                // In a real app, we'd add domain constraints here too
            },
            config: {
                maxDistance: 2, // Allow some flex
                allowDriftWarning: true
            }
        };

        const result = await generateFlexibleSession(sessionReq);
        res.json(result);
    } catch (e) {
        console.error("Exam Gen Error", e);
        res.status(500).json({ error: 'Failed to generate exam session' });
    }
});

// MAGIC AI FIXER ENDPOINT
import { magicFixItem } from './aiService.ts';

app.post('/api/ai/magic-fix', async (req: Request, res: Response) => {
    try {
        const { item, instruction } = req.body;
        if (!item || !instruction) {
            return res.status(400).json({ error: 'Missing item or instruction' });
        }

        console.log(`✨ Magic Fix Requested for Item ${item.id}: "${instruction}"`);
        const modifiedItem = await magicFixItem(item, instruction);

        // Log success
        console.log(`✅ Magic Fix Applied`);
        res.json({ success: true, item: modifiedItem });

    } catch (e: any) {
        console.error("Magic Fix Error:", e);
        res.status(500).json({ error: e.message || "AI Processing Failed" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Item‑bank API listening on http://localhost:${PORT}`);
});

// Keep-alive to prevent tsx from exiting
setInterval(() => { }, 60000);
