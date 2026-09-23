import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("BhoomiRakshak Dashboard Error Boundary caught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #fee2e2',
          margin: '20px',
          textAlign: 'center',
          color: '#0f172a'
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: '#fee2e2', color: '#dc2626',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <ShieldAlert size={26} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 8px 0', color: '#991b1b' }}>
            APPLICATION ERROR
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 20px 0' }}>
            The monitoring dashboard component encountered a runtime error.
          </p>

          {this.state.error && (
            <pre style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#dc2626',
              maxWidth: '600px',
              margin: '0 auto 20px auto',
              overflowX: 'auto',
              textAlign: 'left'
            }}>
              {this.state.error.toString()}
            </pre>
          )}

          <button
            onClick={this.handleReset}
            style={{
              padding: '8px 20px',
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <RefreshCw size={15} /> Retry / Reload Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
