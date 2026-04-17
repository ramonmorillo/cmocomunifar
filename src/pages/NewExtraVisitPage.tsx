import { FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createExtraVisit } from '../services/visits';

export function NewExtraVisitPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visitNumber, setVisitNumber] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitStatus, setVisitStatus] = useState('scheduled');
  const [extraordinaryReason, setExtraordinaryReason] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!id) return;

    try {
      await createExtraVisit({
        patient_id: id,
        visit_number: Number.parseInt(visitNumber, 10) || null,
        scheduled_date: scheduledDate || null,
        visit_date: visitDate || null,
        visit_status: visitStatus,
        extraordinary_reason: extraordinaryReason,
        notes: notes || null
      });
      navigate(`/patients/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la visita extraordinaria');
    }
  }

  return (
    <main className="page page--narrow">
      <h1>Nueva visita extraordinaria</h1>
      <form className="card form-grid" onSubmit={handleSubmit}>
        <label>
          Motivo extraordinario
          <input value={extraordinaryReason} onChange={(e) => setExtraordinaryReason(e.target.value)} required />
        </label>
        <label>
          Número de visita
          <input type="number" min={1} value={visitNumber} onChange={(e) => setVisitNumber(e.target.value)} />
        </label>
        <label>
          Fecha programada
          <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
        </label>
        <label>
          Fecha de visita
          <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
        </label>
        <label>
          Estado
          <input value={visitStatus} onChange={(e) => setVisitStatus(e.target.value)} required />
        </label>
        <label>
          Notas
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit">Guardar visita extraordinaria</button>
      </form>
    </main>
  );
}
