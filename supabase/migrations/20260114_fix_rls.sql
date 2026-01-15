-- Enable access for Admin Panel
-- Run this in Supabase SQL Editor to fix 401 Unauthorized / RLS Policy errors

-- Option 1: Disable RLS completely (Easiest for development)
ALTER TABLE public.ngn_items DISABLE ROW LEVEL SECURITY;

-- Option 2: Keep RLS but allow everything (If you prefer to keep RLS on)
-- UNCOMMENT the lines below if you prefer this over Option 1
/*
ALTER TABLE public.ngn_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for anon users" 
ON "public"."ngn_items"
FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);
*/
