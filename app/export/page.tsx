'use client';

import { AppShell } from '@/components/layout/AppShell';
import { supabase } from '@/lib/supabaseClient';

function toCsv(data: Record<string, unknown>[]) {
  if (!data.length) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map((row) => headers.map((header) => JSON.stringify(row[header] ?? '')).join(','));
  return [headers.join(','), ...rows].join('\n');
}

export default function ExportPage() {
  const handleExport = async () => {
    const { data } = await supabase.from('export_dataset').select('*');
    const csv = toCsv((data as Record<string, unknown>[]) ?? []);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cmo_rcv_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <div className="card grid" style={{ maxWidth: 560 }}>
        <h2>Exportación de datos</h2>
        <p>Genera un CSV longitudinal listo para SPSS/R usando la vista SQL <code>export_dataset</code>.</p>
        <button onClick={handleExport}>Descargar CSV</button>
      </div>
    </AppShell>
  );
}
