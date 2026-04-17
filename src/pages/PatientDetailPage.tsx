import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Patient, Visit } from '../types/db';
import { getPatientById } from '../services/patients';
import { listVisitsByPatient } from '../services/visits';

export function PatientDetailPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    Promise.all([getPatientById(id), listVisitsByPatient(id)])
      .then(([patientData, visitsData]) => {
        setPatient(patientData);
        setVisits(visitsData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudo cargar la ficha'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <main className="page">
      {loading ? <p>Cargando ficha...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {patient ? (
        <>
          <header className="page-header">
            <div>
              <h1>Paciente {patient.study_code}</h1>
              <p>Farmacia: {patient.pharmacy_site ?? 'No informada'}</p>
              <p>Investigador: {patient.investigator_name ?? 'No informado'}</p>
              <p>Inclusion: {patient.inclusion_date ?? 'No informada'}</p>
            </div>
            <div className="button-group">
              <Link to={`/patients/${patient.id}/follow-up/new`} className="button-link">Nueva visita seguimiento</Link>
              <Link to={`/patients/${patient.id}/extra/new`} className="button-link button-link--ghost">Nueva visita extraordinaria</Link>
            </div>
          </header>

          <section className="card">
            <h2>Cronología de visitas</h2>
            {visits.length === 0 ? <p>Sin visitas registradas.</p> : null}
            <ul className="list">
              {visits.map((visit) => (
                <li key={visit.id}>
                  <strong>{visit.visit_type}</strong>
                  <span>{visit.visit_date ?? visit.scheduled_date ?? 'Sin fecha'}</span>
                  <span>{visit.visit_status}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
    </main>
  );
}
