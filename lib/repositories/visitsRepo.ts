import { supabase } from '@/lib/supabaseClient';
import type { Visit } from '@/types/db';

export type VisitInput = Omit<Visit, 'id'>;

export async function listVisitsByPatient(patientId: string) {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('patient_id', patientId)
    .order('visit_date', { ascending: false, nullsFirst: false })
    .order('scheduled_date', { ascending: false, nullsFirst: false });

  if (error) {
    throw error;
  }

  return (data as Visit[]) ?? [];
}

export async function getVisitById(id: string) {
  const { data, error } = await supabase.from('visits').select('*').eq('id', id).single();

  if (error) {
    throw error;
  }

  return data as Visit;
}

export async function createVisit(input: Partial<VisitInput>) {
  const { data, error } = await supabase.from('visits').insert(input).select('*').single();

  if (error) {
    throw error;
  }

  return data as Visit;
}

export async function updateVisit(id: string, input: Partial<VisitInput>) {
  const { data, error } = await supabase
    .from('visits')
    .update(input)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data as Visit;
}
