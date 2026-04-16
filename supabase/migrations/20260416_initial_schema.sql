-- CMO-RCV Study: initial Supabase schema
-- Safe baseline schema focused on robust data capture and future extensibility.

create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'investigator',
  created_at timestamptz not null default now()
);

create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  study_code text not null unique,
  inclusion_date date not null,
  birth_date date,
  sex text check (sex in ('M', 'F', 'O')),
  pharmacy_site text,
  investigator_name text,
  consent_signed boolean not null default false,
  inclusion_ok boolean not null default false,
  exclusion_reason text,
  recruitment_status text not null default 'screening',
  notes text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists visits (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  visit_type text not null check (visit_type in ('basal', 'm3', 'm6', 'm9', 'm12', 'extraordinaria')),
  scheduled_date date,
  visit_date date,
  visit_status text not null default 'pendiente',
  extraordinary_reason text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists clinical_assessments (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null unique references visits(id) on delete cascade,
  sbp numeric(5,2),
  dbp numeric(5,2),
  heart_rate numeric(5,2),
  weight_kg numeric(6,2),
  height_cm numeric(6,2),
  bmi numeric(6,2),
  waist_cm numeric(6,2),
  ldl_mg_dl numeric(6,2),
  hdl_mg_dl numeric(6,2),
  non_hdl_mg_dl numeric(6,2),
  fasting_glucose_mg_dl numeric(6,2),
  hba1c_pct numeric(4,2),
  score2_value numeric(6,2),
  cv_risk_level text,
  smoker_status text,
  alcohol_use text,
  physical_activity_level text,
  diet_score numeric(6,2),
  safety_incidents text,
  updated_at timestamptz not null default now()
);

create table if not exists medication_records (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references visits(id) on delete cascade,
  drug_name text not null,
  dose text,
  frequency text,
  duration text,
  high_risk_ismp boolean,
  adherence_observed text,
  treatment_change boolean,
  change_reason text,
  created_at timestamptz not null default now()
);

create table if not exists patient_reported_outcomes (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null unique references visits(id) on delete cascade,
  iexpac_total numeric(6,2),
  morisky_green_score numeric(6,2),
  predimed_score numeric(6,2),
  ipaq_score numeric(6,2),
  eq5d5l_index numeric(6,3),
  empowerment_score numeric(6,2),
  communication_score numeric(6,2),
  self_report_notes text,
  updated_at timestamptz not null default now()
);

create table if not exists interventions (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references visits(id) on delete cascade,
  intervention_type text,
  intervention_domain text,
  priority_level text,
  delivered boolean not null default false,
  linked_to_cmo_level text,
  outcome text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists coordination_events (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references visits(id) on delete cascade,
  coordination_type text,
  target_professional text,
  issue_reported text,
  response_received boolean,
  response_time_hours numeric(8,2),
  resolved boolean,
  created_at timestamptz not null default now()
);

create table if not exists feasibility_metrics (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null unique references visits(id) on delete cascade,
  visit_duration_minutes numeric(6,2),
  pharmacist_time_minutes numeric(6,2),
  material_cost_eur numeric(8,2),
  operational_notes text,
  updated_at timestamptz not null default now()
);

-- Future-ready CMO configuration table (no closed clinical logic yet)
create table if not exists cmo_config (
  id uuid primary key default gen_random_uuid(),
  config_key text not null unique,
  config_value jsonb not null default '{}'::jsonb,
  enabled boolean not null default true,
  version integer not null default 1,
  notes text,
  updated_by uuid references profiles(id),
  updated_at timestamptz not null default now()
);

create or replace view export_dataset as
select
  p.id as patient_id,
  p.study_code,
  p.inclusion_date,
  p.birth_date,
  p.sex,
  p.pharmacy_site,
  p.investigator_name,
  p.consent_signed,
  p.inclusion_ok,
  p.recruitment_status,
  v.id as visit_id,
  v.visit_type,
  v.scheduled_date,
  v.visit_date,
  v.visit_status,
  v.extraordinary_reason,
  ca.sbp,
  ca.dbp,
  ca.heart_rate,
  ca.weight_kg,
  ca.height_cm,
  ca.bmi,
  ca.waist_cm,
  ca.ldl_mg_dl,
  ca.hdl_mg_dl,
  ca.non_hdl_mg_dl,
  ca.fasting_glucose_mg_dl,
  ca.hba1c_pct,
  ca.score2_value,
  ca.cv_risk_level,
  mr.drug_name,
  mr.dose,
  mr.frequency,
  mr.duration,
  mr.high_risk_ismp,
  mr.adherence_observed,
  mr.treatment_change,
  pro.iexpac_total,
  pro.morisky_green_score,
  pro.predimed_score,
  pro.ipaq_score,
  pro.eq5d5l_index,
  pro.empowerment_score,
  i.intervention_type,
  i.intervention_domain,
  i.priority_level,
  i.delivered,
  i.linked_to_cmo_level,
  i.outcome as intervention_outcome,
  ce.coordination_type,
  ce.target_professional,
  ce.response_received,
  ce.response_time_hours,
  ce.resolved,
  fm.visit_duration_minutes,
  fm.pharmacist_time_minutes,
  fm.material_cost_eur
from patients p
join visits v on v.patient_id = p.id
left join clinical_assessments ca on ca.visit_id = v.id
left join medication_records mr on mr.visit_id = v.id
left join patient_reported_outcomes pro on pro.visit_id = v.id
left join interventions i on i.visit_id = v.id
left join coordination_events ce on ce.visit_id = v.id
left join feasibility_metrics fm on fm.visit_id = v.id;

-- Row Level Security baseline: authenticated users can operate the study.
alter table profiles enable row level security;
alter table patients enable row level security;
alter table visits enable row level security;
alter table clinical_assessments enable row level security;
alter table medication_records enable row level security;
alter table patient_reported_outcomes enable row level security;
alter table interventions enable row level security;
alter table coordination_events enable row level security;
alter table feasibility_metrics enable row level security;
alter table cmo_config enable row level security;

create policy "auth_read_profiles" on profiles for select to authenticated using (true);
create policy "self_write_profile" on profiles for all to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "auth_all_patients" on patients for all to authenticated using (true) with check (true);
create policy "auth_all_visits" on visits for all to authenticated using (true) with check (true);
create policy "auth_all_clinical" on clinical_assessments for all to authenticated using (true) with check (true);
create policy "auth_all_medication" on medication_records for all to authenticated using (true) with check (true);
create policy "auth_all_pro" on patient_reported_outcomes for all to authenticated using (true) with check (true);
create policy "auth_all_interventions" on interventions for all to authenticated using (true) with check (true);
create policy "auth_all_coordination" on coordination_events for all to authenticated using (true) with check (true);
create policy "auth_all_feasibility" on feasibility_metrics for all to authenticated using (true) with check (true);
create policy "auth_all_cmo_config" on cmo_config for all to authenticated using (true) with check (true);
