import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error): void {
    if (import.meta.env.DEV) {
      console.error(error);
    }
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  override render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-bg dark:bg-bg-dark">
          <div className="max-w-md w-full text-center">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-pill bg-red-500/15 text-red-500">
              <AlertTriangle size={22} strokeWidth={1.75} />
            </div>
            <h1 className="text-[20px] font-semibold mb-2">Something went wrong</h1>
            <p className="text-[14px] text-muted dark:text-muted-dark mb-6">
              {this.state.error.message || 'An unexpected error occurred.'}
            </p>
            <Button onClick={() => window.location.reload()} variant="primary">
              Reload page
            </Button>
            <Button onClick={this.reset} variant="ghost" className="ml-2">
              Try again
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
