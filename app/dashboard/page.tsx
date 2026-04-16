'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { getDashboardMetrics, type DashboardMetrics } from '@/lib/repositories/dashboardRepo';

const initialMetrics: DashboardMetrics = {
  patients: 0,
  visits: 0,
  pendingVisits: 0,
  extraordinaryVisits: 0
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(initialMetrics);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar las métricas.');
      }
    };

    void loadMetrics();
  }, []);

  return (
    <AppShell>
      {error && <p style={{ color: '#b42318' }}>{error}</p>}
      <div className="grid grid-2">
        <article className="card"><h3>Pacientes</h3><p>{metrics.patients}</p></article>
        <article className="card"><h3>Visitas totales</h3><p>{metrics.visits}</p></article>
        <article className="card"><h3>Visitas pendientes</h3><p>{metrics.pendingVisits}</p></article>
        <article className="card"><h3>Visitas extraordinarias</h3><p>{metrics.extraordinaryVisits}</p></article>
      </div>
    </AppShell>
  );
}
