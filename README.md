# CMO-RCV Study (SPA estática con Vite + Supabase)

Aplicación web ligera para seguimiento longitudinal de pacientes con riesgo cardiovascular en farmacia comunitaria.

## Stack
- React + TypeScript + Vite
- Supabase (Auth + tablas existentes)
- Publicación estática en GitHub Pages desde `docs/`

## Variables de entorno
Crear un archivo `.env.local` (o `.env`) con:

```bash
VITE_SUPABASE_URL=TU_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=TU_SUPABASE_ANON_KEY
```

## Desarrollo local
```bash
npm install
npm run dev
```

## Build estática para GitHub Pages
```bash
npm run build
```

Este comando genera la SPA en `docs/` y también incluye `.nojekyll`.

## Publicación manual en GitHub Pages (sin workflows)
1. Ejecutar `npm run build`.
2. Confirmar que `docs/index.html` y `docs/.nojekyll` existen.
3. Commit y push al repositorio.
4. En GitHub: **Settings → Pages**.
5. En **Build and deployment** seleccionar:
   - **Source**: Deploy from a branch
   - **Branch**: rama principal
   - **Folder**: `/docs`
6. Guardar y esperar la publicación.

## Flujo mínimo implementado
- Login (`/login`)
- Listado de pacientes (`/patients`)
- Alta de paciente (`/patients/new`)
- Ficha de paciente (`/patients/:id`)
- Nueva visita de seguimiento (`/patients/:id/follow-up/new`)
- Nueva visita extraordinaria (`/patients/:id/extra/new`)

## Pendiente intencionadamente
- Estratificación CMO compleja
- Lógica clínica avanzada
- Exportaciones
