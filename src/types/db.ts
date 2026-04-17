export type VisitType = 'baseline' | 'month_3' | 'month_6' | 'month_9' | 'month_12' | 'extra';

export interface Patient {
  id: string;
  study_code: string;
  pharmacy_site: string | null;
  investigator_name: string | null;
  inclusion_date: string | null;
  screening_date: string | null;
  birth_date: string | null;
  age_at_inclusion: number | null;
  sex: 'male' | 'female' | 'other' | 'unknown';
  consent_signed: boolean;
  inclusion_ok: boolean;
  exclusion_reason: string | null;
  cardiovascular_disease_established: 'yes' | 'no' | 'unknown';
  hypertension: 'yes' | 'no' | 'unknown';
  dyslipidemia: 'yes' | 'no' | 'unknown';
  diabetes: 'yes' | 'no' | 'unknown';
  chronic_kidney_disease: 'yes' | 'no' | 'unknown';
  obesity: 'yes' | 'no' | 'unknown';
  recruitment_status:
    | 'screening'
    | 'included'
    | 'active'
    | 'completed'
    | 'withdrawn'
    | 'lost_to_follow_up'
    | 'excluded';
  notes: string | null;
}

export interface Visit {
  id: string;
  patient_id: string;
  visit_type: VisitType;
  visit_number: number | null;
  scheduled_date: string | null;
  visit_date: string | null;
  visit_status: string;
  extraordinary_reason: string | null;
  notes: string | null;
}
