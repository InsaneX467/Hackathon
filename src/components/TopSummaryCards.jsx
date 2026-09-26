import { ShieldAlert, Radio, MapPin, CloudRain, Waves, Clock, TrendingUp, Minus } from 'lucide-react';
import { formatDataAgeSeconds } from '../services/dataStatusService';
import { SENSOR_NODES } from '../services/telemetryService';

export default function TopSummaryCards({ villages = [], alerts = [], lastUpdatedTime }) {
  const activeAlertsCount = alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH' || a.critical).length;
  const ageText = formatDataAgeSeconds(lastUpdatedTime || new Date());

  // Compute maximum rainfall and river level across active villages
  const maxRain = villages.length > 0 ? Math.max(...villages.map(v => v.rain || 0)) : 126;
  const maxRiver = villages.length > 0 ? Math.max(...villages.map(v => v.riverLevel || 0)) : 2.4;

  const cardStyle = {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: '12px',
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: 'var(--glass-shadow)'
  };

  const labelStyle = {
    fontSize: '0.68rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  return (
    <section className="grid grid-cols-6 gap-3 shrink-0" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
      gap: '12px'
    }}>
      {/* Metric 1: Active Alerts */}
      <div style={cardStyle}>
        <div style={labelStyle}>
          Active Alerts
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--risk-high)', lineHeight: 1 }}>{activeAlertsCount}</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--risk-high)', fontWeight: 600 }}>Critical</span>
        </div>
      </div>

      {/* Metric 2: Sensors Reporting */}
      <div style={cardStyle}>
        <div style={labelStyle}>
          Sensors Reporting
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--risk-low)', lineHeight: 1 }}>{SENSOR_NODES.length} / {SENSOR_NODES.length}</span>
          <span style={{ fontSize: '0.62rem', background: 'var(--risk-low-bg)', color: 'var(--risk-low)', padding: '1px 5px', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase', border: '1px solid var(--risk-low-border)' }}>LIVE</span>
        </div>
      </div>

      {/* Metric 3: Monitored Wards */}
      <div style={cardStyle}>
        <div style={labelStyle}>
          Monitored Wards
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{villages.length}</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Active</span>
        </div>
      </div>

      {/* Metric 4: Max Rainfall */}
      <div style={cardStyle}>
        <div style={labelStyle}>
          Max Rainfall
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '4px' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{Math.round(maxRain)} mm/h</span>
          <span style={{ fontSize: '0.68rem', color: 'var(--risk-medium)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
            <TrendingUp size={12} /> Increasing
          </span>
        </div>
      </div>

      {/* Metric 5: Max River Level */}
      <div style={cardStyle}>
        <div style={labelStyle}>
          Max River Level
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '4px' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{maxRiver.toFixed(1)} m</span>
          <span style={{ fontSize: '0.68rem', color: 'var(--risk-low)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
            <Minus size={12} /> Stable
          </span>
        </div>
      </div>

      {/* Metric 6: Last Updated */}
      <div style={cardStyle}>
        <div style={labelStyle}>
          Last Updated
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{ageText}</span>
        </div>
      </div>
    </section>
  );
}
