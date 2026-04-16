# CMO-RCV Study

Aplicación web para investigación clínica longitudinal en farmacia comunitaria, conectada a Supabase.

## Arquitectura propuesta

- **Frontend:** Next.js (App Router + TypeScript), diseño sobrio y modular.
- **Backend:** Supabase (PostgreSQL, Auth, RLS, vistas de exportación).
- **Modelo de datos:** núcleo en `patients` + `visits`, con tablas satélite por bloques de formulario.
- **Extensibilidad CMO:** módulo `lib/cmo` y tabla `cmo_config` para reglas futuras sin romper histórico.

## Estructura de carpetas

```txt
app/
  login/                # autenticación
  dashboard/            # métricas básicas
  patients/             # listado y ficha paciente
  visits/new/           # alta de visita
  visits/[id]/edit/     # edición de visita
  export/               # exportación CSV
components/
  layout/               # shell principal
  forms/                # bloques reutilizables de formularios
  visits/               # formulario de visita
lib/
  supabaseClient.ts     # cliente Supabase
  cmo/config.ts         # preparación módulo futuro CMO
types/
  db.ts                 # tipos base
supabase/migrations/
  20260416_initial_schema.sql
```

## SQL inicial Supabase

El script inicial está en:

- `supabase/migrations/20260416_initial_schema.sql`

Incluye:

- tablas: `patients`, `visits`, `clinical_assessments`, `medication_records`, `patient_reported_outcomes`, `interventions`, `coordination_events`, `feasibility_metrics`, `cmo_config`, `profiles`.
- restricciones básicas y claves foráneas.
- `view export_dataset` para exportación longitudinal CSV/SPSS/R.
- políticas RLS baseline para usuarios autenticados.

## Arranque local

1. Crear `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

2. Instalar y ejecutar:

```bash
npm install
npm run dev
```

3. Aplicar migración SQL en Supabase (SQL Editor o CLI).

---

> Nota: la estratificación clínica CMO **no** se implementa aún por diseño; solo se deja preparada su configuración futura.
