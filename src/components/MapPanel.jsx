import { MapContainer, TileLayer, CircleMarker, Circle, Popup, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Compass, 
  Waves, 
  ShieldAlert, 
  Radio, 
  Home, 
  Sun, 
  Moon,
  ChevronDown,
  Plus,
  Minus
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SENSOR_NODES } from '../services/telemetryService';

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
  const prevRegionRef = useRef(null);
  const prevIndlandsRef = useRef(null);

  // 1. Zoom to region bounds ONLY when activeRegion or indlandsPoint actually changes
  useEffect(() => {
    if (!map) return;

    if (indlandsPoint && prevIndlandsRef.current !== indlandsPoint) {
      prevIndlandsRef.current = indlandsPoint;
      map.flyTo([indlandsPoint.lat, indlandsPoint.lng], 13, { duration: 1.2 });
      return;
    }

    if (prevRegionRef.current !== activeRegion) {
      prevRegionRef.current = activeRegion;
      if (visibleVillages && visibleVillages.length > 0) {
        const bounds = L.latLngBounds(visibleVillages.map(v => [v.lat, v.lng]));
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: activeRegion === 'all' ? 6 : 9, duration: 1.0 });
        }
      }
    }
  }, [map, activeRegion, indlandsPoint]);

  // 2. Fly to specific location ONLY when selectedId changes from external click
  useEffect(() => {
    if (!map || !selectedId) return;
    if (prevSelectedRef.current === selectedId) return;
    prevSelectedRef.current = selectedId;

    const v = villages.find(item => item.id === selectedId);
    if (v) {
      const currentZoom = map.getZoom();
      const targetZoom = Math.max(currentZoom, 11);
      map.flyTo([v.lat, v.lng], targetZoom, { duration: 1.0 });
    }
  }, [map, selectedId, villages]);

  return null;
}

function CursorCoordinatesTracker({ onCoordsChange }) {
  useMapEvents({
    mousemove(e) {
      if (onCoordsChange) {
        onCoordsChange({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    }
  });
  return null;
}

function ZoomTracker({ onZoomChange }) {
  const map = useMapEvents({
    zoomend() {
      onZoomChange(map.getZoom());
    }
  });
  useEffect(() => {
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);
  return null;
}

function CustomZoomButtons() {
  const map = useMap();
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '2px',
      background: 'var(--header-bg)', backdropFilter: 'blur(10px)',
      border: '1px solid var(--card-border)', borderRadius: '8px', padding: '3px',
      boxShadow: 'var(--glass-shadow)', pointerEvents: 'auto'
    }}>
      <button
        type="button"
        onClick={() => map.zoomIn()}
        title="Zoom In (+)"
        style={{
          width: '26px', height: '26px', border: 'none', background: 'transparent',
          color: 'var(--text-primary)', fontWeight: 'bold', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '5px'
        }}
      >
        <Plus size={14} />
      </button>
      <div style={{ height: '1px', background: 'var(--card-border)' }} />
      <button
        type="button"
        onClick={() => map.zoomOut()}
        title="Zoom Out (-)"
        style={{
          width: '26px', height: '26px', border: 'none', background: 'transparent',
          color: 'var(--text-primary)', fontWeight: 'bold', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '5px'
        }}
      >
        <Minus size={14} />
      </button>
    </div>
  );
}

const MAP_STYLES = {
  satellite: {
    label: 'Satellite',
    icon: Compass,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxNativeZoom: 18,
    hasOverlay: true,
    overlayUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
  },
  topo: {
    label: 'Street Topo',
    icon: MapPin,
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxNativeZoom: 18,
    hasOverlay: false
  }
};

// Helper: De-clutter markers that are close to each other at any zoom level
function getClusteredCoords(village, allVillages, zoom) {
  const threshold = zoom >= 12 ? 0.02 : (zoom >= 9 ? 0.05 : 0.15);

  const nearby = allVillages.filter(other => 
    Math.abs(other.lat - village.lat) < threshold && Math.abs(other.lng - village.lng) < threshold
  );

  if (nearby.length <= 1) return [village.lat, village.lng];

  const localIdx = nearby.findIndex(item => item.id === village.id);
  const angle = (localIdx * 2 * Math.PI) / nearby.length;
  const spreadRadius = zoom >= 12 ? 0.012 : (zoom >= 9 ? 0.03 : (zoom <= 6 ? 0.08 : 0.045));

  return [
    village.lat + Math.sin(angle) * spreadRadius,
    village.lng + Math.cos(angle) * spreadRadius
  ];
}

// Helper: Sleek compact radius scaling based on zoom level
function getMarkerRadius(isSelected, isCritical, zoom) {
  let base = 5;
  if (zoom >= 12) base = 8;
  else if (zoom >= 10) base = 7;
  else if (zoom >= 8) base = 6;
  else if (zoom >= 6) base = 5;
  else base = 4;

  if (isSelected) return base + 3;
  if (isCritical) return base + 1.5;
  return base;
}

export default function MapPanel({ 
  villages = [], 
  selectedId, 
  onSelect, 
  mode = 'landslide',
  indlandsPoint = null
}) {
  const [currentStyle, setCurrentStyle] = useState('satellite');
  const [activeRegion, setActiveRegion] = useState('all'); // 'all' | 'ne' | 'uk'
  const [cursorCoords, setCursorCoords] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(6);
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  
  // GIS Layer Toggles - default sensors/shelters OFF to prevent cluttering map
  const [layers, setLayers] = useState({
    riskZones: true,
    sensors: false,
    shelters: false,
    radiusRing: true
  });

  const activeStyleConfig = MAP_STYLES[currentStyle];
  const selectedVillage = villages.find(v => v.id === selectedId) || villages[0];

  const neCount = villages.filter(v => v.lng > 85).length;
  const ukCount = villages.filter(v => v.lng <= 85).length;

  const visibleVillages = activeRegion === 'ne'
    ? villages.filter(v => v.lng > 85)
    : activeRegion === 'uk'
    ? villages.filter(v => v.lng <= 85)
    : villages;

  // Sort visible villages so selectedId is rendered LAST (on top of all others)
  const sortedVillages = [...visibleVillages].sort((a, b) => {
    if (a.id === selectedId) return 1;
    if (b.id === selectedId) return -1;
    return 0;
  });

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

  const toggleLayer = (layerKey) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className="panel map-panel" style={{ position: 'relative', height: '100%', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* 1. LEAFLET INTERACTIVE MAP CONTAINER */}
      <MapContainer 
        key={`leaflet-map-${activeRegion}`}
        center={indlandsPoint ? [indlandsPoint.lat, indlandsPoint.lng] : [26.0, 87.0]} 
        zoom={6}
        zoomControl={false}
        attributionControl={false}
        style={{ width: '100%', height: '100%', minHeight: '420px', background: 'var(--bg-dark)', borderRadius: '12px', zIndex: 1 }}
      >
        <MapController 
          selectedId={selectedId} 
          villages={villages} 
          visibleVillages={visibleVillages}
          indlandsPoint={indlandsPoint} 
          activeRegion={activeRegion}
        />

        <CursorCoordinatesTracker onCoordsChange={setCursorCoords} />
        <ZoomTracker onZoomChange={setZoomLevel} />

        {/* Sleek Custom Zoom Controls placed INSIDE MapContainer */}
        <div style={{ position: 'absolute', top: '48px', left: '10px', zIndex: 400, pointerEvents: 'auto' }}>
          <CustomZoomButtons />
        </div>

        <TileLayer
          key={currentStyle}
          url={activeStyleConfig.url}
          attribution={activeStyleConfig.attribution}
          maxNativeZoom={activeStyleConfig.maxNativeZoom || 17}
          maxZoom={19}
        />

        {activeStyleConfig.hasOverlay && (
          <TileLayer
            key={`${currentStyle}-overlay`}
            url={activeStyleConfig.overlayUrl}
            maxNativeZoom={activeStyleConfig.maxNativeZoom || 17}
            maxZoom={19}
            opacity={0.8}
          />
        )}

        {/* FEATURE 1: 5km Evacuation Danger Circle (Transparent fill so map terrain is visible) */}
        {layers.radiusRing && selectedVillage && (
          <Circle
            center={[selectedVillage.lat, selectedVillage.lng]}
            radius={5000} // 5,000 meters = 5km
            pathOptions={{
              color: selectedVillage.score >= 80 ? '#ef4444' : '#0284c7',
              fillColor: selectedVillage.score >= 80 ? '#ef4444' : '#0284c7',
              fillOpacity: zoomLevel >= 10 ? 0.01 : 0.04,
              weight: 1.5,
              dashArray: '6, 6'
            }}
          />
        )}

        {/* FEATURE 2: Monitored Ward Hazard Markers (Translucent Fill on High Zoom so Satellite Terrain is Readable) */}
        {layers.riskZones && sortedVillages.map(v => {
          const isSelected = v.id === selectedId;
          const isCritical = v.score >= 80;
          const isWarning = v.score >= 60 && v.score < 80;
          const isWatch = v.score >= 40 && v.score < 60;

          const color = isCritical ? '#ef4444' : (isWarning ? '#f97316' : (isWatch ? '#f59e0b' : '#10b981'));
          const symbol = isCritical ? '🚨' : (isWarning ? '🟠' : (isWatch ? '🟡' : '🟢'));
          
          // Compact Radius based on Zoom Level
          const radius = getMarkerRadius(isSelected, isCritical, zoomLevel);

          // Calculate decluttered coordinates to prevent marker overlap
          const pos = getClusteredCoords(v, visibleVillages, zoomLevel);

          // Translucency on high zoom keeps satellite imagery 100% readable
          const fillOpacity = zoomLevel >= 11 ? (isSelected ? 0.35 : 0.25) : 0.85;
          const strokeWeight = isSelected ? 3 : (zoomLevel >= 11 ? 2 : 1.5);

          return (
            <div key={v.id}>
              {/* Highlight Outer Radar Ring for Selected Location */}
              {isSelected && (
                <CircleMarker
                  center={pos}
                  radius={radius + 4}
                  fillColor="#0284c7"
                  color="#0284c7"
                  weight={2}
                  opacity={0.9}
                  fillOpacity={0.12}
                  dashArray="3,3"
                />
              )}

              <CircleMarker
                center={pos}
                radius={radius}
                fillColor={color}
                color={isSelected ? '#ffffff' : color}
                weight={strokeWeight}
                opacity={1}
                fillOpacity={fillOpacity}
                eventHandlers={{
                  click: () => onSelect && onSelect(v.id)
                }}
              >
                <Popup autoPan={true} autoPanPadding={[50, 50]}>
                  <div style={{ fontFamily: 'sans-serif', padding: '6px', minWidth: '190px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{symbol}</span>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 800 }}>{v.name}</h4>
                    </div>
                    
                    <div style={{
                      background: `${color}15`,
                      color: color,
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      marginBottom: '8px',
                      border: `1px solid ${color}40`
                    }}>
                      {mode === 'flash_flood' ? 'Flash Flood Risk' : 'Landslide Risk'}: {v.score} / 100 ({v.cat?.label || 'WATCH'})
                    </div>

                    <div style={{ fontSize: '0.775rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div><strong>Precipitation:</strong> {Math.round(v.rain)} mm/hr</div>
                      <div><strong>Soil Moisture:</strong> {Math.round(v.moisture)}% Saturation</div>
                      <div><strong>Slope Angle:</strong> {Math.round(v.slope)}° incline</div>
                      {mode === 'flash_flood' && (
                        <div><strong>River Stage:</strong> {(v.riverLevel || 1.4).toFixed(2)} m</div>
                      )}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            </div>
          );
        })}

        {/* FEATURE 3: IoT Sensor Mesh Node Hardware Markers (Realistic ~400m Offset) */}
        {layers.sensors && visibleVillages.map(v => {
          const sensorLat = v.lat - 0.0035;
          const sensorLng = v.lng + 0.0045;

          return (
            <CircleMarker
              key={`sensor-${v.id}`}
              center={[sensorLat, sensorLng]}
              radius={zoomLevel >= 10 ? 5 : 4}
              fillColor="#0284c7"
              color="#ffffff"
              weight={1.5}
              opacity={1}
              fillOpacity={zoomLevel >= 11 ? 0.35 : 0.9}
            >
              <Popup autoPan={true} autoPanPadding={[50, 50]}>
                <div style={{ fontFamily: 'sans-serif', padding: '6px', minWidth: '180px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontWeight: 800, fontSize: '0.85rem' }}>
                    <Radio size={16} /> IoT Sensor Mesh Node
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>
                    Node #{v.id.toUpperCase()}-TELEMETRY
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Status: <strong style={{ color: '#16a34a' }}>● ONLINE (99.8%)</strong><br/>
                    Battery: <strong>96% Solar Charged</strong><br/>
                    Telemetry Frequency: <strong>15 Seconds</strong>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* FEATURE 4: Evacuation Relief Camp Shelter Markers (Realistic ~400m Offset) */}
        {layers.shelters && visibleVillages.map(v => {
          if (!v.shelter) return null;
          const shelterLat = v.lat + 0.0040;
          const shelterLng = v.lng - 0.0040;

          return (
            <CircleMarker
              key={`shelter-${v.id}`}
              center={[shelterLat, shelterLng]}
              radius={zoomLevel >= 10 ? 6 : 4.5}
              fillColor="#16a34a"
              color="#ffffff"
              weight={2}
              opacity={1}
              fillOpacity={zoomLevel >= 11 ? 0.4 : 0.95}
            >
              <Popup autoPan={true} autoPanPadding={[50, 50]}>
                <div style={{ fontFamily: 'sans-serif', padding: '6px', minWidth: '190px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 800, fontSize: '0.85rem' }}>
                    <Home size={16} /> Designated Relief Camp
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
                    {v.shelter.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                    Distance: <strong>{v.shelter.dist}</strong><br/>
                    Capacity: <strong>{v.shelter.capacity} Beds</strong> ({v.shelter.occupancy})<br/>
                    Evacuation Track: <strong style={{ color: '#0284c7' }}>{v.shelter.route}</strong>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

      </MapContainer>

      {/* 2. TOP OVERLAY HEADER - Rendered AFTER MapContainer with zIndex: 1000 */}
      <div className="map-overlay-header" style={{
        position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
        pointerEvents: 'none'
      }}>
        {/* Title Badge */}
        <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div className="map-overlay-pill" style={{
            background: 'var(--header-bg)', backdropFilter: 'blur(10px)',
            border: '1px solid var(--card-border)', color: 'var(--text-primary)',
            padding: '5px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: '6px', boxShadow: 'var(--glass-shadow)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {mode === 'flash_flood' ? <Waves size={14} color="var(--accent-blue)" /> : <ShieldAlert size={14} color="var(--risk-high)" />}
            <span>Spatial Operations Map</span>
          </div>
        </div>

        {/* Region View Jump Pills */}
        <div style={{
          pointerEvents: 'auto',
          display: 'flex',
          gap: '3px',
          background: 'var(--header-bg)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--card-border)',
          padding: '3px',
          borderRadius: '20px',
          boxShadow: 'var(--glass-shadow)'
        }}>
          <button
            type="button"
            onClick={() => handleRegionChange('all')}
            title="Show all monitored locations across India"
            style={{
              padding: '3px 9px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeRegion === 'all' ? 'var(--accent-blue)' : 'transparent',
              color: activeRegion === 'all' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            All ({villages.length})
          </button>
          <button
            type="button"
            onClick={() => handleRegionChange('ne')}
            title="Focus on Assam & North-East India"
            style={{
              padding: '3px 9px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeRegion === 'ne' ? 'var(--accent-blue)' : 'transparent',
              color: activeRegion === 'ne' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            Assam & NE ({neCount})
          </button>
          <button
            type="button"
            onClick={() => handleRegionChange('uk')}
            title="Focus on Garhwal Himalayas / Uttarakhand"
            style={{
              padding: '3px 9px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeRegion === 'uk' ? 'var(--accent-blue)' : 'transparent',
              color: activeRegion === 'uk' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            Uttarakhand ({ukCount})
          </button>
        </div>
      </div>

      {/* 3. MAP RISK SCHEME LEGEND & CURSOR COORDS (Bottom Left, zIndex: 1000) */}
      <div className="map-legend-overlay" style={{
        position: 'absolute', bottom: '16px', left: '12px', zIndex: 1000,
        background: 'var(--header-bg)', backdropFilter: 'blur(10px)',
        border: '1px solid var(--card-border)', color: 'var(--text-primary)',
        padding: '8px 12px', borderRadius: '10px', fontSize: '0.72rem',
        boxShadow: 'var(--glass-shadow)', pointerEvents: 'auto'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ color: 'var(--risk-low)' }}>🟢</span> Low</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ color: 'var(--risk-medium)' }}>🟡</span> Watch</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ color: 'var(--risk-medium)' }}>🟠</span> Warning</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ color: 'var(--risk-high)' }}>🔴</span> Critical</span>
        </div>

        {/* Live Mouse Coordinates Bar */}
        {cursorCoords && (
          <div style={{
            marginTop: '4px', paddingTop: '4px', borderTop: '1px solid var(--card-border)',
            fontFamily: 'monospace', fontSize: '0.65rem', color: 'var(--text-muted)'
          }}>
            Lat: {cursorCoords.lat.toFixed(3)}° | Lng: {cursorCoords.lng.toFixed(3)}° | Zoom: {zoomLevel}x
          </div>
        )}
      </div>

      {/* 4. BOTTOM-RIGHT TOOLBAR: BASEMAP SWITCHER & GIS LAYER TOGGLES (zIndex: 1000) */}
      <div style={{
        position: 'absolute', bottom: '16px', right: '12px', zIndex: 1000,
        display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end',
        pointerEvents: 'auto'
      }}>
        {/* Compact Basemap Switcher */}
        <div style={{
          background: 'var(--header-bg)', backdropFilter: 'blur(10px)',
          border: '1px solid var(--card-border)', padding: '3px', borderRadius: '10px',
          display: 'flex', gap: '3px', boxShadow: 'var(--glass-shadow)'
        }}>
          {Object.entries(MAP_STYLES).map(([key, cfg]) => {
            const IconComponent = cfg.icon;
            const isSelected = currentStyle === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setCurrentStyle(key)}
                title={`Switch tile layer to ${cfg.label}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '4px 8px', borderRadius: '6px', border: 'none',
                  fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer',
                  background: isSelected ? 'var(--accent-blue)' : 'transparent',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                <IconComponent size={12} />
                <span>{cfg.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* GIS Layer Menu Button */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            style={{
              background: 'var(--header-bg)', backdropFilter: 'blur(10px)',
              border: '1px solid var(--card-border)', padding: '6px 12px', borderRadius: '8px',
              color: 'var(--text-primary)', fontSize: '0.72rem', fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              boxShadow: 'var(--glass-shadow)'
            }}
          >
            <Layers size={13} color="var(--accent-blue)" />
            <span>GIS Map Layers</span>
            <ChevronDown size={12} />
          </button>

          {/* Layer Popover Menu */}
          {showLayerMenu && (
            <div style={{
              position: 'absolute', bottom: 'calc(100% + 6px)', right: 0,
              background: 'var(--card-bg)', border: '1px solid var(--card-border)',
              borderRadius: '10px', padding: '10px 12px', boxShadow: 'var(--glass-shadow)',
              display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '170px',
              fontSize: '0.72rem', color: 'var(--text-primary)', zIndex: 1500
            }}>
              <div style={{ fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.65rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '4px' }}>
                TOGGLE MAP LAYERS
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                <input 
                  type="checkbox" 
                  checked={layers.riskZones} 
                  onChange={() => toggleLayer('riskZones')}
                  style={{ accentColor: 'var(--accent-blue)' }}
                />
                <span>Risk Zones</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                <input 
                  type="checkbox" 
                  checked={layers.sensors} 
                  onChange={() => toggleLayer('sensors')}
                  style={{ accentColor: 'var(--accent-blue)' }}
                />
                <span style={{ color: 'var(--accent-blue)' }}>IoT Sensors ({SENSOR_NODES.length})</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                <input 
                  type="checkbox" 
                  checked={layers.shelters} 
                  onChange={() => toggleLayer('shelters')}
                  style={{ accentColor: 'var(--accent-blue)' }}
                />
                <span style={{ color: 'var(--risk-low)' }}>Relief Camps</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                <input 
                  type="checkbox" 
                  checked={layers.radiusRing} 
                  onChange={() => toggleLayer('radiusRing')}
                  style={{ accentColor: 'var(--accent-blue)' }}
                />
                <span style={{ color: 'var(--risk-high)' }}>5km Danger Radius</span>
              </label>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
