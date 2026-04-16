import Link from 'next/link';
import type { ReactNode } from 'react';
import { routes } from '@/lib/routes';

const links = [
  { href: routes.dashboard, label: 'Dashboard' },
  { href: routes.patients, label: 'Pacientes' },
  { href: routes.patientNew, label: 'Nuevo paciente' }
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <main>
      <div className="container grid" style={{ gridTemplateColumns: '240px 1fr' }}>
        <aside className="card">
          <h2>CMO-RCV Study</h2>
          <nav className="grid">
            {links.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </main>
  );
}
