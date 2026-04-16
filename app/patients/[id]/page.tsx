'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { getPatientById } from '@/lib/repositories/patientsRepo';
import { formatDate } from '@/lib/utils/date';
import type { Patient } from '@/types/db';

function toLabel(value: string | null | undefined) {
  if (!value) {
    return '—';
  }

  return value;
}

function toYesNoUnknownLabel(value: Patient['cardiovascular_disease_established']) {
  if (value === 'yes') return 'Sí';
  if (value === 'no') return 'No';
  return 'Desconocido';
}

function toSexLabel(value: Patient['sex']) {
  if (value === 'male') return 'Hombre';
  if (value === 'female') return 'Mujer';
  if (value === 'other') return 'Otro';
  return 'Desconocido';
}

export default function PatientPage() {
  const params = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const patientData = await getPatientById(params.id);
        setPatient(patientData);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar la ficha');
      }
    };

    void load();
  }, [params.id]);

  return (
    <AppShell>
      <h2>Ficha de paciente</h2>
      {error && <p style={{ color: '#b42318' }}>{error}</p>}
      {!patient && !error && <p>Cargando datos del paciente...</p>}

      {patient && (
        <div className="card grid">
          <div className="grid grid-3">
            <div><span className="small">Código de estudio</span><p>{patient.study_code}</p></div>
            <div><span className="small">Sede farmacia</span><p>{toLabel(patient.pharmacy_site)}</p></div>
            <div><span className="small">Investigador</span><p>{toLabel(patient.investigator_name)}</p></div>
            <div><span className="small">Fecha inclusión</span><p>{formatDate(patient.inclusion_date)}</p></div>
            <div><span className="small">Fecha screening</span><p>{formatDate(patient.screening_date)}</p></div>
            <div><span className="small">Fecha nacimiento</span><p>{formatDate(patient.birth_date)}</p></div>
            <div><span className="small">Edad en inclusión</span><p>{patient.age_at_inclusion ?? '—'}</p></div>
            <div><span className="small">Sexo</span><p>{toSexLabel(patient.sex)}</p></div>
            <div><span className="small">Estado de reclutamiento</span><p>{patient.recruitment_status}</p></div>
            <div><span className="small">Consentimiento firmado</span><p>{patient.consent_signed ? 'Sí' : 'No'}</p></div>
            <div><span className="small">Cumple inclusión</span><p>{patient.inclusion_ok ? 'Sí' : 'No'}</p></div>
            <div><span className="small">Motivo exclusión</span><p>{toLabel(patient.exclusion_reason)}</p></div>
            <div><span className="small">ECV establecida</span><p>{toYesNoUnknownLabel(patient.cardiovascular_disease_established)}</p></div>
            <div><span className="small">Hipertensión</span><p>{toYesNoUnknownLabel(patient.hypertension)}</p></div>
            <div><span className="small">Dislipidemia</span><p>{toYesNoUnknownLabel(patient.dyslipidemia)}</p></div>
            <div><span className="small">Diabetes</span><p>{toYesNoUnknownLabel(patient.diabetes)}</p></div>
            <div><span className="small">Enfermedad renal crónica</span><p>{toYesNoUnknownLabel(patient.chronic_kidney_disease)}</p></div>
            <div><span className="small">Obesidad</span><p>{toYesNoUnknownLabel(patient.obesity)}</p></div>
          </div>

          <div>
            <span className="small">Notas</span>
            <p>{toLabel(patient.notes)}</p>
          </div>
        </div>
      )}
    </AppShell>
  );
}
