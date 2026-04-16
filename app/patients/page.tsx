'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { supabase } from '@/lib/supabaseClient';
import type { Patient } from '@/types/db';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('patients').select('*').order('inclusion_date', { ascending: false });
      setPatients((data as Patient[]) ?? []);
    };
    void load();
  }, []);

  return (
    <AppShell>
      <div className="card">
        <h2>Listado de pacientes</h2>
        <table>
          <thead>
            <tr>
              <th>Código estudio</th>
              <th>Fecha inclusión</th>
              <th>Sede</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.study_code}</td>
                <td>{patient.inclusion_date}</td>
                <td>{patient.pharmacy_site}</td>
                <td>{patient.recruitment_status}</td>
                <td>
                  <Link href={`/patients/${patient.id}`}>Abrir ficha</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
