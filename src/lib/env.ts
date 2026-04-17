type SafeImportMetaEnv = Record<string, unknown> & {
  BASE_URL?: unknown;
  VITE_SUPABASE_URL?: unknown;
  VITE_SUPABASE_ANON_KEY?: unknown;
};

function getImportMetaEnv(): SafeImportMetaEnv {
  const meta = import.meta as ImportMeta & { env?: SafeImportMetaEnv };
  return meta.env ?? {};
}

export function getEnvString(name: keyof SafeImportMetaEnv): string {
  const value = getImportMetaEnv()[name];

  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}
