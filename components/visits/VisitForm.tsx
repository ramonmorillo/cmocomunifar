'use client';

import { useState } from 'react';
import { FormField, TextAreaField } from '@/components/forms/FormField';
import { FormSection } from '@/components/forms/FormSection';
import { supabase } from '@/lib/supabaseClient';
import type { Visit, VisitType } from '@/types/db';

interface VisitFormProps {
  initialVisit?: Partial<Visit>;
  visitId?: string;
}

const visitTypes: VisitType[] = ['basal', 'm3', 'm6', 'm9', 'm12', 'extraordinaria'];

export function VisitForm({ initialVisit = {}, visitId }: VisitFormProps) {
  const [visit, setVisit] = useState<Partial<Visit>>(initialVisit);

  const save = async () => {
    const payload = {
      patient_id: visit.patient_id,
      visit_type: visit.visit_type,
      visit_date: visit.visit_date,
      visit_status: visit.visit_status,
      notes: visit.notes,
      extraordinary_reason: visit.extraordinary_reason
    };

    if (visitId) {
      await supabase.from('visits').update(payload).eq('id', visitId);
      return;
    }

    const { data } = await supabase.from('visits').insert(payload).select('*').single();
    if (!data?.id) return;

    await Promise.all([
      supabase.from('clinical_assessments').insert({ visit_id: data.id }),
      supabase.from('patient_reported_outcomes').insert({ visit_id: data.id }),
      supabase.from('feasibility_metrics').insert({ visit_id: data.id })
    ]);
  };

  return (
    <div className="grid">
      <FormSection title="Datos generales">
        <FormField label="ID paciente" value={visit.patient_id ?? ''} onChange={(e) => setVisit({ ...visit, patient_id: e.target.value })} />
        <label>
          <span className="small">Tipo de visita</span>
          <select value={visit.visit_type ?? 'basal'} onChange={(e) => setVisit({ ...visit, visit_type: e.target.value as VisitType })}>
            {visitTypes.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>
        <FormField label="Fecha visita" type="date" value={visit.visit_date ?? ''} onChange={(e) => setVisit({ ...visit, visit_date: e.target.value })} />
        <FormField label="Estado" value={visit.visit_status ?? 'completada'} onChange={(e) => setVisit({ ...visit, visit_status: e.target.value })} />
        <TextAreaField label="Notas" value={visit.notes ?? ''} onChange={(e) => setVisit({ ...visit, notes: e.target.value })} />
      </FormSection>

      <FormSection title="Variables clínicas">
        <p className="small" style={{ gridColumn: '1 / -1' }}>Bloque listo para extender con presión arterial, antropometría y bioquímica.</p>
      </FormSection>
      <FormSection title="Medicación y cambios"><p className="small" style={{ gridColumn: '1 / -1' }}>Bloque modular preparado para múltiples registros por visita.</p></FormSection>
      <FormSection title="Adherencia y hábitos"><p className="small" style={{ gridColumn: '1 / -1' }}>Espacio para Morisky-Green, PREDIMED e IPAQ.</p></FormSection>
      <FormSection title="Experiencia del paciente"><p className="small" style={{ gridColumn: '1 / -1' }}>IEXPAC, EQ-5D-5L y notas de autopercepción.</p></FormSection>
      <FormSection title="Intervenciones farmacéuticas"><p className="small" style={{ gridColumn: '1 / -1' }}>Registro de intervención, dominio y resultado.</p></FormSection>
      <FormSection title="Coordinación multidisciplinar"><p className="small" style={{ gridColumn: '1 / -1' }}>Eventos de coordinación y resolución.</p></FormSection>
      <FormSection title="Factibilidad operativa"><p className="small" style={{ gridColumn: '1 / -1' }}>Tiempo, costes y observaciones del proceso.</p></FormSection>

      <button onClick={save}>Guardar visita</button>
    </div>
  );
}
