import { createClient } from '@supabase/supabase-js';

// Access environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);

// Helper for typed table access (optional but recommended)
// You can expand this type based on your schema
export type Tables = {
    item_bank: any;
    ngn_items: any;
    ngn_students: any;
    ngn_sessions: any;
    ngn_responses: any;
    ngn_metrics: any;
};
