'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { VisitForm } from '@/components/visits/VisitForm';
import { getVisitById } from '@/lib/repositories/visitsRepo';
import type { Visit } from '@/types/db';

export default function EditVisitPage() {
  const params = useParams<{ id: string }>();
  const [visit, setVisit] = useState<Partial<Visit>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getVisitById(params.id);
        setVisit(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar la visita');
      }
    };

    void load();
  }, [params.id]);

  return (
    <AppShell>
      <h2>Editar visita</h2>
      {error && <p style={{ color: '#b42318' }}>{error}</p>}
      {!visit.id && !error && <p>Cargando visita...</p>}
      {!!visit.id && <VisitForm initialVisit={visit} visitId={params.id} />}
    </AppShell>
  );
}
