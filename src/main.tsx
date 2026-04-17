import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/main.css';

type ErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

class StartupErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: ''
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'Error desconocido de arranque.'
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="page page--narrow">
          <h1>Error inesperado</h1>
          <p>Ocurrió un problema al iniciar la aplicación.</p>
          <p className="error">{this.state.message}</p>
        </main>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('No se encontró el contenedor #root en index.html.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <StartupErrorBoundary>
      <App />
    </StartupErrorBoundary>
  </React.StrictMode>
);
