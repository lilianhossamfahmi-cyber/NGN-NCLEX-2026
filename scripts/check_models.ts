
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

const CANDIDATES = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-1.5-pro",
    "gemini-1.5-pro-001",
    "gemini-1.0-pro",
    "gemini-pro",
    "gemini-flash"
];

async function checkModels() {
    if (!API_KEY) {
        console.error("❌ No API Key found in environment.");
        return;
    }
    console.log("🔑 Checking models check with key ending in...", API_KEY.slice(-4));

    const genAI = new GoogleGenerativeAI(API_KEY);

    for (const modelName of CANDIDATES) {
        process.stdout.write(`Testing ${modelName}... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            if (response.text()) {
                console.log("✅ SUCCESS!");
                console.log(`\n🎉 RECOMMENDED MODEL: "${modelName}"\n`);
                return; // Stop at first success
            }
        } catch (e: any) {
            console.log("❌ Failed:", e.message.split('[')[0]); // Brief error
        }
    }
    console.log("⚠️ No working models found in candidate list.");
}

checkModels();
