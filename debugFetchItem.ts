// Temporary script to fetch and log a specific item from Supabase
import { fetchItemById } from './src/services/itemApiService.ts';

// Replace with the ID you want to inspect
const ITEM_ID = 'CARDIOLOGY-TRD-PAPRUPT-F3G4';

fetchItemById(ITEM_ID).catch((e) => {
    console.error('Unexpected error in debug script:', e);
});
