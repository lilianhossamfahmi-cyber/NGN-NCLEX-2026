// src/services/itemStorage.ts
/**
 * Central storage façade.
 * Switch between localStorage (dev) and the API (prod) by toggling the import below.
 */

// Use API-based storage
export {
    getBankItems,
    saveItemToBank,
    saveBatchToBank,
    deleteItemFromBank,
    deleteBatchFromBank,
    clearBank,
} from './itemApiService';

// Fallback to localStorage (comment out above and uncomment below to revert)
// export * from './itemStorageService';
