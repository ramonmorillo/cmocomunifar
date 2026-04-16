import Link from 'next/link';
import type { ReactNode } from 'react';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/patients', label: 'Pacientes' },
  { href: '/visits/new', label: 'Nueva visita' },
  { href: '/export', label: 'Exportación' }
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
