import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPatient } from '../services/patients';

export function NewPatientPage() {
  const navigate = useNavigate();
  const [studyCode, setStudyCode] = useState('');
  const [inclusionDate, setInclusionDate] = useState('');
  const [pharmacySite, setPharmacySite] = useState('');
  const [investigatorName, setInvestigatorName] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const patient = await createPatient({
        study_code: studyCode,
        pharmacy_site: pharmacySite || null,
        investigator_name: investigatorName || null,
        inclusion_date: inclusionDate || null,
        screening_date: null,
        birth_date: null,
        age_at_inclusion: null,
        sex: 'unknown',
        consent_signed: true,
        inclusion_ok: true,
        exclusion_reason: null,
        cardiovascular_disease_established: 'unknown',
        hypertension: 'unknown',
        dyslipidemia: 'unknown',
        diabetes: 'unknown',
        chronic_kidney_disease: 'unknown',
        obesity: 'unknown',
        recruitment_status: 'included',
        notes: notes || null
      });

      navigate(`/patients/${patient.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el paciente');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page page--narrow">
      <h1>Nuevo paciente</h1>
      <form onSubmit={handleSubmit} className="card form-grid">
        <label>
          Código de estudio
          <input value={studyCode} onChange={(e) => setStudyCode(e.target.value)} required />
        </label>
        <label>
          Fecha de inclusión
          <input type="date" value={inclusionDate} onChange={(e) => setInclusionDate(e.target.value)} />
        </label>
        <label>
          Farmacia
          <input value={pharmacySite} onChange={(e) => setPharmacySite(e.target.value)} />
        </label>
        <label>
          Investigador
          <input value={investigatorName} onChange={(e) => setInvestigatorName(e.target.value)} />
        </label>
        <label>
          Notas
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" disabled={submitting}>{submitting ? 'Guardando...' : 'Guardar paciente'}</button>
      </form>
    </main>
  );
}
