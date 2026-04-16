import { supabase } from '@/lib/supabaseClient';
import { throwIfSupabaseError, withDefaultArray } from '@/lib/repositories/helpers';
import type { Patient } from '@/types/db';

const TABLE = 'patients';

export type PatientInput = Omit<Patient, 'id'>;

export async function listPatients() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('inclusion_date', { ascending: false });

  throwIfSupabaseError(error);

  return withDefaultArray(data as Patient[] | null);
}

export async function getPatientById(id: string) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();

  throwIfSupabaseError(error);

  return data as Patient;
}

// Estructura mínima preparada para siguiente bloque.
export async function createPatient(input: Partial<PatientInput>) {
  const { data, error } = await supabase.from(TABLE).insert(input).select('*').single();

  throwIfSupabaseError(error);

  return data as Patient;
}

// Estructura mínima preparada para siguiente bloque.
export async function updatePatient(id: string, input: Partial<PatientInput>) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(input)
    .eq('id', id)
    .select('*')
    .single();

  throwIfSupabaseError(error);

  return data as Patient;
}
