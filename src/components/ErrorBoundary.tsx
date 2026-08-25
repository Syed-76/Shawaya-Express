import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    if (
      error?.message?.toLowerCase().includes('metamask') ||
      error?.message?.toLowerCase().includes('ethereum') ||
      error?.message?.toLowerCase().includes('web3')
    ) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (
      error?.message?.toLowerCase().includes('metamask') ||
      error?.message?.toLowerCase().includes('ethereum') ||
      error?.message?.toLowerCase().includes('web3')
    ) {
      return;
    }
    console.error('Uncaught application error:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
            <p className="text-xs text-gray-600 font-light">
              An unexpected error occurred while rendering the restaurant view.
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-3 bg-[#1F2937] hover:bg-[#D97706] text-white font-bold rounded-full text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
