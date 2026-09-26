import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useMemo } from 'react';

// Generates custom SVG icons matching the reference image
function buildHazardSvgIcon(type, isCritical = false) {
  if (type === 'landslide') {
    return L.divIcon({
      className: 'hazard-custom-icon',
      iconSize: [34, 32],
      iconAnchor: [17, 16],
      popupAnchor: [0, -16],
      html: `
        <div class="${isCritical ? 'pulse-critical' : ''}" style="width: 34px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; filter: drop-shadow(0 3px 10px rgba(239, 68, 68, 0.85)); transition: transform 0.2s ease;">
          <svg width="34" height="32" viewBox="0 0 34 32" fill="none">
            <path d="M17 2.5 C17.7 2.5 18.3 3.0 18.7 3.8 L31.5 25.5 C32 26.4 31.3 27.8 30.2 27.8 L3.8 27.8 C2.7 27.8 2 26.4 2.5 25.5 L15.3 3.8 C15.7 3.0 16.3 2.5 17 2.5 Z" fill="#ef4444" stroke="#ffffff" stroke-width="1.3" stroke-linejoin="round"/>
            <path d="M10 23 L17 12" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
            <circle cx="19" cy="16" r="1.8" fill="#ffffff" />
            <circle cx="22" cy="20" r="1.5" fill="#ffffff" />
            <circle cx="18" cy="23" r="1.3" fill="#ffffff" />
          </svg>
        </div>
      `
    });
  }

  if (type === 'flash_flood') {
    return L.divIcon({
      className: 'hazard-custom-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
      html: `
        <div class="${isCritical ? 'pulse-critical-orange' : ''}" style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; filter: drop-shadow(0 3px 10px rgba(249, 115, 22, 0.85)); transition: transform 0.2s ease;">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <rect x="2.5" y="2.5" width="25" height="25" rx="6.5" fill="#f97316" stroke="#ffffff" stroke-width="1.3"/>
            <path d="M6 11 C8 9.5 10 12.5 13 11 C16 9.5 18 12.5 21 11 C23 9.5 24 12 24 11" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
            <path d="M6 17 C8 15.5 10 18.5 13 17 C16 15.5 18 18.5 21 17 C23 15.5 24 18 24 17" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      `
    });
  }

  if (type === 'normal_safe') {
    return L.divIcon({
      className: 'hazard-custom-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
      html: `
        <div style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; filter: drop-shadow(0 3px 10px rgba(16, 185, 129, 0.85)); transition: transform 0.2s ease;">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="13" fill="#10b981" stroke="#ffffff" stroke-width="1.3"/>
            <path d="M8 12 C10 10.5 12 13.5 15 12 C18 10.5 20 13.5 22 12" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 18 C10 16.5 12 19.5 15 18 C18 16.5 20 19.5 22 18" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      `
    });
  }

  // Rainfall station (Blue droplet)
  return L.divIcon({
    className: 'hazard-custom-icon',
    iconSize: [28, 32],
    iconAnchor: [14, 30],
    popupAnchor: [0, -28],
    html: `
      <div style="width: 28px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; filter: drop-shadow(0 3px 10px rgba(2, 132, 199, 0.85)); transition: transform 0.2s ease;">
        <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
          <path d="M14 2 C14 2 24 13.5 24 19.5 C24 25.3 19.5 30 14 30 C8.5 30 4 25.3 4 19.5 C4 13.5 14 2 14 2 Z" fill="#0284c7" stroke="#ffffff" stroke-width="1.3"/>
          <path d="M14 11 C14 11 19 17 19 20.5 C19 23.3 16.8 25.5 14 25.5 C11.2 25.5 9 23.3 9 20.5 C9 17 14 11 14 11 Z" fill="#ffffff"/>
        </svg>
      </div>
    `
  });
}

export default function HazardMarker({ marker, onSelect, mode = 'landslide' }) {
  const isCritical = marker.riskLevel === 'CRITICAL';
  const type = marker.type || marker.hazardType || 'landslide';
  const lat = marker.lat ?? marker.latitude;
  const lng = marker.lng ?? marker.longitude;
  const score = marker.score ?? marker.riskScore ?? 75;

  const icon = useMemo(() => buildHazardSvgIcon(type, isCritical), [type, isCritical]);

  const isEmphasized = mode === 'all' ||
    (mode === 'landslide' && type === 'landslide') ||
    (mode === 'flash_flood' && (type === 'flash_flood' || type === 'rainfall_station'));

  return (
    <Marker
      position={[lat, lng]}
      icon={icon}
      opacity={isEmphasized ? 1.0 : 0.65}
      eventHandlers={{
        click: () => onSelect && onSelect(marker.locationRef || marker.id)
      }}
    >
      <Popup className="dark-hazard-popup">
        <div style={{ padding: '8px', minWidth: '220px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '6px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
              {marker.name}
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '4px',
                background:
                  marker.riskLevel === 'CRITICAL'
                    ? 'rgba(239, 68, 68, 0.25)'
                    : marker.riskLevel === 'WARNING'
                    ? 'rgba(249, 115, 22, 0.25)'
                    : 'rgba(16, 185, 129, 0.25)',
                color:
                  marker.riskLevel === 'CRITICAL'
                    ? '#f87171'
                    : marker.riskLevel === 'WARNING'
                    ? '#fb923c'
                    : '#34d399'
              }}
            >
              {marker.riskLevel} ({marker.score}/100)
            </span>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
            {marker.slope != null && <div><strong>Slope Inclination:</strong> {marker.slope}°</div>}
            <div><strong>Hazard Category:</strong> {marker.type.toUpperCase().replace('_', ' ')}</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontStyle: 'italic' }}>
              Demonstration Risk Assessment Model
            </div>
          </div>

          <div
            style={{
              fontSize: '0.72rem',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '6px',
              padding: '6px 8px',
              color: '#94a3b8',
              marginBottom: '8px'
            }}
          >
            {marker.statusText || 'Monitoring station active'}
          </div>

          <button
            type="button"
            onClick={() => onSelect && onSelect(marker.locationRef || marker.id)}
            style={{
              width: '100%',
              padding: '6px 12px',
              background: '#0284c7',
              border: 'none',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            Inspect Location Details & Weather →
          </button>
        </div>
      </Popup>
    </Marker>
  );
}
