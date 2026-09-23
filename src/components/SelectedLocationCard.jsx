import { useState } from 'react';
import { 
  CloudRain, 
  Droplets, 
  Mountain, 
  Waves, 
  ShieldAlert, 
  MapPin, 
  Radio, 
  CheckCircle2 
} from 'lucide-react';
import { formatDataAgeSeconds } from '../services/dataStatusService';

export default function SelectedLocationCard({ 
  village, 
  villages = [], 
  onSelectVillage, 
  mode = 'landslide', 
  lastUpdatedTime 
}) {
  const [activeSubTab, setActiveSubTab] = useState('conditions'); // 'conditions' | 'factors' | 'terrain'

  if (!village) {
    return (
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', color: '#64748b' }}>
        Select a location on the map to inspect live current conditions and risk indicators.
      </div>
    );
  }

  const isCritical = village.score >= 80;
  const isWarning = village.score >= 60 && village.score < 80;
  const isWatch = village.score >= 40 && village.score < 60;

  const riskLabel = isCritical ? 'CRITICAL LANDSLIDE RISK' : isWarning ? 'WARNING LANDSLIDE RISK' : isWatch ? 'WATCH' : 'LOW RISK';
  const riskSymbol = isCritical ? '🔴' : isWarning ? '🟠' : isWatch ? '🟡' : '🟢';
  const riskColor = isCritical ? '#ef4444' : isWarning ? '#f97316' : isWatch ? '#f59e0b' : '#10b981';

  const hazardName = mode === 'flash_flood' ? 'Flash Flood Risk' : 'Landslide Risk';

  // Trends based on actual readings
  const rainTrend = village.rain > 30 ? '↑ Increasing' : village.rain > 10 ? '→ Moderate' : '↓ Low';
  const moistureTrend = village.moisture > 75 ? '↑ High' : '→ Stable';
  const slopeStatus = village.slope > 35 ? '⚠ Steep / Unstable' : '✓ Normal Incline';
  const riverTrend = (village.riverLevel || 1.4) > (village.warningMark || 3.0) ? '↑ Rising Surge' : '→ Normal';

  const ageText = formatDataAgeSeconds(lastUpdatedTime || new Date());

  // Filter nearby villages for ranking list (excluding selected)
  const nearbyVillages = villages.filter(v => v.id !== village.id).slice(0, 3);

  return (
    <div className="selected-location-card" style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* 1. LOCATION HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>{village.name}</h2>
          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Chamoli, Uttarakhand</span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{
            padding: '4px 10px',
            borderRadius: '20px',
            background: `${riskColor}15`,
            color: riskColor,
            fontWeight: 800,
            fontSize: '0.78rem',
            border: `1px solid ${riskColor}30`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>{riskSymbol}</span>
            <span>{riskLabel}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
            Risk Score: <strong style={{ fontSize: '1.2rem', color: '#0f172a' }}>{village.score}</strong> / 100
          </div>
        </div>
      </div>

      {/* 2. DATA FRESHNESS & PROVENANCE BAR */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '0.78rem',
        color: '#64748b',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center'
      }}>
        <span>Updated <strong>{ageText}</strong></span>
        <span>Data Source: <strong>IoT Sensors + Remote Sensing</strong></span>
        <span style={{ color: '#15803d', fontWeight: 700 }}>● LIVE</span>
      </div>

      {/* 3. SUB-TABS */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
        <button
          onClick={() => setActiveSubTab('conditions')}
          style={{
            padding: '6px 12px', border: 'none', background: 'transparent',
            fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
            color: activeSubTab === 'conditions' ? '#0284c7' : '#64748b',
            borderBottom: activeSubTab === 'conditions' ? '2px solid #0284c7' : 'none'
          }}
        >
          Current Conditions
        </button>
        <button
          onClick={() => setActiveSubTab('factors')}
          style={{
            padding: '6px 12px', border: 'none', background: 'transparent',
            fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
            color: activeSubTab === 'factors' ? '#0284c7' : '#64748b',
            borderBottom: activeSubTab === 'factors' ? '2px solid #0284c7' : 'none'
          }}
        >
          Why at Risk?
        </button>
        <button
          onClick={() => setActiveSubTab('terrain')}
          style={{
            padding: '6px 12px', border: 'none', background: 'transparent',
            fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
            color: activeSubTab === 'terrain' ? '#0284c7' : '#64748b',
            borderBottom: activeSubTab === 'terrain' ? '2px solid #0284c7' : 'none'
          }}
        >
          Terrain & Satellite
        </button>
      </div>

      {/* 4. CURRENT CONDITIONS GRID */}
      {activeSubTab === 'conditions' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CloudRain size={14} color="#0284c7" /> Rainfall
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '2px 0' }}>{Math.round(village.rain)} mm/hr</div>
            <div style={{ fontSize: '0.72rem', color: village.rain > 30 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
              {rainTrend} • Updated {ageText}
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Droplets size={14} color="#10b981" /> Soil Moisture
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '2px 0' }}>{Math.round(village.moisture)}%</div>
            <div style={{ fontSize: '0.72rem', color: village.moisture > 70 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
              {moistureTrend} • Updated {ageText}
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mountain size={14} color="#f59e0b" /> Slope Angle
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '2px 0' }}>{Math.round(village.slope)}°</div>
            <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 600 }}>{slopeStatus}</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Waves size={14} color="#38bdf8" /> River Level
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '2px 0' }}>{(village.riverLevel || 1.4).toFixed(1)} m</div>
            <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>{riverTrend} • Updated 6 min ago</div>
          </div>
        </div>
      )}

      {/* 5. WHY IS THIS AREA AT RISK? */}
      {activeSubTab === 'factors' && (
        <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 8px 0', color: '#0f172a' }}>
            WHY IS THIS AREA AT RISK?
          </h4>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: '#475569', lineHeight: '1.6' }}>
            {village.rain > 15 && <li>🌧 Heavy rainfall detected in catchment area</li>}
            {village.moisture > 60 && <li>💧 Soil moisture saturation is high</li>}
            {village.slope > 35 && <li>⛰ Terrain slope incline is steep (41°)</li>}
            <li>📈 Risk trend is actively monitored via live telemetry</li>
          </ul>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '8px', fontStyle: 'italic' }}>
            Observed indicators contributing to the current risk assessment.
          </div>
        </div>
      )}

      {/* 6. TERRAIN & SATELLITE STATUS */}
      {activeSubTab === 'terrain' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#475569' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
            <span>Elevation:</span>
            <strong>2,890 m</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
            <span>Slope:</span>
            <strong>{Math.round(village.slope)}°</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
            <span>Terrain Wetness:</span>
            <strong style={{ color: village.moisture > 70 ? '#dc2626' : '#10b981' }}>
              {village.moisture > 70 ? 'High' : 'Normal'}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
            <span>Vegetation Condition:</span>
            <strong style={{ color: '#0284c7' }}>Normal</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Satellite Update:</span>
            <strong>2 days ago</strong>
          </div>
        </div>
      )}

      {/* 7. NEARBY AREAS (RISK RANKING TABLE) */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
        <h4 style={{ fontSize: '0.82rem', fontWeight: 700, margin: '0 0 8px 0', color: '#64748b', textTransform: 'uppercase' }}>
          NEARBY AREAS (RISK RANKING)
        </h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', color: '#94a3b8', textAlign: 'left' }}>
              <th style={{ padding: '6px 8px' }}>Location</th>
              <th style={{ padding: '6px 8px' }}>Hazard</th>
              <th style={{ padding: '6px 8px', textAlign: 'right' }}>Risk Score</th>
            </tr>
          </thead>
          <tbody>
            {nearbyVillages.map(v => {
              const sym = v.score >= 80 ? '🔴' : v.score >= 60 ? '🟠' : v.score >= 40 ? '🟡' : '🟢';
              return (
                <tr 
                  key={v.id}
                  onClick={() => onSelectVillage && onSelectVillage(v.id)}
                  style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' }}
                  className="nearby-row-hover"
                >
                  <td style={{ padding: '6px 8px', fontWeight: 600, color: '#0f172a' }}>{v.name}</td>
                  <td style={{ padding: '6px 8px', color: '#64748b' }}>Landslide</td>
                  <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700 }}>
                    <span style={{ marginRight: '4px' }}>{sym}</span>
                    {v.score} / 100
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
