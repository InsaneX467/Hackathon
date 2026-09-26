import { useState } from 'react';
import { 
  CloudRain, 
  Droplets, 
  Mountain, 
  Waves,
  TrendingUp,
  AlertTriangle,
  Minus
} from 'lucide-react';
import { formatDataAgeSeconds } from '../services/dataStatusService';

function getLocationSubtitle(village) {
  if (!village) return 'Chamoli, Uttarakhand';
  const name = village.name || '';
  if (name.includes('Guwahati')) return 'Kamrup Metropolitan, Assam';
  if (name.includes('Silchar')) return 'Cachar, Assam';
  if (name.includes('Majuli')) return 'Majuli River Island, Assam';
  if (name.includes('Haflong')) return 'Dima Hasao, Assam';
  if (name.includes('Kaziranga')) return 'Golaghat, Assam';
  if (name.includes('Cherrapunji')) return 'East Khasi Hills, Meghalaya';
  if (name.includes('Gangtok')) return 'East Sikkim, Sikkim';
  if (name.includes('Aizawl')) return 'Aizawl District, Mizoram';
  if (name.includes('Itanagar')) return 'Papum Pare, Arunachal Pradesh';
  if (name.includes('Kohima')) return 'Kohima District, Nagaland';
  if (name.includes('Agartala')) return 'West Tripura, Tripura';
  if (name.includes('Imphal')) return 'Imphal West, Manipur';
  if (village.lng > 85) return 'North-East Monitored Zone';
  return 'Chamoli, Uttarakhand';
}

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
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px', color: 'var(--text-secondary)', height: '100%' }}>
        Select a location on the map to inspect live current conditions and risk indicators.
      </div>
    );
  }

  const isCritical = village.score >= 80;
  const isWarning = village.score >= 60 && village.score < 80;
  const isWatch = village.score >= 40 && village.score < 60;

  const riskLabel = isCritical ? (mode === 'flash_flood' ? 'Critical Flood Risk' : 'Critical Landslide Risk') : isWarning ? 'Warning Risk' : isWatch ? 'Watch' : 'Low Risk';
  const riskColor = isCritical ? '#ef4444' : isWarning ? '#f97316' : isWatch ? '#f59e0b' : '#10b981';
  const riskBg = isCritical ? 'rgba(239, 68, 68, 0.15)' : isWarning ? 'rgba(249, 115, 22, 0.15)' : isWatch ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)';
  const riskBorder = isCritical ? 'rgba(239, 68, 68, 0.35)' : isWarning ? 'rgba(249, 115, 22, 0.35)' : isWatch ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.35)';

  const ageText = formatDataAgeSeconds(lastUpdatedTime || new Date());

  // Filter nearby villages for ranking list (excluding selected) - slice 2 to fit cleanly
  const nearbyVillages = villages.filter(v => v.id !== village.id).slice(0, 2);

  const subCardStyle = {
    background: 'var(--input-bg)',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid var(--card-border)'
  };

  return (
    <section className="selected-location-card" style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: '12px',
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      overflow: 'hidden',
      color: 'var(--text-primary)'
    }}>
      {/* TOP CONTENT SECTION */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0, overflow: 'hidden' }}>
        
        {/* 1. LOCATION HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{village.name}</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{getLocationSubtitle(village)}</span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{
              padding: '3px 10px',
              borderRadius: '9999px',
              background: riskBg,
              color: riskColor,
              fontWeight: 800,
              fontSize: '0.68rem',
              border: `1px solid ${riskBorder}`,
              textTransform: 'uppercase',
              letterSpacing: '0.03em'
            }}>
              {riskLabel}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Risk Score: <strong style={{ fontSize: '1.05rem', color: isCritical ? '#ef4444' : 'var(--text-primary)' }}>{village.score}</strong> / 100
            </div>
          </div>
        </div>

        {/* 2. DATA FRESHNESS & PROVENANCE BAR */}
        <div style={{
          background: 'var(--input-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '8px',
          padding: '6px 10px',
          fontSize: '0.7rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <span>Updated <strong style={{ color: 'var(--text-primary)' }}>{ageText}</strong></span>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Data Source: <strong style={{ color: 'var(--text-primary)' }}>IoT Sensors + Remote Sensing</strong>
          </span>
          <span style={{ color: 'var(--risk-low)', fontWeight: 700, flexShrink: 0, marginLeft: '4px' }}>● LIVE</span>
        </div>

        {/* 3. SUB-TABS */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--card-border)', background: 'var(--input-bg)', borderRadius: '6px' }}>
          <button
            type="button"
            onClick={() => setActiveSubTab('conditions')}
            style={{
              flex: 1, padding: '7px 4px', border: 'none', background: activeSubTab === 'conditions' ? 'var(--accent-blue-glow)' : 'transparent',
              fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer',
              color: activeSubTab === 'conditions' ? 'var(--accent-blue)' : 'var(--text-secondary)',
              borderBottom: activeSubTab === 'conditions' ? '2px solid var(--accent-blue)' : 'none'
            }}
          >
            Current Conditions
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('factors')}
            style={{
              flex: 1, padding: '7px 4px', border: 'none', background: activeSubTab === 'factors' ? 'var(--accent-blue-glow)' : 'transparent',
              fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer',
              color: activeSubTab === 'factors' ? 'var(--accent-blue)' : 'var(--text-secondary)',
              borderBottom: activeSubTab === 'factors' ? '2px solid var(--accent-blue)' : 'none'
            }}
          >
            Why at Risk?
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('terrain')}
            style={{
              flex: 1, padding: '7px 4px', border: 'none', background: activeSubTab === 'terrain' ? 'var(--accent-blue-glow)' : 'transparent',
              fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer',
              color: activeSubTab === 'terrain' ? 'var(--accent-blue)' : 'var(--text-secondary)',
              borderBottom: activeSubTab === 'terrain' ? '2px solid var(--accent-blue)' : 'none'
            }}
          >
            Terrain & Satellite
          </button>
        </div>

        {/* 4. CURRENT CONDITIONS GRID */}
        {activeSubTab === 'conditions' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={subCardStyle}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <CloudRain size={13} color="var(--accent-blue)" /> Rainfall
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 2px 0' }}>{Math.round(village.rain)} mm/hr</div>
              <div style={{ fontSize: '0.68rem', color: village.rain > 30 ? 'var(--risk-medium)' : 'var(--risk-low)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                <TrendingUp size={11} /> Increasing • {ageText}
              </div>
            </div>

            <div style={subCardStyle}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <Droplets size={13} color="var(--accent-blue)" /> Soil Moisture
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 2px 0' }}>{Math.round(village.moisture)}%</div>
              <div style={{ fontSize: '0.68rem', color: village.moisture > 70 ? 'var(--risk-high)' : 'var(--risk-low)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                <AlertTriangle size={11} /> High • {ageText}
              </div>
            </div>

            <div style={subCardStyle}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <Mountain size={13} color="var(--risk-medium)" /> Slope Angle
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 2px 0' }}>{Math.round(village.slope)}°</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--risk-medium)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                <AlertTriangle size={11} /> Steep / Unstable
              </div>
            </div>

            <div style={subCardStyle}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <Waves size={13} color="var(--accent-blue)" /> River Level
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 2px 0' }}>{(village.riverLevel || 1.4).toFixed(1)} m</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--risk-low)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Minus size={11} /> Normal • {ageText}
              </div>
            </div>
          </div>
        )}

        {/* 5. WHY IS THIS AREA AT RISK? */}
        {activeSubTab === 'factors' && (
          <div style={{ background: 'var(--input-bg)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
            <h4 style={{ fontSize: '0.72rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              WHY IS THIS AREA AT RISK?
            </h4>
            <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
              {village.rain > 15 && <li>🌧 Heavy rainfall in catchment area ({Math.round(village.rain)} mm/h)</li>}
              {village.moisture > 60 && <li>💧 High soil moisture saturation level ({Math.round(village.moisture)}%)</li>}
              {village.slope > 35 && <li>⛰ Steep terrain slope inclination angle ({Math.round(village.slope)}°)</li>}
              <li>📈 Continuous real-time risk assessment via telemetry mesh</li>
            </ul>
          </div>
        )}

        {/* 6. TERRAIN & SATELLITE STATUS */}
        {activeSubTab === 'terrain' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: 'var(--text-primary)', background: 'var(--input-bg)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Elevation:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{village.lng > 85 ? '120 m' : '2,890 m'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Slope:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{Math.round(village.slope)}°</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Terrain Saturation:</span>
              <strong style={{ color: village.moisture > 70 ? 'var(--risk-high)' : 'var(--risk-low)' }}>
                {village.moisture > 70 ? 'High Saturation' : 'Normal Baseline'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Satellite Provider:</span>
              <strong style={{ color: 'var(--text-primary)' }}>Sentinel-2 / Esri HighRes</strong>
            </div>
          </div>
        )}
      </div>

      {/* 7. NEARBY AREAS (RISK RANKING TABLE) - ANCHORED AT BOTTOM OF CARD */}
      <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '8px', flexShrink: 0 }}>
        <h4 style={{ fontSize: '0.68rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          NEARBY AREAS (RISK RANKING)
        </h4>
        <div style={{ background: 'var(--input-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ background: 'var(--card-bg)', color: 'var(--text-secondary)', textAlign: 'left', borderBottom: '1px solid var(--card-border)' }}>
                <th style={{ padding: '6px 10px', fontWeight: 600 }}>Location</th>
                <th style={{ padding: '6px 10px', fontWeight: 600 }}>Hazard</th>
                <th style={{ padding: '6px 10px', fontWeight: 600, textAlign: 'right' }}>Risk Score</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--text-primary)' }}>
              {nearbyVillages.map(v => {
                const symColor = v.score >= 80 ? 'var(--risk-high)' : v.score >= 60 ? 'var(--risk-medium)' : v.score >= 40 ? 'var(--risk-medium)' : 'var(--risk-low)';
                return (
                  <tr 
                    key={v.id}
                    onClick={() => onSelectVillage && onSelectVillage(v.id)}
                    style={{ borderBottom: '1px solid var(--card-border)', cursor: 'pointer', transition: 'background 0.15s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-blue-glow)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '6px 10px', fontWeight: 700, color: 'var(--text-primary)' }}>{v.name}</td>
                    <td style={{ padding: '6px 10px', color: 'var(--text-secondary)' }}>{mode === 'flash_flood' ? 'Flash Flood' : 'Landslide'}</td>
                    <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 700 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: symColor }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: symColor }}></span>
                        {v.score} / 100
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
