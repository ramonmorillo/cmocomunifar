export type VisitType = 'basal' | 'm3' | 'm6' | 'm9' | 'm12' | 'extraordinaria';

export interface Patient {
  id: string;
  study_code: string;
  inclusion_date: string;
  birth_date: string | null;
  sex: 'M' | 'F' | 'O' | null;
  pharmacy_site: string | null;
  investigator_name: string | null;
  consent_signed: boolean;
  inclusion_ok: boolean;
  exclusion_reason: string | null;
  recruitment_status: string;
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
