import { Marker, Popup } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';
import { getLocationWeather } from '../../services/weatherService';

const weatherStationIcon = L.divIcon({
  className: 'hazard-custom-icon',
  iconSize: [28, 32],
  iconAnchor: [14, 30],
  popupAnchor: [0, -28],
  html: `
    <div class="pulse-station" style="width: 28px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; filter: drop-shadow(0 3px 10px rgba(2, 132, 199, 0.85)); transition: transform 0.2s ease;">
      <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
        <path d="M14 2 C14 2 24 13.5 24 19.5 C24 25.3 19.5 30 14 30 C8.5 30 4 25.3 4 19.5 C4 13.5 14 2 14 2 Z" fill="#0284c7" stroke="#ffffff" stroke-width="1.3"/>
        <path d="M14 11 C14 11 19 17 19 20.5 C19 23.3 16.8 25.5 14 25.5 C11.2 25.5 9 23.3 9 20.5 C9 17 14 11 14 11 Z" fill="#ffffff"/>
      </svg>
    </div>
  `
});

export default function WeatherStation({ station, onSelect }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpenPopup = async () => {
    if (!weather && !loading) {
      setLoading(true);
      const data = await getLocationWeather(station.lat, station.lng);
      setWeather(data);
      setLoading(false);
    }
  };

  return (
    <Marker
      position={[station.lat, station.lng]}
      icon={weatherStationIcon}
      eventHandlers={{
        click: () => {
          handleOpenPopup();
          if (onSelect) onSelect(station.id);
        }
      }}
    >
      <Popup className="dark-hazard-popup">
        <div style={{ padding: '8px', minWidth: '220px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '6px', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
              {station.name}
            </span>
            <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700 }}>
              ● LIVE
            </span>
          </div>

          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '6px' }}>
            {station.district}, {station.state} • Elev. {station.elevation}m
          </div>

          {loading ? (
            <div style={{ padding: '12px 0', textAlign: 'center', color: '#94a3b8', fontSize: '0.78rem' }}>
              Fetching real-time Open-Meteo telemetry...
            </div>
          ) : weather ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: '#e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(2, 132, 199, 0.15)', padding: '6px 8px', borderRadius: '6px' }}>
                <span style={{ fontSize: '1.2rem' }}>{weather.conditionIcon}</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ffffff' }}>{weather.temperature}°C</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{weather.condition}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.75rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 6px', borderRadius: '4px' }}>
                  <span style={{ color: '#94a3b8' }}>Precipitation:</span>
                  <div style={{ fontWeight: 700, color: '#38bdf8' }}>{weather.precipitation} mm</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 6px', borderRadius: '4px' }}>
                  <span style={{ color: '#94a3b8' }}>Humidity:</span>
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>{weather.humidity}%</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 6px', borderRadius: '4px' }}>
                  <span style={{ color: '#94a3b8' }}>Wind:</span>
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>{weather.windSpeed} km/h</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 6px', borderRadius: '4px' }}>
                  <span style={{ color: '#94a3b8' }}>Sensors:</span>
                  <div style={{ fontWeight: 700, color: '#10b981' }}>Active</div>
                </div>
              </div>

              <div style={{ fontSize: '0.68rem', color: '#6ee7b7', marginTop: '4px', textAlign: 'right' }}>
                ● Updated just now (Open-Meteo API)
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Click to poll real-time rainfall & atmospheric telemetry.
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
