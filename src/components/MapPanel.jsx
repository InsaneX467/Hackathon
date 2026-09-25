import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';
import { MapPin, Layers, Compass, Waves, ShieldAlert, Globe } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getDataFreshnessBadge } from '../services/telemetryService';

// Fix Leaflet Default Icon Path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapController({ selectedId, villages, visibleVillages, indlandsPoint, activeRegion }) {
  const map = useMap();
  const prevSelectedRef = useRef(null);

  // 1. Zoom to region bounds when activeRegion or indlandsPoint changes
  useEffect(() => {
    if (!map) return;
    if (indlandsPoint) {
      map.flyTo([indlandsPoint.lat, indlandsPoint.lng], 13, { duration: 1.2 });
      return;
    }

    if (visibleVillages && visibleVillages.length > 0) {
      const bounds = L.latLngBounds(visibleVillages.map(v => [v.lat, v.lng]));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: activeRegion === 'all' ? 6 : 9, duration: 1.2 });
      }
    }
  }, [map, activeRegion, visibleVillages, indlandsPoint]);

  // 2. Fly to specific location when selectedId changes
  useEffect(() => {
    if (!map || !selectedId) return;
    if (prevSelectedRef.current === selectedId) return;
    prevSelectedRef.current = selectedId;

    const v = villages.find(item => item.id === selectedId);
    if (v) {
      map.flyTo([v.lat, v.lng], 12, { duration: 1 });
    }
  }, [map, selectedId, villages]);

  return null;
}

const MAP_STYLES = {
  satellite: {
    label: 'Satellite',
    icon: Compass,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    hasOverlay: true,
    overlayUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
  },
  light: {
    label: 'Light Canvas',
    icon: Layers,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    hasOverlay: true,
    overlayUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
  },
  topo: {
    label: 'Street / Topo',
    icon: MapPin,
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    hasOverlay: false
  }
};

export default function MapPanel({ 
  villages = [], 
  selectedId, 
  onSelect, 
  mode = 'landslide',
  indlandsPoint = null,
  lastUpdatedTime
}) {
  const [currentStyle, setCurrentStyle] = useState('satellite');
  const [activeRegion, setActiveRegion] = useState('all'); // 'all' | 'ne' | 'uk'
  const [layers, setLayers] = useState({
    riskZones: true,
    sensors: true,
    rivers: true,
    wards: true
  });

  const activeStyleConfig = MAP_STYLES[currentStyle];
  const freshness = getDataFreshnessBadge(lastUpdatedTime);

  const neCount = villages.filter(v => v.lng > 85).length;
  const ukCount = villages.filter(v => v.lng <= 85).length;

  const visibleVillages = activeRegion === 'ne'
    ? villages.filter(v => v.lng > 85)
    : activeRegion === 'uk'
    ? villages.filter(v => v.lng <= 85)
    : villages;

  const handleRegionChange = (regionKey) => {
    setActiveRegion(regionKey);
    const targetList = regionKey === 'ne'
      ? villages.filter(v => v.lng > 85)
      : regionKey === 'uk'
      ? villages.filter(v => v.lng <= 85)
      : villages;

    if (targetList.length > 0) {
      const isCurrentlyVisible = targetList.some(v => v.id === selectedId);
      if (!isCurrentlyVisible && onSelect) {
        onSelect(targetList[0].id);
      }
    }
  };

  return (
    <div className="panel map-panel" style={{ position: 'relative', height: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Map Overlay Header & Region Switcher */}
      <div className="map-overlay-header" style={{
        position: 'absolute', top: '12px', left: '16px', right: '16px', zIndex: 400,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px'
      }}>
        <div className="map-overlay-pill" style={{
          background: 'rgba(15, 23, 42, 0.88)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.15)', color: '#fff',
          padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          {mode === 'flash_flood' ? <Waves size={14} color="#38bdf8" /> : <ShieldAlert size={14} color="#ef4444" />}
          <span>Spatial Operations Map • {mode === 'flash_flood' ? 'Flash Flood & River Stage' : 'Landslide Susceptibility'}</span>
        </div>

        {/* Region View Jump Pills */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.15)',
          padding: '3px',
          borderRadius: '20px'
        }}>
          <button
            type="button"
            onClick={() => handleRegionChange('all')}
            title="Show all monitored locations across India"
            style={{
              padding: '4px 10px',
              borderRadius: '14px',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeRegion === 'all' ? '#0284c7' : 'transparent',
              color: activeRegion === 'all' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.15s ease'
            }}
          >
            🇮🇳 All India ({villages.length})
          </button>
          <button
            type="button"
            onClick={() => handleRegionChange('ne')}
            title="Focus on Assam & North-East India"
            style={{
              padding: '4px 10px',
              borderRadius: '14px',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeRegion === 'ne' ? '#0284c7' : 'transparent',
              color: activeRegion === 'ne' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.15s ease'
            }}
          >
            🌿 Assam & NE ({neCount})
          </button>
          <button
            type="button"
            onClick={() => handleRegionChange('uk')}
            title="Focus on Garhwal Himalayas / Uttarakhand"
            style={{
              padding: '4px 10px',
              borderRadius: '14px',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeRegion === 'uk' ? '#0284c7' : 'transparent',
              color: activeRegion === 'uk' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.15s ease'
            }}
          >
            🏔️ Uttarakhand ({ukCount})
          </button>
        </div>
      </div>

      {/* Map Risk Scheme Legend */}
      <div className="map-legend-overlay" style={{
        position: 'absolute', bottom: '16px', left: '16px', zIndex: 400,
        background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.15)', color: '#f8fafc',
        padding: '10px 14px', borderRadius: '10px', fontSize: '0.75rem'
      }}>
        <div style={{ fontWeight: 700, marginBottom: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>RISK LEVEL</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#10b981' }}>🟢</span> <span>Low (0–40)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#f59e0b' }}>🟡</span> <span>Watch (40–60)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#f97316' }}>🟠</span> <span>Warning (60–80)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#ef4444' }}>🔴</span> <span>Critical (80–100)</span>
          </div>
        </div>
      </div>

      <MapContainer 
        center={indlandsPoint ? [indlandsPoint.lat, indlandsPoint.lng] : [26.0, 87.0]} 
        zoom={6} 
        style={{ width: '100%', height: '100%', minHeight: '420px', background: '#0f172a', borderRadius: '12px' }}
      >
        <MapController 
          selectedId={selectedId} 
          villages={villages} 
          visibleVillages={visibleVillages}
          indlandsPoint={indlandsPoint} 
          activeRegion={activeRegion}
        />
        
        <TileLayer
          key={currentStyle}
          url={activeStyleConfig.url}
          attribution={activeStyleConfig.attribution}
          maxZoom={19}
        />

        {activeStyleConfig.hasOverlay && (
          <TileLayer
            key={`${currentStyle}-overlay`}
            url={activeStyleConfig.overlayUrl}
            maxZoom={19}
            opacity={0.8}
          />
        )}

        {/* Monitored Ward Risk Markers */}
        {layers.riskZones && visibleVillages.map(v => {
          const isSelected = v.id === selectedId;
          const isCritical = v.score >= 80;
          const isWarning = v.score >= 60 && v.score < 80;
          const isWatch = v.score >= 40 && v.score < 60;

          const color = isCritical ? '#ef4444' : (isWarning ? '#f97316' : (isWatch ? '#f59e0b' : '#10b981'));
          const symbol = isCritical ? '🚨' : (isWarning ? '🟠' : (isWatch ? '🟡' : '🟢'));
          const radius = isSelected ? 18 : (isCritical ? 16 : 12);

          return (
            <CircleMarker
              key={v.id}
              center={[v.lat, v.lng]}
              radius={radius}
              fillColor={color}
              color={isSelected ? '#ffffff' : color}
              weight={isSelected ? 4 : 2}
              opacity={1}
              fillOpacity={0.85}
              eventHandlers={{
                click: () => onSelect && onSelect(v.id)
              }}
            >
              <Popup>
                <div style={{ fontFamily: 'sans-serif', padding: '6px', minWidth: '180px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{symbol}</span>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a' }}>{v.name}</h4>
                  </div>
                  <div style={{
                    background: `${color}15`,
                    color: color,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    marginBottom: '8px'
                  }}>
                    {mode === 'flash_flood' ? 'Flash Flood Risk' : 'Landslide Risk'}: {v.score} / 100 ({v.cat?.label || 'WATCH'})
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div><strong>Rainfall:</strong> {Math.round(v.rain)} mm/hr</div>
                    <div><strong>Soil Moisture:</strong> {Math.round(v.moisture)}%</div>
                    <div><strong>Slope:</strong> {Math.round(v.slope)}°</div>
                    {mode === 'flash_flood' && (
                      <div><strong>River Level:</strong> {(v.riverLevel || 1.4).toFixed(2)} m</div>
                    )}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}

