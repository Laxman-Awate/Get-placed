import React from 'react';

type Props = { children: React.ReactNode; title?: string };
type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Visible in devtools without leaking anything to the UI.
    console.error('UI crashed inside ErrorBoundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-full bg-[#080810] flex items-center justify-center p-6">
          <div className="card-dark rounded-2xl p-8 max-w-sm text-center">
            <div className="text-lg font-bold text-white mb-2">Something went wrong</div>
            <p className="text-sm text-[#64748b] mb-6">
              {this.props.title || 'This section'} ran into a problem. Your data is safe.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
