'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { listPatients } from '@/lib/repositories/patientsRepo';
import { formatDate } from '@/lib/utils/date';
import type { Patient } from '@/types/db';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listPatients();
        setPatients(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar el listado');
      }
    };

    void load();
  }, []);

  return (
    <AppShell>
      <div className="card grid">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Listado de pacientes</h2>
          <Link href="/patients/new">Crear paciente</Link>
        </div>

        {error && <p style={{ color: '#b42318' }}>{error}</p>}

        {!error && patients.length === 0 && <p>No hay pacientes registrados todavía.</p>}

        {patients.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Código estudio</th>
                <th>Fecha inclusión</th>
                <th>Sede</th>
                <th>Investigador</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.study_code}</td>
                  <td>{formatDate(patient.inclusion_date)}</td>
                  <td>{patient.pharmacy_site ?? '—'}</td>
                  <td>{patient.investigator_name ?? '—'}</td>
                  <td>{patient.recruitment_status}</td>
                  <td>
                    <Link href={`/patients/${patient.id}`}>Abrir ficha</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppShell>
  );
}
