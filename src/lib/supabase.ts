import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function readEnvValue(name: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY') {
  const value = import.meta.env[name];

  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

const supabaseUrl = readEnvValue('VITE_SUPABASE_URL');
const supabaseAnonKey = readEnvValue('VITE_SUPABASE_ANON_KEY');

const missingEnvVars = [
  supabaseUrl.length === 0 ? 'VITE_SUPABASE_URL' : null,
  supabaseAnonKey.length === 0 ? 'VITE_SUPABASE_ANON_KEY' : null
].filter(Boolean) as string[];

export const isSupabaseConfigured = missingEnvVars.length === 0;

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local.'
    );
  }

  return supabase;
}

export function getMissingSupabaseEnvVars() {
  return [...missingEnvVars];
}
