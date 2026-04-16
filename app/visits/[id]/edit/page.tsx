'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { VisitForm } from '@/components/visits/VisitForm';
import { supabase } from '@/lib/supabaseClient';
import type { Visit } from '@/types/db';

export default function EditVisitPage() {
  const params = useParams<{ id: string }>();
  const [visit, setVisit] = useState<Partial<Visit>>({});

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('visits').select('*').eq('id', params.id).single();
      if (data) setVisit(data as Visit);
    };
    void load();
  }, [params.id]);

  return (
    <AppShell>
      <h2>Editar visita</h2>
      <VisitForm initialVisit={visit} visitId={params.id} />
    </AppShell>
  );
}
