import { supabase } from '@/lib/supabaseClient';
import type { Patient } from '@/types/db';

export type PatientInput = Omit<Patient, 'id'>;

export async function listPatients() {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('inclusion_date', { ascending: false });

  if (error) {
    throw error;
  }

  return (data as Patient[]) ?? [];
}

export async function getPatientById(id: string) {
  const { data, error } = await supabase.from('patients').select('*').eq('id', id).single();

  if (error) {
    throw error;
  }

  return data as Patient;
}

export async function createPatient(input: Partial<PatientInput>) {
  const { data, error } = await supabase.from('patients').insert(input).select('*').single();

  if (error) {
    throw error;
  }

  return data as Patient;
}

export async function updatePatient(id: string, input: Partial<PatientInput>) {
  const { data, error } = await supabase
    .from('patients')
    .update(input)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data as Patient;
}
