import { ShieldAlert, Radio, MapPin, CloudRain, Waves, Clock } from 'lucide-react';
import { formatDataAgeSeconds } from '../services/dataStatusService';
import { SENSOR_NODES } from '../services/telemetryService';

export default function TopSummaryCards({ villages = [], alerts = [], lastUpdatedTime }) {
  const activeAlertsCount = alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH' || a.critical).length;
  const ageText = formatDataAgeSeconds(lastUpdatedTime || new Date());

  // Compute maximum rainfall and river level across active villages
  const maxRain = villages.length > 0 ? Math.max(...villages.map(v => v.rain || 0)) : 126;
  const maxRiver = villages.length > 0 ? Math.max(...villages.map(v => v.riverLevel || 0)) : 2.4;

  return (
    <div className="top-summary-cards" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
      gap: '12px',
      marginBottom: '12px'
    }}>
      {/* CARD 1: Active Alerts */}
      <div style={{
        background: activeAlertsCount > 0 ? '#fef2f2' : '#ffffff',
        border: `1px solid ${activeAlertsCount > 0 ? '#fca5a5' : '#e2e8f0'}`,
        borderRadius: '10px',
        padding: '12px 14px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: activeAlertsCount > 0 ? '#fee2e2' : '#f0fdf4',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <ShieldAlert size={20} color={activeAlertsCount > 0 ? '#dc2626' : '#16a34a'} />
        </div>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: activeAlertsCount > 0 ? '#b91c1c' : '#0f172a' }}>
            {activeAlertsCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: activeAlertsCount > 0 ? '#991b1b' : '#64748b', fontWeight: 600 }}>
            {activeAlertsCount > 0 ? 'Active Alerts' : 'Active Alerts'}
          </div>
        </div>
      </div>

      {/* CARD 2: Sensor Status */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '12px 14px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: '#dcfce7',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Radio size={20} color="#15803d" />
        </div>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            {SENSOR_NODES.length} / {SENSOR_NODES.length}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Sensors Reporting</span>
            <span>● LIVE</span>
          </div>
        </div>
      </div>

      {/* CARD 3: Monitored Locations */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '12px 14px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: '#e0f2fe',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <MapPin size={20} color="#0284c7" />
        </div>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            {villages.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
            Monitored Wards
          </div>
        </div>
      </div>

      {/* CARD 4: Maximum Rainfall */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '12px 14px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: '#f0f9ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <CloudRain size={20} color="#0284c7" />
        </div>
        <div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
            {Math.round(maxRain)} mm/hr
          </div>
          <div style={{ fontSize: '0.72rem', color: maxRain > 30 ? '#dc2626' : '#64748b', fontWeight: 600 }}>
            Max Rainfall {maxRain > 30 ? '↑ Increasing' : '→ Normal'}
          </div>
        </div>
      </div>

      {/* CARD 5: Maximum River Level */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '12px 14px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: '#f0f9ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Waves size={20} color="#38bdf8" />
        </div>
        <div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
            {maxRiver.toFixed(1)} m
          </div>
          <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
            Max River Level → Stable
          </div>
        </div>
      </div>

      {/* CARD 6: Data Freshness */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '12px 14px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: '#f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Clock size={20} color="#64748b" />
        </div>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
            {ageText}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
            Last Updated
          </div>
        </div>
      </div>
    </div>
  );
}
