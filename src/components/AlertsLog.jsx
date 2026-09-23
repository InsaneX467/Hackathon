import { useState } from 'react';
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2, Info, Trash2, MapPin, Clock, ExternalLink, Siren, Shield } from 'lucide-react';
import { calculateDataAge } from '../services/telemetryService';

export default function AlertsLog({ alerts = [], onClearAlerts }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'HIGH'

  const filteredAlerts = alerts.filter(a => {
    const sev = (a.severity || (a.critical ? 'CRITICAL' : 'INFO')).toUpperCase();
    if (filterSeverity === 'CRITICAL') return sev === 'CRITICAL' || a.critical;
    if (filterSeverity === 'HIGH') return sev === 'HIGH' || sev === 'CRITICAL';
    return true;
  });

  const getSeverityStyle = (sev, isCritical) => {
    if (sev === 'CRITICAL' || isCritical) {
      return {
        bg: '#fef2f2', border: '#fecaca', text: '#dc2626', badgeBg: '#dc2626', badgeText: '#ffffff',
        icon: Siren, label: 'CRITICAL EVACUATION'
      };
    }
    if (sev === 'HIGH') {
      return {
        bg: '#fff7ed', border: '#ffedd5', text: '#ea580c', badgeBg: '#ea580c', badgeText: '#ffffff',
        icon: AlertTriangle, label: 'HIGH RISK ADVISORY'
      };
    }
    if (sev === 'WARNING') {
      return {
        bg: '#fffbeb', border: '#fef3c7', text: '#d97706', badgeBg: '#d97706', badgeText: '#ffffff',
        icon: AlertTriangle, label: 'RISK WATCH'
      };
    }
    return {
      bg: '#f0f9ff', border: '#bae6fd', text: '#0284c7', badgeBg: '#0284c7', badgeText: '#ffffff',
      icon: Info, label: 'TELEMETRY NOTICE'
    };
  };

  return (
    <div className="panel alerts-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', minHeight: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Siren size={22} color="#dc2626" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>System Emergency Log & Active Alerts</h1>
              <span style={{ background: '#dc2626', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
                {alerts.length} Active
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '2px 0 0 0' }}>
              Real-time early warning notifications, evacuation triggers, and telemetry threshold breaches
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
            <button
              onClick={() => setFilterSeverity('ALL')}
              style={{
                padding: '6px 12px', borderRadius: '6px', border: 'none', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer',
                background: filterSeverity === 'ALL' ? '#0f172a' : 'transparent',
                color: filterSeverity === 'ALL' ? '#ffffff' : '#64748b'
              }}
            >
              All Alerts ({alerts.length})
            </button>
            <button
              onClick={() => setFilterSeverity('CRITICAL')}
              style={{
                padding: '6px 12px', borderRadius: '6px', border: 'none', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer',
                background: filterSeverity === 'CRITICAL' ? '#dc2626' : 'transparent',
                color: filterSeverity === 'CRITICAL' ? '#ffffff' : '#64748b'
              }}
            >
              Critical Only
            </button>
          </div>

          {onClearAlerts && (
            <button
              onClick={onClearAlerts}
              title="Clear Emergency Log"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                background: '#ffffff', color: '#64748b', fontSize: '0.78rem', fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Trash2 size={14} color="#dc2626" /> Clear Log
            </button>
          )}
        </div>
      </div>

      {/* Alert Entries List */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
        {filteredAlerts.map((alert, idx) => {
          const sev = (alert.severity || (alert.critical ? 'CRITICAL' : 'INFO')).toUpperCase();
          const style = getSeverityStyle(sev, alert.critical);
          const IconComp = style.icon;
          const locationName = alert.villageName || alert.location || 'Joshimath Region';
          const hazardType = alert.hazard || alert.title || 'Hydro-Meteorological Alert';
          const trigger = alert.triggerData || alert.message || 'Telemetry threshold exceeded standard baseline parameters.';
          const action = alert.actionText || alert.action || 'Issue immediate safety advisory to local authorities.';
          const age = alert.timestamp ? calculateDataAge(alert.timestamp) : (alert.time || 'Recently');

          return (
            <div
              key={alert.id || idx}
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                borderRadius: '12px',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
            >
              {/* Top Row: Severity Badge + Title + Location + Time */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    background: style.badgeBg, color: style.badgeText,
                    fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', gap: '5px'
                  }}>
                    <IconComp size={13} /> {style.label}
                  </span>

                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    {hazardType}
                  </h3>

                  <span style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontSize: '0.78rem', fontWeight: 700, color: '#0284c7', background: '#ffffff',
                    padding: '2px 8px', borderRadius: '6px', border: '1px solid #bae6fd'
                  }}>
                    <MapPin size={12} /> {locationName}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem', color: '#64748b' }}>
                  {alert.riskScore && (
                    <span style={{ fontWeight: 800, color: style.text, background: '#ffffff', padding: '2px 8px', borderRadius: '6px', border: `1px solid ${style.border}` }}>
                      Risk Score: {alert.riskScore}/100
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <Clock size={12} /> {age}
                  </span>
                </div>
              </div>

              {/* Middle Section: Telemetry Trigger Details */}
              <div style={{ background: '#ffffff', border: `1px solid ${style.border}`, borderRadius: '8px', padding: '10px 14px', fontSize: '0.82rem', color: '#334155' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '2px', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  Telemetry Trigger Condition:
                </div>
                <div style={{ lineHeight: '1.4' }} dangerouslySetInnerHTML={{ __html: trigger }} />
              </div>

              {/* Bottom Section: Recommended Emergency Action Protocol */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: style.text, fontWeight: 700 }}>
                  <Shield size={14} />
                  <span>Protocol Action:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{action}</span>
                </div>

                <button style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  background: '#ffffff', border: `1px solid ${style.border}`,
                  padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700,
                  color: style.text, cursor: 'pointer'
                }}>
                  Deploy Action Protocol <ExternalLink size={12} />
                </button>
              </div>

            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <CheckCircle2 size={40} color="#10b981" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 4px 0', color: '#0f172a' }}>All Clear — No Active Emergency Logs</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, textAlign: 'center' }}>
              All sensor mesh nodes are operating within safe baseline parameters. No critical evacuation alerts are active.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

