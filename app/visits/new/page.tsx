import { AppShell } from '@/components/layout/AppShell';
import { VisitForm } from '@/components/visits/VisitForm';

export default function NewVisitPage({ searchParams }: { searchParams?: { patient_id?: string } }) {
  return (
    <AppShell>
      <h2>Nueva visita</h2>
      <VisitForm
        initialVisit={{
          patient_id: searchParams?.patient_id ?? '',
          visit_type: 'baseline',
          visit_status: 'scheduled'
        }}
      />
    </AppShell>
  );
}
