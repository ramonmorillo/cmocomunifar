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

> Importante: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` **deben existir antes de ejecutar** `npm run build`.
> Si faltan, la app mostrará una pantalla de configuración pendiente en lugar de una pantalla en blanco.

## Desarrollo local
```bash
npm install
npm run dev
```

## Build estática para GitHub Pages
```bash
npm install
npm run build
```

Este comando:
- genera la SPA en `docs/`
- usa `base: '/cmocomunifar/'` para que los assets apunten a `/cmocomunifar/assets/...`
- crea `docs/.nojekyll`

## Publicación manual en GitHub Pages (sin workflows)
1. Ejecutar `npm install` y luego `npm run build`.
2. Confirmar que `docs/index.html` y `docs/.nojekyll` existen.
3. Verificar que en `docs/index.html` los bundles se cargan desde `/cmocomunifar/assets/...`.
4. Commit y push al repositorio.
5. En GitHub: **Settings → Pages**.
6. En **Build and deployment** seleccionar:
   - **Source**: Deploy from a branch
   - **Branch**: `main`
   - **Folder**: `/docs`
7. Guardar y esperar la publicación.

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
