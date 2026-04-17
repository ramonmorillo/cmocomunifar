import type { Visit, VisitType } from '../types/db';
import { supabase } from '../lib/supabase';

export type CreateVisitInput = {
  patient_id: string;
  visit_type: VisitType;
  visit_number: number | null;
  scheduled_date: string | null;
  visit_date: string | null;
  visit_status: string;
  extraordinary_reason: string | null;
  notes: string | null;
};

export async function listVisitsByPatient(patientId: string) {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('patient_id', patientId)
    .order('visit_date', { ascending: false, nullsFirst: false })
    .order('scheduled_date', { ascending: false, nullsFirst: false });

  if (error) throw error;
  return (data ?? []) as Visit[];
}

async function createVisit(input: CreateVisitInput) {
  const { data, error } = await supabase.from('visits').insert(input).select('*').single();

  if (error) throw error;
  return data as Visit;
}

export async function createFollowUpVisit(input: Omit<CreateVisitInput, 'visit_type' | 'extraordinary_reason'> & {visit_type: Exclude<VisitType, 'extra'>; extraordinary_reason?: null;}) {
  return createVisit({ ...input, extraordinary_reason: null });
}

export async function createExtraVisit(input: Omit<CreateVisitInput, 'visit_type'> & { extraordinary_reason: string }) {
  return createVisit({ ...input, visit_type: 'extra' });
}
