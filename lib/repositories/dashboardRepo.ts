import { supabase } from '@/lib/supabaseClient';
import { throwIfSupabaseError } from '@/lib/repositories/helpers';

export interface DashboardMetrics {
  patients: number;
  visits: number;
  pendingVisits: number;
  extraordinaryVisits: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [patientsQuery, visitsQuery, pendingVisitsQuery, extraordinaryVisitsQuery] = await Promise.all([
    supabase.from('patients').select('*', { count: 'exact', head: true }),
    supabase.from('visits').select('*', { count: 'exact', head: true }),
    supabase.from('visits').select('*', { count: 'exact', head: true }).eq('visit_status', 'pendiente'),
    supabase.from('visits').select('*', { count: 'exact', head: true }).eq('visit_type', 'extraordinaria')
  ]);

  throwIfSupabaseError(patientsQuery.error);
  throwIfSupabaseError(visitsQuery.error);
  throwIfSupabaseError(pendingVisitsQuery.error);
  throwIfSupabaseError(extraordinaryVisitsQuery.error);

  return {
    patients: patientsQuery.count ?? 0,
    visits: visitsQuery.count ?? 0,
    pendingVisits: pendingVisitsQuery.count ?? 0,
    extraordinaryVisits: extraordinaryVisitsQuery.count ?? 0
  };
}
