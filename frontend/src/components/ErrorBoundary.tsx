import { Component, type ErrorInfo, type ReactNode } from 'react';
import { colors } from '../config/colors';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-secondary-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                style={{ backgroundColor: colors.error.light }}
              >
                <svg 
                  className="w-6 h-6" 
                  style={{ color: colors.error.main }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">
                  ¡Oops! Algo salió mal
                </h2>
                <p className="text-neutral-600">
                  Ha ocurrido un error inesperado
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-neutral-700 mb-4">
                Lo sentimos, pero algo no funcionó correctamente. 
                Por favor, intenta recargar la página.
              </p>
              
              {import.meta.env.DEV && this.state.error && (
                <details className="mb-4">
                  <summary className="cursor-pointer text-sm font-medium text-neutral-600 hover:text-neutral-800">
                    Detalles del error (desarrollo)
                  </summary>
                  <div className="mt-2 p-3 bg-neutral-100 rounded text-xs font-mono text-neutral-800 overflow-auto">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 text-white font-medium rounded-lg transition-colors"
                style={{ backgroundColor: colors.primary.main }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary.main;
                }}
              >
                Recargar página
              </button>
              
              <button
                onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
