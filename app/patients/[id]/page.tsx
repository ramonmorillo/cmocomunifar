'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { FormField, TextAreaField } from '@/components/forms/FormField';
import { FormSection } from '@/components/forms/FormSection';
import { supabase } from '@/lib/supabaseClient';
import type { Patient } from '@/types/db';

const emptyPatient: Partial<Patient> = {
  consent_signed: false,
  inclusion_ok: false,
  recruitment_status: 'screening'
};

export default function PatientPage() {
  const params = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Partial<Patient>>(emptyPatient);

  useEffect(() => {
    const load = async () => {
      if (params.id === 'new') return;
      const { data } = await supabase.from('patients').select('*').eq('id', params.id).single();
      if (data) setPatient(data as Patient);
    };
    void load();
  }, [params.id]);

  const save = async () => {
    if (params.id === 'new') {
      await supabase.from('patients').insert(patient);
      return;
    }
    await supabase.from('patients').update(patient).eq('id', params.id);
  };

  return (
    <AppShell>
      <div className="grid">
        <FormSection title="Datos generales">
          <FormField label="Código de estudio" value={patient.study_code ?? ''} onChange={(e) => setPatient({ ...patient, study_code: e.target.value })} />
          <FormField label="Fecha inclusión" type="date" value={patient.inclusion_date ?? ''} onChange={(e) => setPatient({ ...patient, inclusion_date: e.target.value })} />
          <FormField label="Fecha nacimiento" type="date" value={patient.birth_date ?? ''} onChange={(e) => setPatient({ ...patient, birth_date: e.target.value })} />
          <FormField label="Sexo (M/F/O)" value={patient.sex ?? ''} onChange={(e) => setPatient({ ...patient, sex: e.target.value as Patient['sex'] })} />
          <FormField label="Sede farmacia" value={patient.pharmacy_site ?? ''} onChange={(e) => setPatient({ ...patient, pharmacy_site: e.target.value })} />
          <FormField label="Investigador" value={patient.investigator_name ?? ''} onChange={(e) => setPatient({ ...patient, investigator_name: e.target.value })} />
          <TextAreaField label="Notas" value={patient.notes ?? ''} onChange={(e) => setPatient({ ...patient, notes: e.target.value })} />
        </FormSection>
        <button onClick={save}>Guardar ficha</button>
      </div>
    </AppShell>
  );
}
