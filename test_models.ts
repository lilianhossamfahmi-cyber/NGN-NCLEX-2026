
import { GoogleGenerativeAI } from "@google/generative-ai";
import process from "process";

const API_KEY = "AIzaSyAhPrwVud7qtIfwGJUPhsL6Fl_KizV3dJs";
const genAI = new GoogleGenerativeAI(API_KEY);

const MODELS_TO_TEST = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-001",
    "gemini-1.5-pro",
    "gemini-pro",
    "gemini-1.0-pro"
];

async function findWorkingModel() {
    console.log("Searching for a working model...");

    for (const modelName of MODELS_TO_TEST) {
        process.stdout.write(`Testing ${modelName}... `);
        try {
            const m = genAI.getGenerativeModel({ model: modelName });
            await m.generateContent("Hello");
            console.log("SUCCESS! ✅");
            console.log(`\n>>> RECOMMENDED MODEL: ${modelName} <<<\n`);
            return;
        } catch (error: any) {
            console.log("Fail ❌ (" + error.message.split(':')[0] + ")");
        }
    }
    console.error("\nALL MODELS FAILED. Please check API Key permissions or Enable Generative Language API in Google Cloud Console.");
}

findWorkingModel();
