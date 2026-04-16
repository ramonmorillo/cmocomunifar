'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      setError(loginError.message);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <main>
      <div className="container" style={{ maxWidth: 420 }}>
        <form className="card grid" onSubmit={handleSubmit}>
          <h1>Acceso de investigadores</h1>
          <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p style={{ color: '#b42318' }}>{error}</p>}
          <button type="submit">Entrar</button>
        </form>
      </div>
    </main>
  );
}
