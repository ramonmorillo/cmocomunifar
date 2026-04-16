import { supabase } from '@/lib/supabaseClient';
import { throwIfSupabaseError, withDefaultArray } from '@/lib/repositories/helpers';
import type { Visit } from '@/types/db';

const TABLE = 'visits';

export type VisitInput = Omit<Visit, 'id'>;

export async function listVisitsByPatient(patientId: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('patient_id', patientId)
    .order('visit_date', { ascending: false, nullsFirst: false })
    .order('scheduled_date', { ascending: false, nullsFirst: false });

  throwIfSupabaseError(error);

  return withDefaultArray(data as Visit[] | null);
}

export async function getVisitById(id: string) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();

  throwIfSupabaseError(error);

  return data as Visit;
}

// Estructura mínima preparada para siguiente bloque.
export async function createVisit(input: Partial<VisitInput>) {
  const { data, error } = await supabase.from(TABLE).insert(input).select('*').single();

  throwIfSupabaseError(error);

  return data as Visit;
}

// Estructura mínima preparada para siguiente bloque.
export async function updateVisit(id: string, input: Partial<VisitInput>) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(input)
    .eq('id', id)
    .select('*')
    .single();

  throwIfSupabaseError(error);

  return data as Visit;
}
