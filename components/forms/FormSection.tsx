import type { ReactNode } from 'react';

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      <div className="grid grid-2">{children}</div>
    </section>
  );
}
