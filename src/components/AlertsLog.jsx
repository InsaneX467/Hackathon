import { useState } from 'react';
import { 
  Siren, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  Trash2, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Shield,
  Zap
} from 'lucide-react';
import { calculateDataAge } from '../services/telemetryService';

export default function AlertsLog({ alerts = [], onClearAlerts }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL'); // 'ALL' | 'CRITICAL'

  const filteredAlerts = alerts.filter(a => {
    const sev = (a.severity || (a.critical ? 'CRITICAL' : 'INFO')).toUpperCase();
    if (filterSeverity === 'CRITICAL') return sev === 'CRITICAL' || a.critical;
    return true;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', background: 'transparent', minHeight: '100%' }}>
      
      {/* 1. ALERT DASHBOARD HEADER BAR */}
      <div style={{
        background: 'var(--card-bg)',
        borderRadius: '16px',
        border: '1px solid var(--card-border)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'var(--glass-shadow)'
      }}>
        {/* Title & Flashing Siren Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            position: 'relative',
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--risk-high-bg)',
            border: '1px solid var(--risk-high-border)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color: 'var(--risk-high)',
            flexShrink: 0
          }}>
            <Siren size={22} className="animate-pulse" />
            <span style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--risk-high)',
              boxShadow: '0 0 8px var(--risk-high)'
            }}></span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                System Emergency Log & Active Alerts
              </h1>
              <span style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #e11d48 100%)',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '9999px',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
              }}>
                {alerts.length} Active
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500, margin: '2px 0 0 0' }}>
              Real-time early warning notifications, evacuation triggers, and telemetry threshold breaches
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setFilterSeverity('ALL')}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              border: filterSeverity === 'ALL' ? 'none' : '1px solid var(--card-border)',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer',
              background: filterSeverity === 'ALL' ? 'var(--accent-blue)' : 'var(--input-bg)',
              color: filterSeverity === 'ALL' ? '#ffffff' : 'var(--text-primary)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}
          >
            All Alerts ({alerts.length})
          </button>
          
          <button
            onClick={() => setFilterSeverity('CRITICAL')}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              border: filterSeverity === 'CRITICAL' ? 'none' : '1px solid var(--card-border)',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer',
              background: filterSeverity === 'CRITICAL' ? 'var(--risk-high)' : 'var(--input-bg)',
              color: filterSeverity === 'CRITICAL' ? '#ffffff' : 'var(--text-primary)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}
          >
            Critical Only
          </button>

          {onClearAlerts && (
            <button
              onClick={onClearAlerts}
              title="Clear Emergency Log"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                border: '1px solid var(--risk-high-border)',
                background: 'var(--risk-high-bg)',
                color: 'var(--risk-high)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Trash2 size={13} color="var(--risk-high)" />
              <span>Clear Log</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. ALERT CARDS LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
        {filteredAlerts.map((alert, idx) => {
          const isCritical = alert.severity === 'CRITICAL' || alert.critical;
          const locationName = alert.villageName || alert.location || 'Joshimath Ward 1';
          const hazardType = alert.hazard || 'Landslide Slope Instability';
          const trigger = alert.triggerData || alert.message || 'Sustained slope shear stress (41°) + High TWI (6.5)';
          const action = alert.actionText || alert.action || 'Initiate Ward Evacuation Protocol 1B. Alert District Operations Center.';
          const age = alert.timestamp ? calculateDataAge(alert.timestamp) : (alert.time || '13m ago');

          const borderColor = isCritical ? 'var(--risk-high-border)' : 'var(--risk-medium-border)';
          const barGradient = isCritical ? 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)';
          const badgeBg = isCritical ? 'linear-gradient(135deg, #dc2626 0%, #e11d48 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
          const badgeText = isCritical ? 'CRITICAL EVACUATION' : 'HIGH RISK ADVISORY';
          const scoreColor = isCritical ? 'var(--risk-high)' : 'var(--risk-medium)';

          return (
            <article
              key={alert.id || idx}
              style={{
                position: 'relative',
                background: 'var(--card-bg)',
                borderRadius: '16px',
                border: `1px solid ${borderColor}`,
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: 'var(--glass-shadow)',
                overflow: 'hidden'
              }}
            >
              {/* Left Glowing Bar */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '6px',
                background: barGradient
              }} />

              {/* Header Row: Severity Badge + Hazard Title + Ward Location Tag + Score & Time */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{
                    background: badgeBg,
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '6px',
                    letterSpacing: '0.04em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}>
                    <Zap size={13} />
                    {badgeText}
                  </span>

                  <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {hazardType}
                  </h2>

                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--accent-blue)',
                    background: 'var(--accent-blue-glow)',
                    padding: '2px 9px',
                    borderRadius: '9999px',
                    border: '1px solid var(--card-border)'
                  }}>
                    <MapPin size={12} color="var(--accent-blue)" />
                    {locationName}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem' }}>
                  <span style={{
                    fontWeight: 800,
                    color: scoreColor,
                    background: isCritical ? 'var(--risk-high-bg)' : 'var(--risk-medium-bg)',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${isCritical ? 'var(--risk-high-border)' : 'var(--risk-medium-border)'}`
                  }}>
                    Risk Score: {alert.riskScore || 78}/100
                  </span>

                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    <Clock size={13} />
                    {age}
                  </span>
                </div>
              </div>

              {/* Telemetry Trigger Condition Box */}
              <div style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '12px',
                padding: '12px 14px',
                fontSize: '0.8rem'
              }}>
                <div style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '4px',
                  fontFamily: 'monospace'
                }}>
                  TELEMETRY TRIGGER CONDITION:
                </div>
                <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: trigger }} />
              </div>

              {/* Protocol Action Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: isCritical ? 'var(--risk-high-bg)' : 'var(--risk-medium-bg)',
                    border: `1px solid ${isCritical ? 'var(--risk-high-border)' : 'var(--risk-medium-border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Shield size={12} color={scoreColor} />
                  </div>
                  <span>
                    <strong style={{ color: scoreColor, fontWeight: 700 }}>Protocol Action: </strong>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{action}</span>
                  </span>
                </div>

                <button
                  type="button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${isCritical ? 'var(--risk-high-border)' : 'var(--risk-medium-border)'}`,
                    background: isCritical ? 'var(--risk-high-bg)' : 'var(--risk-medium-bg)',
                    color: isCritical ? 'var(--risk-high)' : 'var(--risk-medium)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>Deploy Action Protocol</span>
                  <ExternalLink size={13} />
                </button>
              </div>

            </article>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justify: 'center',
            padding: '40px',
            background: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px dashed var(--card-border)'
          }}>
            <CheckCircle2 size={42} color="var(--risk-low)" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>All Clear — No Active Emergency Logs</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, textAlign: 'center' }}>
              All sensor mesh nodes are operating within safe baseline parameters. No critical evacuation alerts are active.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
