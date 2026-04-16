import { AppShell } from '@/components/layout/AppShell';
import { VisitForm } from '@/components/visits/VisitForm';

export default function NewVisitPage() {
  return (
    <AppShell>
      <h2>Nueva visita</h2>
      <VisitForm initialVisit={{ visit_type: 'basal', visit_status: 'completada' }} />
    </AppShell>
  );
}
