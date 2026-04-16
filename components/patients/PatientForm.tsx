'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormField, TextAreaField } from '@/components/forms/FormField';
import { FormSection } from '@/components/forms/FormSection';
import { createPatient, updatePatient } from '@/lib/repositories/patientsRepo';
import type { Patient } from '@/types/db';

interface PatientFormProps {
  mode: 'create' | 'edit';
  initialPatient?: Partial<Patient>;
  patientId?: string;
}

const emptyPatient: Partial<Patient> = {
  consent_signed: false,
  inclusion_ok: false,
  recruitment_status: 'screening'
};

export function PatientForm({ mode, initialPatient = {}, patientId }: PatientFormProps) {
  const router = useRouter();
  const [patient, setPatient] = useState<Partial<Patient>>({ ...emptyPatient, ...initialPatient });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    setError('');
    setSaving(true);

    try {
      if (mode === 'create') {
        const created = await createPatient(patient);
        router.push(`/patients/${created.id}`);
        return;
      }

      if (!patientId) {
        throw new Error('Missing patient id');
      }

      await updatePatient(patientId, patient);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo guardar la ficha');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid">
      <FormSection title="Datos básicos del paciente">
        <FormField
          label="Código de estudio"
          value={patient.study_code ?? ''}
          onChange={(event) => setPatient({ ...patient, study_code: event.target.value })}
        />
        <FormField
          label="Fecha inclusión"
          type="date"
          value={patient.inclusion_date ?? ''}
          onChange={(event) => setPatient({ ...patient, inclusion_date: event.target.value })}
        />
        <FormField
          label="Fecha nacimiento"
          type="date"
          value={patient.birth_date ?? ''}
          onChange={(event) => setPatient({ ...patient, birth_date: event.target.value })}
        />
        <FormField
          label="Sexo (M/F/O)"
          value={patient.sex ?? ''}
          onChange={(event) => setPatient({ ...patient, sex: event.target.value as Patient['sex'] })}
        />
        <FormField
          label="Sede farmacia"
          value={patient.pharmacy_site ?? ''}
          onChange={(event) => setPatient({ ...patient, pharmacy_site: event.target.value })}
        />
        <FormField
          label="Investigador"
          value={patient.investigator_name ?? ''}
          onChange={(event) => setPatient({ ...patient, investigator_name: event.target.value })}
        />
        <FormField
          label="Estado de reclutamiento"
          value={patient.recruitment_status ?? ''}
          onChange={(event) => setPatient({ ...patient, recruitment_status: event.target.value })}
        />
        <TextAreaField
          label="Notas"
          value={patient.notes ?? ''}
          onChange={(event) => setPatient({ ...patient, notes: event.target.value })}
        />
      </FormSection>

      {error && <p style={{ color: '#b42318' }}>{error}</p>}

      <button onClick={onSubmit} disabled={saving}>
        {saving ? 'Guardando...' : mode === 'create' ? 'Crear paciente' : 'Guardar ficha'}
      </button>
    </div>
  );
}
