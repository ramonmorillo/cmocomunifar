export function formatDate(value: string | null | undefined) {
  if (!value) {
    return '—';
  }

  try {
    return new Date(value).toLocaleDateString('es-ES');
  } catch {
    return value;
  }
}
