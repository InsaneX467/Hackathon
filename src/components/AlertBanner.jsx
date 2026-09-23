import { ShieldAlert, AlertTriangle, MapPin, CheckCircle2, X } from 'lucide-react';
import { formatDataAgeSeconds } from '../services/dataStatusService';

export default function AlertBanner({ activeAlerts = [], onSelectLocation, onDismiss }) {
  if (!activeAlerts || activeAlerts.length === 0) {
    return (
      <div className="emergency-alert-banner nominal" style={{
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        color: '#166534',
        padding: '10px 18px',
        borderRadius: '10px',
        margin: '10px 16px 0 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.85rem',
        fontWeight: 600
      }}>
        <CheckCircle2 size={18} color="#16a34a" />
        <span>✓ No active emergency alerts. All monitored Himalayan wards within baseline parameters.</span>
      </div>
    );
  }

  // Prioritize CRITICAL first, then HIGH
  const topAlert = activeAlerts.find(a => a.severity === 'CRITICAL') || activeAlerts[0];
  if (!topAlert) return null;

  const isCritical = topAlert.severity === 'CRITICAL';
  const ageText = formatDataAgeSeconds(topAlert.timestamp);

  return (
    <div className={`emergency-alert-banner ${isCritical ? 'critical' : 'warning'}`} style={{
      background: isCritical ? '#fef2f2' : '#fffbe6',
      border: `1px solid ${isCritical ? '#fca5a5' : '#fde68a'}`,
      borderRadius: '10px',
      margin: '10px 16px 0 16px',
      padding: '12px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      <div className="alert-banner-left" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: isCritical ? '#fee2e2' : '#fef3c7',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {isCritical ? (
            <ShieldAlert size={20} color="#dc2626" />
          ) : (
            <AlertTriangle size={20} color="#d97706" />
          )}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontWeight: 800, fontSize: '0.9rem',
              color: isCritical ? '#991b1b' : '#92400e'
            }}>
              {isCritical ? '🚨 CRITICAL ALERT' : '⚠ ELEVATED HAZARD WARNING'} — {topAlert.villageName}
            </span>
            <span style={{
              fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700,
              background: isCritical ? '#fee2e2' : '#fef3c7',
              color: isCritical ? '#991b1b' : '#92400e'
            }}>
              Risk Score: {topAlert.riskScore || 78}/100
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: isCritical ? '#7f1d1d' : '#78350f', margin: '2px 0 0 0' }}>
            {topAlert.hazard}: {topAlert.actionText || 'High risk conditions observed. Follow official emergency guidance.'}
          </p>
        </div>
      </div>

      <div className="alert-banner-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Updated {ageText}</span>
        {onSelectLocation && (
          <button 
            onClick={() => onSelectLocation(topAlert.villageId)}
            style={{
              padding: '6px 14px', borderRadius: '8px', border: 'none',
              background: isCritical ? '#dc2626' : '#d97706', color: '#fff',
              fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <MapPin size={13} /> View on Map
          </button>
        )}
      </div>
    </div>
  );
}
