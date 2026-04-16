import { AppShell } from '@/components/layout/AppShell';
import { PatientForm } from '@/components/patients/PatientForm';

export default function NewPatientPage() {
  return (
    <AppShell>
      <h2>Nuevo paciente</h2>
      <PatientForm />
    </AppShell>
  );
}
