import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { AppRouter } from './router';
import { getSession, onAuthStateChange, signOut } from './services/auth';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession()
      .then((result) => setSession(result))
      .finally(() => setLoading(false));

    const unsubscribe = onAuthStateChange((nextSession) => setSession(nextSession));

    return unsubscribe;
  }, []);

  async function handleLogout() {
    await signOut();
  }

  if (loading) {
    return <main className="page"><p>Cargando sesión...</p></main>;
  }

  return <AppRouter session={session} onLogout={handleLogout} />;
}

export default App;
