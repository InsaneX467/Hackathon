import { X, Layers } from 'lucide-react';

export default function MapLayerControl({ layers, onToggle, onClose }) {
  const layerDefs = [
    { key: 'hazardZones', label: 'Hazard Zones (Polygons)', icon: '🗺️', desc: 'Critical & Watch Contours' },
    { key: 'landslideRisk', label: 'Landslide Risk Markers', icon: '🔺', desc: 'Escarpments & Slopes' },
    { key: 'floodRisk', label: 'Flash Flood Risk Markers', icon: '🟧', desc: 'River Surge & Lowlands' },
    { key: 'rainfallStations', label: 'Rainfall Stations', icon: '💧', desc: 'Telemetry Rain Gauges' },
    { key: 'weatherData', label: 'Live Weather Stations', icon: '☁️', desc: 'Open-Meteo Live Data' },
    { key: 'rivers', label: 'Brahmaputra River Network', icon: '〰', desc: 'Braided Channels & Inflows' },
    { key: 'districtBoundaries', label: 'District Boundaries', icon: '┄', desc: 'Administrative Borders' },
    { key: 'safeAreas', label: 'Safe / Normal Areas', icon: '🟢', desc: 'Shelters & Safe Zones' }
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: '68px',
        left: '58px',
        zIndex: 600,
        background: 'rgba(8, 16, 32, 0.94)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '12px',
        padding: '14px 16px',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.65)',
        color: '#f8fafc',
        width: '260px',
        maxHeight: '440px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.4px', color: '#94a3b8' }}>
          <Layers size={14} color="#38bdf8" />
          <span>GIS LAYER CONTROLS</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
        >
          <X size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {layerDefs.map((def) => {
          const isActive = layers[def.key] ?? true;
          return (
            <label
              key={def.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 8px',
                borderRadius: '6px',
                background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = isActive ? 'rgba(255,255,255,0.06)' : 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1rem' }}>{def.icon}</span>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: isActive ? '#ffffff' : '#94a3b8' }}>
                    {def.label}
                  </div>
                  <div style={{ fontSize: '0.66rem', color: '#64748b' }}>
                    {def.desc}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => onToggle(def.key)}
                style={{ accentColor: '#0284c7', cursor: 'pointer' }}
              />
            </label>
          );
        })}
      </div>

      <div style={{ fontSize: '0.68rem', color: '#64748b', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '6px' }}>
        Select layers to customize command view
      </div>
    </div>
  );
}
