import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gpojmtxpulytpaiwgywp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_b1vgatjIgIA2viXUansOrw_yP5V_sOl';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Admin access code
export const ADMIN_ACCESS_CODE = '2303';


