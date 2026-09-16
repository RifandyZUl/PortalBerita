/**
 * Error Boundary Component
 * 
 * React Error Boundary untuk catch dan handle errors di component tree.
 * Mencegah entire app dari crash ketika ada error di component.
 * 
 * @module components/ErrorBoundary
 */

import React from 'react';
import { logError } from '../utils/errorHandler.js';

/**
 * Error Fallback Component
 * 
 * @param {Object} props
 * @param {Error} props.error - Error object
 * @param {Function} props.resetError - Function untuk reset error
 */
const ErrorFallback = ({ error, resetError }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          Terjadi Kesalahan
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          Maaf, terjadi kesalahan yang tidak terduga. Silakan refresh halaman atau coba lagi nanti.
        </p>

        {import.meta.env.MODE === 'development' && error && (
          <div className="mb-4 p-3 bg-gray-100 rounded text-xs text-gray-700 overflow-auto max-h-32">
            <strong>Error:</strong> {error.message}
            {error.stack && (
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-600">Stack Trace</summary>
                <pre className="mt-2 text-xs whitespace-pre-wrap">{error.stack}</pre>
              </details>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={resetError}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Refresh Halaman
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Error Boundary Class Component
 * 
 * Catches errors di component tree dan menampilkan fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state untuk render fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error untuk debugging
    logError(error, {
      componentStack: errorInfo.componentStack,
      type: 'REACT_ERROR_BOUNDARY',
    });

    // Store error info untuk display
    this.setState({
      errorInfo,
    });

    // Optional: Send to error tracking service (Sentry, etc.)
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     contexts: {
    //       react: {
    //         componentStack: errorInfo.componentStack,
    //       },
    //     },
    //   });
    // }
  }

  handleReset = () => {
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <ErrorFallback
          error={this.state.error}
          resetError={this.handleReset}
        />
      );
    }

    // Render children jika tidak ada error
    return this.props.children;
  }
}

export default ErrorBoundary;

