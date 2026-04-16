-- =========================================================
-- CMO-RCV STUDY · ESQUEMA INICIAL SUPABASE
-- VERSIÓN CORREGIDA SIN COLUMNAS GENERATED
-- =========================================================

create extension if not exists pgcrypto;

-- =========================================================
-- ENUMS
-- =========================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'sex_type') then
    create type sex_type as enum ('male', 'female', 'other', 'unknown');
  end if;

  if not exists (select 1 from pg_type where typname = 'recruitment_status_type') then
    create type recruitment_status_type as enum (
      'screening',
      'included',
      'active',
      'completed',
      'withdrawn',
      'lost_to_follow_up',
      'excluded'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'visit_type_enum') then
    create type visit_type_enum as enum (
      'baseline',
      'month_3',
      'month_6',
      'month_9',
      'month_12',
      'extra'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'visit_status_enum') then
    create type visit_status_enum as enum (
      'scheduled',
      'completed',
      'missed',
      'cancelled'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'yes_no_unknown_enum') then
    create type yes_no_unknown_enum as enum (
      'yes',
      'no',
      'unknown'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'smoking_status_enum') then
    create type smoking_status_enum as enum (
      'never',
      'former',
      'current',
      'unknown'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'alcohol_use_enum') then
    create type alcohol_use_enum as enum (
      'none',
      'occasional',
      'moderate',
      'high',
      'unknown'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'activity_level_enum') then
    create type activity_level_enum as enum (
      'low',
      'moderate',
      'high',
      'unknown'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'priority_level_enum') then
    create type priority_level_enum as enum (
      'low',
      'medium',
      'high'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'resolution_status_enum') then
    create type resolution_status_enum as enum (
      'pending',
      'resolved',
      'partially_resolved',
      'not_resolved'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'user_role_enum') then
    create type user_role_enum as enum (
      'admin',
      'researcher',
      'pharmacist',
      'viewer'
    );
  end if;
end $$;

-- =========================================================
-- FUNCIÓN updated_at
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- PROFILES
-- =========================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role user_role_enum not null default 'researcher',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- =========================================================
-- PATIENTS
-- =========================================================

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),

  study_code text not null unique,
  pharmacy_site text,
  investigator_name text,

  inclusion_date date,
  screening_date date,

  birth_date date,
  age_at_inclusion integer,

  sex sex_type not null default 'unknown',

  consent_signed boolean not null default false,
  inclusion_ok boolean not null default false,
  exclusion_reason text,

  cardiovascular_disease_established yes_no_unknown_enum default 'unknown',
  hypertension yes_no_unknown_enum default 'unknown',
  dyslipidemia yes_no_unknown_enum default 'unknown',
  diabetes yes_no_unknown_enum default 'unknown',
  chronic_kidney_disease yes_no_unknown_enum default 'unknown',
  obesity yes_no_unknown_enum default 'unknown',

  recruitment_status recruitment_status_type not null default 'screening',

  notes text,

  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_patients_updated_at on public.patients;
create trigger trg_patients_updated_at
before update on public.patients
for each row
execute function public.set_updated_at();

create index if not exists idx_patients_study_code on public.patients(study_code);
create index if not exists idx_patients_status on public.patients(recruitment_status);

-- =========================================================
-- VISITS
-- =========================================================

create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),

  patient_id uuid not null references public.patients(id) on delete cascade,

  visit_type visit_type_enum not null,
  visit_number integer,
  scheduled_date date,
  visit_date date,
  visit_status visit_status_enum not null default 'scheduled',

  extraordinary_reason text,
  notes text,

  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint uq_patient_visit unique (patient_id, visit_type, visit_number)
);

drop trigger if exists trg_visits_updated_at on public.visits;
create trigger trg_visits_updated_at
before update on public.visits
for each row
execute function public.set_updated_at();

create index if not exists idx_visits_patient_id on public.visits(patient_id);
create index if not exists idx_visits_visit_date on public.visits(visit_date);
create index if not exists idx_visits_type on public.visits(visit_type);

-- =========================================================
-- CLINICAL ASSESSMENTS
-- =========================================================

create table if not exists public.clinical_assessments (
  id uuid primary key default gen_random_uuid(),

  visit_id uuid not null unique references public.visits(id) on delete cascade,

  systolic_bp numeric(5,2),
  diastolic_bp numeric(5,2),
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
  framingham_value numeric(6,2),
  cv_risk_level text,

  smoker_status smoking_status_enum default 'unknown',
  alcohol_use alcohol_use_enum default 'unknown',
  physical_activity_level activity_level_enum default 'unknown',
  diet_score numeric(6,2),

  safety_incidents text,
  adverse_events_count integer,
  high_risk_medication_present boolean,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_clinical_assessments_updated_at on public.clinical_assessments;
create trigger trg_clinical_assessments_updated_at
before update on public.clinical_assessments
for each row
execute function public.set_updated_at();

-- =========================================================
-- MEDICATION RECORDS
-- =========================================================

create table if not exists public.medication_records (
  id uuid primary key default gen_random_uuid(),

  visit_id uuid not null references public.visits(id) on delete cascade,

  drug_name text not null,
  dose text,
  frequency text,
  duration text,

  is_high_risk_ismp boolean not null default false,
  adherence_observed text,
  treatment_changed boolean not null default false,
  change_reason text,

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_medication_records_updated_at on public.medication_records;
create trigger trg_medication_records_updated_at
before update on public.medication_records
for each row
execute function public.set_updated_at();

create index if not exists idx_medication_records_visit_id on public.medication_records(visit_id);

-- =========================================================
-- PATIENT REPORTED OUTCOMES
-- =========================================================

create table if not exists public.patient_reported_outcomes (
  id uuid primary key default gen_random_uuid(),

  visit_id uuid not null unique references public.visits(id) on delete cascade,

  iexpac_total numeric(5,2),
  morisky_green_score numeric(5,2),
  predimed_score numeric(5,2),
  ipaq_score numeric(10,2),
  eq5d5l_index numeric(6,3),
  empowerment_score numeric(6,2),
  communication_score numeric(6,2),

  patient_satisfaction_score numeric(6,2),
  autonomy_score numeric(6,2),
  quality_of_life_score numeric(6,2),

  self_report_notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_patient_reported_outcomes_updated_at on public.patient_reported_outcomes;
create trigger trg_patient_reported_outcomes_updated_at
before update on public.patient_reported_outcomes
for each row
execute function public.set_updated_at();

-- =========================================================
-- INTERVENTIONS
-- =========================================================

create table if not exists public.interventions (
  id uuid primary key default gen_random_uuid(),

  visit_id uuid not null references public.visits(id) on delete cascade,

  intervention_type text not null,
  intervention_domain text,
  priority_level priority_level_enum default 'medium',

  delivered boolean not null default true,
  linked_to_cmo_level text,
  outcome text,
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_interventions_updated_at on public.interventions;
create trigger trg_interventions_updated_at
before update on public.interventions
for each row
execute function public.set_updated_at();

create index if not exists idx_interventions_visit_id on public.interventions(visit_id);
create index if not exists idx_interventions_type on public.interventions(intervention_type);

-- =========================================================
-- COORDINATION EVENTS
-- =========================================================

create table if not exists public.coordination_events (
  id uuid primary key default gen_random_uuid(),

  visit_id uuid not null references public.visits(id) on delete cascade,

  coordination_type text,
  target_professional text,
  issue_reported text,
  response_received text,
  response_time_hours numeric(8,2),

  resolution_status resolution_status_enum default 'pending',
  resolved boolean default false,

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_coordination_events_updated_at on public.coordination_events;
create trigger trg_coordination_events_updated_at
before update on public.coordination_events
for each row
execute function public.set_updated_at();

create index if not exists idx_coordination_events_visit_id on public.coordination_events(visit_id);

-- =========================================================
-- FEASIBILITY METRICS
-- =========================================================

create table if not exists public.feasibility_metrics (
  id uuid primary key default gen_random_uuid(),

  visit_id uuid not null unique references public.visits(id) on delete cascade,

  visit_duration_minutes numeric(6,2),
  pharmacist_time_minutes numeric(6,2),
  material_cost_eur numeric(10,2),
  operational_notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_feasibility_metrics_updated_at on public.feasibility_metrics;
create trigger trg_feasibility_metrics_updated_at
before update on public.feasibility_metrics
for each row
execute function public.set_updated_at();

-- =========================================================
-- CMO CONFIG
-- =========================================================

create table if not exists public.cmo_config (
  id uuid primary key default gen_random_uuid(),

  version_name text not null,
  is_active boolean not null default false,
  config_json jsonb not null default '{}'::jsonb,
  notes text,

  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_cmo_config_updated_at on public.cmo_config;
create trigger trg_cmo_config_updated_at
before update on public.cmo_config
for each row
execute function public.set_updated_at();

create unique index if not exists uq_cmo_config_active_true
on public.cmo_config(is_active)
where is_active = true;

-- =========================================================
-- VISIT CUSTOM FIELDS
-- =========================================================

create table if not exists public.visit_custom_fields (
  id uuid primary key default gen_random_uuid(),

  visit_id uuid not null references public.visits(id) on delete cascade,
  field_key text not null,
  field_value text,
  field_type text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint uq_visit_custom_field unique (visit_id, field_key)
);

drop trigger if exists trg_visit_custom_fields_updated_at on public.visit_custom_fields;
create trigger trg_visit_custom_fields_updated_at
before update on public.visit_custom_fields
for each row
execute function public.set_updated_at();

create index if not exists idx_visit_custom_fields_visit_id on public.visit_custom_fields(visit_id);

-- =========================================================
-- RLS
-- =========================================================

alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.visits enable row level security;
alter table public.clinical_assessments enable row level security;
alter table public.medication_records enable row level security;
alter table public.patient_reported_outcomes enable row level security;
alter table public.interventions enable row level security;
alter table public.coordination_events enable row level security;
alter table public.feasibility_metrics enable row level security;
alter table public.cmo_config enable row level security;
alter table public.visit_custom_fields enable row level security;

drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "patients_all_authenticated" on public.patients;
create policy "patients_all_authenticated"
on public.patients
for all
to authenticated
using (true)
with check (true);

drop policy if exists "visits_all_authenticated" on public.visits;
create policy "visits_all_authenticated"
on public.visits
for all
to authenticated
using (true)
with check (true);

drop policy if exists "clinical_assessments_all_authenticated" on public.clinical_assessments;
create policy "clinical_assessments_all_authenticated"
on public.clinical_assessments
for all
to authenticated
using (true)
with check (true);

drop policy if exists "medication_records_all_authenticated" on public.medication_records;
create policy "medication_records_all_authenticated"
on public.medication_records
for all
to authenticated
using (true)
with check (true);

drop policy if exists "patient_reported_outcomes_all_authenticated" on public.patient_reported_outcomes;
create policy "patient_reported_outcomes_all_authenticated"
on public.patient_reported_outcomes
for all
to authenticated
using (true)
with check (true);

drop policy if exists "interventions_all_authenticated" on public.interventions;
create policy "interventions_all_authenticated"
on public.interventions
for all
to authenticated
using (true)
with check (true);

drop policy if exists "coordination_events_all_authenticated" on public.coordination_events;
create policy "coordination_events_all_authenticated"
on public.coordination_events
for all
to authenticated
using (true)
with check (true);

drop policy if exists "feasibility_metrics_all_authenticated" on public.feasibility_metrics;
create policy "feasibility_metrics_all_authenticated"
on public.feasibility_metrics
for all
to authenticated
using (true)
with check (true);

drop policy if exists "cmo_config_all_authenticated" on public.cmo_config;
create policy "cmo_config_all_authenticated"
on public.cmo_config
for all
to authenticated
using (true)
with check (true);

drop policy if exists "visit_custom_fields_all_authenticated" on public.visit_custom_fields;
create policy "visit_custom_fields_all_authenticated"
on public.visit_custom_fields
for all
to authenticated
using (true)
with check (true);

-- =========================================================
-- AUTO PROFILE ON SIGNUP
-- =========================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    'researcher'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();
