import { Activity, Radio, RefreshCw, Info } from 'lucide-react';
import { SENSOR_NODES, calculateDataAge, getDataFreshnessBadge } from '../services/telemetryService';

export default function ControlsPanel({ 
  village, 
  onRefreshData,
  lastUpdatedTime
}) {
  const freshness = getDataFreshnessBadge(lastUpdatedTime);

  return (
    <footer 
      className="operational-controls-bar"
      style={{
        height: '44px',
        minHeight: '44px',
        maxHeight: '44px',
        background: 'var(--footer-bg)',
        borderTop: '1px solid var(--panel-border)',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
        flexShrink: 0,
        userSelect: 'none'
      }}
    >
      {/* Left Side: Brand & Data Sources */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>BHOOMIRAKSHAK</span>
        <span style={{ color: 'var(--panel-border)' }}>|</span>
        <span style={{ color: 'var(--text-secondary)' }}>Protecting Communities, Saving Lives</span>
        <span style={{ color: 'var(--panel-border)' }}>|</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Data Sources:</span>
          <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>IoT Sensors</span>
          <span style={{ color: 'var(--panel-border)' }}>•</span>
          <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>IMD</span>
          <span style={{ color: 'var(--panel-border)' }}>•</span>
          <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>CWC</span>
          <span style={{ color: 'var(--panel-border)' }}>•</span>
          <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>IndLands</span>
          <span style={{ color: 'var(--panel-border)' }}>•</span>
          <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>SDMA</span>
        </div>
      </div>

      {/* Right Side: Ingestion Pipeline & Telemetry Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Ingestion Pipeline:</span>
          <span style={{
            fontSize: '0.68rem',
            padding: '2px 8px',
            borderRadius: '4px',
            background: `${freshness.color}20`,
            color: freshness.color,
            fontWeight: 800,
            border: `1px solid ${freshness.color}40`
          }}>
            {freshness.label}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Last Ingested:</span>
          <strong style={{ color: 'var(--text-primary)' }}>{calculateDataAge(lastUpdatedTime)}</strong>
        </div>

        {village && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Target Ward:</span>
            <strong style={{ color: 'var(--accent-blue)' }}>{village.name}</strong>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderLeft: '1px solid var(--panel-border)', paddingLeft: '12px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }}></span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Active Sensor Mesh: <strong style={{ color: 'var(--risk-low)' }}>{SENSOR_NODES.length} Nodes Online</strong></span>
        </div>

        <button 
          onClick={onRefreshData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--accent-blue-glow)',
            border: '1px solid var(--panel-border-hover)',
            color: 'var(--accent-blue)',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title="Query telemetry data & re-evaluate risk"
        >
          <RefreshCw size={12} />
          <span>Sync Telemetry</span>
        </button>
      </div>
    </footer>
  );
}
