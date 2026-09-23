import { Activity, Radio, RefreshCw, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { SENSOR_NODES, calculateDataAge, getDataFreshnessBadge } from '../services/telemetryService';

export default function ControlsPanel({ 
  village, 
  onRefreshData,
  lastUpdatedTime,
  mode = 'landslide'
}) {
  const freshness = getDataFreshnessBadge(lastUpdatedTime);

  return (
    <div className="panel controls-panel-telemetry" style={{
      background: '#0f172a',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap',
      minHeight: '48px',
      maxHeight: '48px',
      fontSize: '0.8rem',
      color: '#94a3b8'
    }}>
      {/* Telemetry Status Bar Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Radio size={14} style={{ color: freshness.color }} />
          <span style={{ fontWeight: 600, color: '#f8fafc' }}>Ingestion Pipeline:</span>
          <span style={{
            fontSize: '0.725rem',
            padding: '2px 8px',
            borderRadius: '12px',
            background: `${freshness.color}20`,
            color: freshness.color,
            fontWeight: 700,
            border: `1px solid ${freshness.color}40`
          }}>
            {freshness.label}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={13} style={{ color: '#94a3b8' }} />
          <span>Last Ingested: <strong style={{ color: '#f8fafc' }}>{calculateDataAge(lastUpdatedTime)}</strong></span>
        </div>

        {village && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={13} style={{ color: '#0284c7' }} />
            <span>Target Ward: <strong style={{ color: '#38bdf8' }}>{village.name}</strong></span>
          </div>
        )}
      </div>

      {/* Sensor Node Health Counts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle size={13} style={{ color: '#10b981' }} />
          <span>Active Sensor Mesh: <strong style={{ color: '#10b981' }}>{SENSOR_NODES.length} Nodes Online</strong></span>
        </div>

        <button 
          onClick={onRefreshData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          title="Query telemetry data & re-evaluate SVM risk"
        >
          <RefreshCw size={12} />
          <span>Sync Telemetry</span>
        </button>
      </div>
    </div>
  );
}
