
const API_KEY = "AIzaSyAhPrwVud7qtIfwGJUPhsL6Fl_KizV3dJs";

async function checkModels() {
    console.log("Fetching models list via REST...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API ERROR:", JSON.stringify(data.error, null, 2));
        } else {
            console.log("AVAILABLE MODELS:");
            if (data.models) {
                data.models.slice(0, 30).forEach(m => console.log(`- ${m.name}`));
            } else {
                console.log("No models array found in response:", data);
            }
        }
    } catch (e) {
        console.error("NETWORK/FETCH ERROR:", e);
    }
}

checkModels();
