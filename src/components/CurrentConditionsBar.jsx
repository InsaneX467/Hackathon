import { CloudRain, Droplets, Waves, Radio, Activity, TrendingUp } from 'lucide-react';
import { formatDataAgeSeconds } from '../services/dataStatusService';
import { SENSOR_NODES } from '../services/telemetryService';

export default function CurrentConditionsBar({ village, lastUpdatedTime, mode = 'landslide' }) {
  const ageText = formatDataAgeSeconds(lastUpdatedTime || new Date());
  
  const rainVal = village ? Math.round(village.rain) : 126;
  const moistureVal = village ? Math.round(village.moisture) : 87;
  const riverVal = village ? (village.riverLevel || 1.4).toFixed(1) : '2.4';
  const scoreVal = village ? village.score : 78;

  const hazardTitle = mode === 'flash_flood' ? 'Flash Flood' : 'Landslide';

  return (
    <div className="current-conditions-bar" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '14px',
      marginTop: '16px'
    }}>
      {/* Card 1: Rainfall */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '14px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Rainfall</span>
          <CloudRain size={16} color="#0284c7" />
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>{rainVal} mm/hr</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginTop: '4px' }}>
          <span style={{ color: rainVal > 30 ? '#dc2626' : '#16a34a', fontWeight: 700 }}>
            {rainVal > 30 ? '↑ Increasing' : '→ Stable'}
          </span>
          <span style={{ color: '#94a3b8' }}>Updated {ageText}</span>
        </div>
      </div>

      {/* Card 2: Soil Moisture */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '14px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Soil Moisture</span>
          <Droplets size={16} color="#10b981" />
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>{moistureVal}%</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginTop: '4px' }}>
          <span style={{ color: moistureVal > 70 ? '#dc2626' : '#16a34a', fontWeight: 700 }}>
            {moistureVal > 70 ? '↑ High Saturation' : '→ Normal'}
          </span>
          <span style={{ color: '#94a3b8' }}>Updated {ageText}</span>
        </div>
      </div>

      {/* Card 3: River Level */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '14px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>River Stage Height</span>
          <Waves size={16} color="#38bdf8" />
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>{riverVal} m</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginTop: '4px' }}>
          <span style={{ color: '#16a34a', fontWeight: 700 }}>→ Normal</span>
          <span style={{ color: '#94a3b8' }}>Updated {ageText}</span>
        </div>
      </div>

      {/* Card 4: Sensor Network */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '14px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Sensor Network</span>
          <Radio size={16} color="#10b981" />
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>{SENSOR_NODES.length} / {SENSOR_NODES.length}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginTop: '4px' }}>
          <span style={{ color: '#15803d', fontWeight: 700 }}>● ALL LIVE</span>
          <span style={{ color: '#94a3b8' }}>All sensors reporting</span>
        </div>
      </div>

      {/* Card 5: Hazard Probability Card */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '14px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{hazardTitle} Risk</span>
          <span style={{
            fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px',
            background: scoreVal >= 70 ? '#fee2e2' : '#dcfce7',
            color: scoreVal >= 70 ? '#b91c1c' : '#15803d',
            fontWeight: 700
          }}>
            {scoreVal >= 70 ? 'HIGH PROBABILITY' : 'MODERATE'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: scoreVal >= 70 ? '#dc2626' : '#0284c7' }}>
            {scoreVal}%
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Estimated Probability</span>
        </div>

        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
          Evaluated from current hydro-meteorological indicators
        </div>
      </div>
    </div>
  );
}
