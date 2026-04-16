'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormField, TextAreaField } from '@/components/forms/FormField';
import { FormSection } from '@/components/forms/FormSection';
import { createPatient } from '@/lib/repositories/patientsRepo';
import type { Patient, RecruitmentStatus, SexType, YesNoUnknown } from '@/types/db';

interface PatientFormProps {
  initialPatient?: Partial<Patient>;
}

type CreatePatientInput = Omit<Patient, 'id'>;

const yesNoUnknownOptions: Array<{ value: YesNoUnknown; label: string }> = [
  { value: 'unknown', label: 'Desconocido' },
  { value: 'yes', label: 'Sí' },
  { value: 'no', label: 'No' }
];

const recruitmentStatusOptions: Array<{ value: RecruitmentStatus; label: string }> = [
  { value: 'screening', label: 'Screening' },
  { value: 'included', label: 'Incluido' },
  { value: 'active', label: 'Activo' },
  { value: 'completed', label: 'Completado' },
  { value: 'withdrawn', label: 'Retirado' },
  { value: 'lost_to_follow_up', label: 'Perdido en seguimiento' },
  { value: 'excluded', label: 'Excluido' }
];

const sexOptions: Array<{ value: SexType; label: string }> = [
  { value: 'unknown', label: 'Desconocido' },
  { value: 'male', label: 'Hombre' },
  { value: 'female', label: 'Mujer' },
  { value: 'other', label: 'Otro' }
];

const emptyPatient: CreatePatientInput = {
  study_code: '',
  pharmacy_site: '',
  investigator_name: '',
  inclusion_date: null,
  screening_date: null,
  birth_date: null,
  age_at_inclusion: null,
  sex: 'unknown',
  consent_signed: false,
  inclusion_ok: false,
  exclusion_reason: '',
  cardiovascular_disease_established: 'unknown',
  hypertension: 'unknown',
  dyslipidemia: 'unknown',
  diabetes: 'unknown',
  chronic_kidney_disease: 'unknown',
  obesity: 'unknown',
  recruitment_status: 'screening',
  notes: ''
};

function normalizeNullableText(value: string) {
  const cleaned = value.trim();
  return cleaned.length ? cleaned : null;
}

function parseIsoDate(dateValue: string | null) {
  if (!dateValue) return null;

  return new Date(`${dateValue}T00:00:00.000Z`);
}

function isFutureDate(dateValue: string | null) {
  const parsedDate = parseIsoDate(dateValue);

  if (!parsedDate) return false;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  return parsedDate > today;
}

export function PatientForm({ initialPatient = {} }: PatientFormProps) {
  const router = useRouter();
  const [patient, setPatient] = useState<CreatePatientInput>({ ...emptyPatient, ...initialPatient });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    setError('');

    if (!patient.study_code.trim()) {
      setError('El campo Código de estudio es obligatorio.');
      return;
    }

    if (patient.age_at_inclusion !== null && patient.age_at_inclusion < 0) {
      setError('La edad en inclusión no puede ser negativa.');
      return;
    }

    if (patient.age_at_inclusion !== null && !Number.isInteger(patient.age_at_inclusion)) {
      setError('La edad en inclusión debe ser un número entero.');
      return;
    }

    if (patient.age_at_inclusion !== null && patient.age_at_inclusion > 130) {
      setError('La edad en inclusión no puede ser mayor de 130.');
      return;
    }

    if (isFutureDate(patient.screening_date)) {
      setError('La fecha de screening no puede ser futura.');
      return;
    }

    if (isFutureDate(patient.inclusion_date)) {
      setError('La fecha de inclusión no puede ser futura.');
      return;
    }

    if (isFutureDate(patient.birth_date)) {
      setError('La fecha de nacimiento no puede ser futura.');
      return;
    }

    const screeningDate = parseIsoDate(patient.screening_date);
    const inclusionDate = parseIsoDate(patient.inclusion_date);
    const birthDate = parseIsoDate(patient.birth_date);

    if (screeningDate && inclusionDate && screeningDate > inclusionDate) {
      setError('La fecha de screening no puede ser posterior a la fecha de inclusión.');
      return;
    }

    if (birthDate && inclusionDate && birthDate > inclusionDate) {
      setError('La fecha de nacimiento no puede ser posterior a la fecha de inclusión.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...patient,
        study_code: patient.study_code.trim(),
        pharmacy_site: normalizeNullableText(patient.pharmacy_site ?? ''),
        investigator_name: normalizeNullableText(patient.investigator_name ?? ''),
        exclusion_reason: normalizeNullableText(patient.exclusion_reason ?? ''),
        notes: normalizeNullableText(patient.notes ?? '')
      };

      const created = await createPatient(payload);
      router.push(`/patients/${created.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo guardar la ficha');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid">
      <FormSection title="Alta de paciente">
        <FormField
          label="Código de estudio *"
          value={patient.study_code}
          onChange={(event) => setPatient({ ...patient, study_code: event.target.value })}
        />

        <FormField
          label="Sede farmacia"
          value={patient.pharmacy_site ?? ''}
          onChange={(event) => setPatient({ ...patient, pharmacy_site: event.target.value })}
        />

        <FormField
          label="Investigador"
          value={patient.investigator_name ?? ''}
          onChange={(event) => setPatient({ ...patient, investigator_name: event.target.value })}
        />

        <FormField
          label="Fecha inclusión"
          type="date"
          value={patient.inclusion_date ?? ''}
          onChange={(event) =>
            setPatient({ ...patient, inclusion_date: event.target.value ? event.target.value : null })
          }
        />

        <FormField
          label="Fecha screening"
          type="date"
          value={patient.screening_date ?? ''}
          onChange={(event) =>
            setPatient({ ...patient, screening_date: event.target.value ? event.target.value : null })
          }
        />

        <FormField
          label="Fecha nacimiento"
          type="date"
          value={patient.birth_date ?? ''}
          onChange={(event) =>
            setPatient({ ...patient, birth_date: event.target.value ? event.target.value : null })
          }
        />

        <label>
          <span className="small">Edad en inclusión</span>
          <input
            type="number"
            min={0}
            value={patient.age_at_inclusion ?? ''}
            onChange={(event) =>
              setPatient({
                ...patient,
                age_at_inclusion: event.target.value === '' ? null : Number(event.target.value)
              })
            }
          />
        </label>

        <label>
          <span className="small">Sexo</span>
          <select
            value={patient.sex}
            onChange={(event) => setPatient({ ...patient, sex: event.target.value as SexType })}
          >
            {sexOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="small">Consentimiento firmado</span>
          <select
            value={patient.consent_signed ? 'yes' : 'no'}
            onChange={(event) =>
              setPatient({
                ...patient,
                consent_signed: event.target.value === 'yes'
              })
            }
          >
            <option value="no">No</option>
            <option value="yes">Sí</option>
          </select>
        </label>

        <label>
          <span className="small">Cumple criterios de inclusión</span>
          <select
            value={patient.inclusion_ok ? 'yes' : 'no'}
            onChange={(event) =>
              setPatient({
                ...patient,
                inclusion_ok: event.target.value === 'yes'
              })
            }
          >
            <option value="no">No</option>
            <option value="yes">Sí</option>
          </select>
        </label>

        <FormField
          label="Motivo de exclusión"
          value={patient.exclusion_reason ?? ''}
          onChange={(event) => setPatient({ ...patient, exclusion_reason: event.target.value })}
        />

        <label>
          <span className="small">Enfermedad cardiovascular establecida</span>
          <select
            value={patient.cardiovascular_disease_established}
            onChange={(event) =>
              setPatient({
                ...patient,
                cardiovascular_disease_established: event.target.value as YesNoUnknown
              })
            }
          >
            {yesNoUnknownOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="small">Hipertensión</span>
          <select
            value={patient.hypertension}
            onChange={(event) =>
              setPatient({ ...patient, hypertension: event.target.value as YesNoUnknown })
            }
          >
            {yesNoUnknownOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="small">Dislipidemia</span>
          <select
            value={patient.dyslipidemia}
            onChange={(event) =>
              setPatient({ ...patient, dyslipidemia: event.target.value as YesNoUnknown })
            }
          >
            {yesNoUnknownOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="small">Diabetes</span>
          <select
            value={patient.diabetes}
            onChange={(event) =>
              setPatient({ ...patient, diabetes: event.target.value as YesNoUnknown })
            }
          >
            {yesNoUnknownOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="small">Enfermedad renal crónica</span>
          <select
            value={patient.chronic_kidney_disease}
            onChange={(event) =>
              setPatient({
                ...patient,
                chronic_kidney_disease: event.target.value as YesNoUnknown
              })
            }
          >
            {yesNoUnknownOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="small">Obesidad</span>
          <select
            value={patient.obesity}
            onChange={(event) => setPatient({ ...patient, obesity: event.target.value as YesNoUnknown })}
          >
            {yesNoUnknownOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="small">Estado de reclutamiento</span>
          <select
            value={patient.recruitment_status}
            onChange={(event) =>
              setPatient({ ...patient, recruitment_status: event.target.value as RecruitmentStatus })
            }
          >
            {recruitmentStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <TextAreaField
          label="Notas"
          value={patient.notes ?? ''}
          onChange={(event) => setPatient({ ...patient, notes: event.target.value })}
        />
      </FormSection>

      {error && <p style={{ color: '#b42318' }}>{error}</p>}

      <button onClick={onSubmit} disabled={saving}>
        {saving ? 'Guardando...' : 'Crear paciente'}
      </button>
    </div>
  );
}
