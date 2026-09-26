import { MapContainer, TileLayer, Polyline, Marker, Polygon, Popup, useMap } from 'react-leaflet';
import { useEffect, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import HazardMarker from './HazardMarker';
import HazardZone from './HazardZone';
import WeatherStation from './WeatherStation';
import MapControls from './MapControls';
import MapLegend from './MapLegend';
import MapLayerControl from './MapLayerControl';
import DynamicScaleBar from './DynamicScaleBar';

import { BRAHMAPUTRA_RIVER, NATIONWIDE_RIVERS } from '../../data/riverData';
import { DISTRICT_BOUNDARIES, DISTRICT_CENTROIDS, REGION_NAMES } from '../../data/districtData';
import { HAZARD_ZONES_DATA, HAZARD_MARKERS_DATA, RAINFALL_STATIONS_DATA } from '../../data/hazardData';
import { INDIA_MACRO_REGIONAL_BELTS } from '../../data/indiaHazards';

// Fix Leaflet Default Icon Path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// National Overview Centering: Covers Whole of India
const DEFAULT_CENTER = [23.5, 80.5];
const DEFAULT_ZOOM = 5;

function getCityDivIcon(name, pos = 'bottom') {
  return L.divIcon({
    className: 'city-text-label',
    iconSize: [120, 36],
    iconAnchor: [60, pos === 'top' ? 24 : 6],
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; pointer-events: none;">
        ${pos === 'top' ? `
          <span style="color: #ffffff; font-size: 12.5px; font-weight: 700; text-shadow: 0 1px 4px #000, 0 0 8px #000, 0 0 16px #000; margin-bottom: 2px; white-space: nowrap; font-family: system-ui, -apple-system, sans-serif;">${name}</span>
          <div style="width: 5px; height: 5px; background: #ffffff; border-radius: 50%; box-shadow: 0 0 4px #ffffff, 0 0 8px #000;"></div>
        ` : `
          <div style="width: 5px; height: 5px; background: #ffffff; border-radius: 50%; box-shadow: 0 0 4px #ffffff, 0 0 8px #000; margin-bottom: 2px;"></div>
          <span style="color: #ffffff; font-size: 12.5px; font-weight: 700; text-shadow: 0 1px 4px #000, 0 0 8px #000, 0 0 16px #000; white-space: nowrap; font-family: system-ui, -apple-system, sans-serif;">${name}</span>
        `}
      </div>
    `
  });
}

function getRegionLabelDivIcon(name, type) {
  if (type === 'river') {
    return L.divIcon({
      className: 'city-text-label',
      iconSize: [180, 30],
      iconAnchor: [90, 15],
      html: `
        <div style="color: #38bdf8; font-size: 12px; font-weight: 700; font-style: italic; letter-spacing: 0.6px; text-shadow: 0 0 8px rgba(2, 132, 199, 0.9), 0 1px 4px #000000; white-space: nowrap; transform: rotate(-15deg); font-family: system-ui, -apple-system, sans-serif;">
          ${name}
        </div>
      `
    });
  }

  return L.divIcon({
    className: 'city-text-label',
    iconSize: [200, 30],
    iconAnchor: [100, 15],
    html: `
      <div style="color: #f1f5f9; font-size: 13px; font-weight: 800; letter-spacing: 0.8px; text-shadow: 0 1px 6px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.85); white-space: nowrap; text-align: center; text-transform: uppercase; font-family: system-ui, -apple-system, sans-serif; opacity: 0.85;">
        ${name}
      </div>
    `
  });
}

// Controller bridging Leaflet map instance to parent state & smooth flyTo
function MapControllerBridge({ onMapReady, selectedLocation }) {
  const map = useMap();

  useEffect(() => {
    if (map && onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  // Smoothly fly to selected location when changed
  useEffect(() => {
    if (!map || !selectedLocation) return;
    if (selectedLocation.lat && selectedLocation.lng) {
      map.flyTo([selectedLocation.lat, selectedLocation.lng], 10, { duration: 1.2 });
    }
  }, [map, selectedLocation]);

  return null;
}

// Zoom Tracker Component for LOD rendering
function ZoomTracker({ onZoomChange }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const handleZoom = () => {
      onZoomChange(map.getZoom());
    };
    map.on('zoomend', handleZoom);
    handleZoom();
    return () => {
      map.off('zoomend', handleZoom);
    };
  }, [map, onZoomChange]);

  return null;
}

export default function LiveHazardMap({
  selectedId,
  selectedLocation,
  onSelect,
  mode = 'landslide',
  lastUpdatedTime,
  status = 'CRITICAL'
}) {
  const [mapStyle, setMapStyle] = useState('terrain'); // 'terrain' | 'satellite'
  const [mapInstance, setMapInstance] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(DEFAULT_ZOOM);
  const [showLayerDrawer, setShowLayerDrawer] = useState(false);
  const [tileError, setTileError] = useState(false);

  // 8 Independent GIS Layers
  const [layers, setLayers] = useState({
    hazardZones: true,
    landslideRisk: true,
    floodRisk: true,
    rainfallStations: true,
    weatherData: true,
    rivers: true,
    districtBoundaries: true,
    safeAreas: true
  });

  const toggleLayer = (layerKey) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleZoomIn = () => mapInstance?.zoomIn();
  const handleZoomOut = () => mapInstance?.zoomOut();
  const handleRecenter = () => {
    mapInstance?.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 1.2 });
  };

  // Filtered markers based on active layer toggles and mode
  const visibleMarkers = useMemo(() => {
    return HAZARD_MARKERS_DATA.filter(m => {
      const type = m.type || m.hazardType;
      if (type === 'landslide' && !layers.landslideRisk) return false;
      if (type === 'flash_flood' && !layers.floodRisk) return false;
      if (type === 'normal_safe' && !layers.safeAreas) return false;

      // Filter by active operational mode
      if (mode === 'landslide' && type === 'flash_flood') return false;
      if (mode === 'flash_flood' && type === 'landslide') return false;

      return true;
    });
  }, [layers, mode]);

  return (
    <div
      className="live-hazard-map-container"
      style={{
        position: 'relative',
        height: '100%',
        minHeight: '480px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#070f1e',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.12)'
      }}
    >
      {/* 1. TOP-LEFT COMMAND HEADER ("🛰 Live Hazard Map • Real-time Data") */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(8, 16, 32, 0.88)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '10px',
          padding: '8px 14px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          pointerEvents: 'auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.05rem' }}>🛰</span>
          <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '14.5px', letterSpacing: '-0.2px' }}>
            Live Hazard Map
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '8px', borderLeft: '1px solid rgba(255,255,255,0.18)' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: tileError ? '#ef4444' : '#10b981',
              boxShadow: `0 0 8px ${tileError ? '#ef4444' : '#10b981'}`,
              display: 'inline-block'
            }}
          />
          <span style={{ color: tileError ? '#f87171' : '#6ee7b7', fontSize: '12px', fontWeight: 600 }}>
            India-Wide Early Warning
          </span>
          <span style={{ color: '#94a3b8', fontSize: '11px', marginLeft: '4px' }}>
            • Live GIS
          </span>
        </div>
      </div>

      {/* 2. LEFT MAP CONTROLS (+, -, Recenter, Layers) */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRecenter={handleRecenter}
        onToggleLayers={() => setShowLayerDrawer(!showLayerDrawer)}
        showLayers={showLayerDrawer}
      />

      {/* 3. GIS LAYER DRAWER */}
      {showLayerDrawer && (
        <MapLayerControl
          layers={layers}
          onToggle={toggleLayer}
          onClose={() => setShowLayerDrawer(false)}
        />
      )}

      {/* 4. UPPER-RIGHT FLOATING LEGEND */}
      <MapLegend />

      {/* 5. BOTTOM-RIGHT BASEMAP SWITCHER ([ Terrain ] [ Satellite ]) */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          zIndex: 500,
          display: 'flex',
          background: 'rgba(8, 16, 32, 0.92)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '24px',
          padding: '3px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
        }}
      >
        <button
          type="button"
          onClick={() => setMapStyle('terrain')}
          style={{
            background: mapStyle === 'terrain' ? '#1d68d8' : 'transparent',
            color: mapStyle === 'terrain' ? '#ffffff' : '#94a3b8',
            border: 'none',
            borderRadius: '20px',
            padding: '6px 18px',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Terrain
        </button>
        <button
          type="button"
          onClick={() => setMapStyle('satellite')}
          style={{
            background: mapStyle === 'satellite' ? '#1d68d8' : 'transparent',
            color: mapStyle === 'satellite' ? '#ffffff' : '#94a3b8',
            border: 'none',
            borderRadius: '20px',
            padding: '6px 18px',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Satellite
        </button>
      </div>

      {/* 6. TILE ERROR FALLBACK BANNER (IF ANY) */}
      {tileError && (
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '16px',
            zIndex: 500,
            background: 'rgba(239, 68, 68, 0.85)',
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.75rem'
          }}
        >
          Base map tiles degraded. Reverting to offline cached vector rendering.
        </div>
      )}

      {/* 7. LEAFLET MAP VIEWPORT */}
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '480px',
          background: '#070e1c',
          borderRadius: '12px'
        }}
      >
        <MapControllerBridge
          onMapReady={setMapInstance}
          selectedLocation={selectedLocation}
        />

        <ZoomTracker onZoomChange={setCurrentZoom} />

        {/* Dynamic Scale Bar */}
        <DynamicScaleBar />

        {/* Basemap Tile Layer */}
        {mapStyle === 'satellite' ? (
          <TileLayer
            key="esri-satellite"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri"
            maxZoom={19}
            eventHandlers={{
              tileerror: () => setTileError(true)
            }}
          />
        ) : (
          <>
            <TileLayer
              key="esri-terrain-imagery"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri"
              maxZoom={19}
              eventHandlers={{
                tileerror: () => setTileError(true)
              }}
            />
            <TileLayer
              key="esri-terrain-hillshade"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}"
              opacity={0.35}
              maxZoom={13}
            />
          </>
        )}

        {/* Rivers Layer (Nationwide Corridors + Brahmaputra Tributary Network) */}
        {layers.rivers && (
          <>
            {/* Nationwide Major River Corridors */}
            {NATIONWIDE_RIVERS.map((river, idx) => (
              <Polyline
                key={`nw-river-${idx}`}
                positions={river.path}
                pathOptions={{
                  color: river.color || '#0284c7',
                  weight: 3.5,
                  opacity: 0.85,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
            ))}

            {/* Brahmaputra Outer Cyan Glow */}
            <Polyline
              positions={BRAHMAPUTRA_RIVER.mainStem}
              pathOptions={{
                color: BRAHMAPUTRA_RIVER.color,
                weight: 7,
                opacity: 0.72,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
            {/* Brahmaputra Bright Cyan Core */}
            <Polyline
              positions={BRAHMAPUTRA_RIVER.mainStem}
              pathOptions={{
                color: BRAHMAPUTRA_RIVER.glowColor,
                weight: 3,
                opacity: 0.95,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />

            {/* Braided Branches */}
            {BRAHMAPUTRA_RIVER.braidedChannels.map((branch, idx) => (
              <Polyline
                key={`braid-${idx}`}
                positions={branch}
                pathOptions={{
                  color: '#0ea5e9',
                  weight: 2,
                  opacity: 0.85,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
            ))}

            {/* Tributaries */}
            {BRAHMAPUTRA_RIVER.tributaries.map((trib, idx) => (
              <Polyline
                key={`trib-${idx}`}
                positions={trib.path}
                pathOptions={{
                  color: '#38bdf8',
                  weight: 2,
                  opacity: 0.8,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
            ))}

            {/* Brahmaputra River Label */}
            <Marker
              position={[BRAHMAPUTRA_RIVER.labelPoint.lat, BRAHMAPUTRA_RIVER.labelPoint.lng]}
              icon={getRegionLabelDivIcon(BRAHMAPUTRA_RIVER.labelPoint.name, 'river')}
              interactive={false}
            />
          </>
        )}

        {/* District & Regional Boundaries Layer */}
        {layers.districtBoundaries && (
          <>
            {DISTRICT_BOUNDARIES.map((bnd) => (
              <Polyline
                key={bnd.id}
                positions={bnd.path}
                pathOptions={{
                  color: '#e2e8f0',
                  weight: 1.4,
                  dashArray: '5, 6',
                  opacity: 0.75,
                  lineCap: 'round'
                }}
              />
            ))}

            {/* District Centroid Labels (Shown at closer zoom levels >= 7) */}
            {currentZoom >= 7 && DISTRICT_CENTROIDS.map((city) => (
              <Marker
                key={city.name}
                position={[city.lat, city.lng]}
                icon={getCityDivIcon(city.name, city.pos)}
                interactive={false}
              />
            ))}

            {/* State & Regional Overview Labels across India */}
            {REGION_NAMES.map((r) => (
              <Marker
                key={r.name}
                position={[r.lat, r.lng]}
                icon={getRegionLabelDivIcon(r.name, r.type)}
                interactive={false}
              />
            ))}
          </>
        )}

        {/* 
          LEVEL OF DETAIL (LOD) 1: MACRO REGIONAL BELTS (Shown at National Zoom <= 6)
          Aggregated national hazard regions following major mountain ranges & flood fans
        */}
        {layers.hazardZones && currentZoom <= 6 && INDIA_MACRO_REGIONAL_BELTS.map((belt) => {
          const isEmphasized = mode === 'all' ||
            (mode === 'landslide' && (belt.hazardType === 'landslide' || belt.hazardType === 'mixed')) ||
            (mode === 'flash_flood' && (belt.hazardType === 'flash_flood' || belt.hazardType === 'mixed'));

          if (!isEmphasized) return null;
          if (belt.hazardType === 'landslide' && !layers.landslideRisk) return null;
          if (belt.hazardType === 'flash_flood' && !layers.floodRisk) return null;

          const positions = belt.coordinates.map(([lng, lat]) => [lat, lng]);
          const beltColor = belt.riskLevel === 'CRITICAL' ? '#ef4444' : belt.riskLevel === 'WARNING' ? '#f97316' : '#eab308';

          return (
            <Polygon
              key={belt.id}
              positions={positions}
              pathOptions={{
                color: beltColor,
                weight: 2,
                fillColor: beltColor,
                fillOpacity: 0.28,
                opacity: 0.85,
                dashArray: '4, 4'
              }}
              eventHandlers={{
                click: () => onSelect && onSelect(belt.id)
              }}
            >
              <Popup className="dark-hazard-popup">
                <div style={{ padding: '6px', minWidth: '220px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff', marginBottom: '4px' }}>
                    {belt.name}
                  </div>
                  <div style={{
                    display: 'inline-block',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: belt.riskLevel === 'CRITICAL' ? 'rgba(239,68,68,0.3)' : 'rgba(249,115,22,0.3)',
                    color: belt.riskLevel === 'CRITICAL' ? '#f87171' : '#fb923c',
                    marginBottom: '6px'
                  }}>
                    NATIONAL SUSCEPTIBILITY BELT • {belt.riskLevel} ({belt.score}/100)
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                    Aggregated macro terrain corridor. Zoom in to inspect detailed state/district-level risk polygons and active monitoring nodes.
                  </div>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {/* 
          LEVEL OF DETAIL (LOD) 2: STATE & DISTRICT-LEVEL HAZARD ZONES (Shown at Zoom >= 6)
          36+ Realistic GeoJSON Polygons along mountainous & flood corridors
        */}
        {layers.hazardZones && currentZoom >= 6 && HAZARD_ZONES_DATA.map((zone) => {
          if (zone.primaryHazard === 'landslide' && !layers.landslideRisk) return null;
          if (zone.primaryHazard === 'flash_flood' && !layers.floodRisk) return null;

          return (
            <HazardZone
              key={zone.id}
              zone={zone}
              onSelect={onSelect}
              mode={mode}
            />
          );
        })}

        {/* 
          LEVEL OF DETAIL (LOD) 3: INDIVIDUAL HAZARD MARKERS (Shown across India)
          Interactive Markers with custom Landslide, Flash Flood, and Safe Haven icons
        */}
        {visibleMarkers.map((marker) => (
          <HazardMarker
            key={marker.id}
            marker={marker}
            onSelect={onSelect}
            mode={mode}
          />
        ))}

        {/* 
          LEVEL OF DETAIL (LOD) 4: RAINFALL & HYDROLOGICAL STATIONS (Shown at Zoom >= 7)
          Automated Telemetry Stations reporting live precipitation & river stages
        */}
        {layers.rainfallStations && currentZoom >= 7 && RAINFALL_STATIONS_DATA.map((st) => (
          <WeatherStation
            key={st.id}
            station={st}
            onSelect={onSelect}
          />
        ))}
      </MapContainer>
    </div>
  );
}
