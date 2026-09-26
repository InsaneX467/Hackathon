import { Polygon, Popup } from 'react-leaflet';

export default function HazardZone({ zone, onSelect, mode = 'landslide' }) {
  const isCritical = zone.riskLevel === 'CRITICAL';
  const isWarning = zone.riskLevel === 'WARNING';
  const isSafe = zone.riskLevel === 'LOW';

  const outerColor = isCritical ? '#eab308' : isWarning ? '#f97316' : isSafe ? '#10b981' : '#eab308';
  const outerFill = isCritical ? '#f59e0b' : isWarning ? '#f97316' : isSafe ? '#10b981' : '#f59e0b';
  const outerFillOpacity = isCritical ? 0.22 : isWarning ? 0.26 : 0.18;

  const isEmphasized = mode === 'all' ||
    (mode === 'landslide' && (zone.primaryHazard === 'landslide' || zone.primaryHazard === 'mixed')) ||
    (mode === 'flash_flood' && (zone.primaryHazard === 'flash_flood' || zone.primaryHazard === 'mixed'));

  return (
    <>
      {/* Outer Contoured Hazard Perimeter */}
      <Polygon
        positions={zone.outerPolygon}
        pathOptions={{
          color: outerColor,
          weight: 1.5,
          fillColor: outerFill,
          fillOpacity: isEmphasized ? outerFillOpacity : outerFillOpacity * 0.5,
          opacity: isEmphasized ? 0.8 : 0.4
        }}
        eventHandlers={{
          click: () => onSelect && onSelect(zone.id)
        }}
      >
        <Popup className="dark-hazard-popup">
          <div style={{ padding: '6px', minWidth: '200px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff', marginBottom: '4px' }}>
              {zone.name}
            </div>
            <div style={{
              display: 'inline-block',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '4px',
              background: isCritical ? 'rgba(239,68,68,0.25)' : 'rgba(249,115,22,0.25)',
              color: isCritical ? '#f87171' : '#fb923c',
              marginBottom: '6px'
            }}>
              {zone.riskLevel} ZONE ({zone.score}/100)
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#cbd5e1' }}>
              {zone.description}
            </p>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '6px', fontStyle: 'italic' }}>
              Model Hazard Polygon Simulation
            </div>
          </div>
        </Popup>
      </Polygon>

      {/* Inner Critical Core Zone (if present) */}
      {zone.innerPolygon && (
        <Polygon
          positions={zone.innerPolygon}
          pathOptions={{
            color: '#ef4444',
            weight: 1.8,
            fillColor: '#ef4444',
            fillOpacity: isEmphasized ? 0.45 : 0.22,
            opacity: isEmphasized ? 0.9 : 0.45
          }}
          eventHandlers={{
            click: () => onSelect && onSelect(zone.id)
          }}
        />
      )}
    </>
  );
}
