# AGENTS.md

## Proyecto
CMO-RCV Study

Aplicación web para estudio longitudinal de pacientes con riesgo cardiovascular en farmacia comunitaria.

## Objetivo funcional
Permitir:
- autenticación de usuarios
- alta y edición de pacientes
- registro de visitas basal, 3, 6, 9, 12 meses y extraordinarias
- registro estructurado de variables clínicas, adherencia, experiencia del paciente, intervenciones, coordinación y factibilidad
- exportación de datos para análisis en SPSS/R

## Backend
Supabase

## Base de datos disponible
Tablas ya creadas:
- profiles
- patients
- visits
- clinical_assessments
- medication_records
- patient_reported_outcomes
- interventions
- coordination_events
- feasibility_metrics
- cmo_config
- visit_custom_fields

## Reglas de desarrollo
- No cambiar el esquema de base de datos sin indicarlo explícitamente.
- No inventar lógica clínica compleja.
- No implementar todavía cálculo automático de estratificación CMO.
- Priorizar código claro, modular y sencillo.
- Empezar por flujo mínimo funcional:
  1. login
  2. listado de pacientes
  3. crear paciente
  4. ficha de paciente
  5. crear visita
- Mantener interfaz sobria y orientada a uso clínico en ordenador.
- Evitar dependencias innecesarias.
