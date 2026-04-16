'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormField, TextAreaField } from '@/components/forms/FormField';
import { FormSection } from '@/components/forms/FormSection';
import { createVisit, updateVisit } from '@/lib/repositories/visitsRepo';
import type { Visit, VisitType } from '@/types/db';

interface VisitFormProps {
  initialVisit?: Partial<Visit>;
  visitId?: string;
}

const visitTypes: VisitType[] = ['baseline', 'month_3', 'month_6', 'month_9', 'month_12', 'extra'];

export function VisitForm({ initialVisit = {}, visitId }: VisitFormProps) {
  const router = useRouter();
  const [visit, setVisit] = useState<Partial<Visit>>(initialVisit);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setError('');

    if (!visit.patient_id?.trim()) {
      setError('El campo patient_id es obligatorio.');
      return;
    }

    if (!visit.visit_type) {
      setError('Selecciona un tipo de visita.');
      return;
    }

    if (!visit.visit_status?.trim()) {
      setError('El campo visit_status es obligatorio.');
      return;
    }

    setSaving(true);

    const payload = {
      patient_id: visit.patient_id.trim(),
      visit_type: visit.visit_type,
      visit_number: visit.visit_number ?? null,
      scheduled_date: visit.scheduled_date || null,
      visit_date: visit.visit_date || null,
      visit_status: visit.visit_status.trim(),
      extraordinary_reason: visit.extraordinary_reason?.trim() || null,
      notes: visit.notes?.trim() || null
    };

    try {
      if (visitId) {
        await updateVisit(visitId, payload);
        router.refresh();
        return;
      }

      await createVisit(payload);
      router.push(`/patients/${visit.patient_id}`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudo guardar la visita');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid">
      <FormSection title="Datos de la visita">
        <FormField
          label="ID paciente"
          value={visit.patient_id ?? ''}
          onChange={(e) => setVisit({ ...visit, patient_id: e.target.value })}
        />

        <label>
          <span className="small">Tipo de visita</span>
          <select
            value={visit.visit_type ?? 'baseline'}
            onChange={(e) => setVisit({ ...visit, visit_type: e.target.value as VisitType })}
          >
            {visitTypes.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <FormField
          label="Número de visita"
          type="number"
          value={visit.visit_number ?? ''}
          onChange={(e) => setVisit({ ...visit, visit_number: Number(e.target.value) || null })}
        />

        <FormField
          label="Fecha programada"
          type="date"
          value={visit.scheduled_date ?? ''}
          onChange={(e) => setVisit({ ...visit, scheduled_date: e.target.value })}
        />

        <FormField
          label="Fecha de visita"
          type="date"
          value={visit.visit_date ?? ''}
          onChange={(e) => setVisit({ ...visit, visit_date: e.target.value })}
        />

        <FormField
          label="Estado de visita"
          value={visit.visit_status ?? 'scheduled'}
          onChange={(e) => setVisit({ ...visit, visit_status: e.target.value })}
        />

        <FormField
          label="Motivo extraordinaria"
          value={visit.extraordinary_reason ?? ''}
          onChange={(e) => setVisit({ ...visit, extraordinary_reason: e.target.value })}
        />

        <TextAreaField
          label="Notas"
          value={visit.notes ?? ''}
          onChange={(e) => setVisit({ ...visit, notes: e.target.value })}
        />
      </FormSection>

      {error && <p style={{ color: '#b42318' }}>{error}</p>}
      <button onClick={save} disabled={saving}>
        {saving ? 'Guardando...' : 'Guardar visita'}
      </button>
    </div>
  );
}
