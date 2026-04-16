'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { supabase } from '@/lib/supabaseClient';

interface Metrics {
  patients: number;
  visits: number;
  pendingVisits: number;
  extraordinaryVisits: number;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics>({ patients: 0, visits: 0, pendingVisits: 0, extraordinaryVisits: 0 });

  useEffect(() => {
    const loadMetrics = async () => {
      const [{ count: patients }, { count: visits }, { count: pending }, { count: extraordinary }] = await Promise.all([
        supabase.from('patients').select('*', { count: 'exact', head: true }),
        supabase.from('visits').select('*', { count: 'exact', head: true }),
        supabase.from('visits').select('*', { count: 'exact', head: true }).eq('visit_status', 'pendiente'),
        supabase.from('visits').select('*', { count: 'exact', head: true }).eq('visit_type', 'extraordinaria')
      ]);

      setMetrics({
        patients: patients ?? 0,
        visits: visits ?? 0,
        pendingVisits: pending ?? 0,
        extraordinaryVisits: extraordinary ?? 0
      });
    };

    void loadMetrics();
  }, []);

  return (
    <AppShell>
      <div className="grid grid-2">
        <article className="card"><h3>Pacientes</h3><p>{metrics.patients}</p></article>
        <article className="card"><h3>Visitas totales</h3><p>{metrics.visits}</p></article>
        <article className="card"><h3>Visitas pendientes</h3><p>{metrics.pendingVisits}</p></article>
        <article className="card"><h3>Visitas extraordinarias</h3><p>{metrics.extraordinaryVisits}</p></article>
      </div>
    </AppShell>
  );
}
