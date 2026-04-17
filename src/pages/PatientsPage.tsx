import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Patient } from '../types/db';
import { listPatients } from '../services/patients';

export function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listPatients()
      .then(setPatients)
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudieron cargar pacientes'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page">
      <header className="page-header">
        <h1>Pacientes</h1>
        <Link to="/patients/new" className="button-link">Nuevo paciente</Link>
      </header>

      <section className="card">
        {loading ? <p>Cargando...</p> : null}
        {error ? <p className="error">{error}</p> : null}
        {!loading && patients.length === 0 ? <p>No hay pacientes registrados.</p> : null}
        <ul className="list">
          {patients.map((patient) => (
            <li key={patient.id}>
              <Link to={`/patients/${patient.id}`}>{patient.study_code}</Link>
              <span>{patient.inclusion_date ?? 'Sin fecha de inclusión'}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
