import { AlertTriangle, CheckCircle2, Eye } from 'lucide-react';
import { formatDataAgeSeconds } from '../services/dataStatusService';

export default function AlertBanner({ activeAlerts = [], onSelectLocation }) {
  if (!activeAlerts || activeAlerts.length === 0) {
    return (
      <section style={{
        background: 'var(--risk-low-bg)',
        border: '1px solid var(--risk-low-border)',
        borderRadius: '12px',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.8rem',
        color: 'var(--risk-low)',
        fontWeight: 600,
        flexShrink: 0
      }}>
        <CheckCircle2 size={16} color="var(--risk-low)" />
        <span>STATUS NOMINAL — All monitored wards within baseline hazard safety thresholds.</span>
      </section>
    );
  }

  // Prioritize CRITICAL first, then HIGH
  const topAlert = activeAlerts.find(a => a.severity === 'CRITICAL') || activeAlerts[0];
  if (!topAlert) return null;

  const ageText = formatDataAgeSeconds(topAlert.timestamp);

  return (
    <section style={{
      background: 'var(--risk-high-bg)',
      border: '1px solid var(--risk-high-border)',
      borderRadius: '12px',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--glass-shadow)',
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
        {/* Crisp Solid Red Warning Badge Icon */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          color: '#ffffff',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
        }}>
          <AlertTriangle size={18} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.82rem', flex: 1, minWidth: 0 }}>
          <span style={{ fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0 }}>
            CRITICAL ALERT —
          </span>
          <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
            {topAlert.villageName || 'Joshimath Ward 1'}
          </span>
          <span style={{
            fontSize: '0.72rem',
            padding: '2px 8px',
            borderRadius: '6px',
            background: 'rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            fontWeight: 800,
            border: '1px solid rgba(239, 68, 68, 0.35)',
            flexShrink: 0
          }}>
            Risk Score: {topAlert.riskScore || 78}/100
          </span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {topAlert.hazard || 'Landslide Slope Instability'}: {topAlert.actionText || 'Initiate Ward Evacuation Protocol 1B. Alert District Operations Center.'}
          </span>
        </div>
      </div>

      {onSelectLocation && (
        <button
          type="button"
          onClick={() => onSelectLocation(topAlert.villageId)}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            background: '#dc2626',
            color: '#ffffff',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
            marginLeft: '12px',
            transition: 'background 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#ef4444'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}
        >
          <Eye size={13} />
          <span>View on Map</span>
        </button>
      )}
    </section>
  );
}
