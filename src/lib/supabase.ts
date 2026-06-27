import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// We create the client regardless, but operations will fail if keys are empty.
// We'll handle this gracefully in the UI.
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key');

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
