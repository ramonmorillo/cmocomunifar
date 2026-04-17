import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { AppRouter } from './router';
import { getSession, onAuthStateChange, signOut } from './services/auth';
import { getMissingSupabaseEnvVars, isSupabaseConfigured } from './lib/supabase';

function MissingConfigScreen() {
  const missingVars = getMissingSupabaseEnvVars();

  return (
    <main className="page page--narrow">
      <h1>Configuración pendiente</h1>
      <p className="error">Falta configuración de Supabase</p>
      <p>La aplicación no puede iniciar porque faltan variables de entorno de Supabase.</p>
      <ul className="list">
        {missingVars.map((varName) => (
          <li key={varName}>Falta {varName}</li>
        ))}
      </ul>
      <p>Define las variables en <code>.env.local</code> y reinicia <code>npm run dev</code>.</p>
    </main>
  );
}

function StartupErrorScreen({ message }: { message: string }) {
  return (
    <main className="page page--narrow">
      <h1>Error de arranque</h1>
      <p>No se pudo iniciar la aplicación.</p>
      <p className="error">{message}</p>
    </main>
  );
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [startupError, setStartupError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    getSession()
      .then((result) => setSession(result))
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Error desconocido al cargar sesión.';
        setStartupError(message);
      })
      .finally(() => setLoading(false));

    const unsubscribe = onAuthStateChange((nextSession) => setSession(nextSession));

    return unsubscribe;
  }, []);

  async function handleLogout() {
    await signOut();
  }

  if (!isSupabaseConfigured) {
    return <MissingConfigScreen />;
  }

  if (startupError) {
    return <StartupErrorScreen message={startupError} />;
  }

  if (loading) {
    return <main className="page"><p>Cargando sesión...</p></main>;
  }

  return <AppRouter session={session} onLogout={handleLogout} />;
}

export default App;
