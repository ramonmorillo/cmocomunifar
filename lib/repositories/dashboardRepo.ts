import { supabase } from '@/lib/supabaseClient';

export interface DashboardMetrics {
  patients: number;
  visits: number;
  pendingVisits: number;
  extraordinaryVisits: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [{ count: patients, error: patientsError }, { count: visits, error: visitsError }, { count: pending, error: pendingError }, { count: extraordinary, error: extraordinaryError }] =
    await Promise.all([
      supabase.from('patients').select('*', { count: 'exact', head: true }),
      supabase.from('visits').select('*', { count: 'exact', head: true }),
      supabase.from('visits').select('*', { count: 'exact', head: true }).eq('visit_status', 'pendiente'),
      supabase.from('visits').select('*', { count: 'exact', head: true }).eq('visit_type', 'extraordinaria')
    ]);

  if (patientsError) throw patientsError;
  if (visitsError) throw visitsError;
  if (pendingError) throw pendingError;
  if (extraordinaryError) throw extraordinaryError;

  return {
    patients: patients ?? 0,
    visits: visits ?? 0,
    pendingVisits: pending ?? 0,
    extraordinaryVisits: extraordinary ?? 0
  };
}
