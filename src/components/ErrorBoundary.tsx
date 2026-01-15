import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = { hasError: false };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    background: '#FEF2F2',
                    border: '1px solid #FCA5A5',
                    borderRadius: '8px',
                    margin: '1rem'
                }}>
                    <h2 style={{ color: '#991B1B', marginBottom: '1rem' }}>Something went wrong</h2>
                    <p style={{ color: '#7F1D1D', marginBottom: '1rem' }}>
                        {this.state.error?.message || "An unexpected error occurred."}
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        style={{
                            padding: '8px 16px',
                            background: '#DC2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
