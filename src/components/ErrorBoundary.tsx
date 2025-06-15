import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Actualizar el estado para mostrar la UI de error
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log del error para debugging/monitoring
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Llamar callback opcional para logging externo
    this.props.onError?.(error, errorInfo);
    
    // En producción, aquí enviarías a Sentry, LogRocket, etc.
    if (import.meta.env.PROD) {
      // TODO: Send to error monitoring service
      console.error('Production Error:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      });
    }
    
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Usar fallback personalizado si se proporciona
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI de error por defecto
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
              Algo salió mal
            </h2>
            
            <p className="text-gray-600 text-center mb-6">
              Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
            </p>

            {/* Mostrar detalles del error solo en desarrollo */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-4 p-3 bg-gray-100 rounded-lg text-sm">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  Detalles del error (desarrollo)
                </summary>
                <div className="space-y-2 text-xs text-gray-600">
                  <div>
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="mt-1 overflow-auto">{this.state.error.stack}</pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 overflow-auto">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Reintentar
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Recargar página
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Si el problema persiste, contacta al soporte técnico
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para reportar errores manualmente
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: string) => {
    console.error('Manual error report:', error, errorInfo);
    
    if (import.meta.env.PROD) {
      // TODO: Send to error monitoring service
    }
  };
};

// Componente funcional para errores simples
export const ErrorFallback: React.FC<{ 
  error?: Error; 
  resetError?: () => void;
  message?: string;
}> = ({ error, resetError, message }) => (
  <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
    <div className="flex items-center mb-3">
      <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
      <h3 className="text-lg font-medium text-red-800">Error</h3>
    </div>
    
    <p className="text-red-700 mb-4">
      {message || error?.message || 'Ha ocurrido un error inesperado'}
    </p>
    
    {resetError && (
      <button
        onClick={resetError}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Reintentar
      </button>
    )}
  </div>
);

export default ErrorBoundary;
