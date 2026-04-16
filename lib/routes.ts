export const routes = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  patients: '/patients',
  patientNew: '/patients/new',
  patientDetail: (id: string) => `/patients/${id}`,
  visitNew: '/visits/new'
} as const;
