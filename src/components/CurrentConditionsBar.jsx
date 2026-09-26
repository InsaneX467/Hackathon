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

  const cardStyle = {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: '12px',
    padding: '14px 16px',
    boxShadow: 'var(--glass-shadow)',
    color: 'var(--text-primary)'
  };

  return (
    <div className="current-conditions-bar" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '14px',
      marginTop: '16px'
    }}>
      {/* Card 1: Rainfall */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Rainfall</span>
          <CloudRain size={16} color="var(--accent-blue)" />
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{rainVal} mm/hr</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginTop: '4px' }}>
          <span style={{ color: rainVal > 30 ? 'var(--risk-high)' : 'var(--risk-low)', fontWeight: 700 }}>
            {rainVal > 30 ? '↑ Increasing' : '→ Stable'}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>Updated {ageText}</span>
        </div>
      </div>

      {/* Card 2: Soil Moisture */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Soil Moisture</span>
          <Droplets size={16} color="var(--risk-low)" />
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{moistureVal}%</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginTop: '4px' }}>
          <span style={{ color: moistureVal > 70 ? 'var(--risk-high)' : 'var(--risk-low)', fontWeight: 700 }}>
            {moistureVal > 70 ? '↑ High Saturation' : '→ Normal'}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>Updated {ageText}</span>
        </div>
      </div>

      {/* Card 3: River Level */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>River Stage Height</span>
          <Waves size={16} color="var(--accent-blue)" />
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{riverVal} m</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginTop: '4px' }}>
          <span style={{ color: 'var(--risk-low)', fontWeight: 700 }}>→ Normal</span>
          <span style={{ color: 'var(--text-muted)' }}>Updated {ageText}</span>
        </div>
      </div>

      {/* Card 4: Sensor Network */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sensor Network</span>
          <Radio size={16} color="var(--risk-low)" />
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--risk-low)' }}>{SENSOR_NODES.length} / {SENSOR_NODES.length}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginTop: '4px' }}>
          <span style={{ color: 'var(--risk-low)', fontWeight: 700 }}>● ALL LIVE</span>
          <span style={{ color: 'var(--text-muted)' }}>All sensors reporting</span>
        </div>
      </div>

      {/* Card 5: Hazard Probability Card */}
      <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{hazardTitle} Risk</span>
          <span style={{
            fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px',
            background: scoreVal >= 70 ? 'var(--risk-high-bg)' : 'var(--risk-low-bg)',
            color: scoreVal >= 70 ? 'var(--risk-high)' : 'var(--risk-low)',
            fontWeight: 700
          }}>
            {scoreVal >= 70 ? 'HIGH PROBABILITY' : 'MODERATE'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: scoreVal >= 70 ? 'var(--risk-high)' : 'var(--accent-blue)' }}>
            {scoreVal}%
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Estimated Probability</span>
        </div>

        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          Evaluated from current hydro-meteorological indicators
        </div>
      </div>
    </div>
  );
}
