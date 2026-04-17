import type { Patient } from '../types/db';
import { supabase } from '../lib/supabase';

export type CreatePatientInput = Pick<
  Patient,
  | 'study_code'
  | 'pharmacy_site'
  | 'investigator_name'
  | 'inclusion_date'
  | 'screening_date'
  | 'birth_date'
  | 'age_at_inclusion'
  | 'sex'
  | 'consent_signed'
  | 'inclusion_ok'
  | 'exclusion_reason'
  | 'cardiovascular_disease_established'
  | 'hypertension'
  | 'dyslipidemia'
  | 'diabetes'
  | 'chronic_kidney_disease'
  | 'obesity'
  | 'recruitment_status'
  | 'notes'
>;

export async function listPatients() {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('inclusion_date', { ascending: false, nullsFirst: false });

  if (error) throw error;
  return (data ?? []) as Patient[];
}

export async function getPatientById(id: string) {
  const { data, error } = await supabase.from('patients').select('*').eq('id', id).single();

  if (error) throw error;
  return data as Patient;
}

export async function createPatient(input: CreatePatientInput) {
  const { data, error } = await supabase.from('patients').insert(input).select('*').single();

  if (error) throw error;
  return data as Patient;
}
