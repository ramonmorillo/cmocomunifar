import { supabase } from '@/lib/supabaseClient';

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return null;
  }

  return data.user ?? null;
}
