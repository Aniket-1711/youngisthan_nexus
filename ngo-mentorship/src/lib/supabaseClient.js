import { createClient } from '@supabase/supabase-js';

// Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://itcmzvfhlrkquvphoqzn.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0Y216dmZobHJrcXV2cGhvcXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODUzOTcsImV4cCI6MjA5MDQ2MTM5N30.npMBxlnzVUsaiO3NxaFyM0aSjMiL_o-3AsxocFs6iRE';

export const supabase = createClient(supabaseUrl, supabaseKey);
