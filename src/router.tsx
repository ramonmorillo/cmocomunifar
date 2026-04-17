import type { Session } from '@supabase/supabase-js';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { PatientsPage } from './pages/PatientsPage';
import { NewPatientPage } from './pages/NewPatientPage';
import { PatientDetailPage } from './pages/PatientDetailPage';
import { NewFollowUpVisitPage } from './pages/NewFollowUpVisitPage';
import { NewExtraVisitPage } from './pages/NewExtraVisitPage';

type RouterProps = {
  session: Session | null;
  onLogout: () => Promise<void>;
};

function ProtectedRoute({ session, children }: { session: Session | null; children: JSX.Element }) {
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function AppRouter({ session, onLogout }: RouterProps) {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {session ? (
        <nav className="top-nav">
          <Link to="/patients">Pacientes</Link>
          <button type="button" onClick={() => void onLogout()}>Cerrar sesión</button>
        </nav>
      ) : null}

      <Routes>
        <Route path="/" element={<Navigate to="/patients" replace />} />
        <Route path="/login" element={session ? <Navigate to="/patients" replace /> : <LoginPage />} />

        <Route
          path="/patients"
          element={
            <ProtectedRoute session={session}>
              <PatientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/new"
          element={
            <ProtectedRoute session={session}>
              <NewPatientPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/:id"
          element={
            <ProtectedRoute session={session}>
              <PatientDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/:id/follow-up/new"
          element={
            <ProtectedRoute session={session}>
              <NewFollowUpVisitPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/:id/extra/new"
          element={
            <ProtectedRoute session={session}>
              <NewExtraVisitPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
