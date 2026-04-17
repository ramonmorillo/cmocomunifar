import type { Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '../lib/supabase';

export async function signIn(email: string, password: string) {
  const { error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }
}

export async function signOut() {
  const { error } = await getSupabaseClient().auth.signOut();
  if (error) {
    throw error;
  }
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await getSupabaseClient().auth.getSession();
  if (error) {
    throw error;
  }
  return data.session;
}

export function onAuthStateChange(callback: (session: Session | null) => void) {
  const {
    data: { subscription }
  } = getSupabaseClient().auth.onAuthStateChange((_event, session) => callback(session));

  return () => subscription.unsubscribe();
}
