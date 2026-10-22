import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lagos B2B Factory ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = '#/';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white p-6 sm:p-12 font-mono flex flex-col justify-center items-center">
          <div className="max-w-xl w-full border-2 border-red-500 p-6 sm:p-8 bg-zinc-950 space-y-6">
            <div className="flex items-center gap-3 text-red-500 border-b border-red-500/40 pb-4">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <span className="text-xs uppercase tracking-widest text-red-400 block font-bold">
                  Runtime Exception Fault
                </span>
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase">
                  Application Error Intercepted
                </h1>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              The B2B Automation Engine encountered an unhandled execution fault while rendering dynamic calculation state.
            </p>

            {this.state.error && (
              <div className="bg-black border border-zinc-800 p-3 text-[11px] text-red-300 overflow-x-auto max-h-36">
                <code>{this.state.error.toString()}</code>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="min-h-[44px] bg-red-600 hover:bg-red-500 text-black font-black px-5 py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload & Reset</span>
              </button>
              <a
                href="#/"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                }}
                className="min-h-[44px] bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-5 py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-zinc-700 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Return to Pipeline</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
