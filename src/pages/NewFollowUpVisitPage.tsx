import { FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createFollowUpVisit } from '../services/visits';
import type { VisitType } from '../types/db';

const followUpTypes: Array<{ value: Exclude<VisitType, 'extra' | 'baseline'>; label: string }> = [
  { value: 'month_3', label: '3 meses' },
  { value: 'month_6', label: '6 meses' },
  { value: 'month_9', label: '9 meses' },
  { value: 'month_12', label: '12 meses' }
];

export function NewFollowUpVisitPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visitType, setVisitType] = useState<Exclude<VisitType, 'extra' | 'baseline'>>('month_3');
  const [visitNumber, setVisitNumber] = useState('1');
  const [scheduledDate, setScheduledDate] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitStatus, setVisitStatus] = useState('scheduled');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!id) return;

    try {
      await createFollowUpVisit({
        patient_id: id,
        visit_type: visitType,
        visit_number: Number.parseInt(visitNumber, 10) || null,
        scheduled_date: scheduledDate || null,
        visit_date: visitDate || null,
        visit_status: visitStatus,
        notes: notes || null
      });
      navigate(`/patients/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la visita');
    }
  }

  return (
    <main className="page page--narrow">
      <h1>Nueva visita de seguimiento</h1>
      <form className="card form-grid" onSubmit={handleSubmit}>
        <label>
          Tipo
          <select value={visitType} onChange={(e) => setVisitType(e.target.value as Exclude<VisitType, 'extra' | 'baseline'>)}>
            {followUpTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
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
        <button type="submit">Guardar visita</button>
      </form>
    </main>
  );
}
