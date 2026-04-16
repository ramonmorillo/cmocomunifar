import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <div className="container card">
        <h1>CMO-RCV Study</h1>
        <p>Plataforma de seguimiento longitudinal de riesgo cardiovascular.</p>
        <Link href="/login">Acceder</Link>
      </div>
    </main>
  );
}
