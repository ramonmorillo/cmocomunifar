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
export async function createPatient(input: PatientInput) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      study_code: input.study_code,
      pharmacy_site: input.pharmacy_site,
      investigator_name: input.investigator_name,
      inclusion_date: input.inclusion_date,
      screening_date: input.screening_date,
      birth_date: input.birth_date,
      age_at_inclusion: input.age_at_inclusion,
      sex: input.sex,
      consent_signed: input.consent_signed,
      inclusion_ok: input.inclusion_ok,
      exclusion_reason: input.exclusion_reason,
      cardiovascular_disease_established: input.cardiovascular_disease_established,
      hypertension: input.hypertension,
      dyslipidemia: input.dyslipidemia,
      diabetes: input.diabetes,
      chronic_kidney_disease: input.chronic_kidney_disease,
      obesity: input.obesity,
      recruitment_status: input.recruitment_status,
      notes: input.notes
    })
    .select('*')
    .single();

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
