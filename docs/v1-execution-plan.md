# CMO-RCV Study · V1 Execution Plan (SPA + Supabase)

## Objetivo
Implementar una app **específica del estudio**, estática y ligera, publicada en GitHub Pages, con Supabase para autenticación y datos centralizados.

Este plan prioriza:
- simplicidad
- rapidez de implementación
- claridad clínica
- mantenibilidad

## Alcance funcional V1
Flujo operativo mínimo:
1. Login
2. Listado de pacientes
3. Alta de paciente
4. Ficha de paciente
5. Crear visita programada
6. Crear visita extraordinaria
7. Basal con estratificación automática Nivel 1/2/3 + plan de intervenciones

## Principios de implementación
- No cambiar el esquema de base de datos.
- No inventar variables clínicas.
- No hardcodear reglas clínicas nuevas.
- Consumir variables/puntuaciones/intervenciones desde configuración oficial del estudio (`cmo_config`).
- Evitar arquitectura genérica de plataforma.

## Tablas usadas en V1
### Núcleo
- `profiles`
- `patients`
- `visits`
- `clinical_assessments`
- `medication_records`
- `patient_reported_outcomes`
- `interventions`
- `cmo_config`

### Opcionales (fase posterior)
- `coordination_events`
- `feasibility_metrics`

### Fuera de V1
- `visit_custom_fields`

## Estructura SPA mínima
```txt
src/
  main.tsx
  app.tsx
  styles.css
  lib/
    supabase.ts
    auth.ts
    types.ts
  services/
    patients.ts
    visits.ts
    clinical-assessments.ts
    medications.ts
    outcomes.ts
    interventions.ts
    cmo-config.ts
  modules/
    stratification/
      engine.ts
      level-assignment.ts
      intervention-plan.ts
  pages/
    login.tsx
    patients-list.tsx
    patient-new.tsx
    patient-detail.tsx
    visit-programmed.tsx
    visit-extra.tsx
    visit-basal-stratification.tsx
  ui/
    app-shell.tsx
    form-field.tsx
    form-section.tsx
```

## Reglas clínicas operativas de nivel
- Nivel 1: máxima prioridad, máxima complejidad, mayor intensidad de intervención.
- Nivel 2: complejidad intermedia.
- Nivel 3: complejidad basal.

## Plan de ejecución recomendado
### PR 1 · Núcleo operativo
- Setup SPA estática
- Auth Supabase
- Pacientes: listado + alta + ficha
- Visitas: programada + extraordinaria

### PR 2 · Basal y estratificación
- Captura basal (clínica, PRO, medicación)
- Carga config activa
- Cálculo automático de score y nivel 1/2/3

### PR 3 · Intervenciones por nivel y cierre V1
- Render de paquete según nivel
- Registro de intervenciones y resultado
- Ajustes UX clínicos finales

## Definition of Done V1
- Flujo completo ejecutable por investigador sin soporte técnico.
- Nivel CMO calculado automáticamente en basal.
- Intervenciones registradas y trazables por visita.
- App desplegable en GitHub Pages sin backend propio.
