import type { PostgrestError } from '@supabase/supabase-js';

export function throwIfSupabaseError(error: PostgrestError | null) {
  if (error) {
    throw error;
  }
}

export function withDefaultArray<T>(value: T[] | null): T[] {
  return value ?? [];
}
