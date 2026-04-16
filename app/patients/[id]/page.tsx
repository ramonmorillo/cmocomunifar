'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PatientForm } from '@/components/patients/PatientForm';
import { PatientVisitsTimeline } from '@/components/patients/PatientVisitsTimeline';
import { getPatientById } from '@/lib/repositories/patientsRepo';
import { listVisitsByPatient } from '@/lib/repositories/visitsRepo';
import type { Patient, Visit } from '@/types/db';

export default function PatientPage() {
  const params = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [patientData, visitsData] = await Promise.all([
          getPatientById(params.id),
          listVisitsByPatient(params.id)
        ]);

        setPatient(patientData);
        setVisits(visitsData);
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
        <div className="grid">
          <PatientForm mode="edit" patientId={patient.id} initialPatient={patient} />
          <PatientVisitsTimeline patientId={patient.id} visits={visits} />
        </div>
      )}
    </AppShell>
  );
}
