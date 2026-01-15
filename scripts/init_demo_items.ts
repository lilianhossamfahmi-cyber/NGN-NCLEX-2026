
import fetch from 'cross-fetch';
import { v4 as uuidv4 } from 'uuid';

const API_URL = 'http://localhost:4000/api';

const createItem = (title: string, type: string, difficulty: number) => ({
    id: uuidv4(),
    typeId: type,
    questions: [
        {
            text: `[PUBLISHED BANK ITEM] ${title}`,
            options: [
                { id: '1', text: 'Correct Answer', isCorrect: true },
                { id: '2', text: 'Wrong A', isCorrect: false },
                { id: '3', text: 'Wrong B', isCorrect: false },
                { id: '4', text: 'Wrong C', isCorrect: false }
            ]
        }
    ],
    metadata: {
        status: 'published',
        topic: 'General',
        tags: ['demo']
    },
    pedagogy: {
        difficultyLevel: difficulty,
        clinicalFocus: 'General'
    }
});

async function main() {
    console.log("Initializing Demo Items...");

    // 1. Clear existing (optional, maybe unsafe if user has data)
    // await fetch(`${API_URL}/clear`, { method: 'DELETE' });

    // 2. Create 3 Items
    const items = [
        createItem("Easy Question (Level 1)", "multiple-choice", 1),
        createItem("Medium Question (Level 3)", "multiple-choice", 3),
        createItem("Hard Question (Level 5)", "multiple-choice", 5)
    ];

    // 3. Post to Batch
    try {
        const res = await fetch(`${API_URL}/items/batch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(items)
        });

        if (res.ok) {
            const data = await res.json();
            console.log(`Success! Added ${data.added} items to the bank.`);
        } else {
            console.error("Failed to add items", await res.text());
        }
    } catch (e) {
        console.error("Error connecting to API", e);
    }
}

main();
