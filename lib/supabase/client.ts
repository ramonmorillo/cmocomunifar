import { createClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from '@/lib/supabase/env';

const { url, anonKey } = getSupabaseEnv();

export function createSupabaseBrowserClient() {
  return createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });
}

export const supabaseBrowser = createSupabaseBrowserClient();
