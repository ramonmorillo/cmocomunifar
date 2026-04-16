'use client';

import Link from 'next/link';
import type { Visit } from '@/types/db';
import { formatDate } from '@/lib/utils/date';

export function PatientVisitsTimeline({ patientId, visits }: { patientId: string; visits: Visit[] }) {
  return (
    <section className="card grid">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Cronología de visitas</h3>
        <Link href={`/visits/new?patient_id=${patientId}`}>Crear nueva visita</Link>
      </div>

      {visits.length === 0 ? (
        <p className="small">Aún no hay visitas registradas para este paciente.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Número</th>
              <th>Programada</th>
              <th>Realizada</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => (
              <tr key={visit.id}>
                <td>{visit.visit_type}</td>
                <td>{visit.visit_number ?? '—'}</td>
                <td>{formatDate(visit.scheduled_date)}</td>
                <td>{formatDate(visit.visit_date)}</td>
                <td>{visit.visit_status}</td>
                <td>
                  <Link href={`/visits/${visit.id}/edit`}>Editar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
