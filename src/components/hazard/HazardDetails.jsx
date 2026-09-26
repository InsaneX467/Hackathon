import { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Droplets, 
  Wind, 
  Mountain, 
  Waves, 
  ShieldAlert, 
  Radio, 
  Compass, 
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';

import { getLocationWeather } from '../../services/weatherService';
import { calculateLocationRisk } from '../../services/riskEngine';
import { MONITORED_LOCATIONS, findLocationById } from '../../data/locations';

export default function HazardDetails({
  selectedLocation,
  onSelectLocation,
  mode = 'landslide',
  lastUpdatedTime
}) {
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'forecast' | 'terrain'

  // Fetch real Open-Meteo weather when selected location changes
  useEffect(() => {
    let isMounted = true;
    if (!selectedLocation || !selectedLocation.lat || !selectedLocation.lng) return;

    setLoadingWeather(true);
    getLocationWeather(selectedLocation.lat, selectedLocation.lng)
      .then((data) => {
        if (isMounted) {
          setWeather(data);
          setLoadingWeather(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingWeather(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedLocation?.lat, selectedLocation?.lng]);

  const loc = selectedLocation || MONITORED_LOCATIONS[0];

  // Dynamic Risk Engine Assessment
  const risk = calculateLocationRisk({
    rainfall: weather?.precipitation || loc.rain || 14,
    slope: loc.slope || 20,
    elevation: loc.elevation || 110,
    riverProximityKm: loc.riverProximityKm || 2.0,
    soilMoisture: loc.moisture || weather?.humidity || 75,
    historicalFloodRisk: loc.historicalFloodRisk || 0.6,
    historicalLandslideRisk: loc.historicalLandslideRisk || 0.6,
    mode
  });

  // Dynamic Nearby Locations
  const nearbyLocations = (loc.nearbyIds || [])
    .map(id => findLocationById(id))
    .filter(Boolean)
    .slice(0, 4);

  // Fallback if no nearbyIds defined
  const displayedNearby = nearbyLocations.length > 0
    ? nearbyLocations
    : MONITORED_LOCATIONS.filter(l => l.id !== loc.id).slice(0, 4);

  return (
    <div
      className="hazard-details-panel"
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      {/* 1. LOCATION HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              LOCATION MONITORED
            </span>
            <span style={{ fontSize: '0.65rem', background: '#e0f2fe', color: '#0369a1', padding: '1px 6px', borderRadius: '10px', fontWeight: 700 }}>
              GIS NODE
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '2px 0 0 0', color: '#0f172a' }}>
            {loc.name}
          </h2>
          <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
            {loc.district ? `${loc.district}, ` : ''}{loc.state || 'India'} • {loc.elevation ? `${loc.elevation}m ASL` : 'Valley'}
          </div>
        </div>

        {/* Risk Badge */}
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              padding: '4px 12px',
              borderRadius: '20px',
              background: `${risk.overallLevel.color}15`,
              color: risk.overallLevel.color,
              fontWeight: 800,
              fontSize: '0.78rem',
              border: `1px solid ${risk.overallLevel.color}35`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{risk.overallLevel.badge}</span>
            <span>{risk.overallLevel.label} RISK</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
            Risk Score: <strong style={{ fontSize: '1.15rem', color: '#0f172a' }}>{risk.activeScore}</strong> / 100
          </div>
        </div>
      </div>

      {/* 2. DATA SOURCE & PROVENANCE BAR */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '0.74rem',
          color: '#64748b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '6px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Radio size={13} color="#16a34a" />
          <span>Weather: <strong style={{ color: '#0f172a' }}>Open-Meteo Live API</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={13} color="#f59e0b" />
          <span>Model: <strong style={{ color: '#0f172a' }}>Demonstration</strong></span>
        </div>
        <span style={{ color: '#16a34a', fontWeight: 700 }}>● LIVE</span>
      </div>

      {/* 3. SUB-TABS */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '6px 12px',
            border: 'none',
            background: 'transparent',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            color: activeTab === 'overview' ? '#0284c7' : '#64748b',
            borderBottom: activeTab === 'overview' ? '2px solid #0284c7' : 'none'
          }}
        >
          Current Conditions
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('forecast')}
          style={{
            padding: '6px 12px',
            border: 'none',
            background: 'transparent',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            color: activeTab === 'forecast' ? '#0284c7' : '#64748b',
            borderBottom: activeTab === 'forecast' ? '2px solid #0284c7' : 'none'
          }}
        >
          Hourly Forecast
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('terrain')}
          style={{
            padding: '6px 12px',
            border: 'none',
            background: 'transparent',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            color: activeTab === 'terrain' ? '#0284c7' : '#64748b',
            borderBottom: activeTab === 'terrain' ? '2px solid #0284c7' : 'none'
          }}
        >
          Terrain & Hydro
        </button>
      </div>

      {/* 4. CURRENT CONDITIONS TAB */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Weather Primary Stat Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                CURRENT WEATHER
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                {loadingWeather ? '...' : `${weather?.temperature ?? 26}°C`}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                {weather?.condition || 'Overcast / Monitored'} • Feels like {weather?.apparentTemperature ?? 27}°C
              </div>
            </div>
            <div style={{ fontSize: '2.4rem' }}>
              {weather?.conditionIcon || '🌦️'}
            </div>
          </div>

          {/* 4-Grid Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.75rem', marginBottom: '4px' }}>
                <CloudRain size={14} color="#0284c7" />
                <span>Precipitation</span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                {weather?.precipitation ?? 12.4} mm
              </div>
              <div style={{ fontSize: '0.7rem', color: '#16a34a' }}>
                Trend: Increasing ↑
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.75rem', marginBottom: '4px' }}>
                <Droplets size={14} color="#0ea5e9" />
                <span>Relative Humidity</span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                {weather?.humidity ?? 82}%
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Soil Saturation: High
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.75rem', marginBottom: '4px' }}>
                <Wind size={14} color="#64748b" />
                <span>Wind Speed</span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                {weather?.windSpeed ?? 8} km/h
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Direction: {weather?.windDirection ?? 120}° ESE
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.75rem', marginBottom: '4px' }}>
                <Mountain size={14} color="#d97706" />
                <span>Terrain Slope</span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                {loc.slope ?? 22}°
              </div>
              <div style={{ fontSize: '0.7rem', color: loc.slope > 35 ? '#ef4444' : '#16a34a' }}>
                {loc.slope > 35 ? '⚠ Steep Incline' : '✓ Normal Incline'}
              </div>
            </div>
          </div>

          {/* Risk Assessment Breakdown */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
              HAZARD SUSCEPTIBILITY (DEMONSTRATION MODEL)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldAlert size={14} color="#ef4444" /> Landslide Risk
                </span>
                <span style={{ fontWeight: 800, fontSize: '0.82rem', color: risk.landslideLevel.color }}>
                  {risk.landslideLevel.label} ({risk.landslideScore}/100)
                </span>
              </div>
              <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${risk.landslideScore}%`, height: '100%', background: risk.landslideLevel.color, borderRadius: '3px' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Waves size={14} color="#0284c7" /> Flood / Surge Risk
                </span>
                <span style={{ fontWeight: 800, fontSize: '0.82rem', color: risk.floodLevel.color }}>
                  {risk.floodLevel.label} ({risk.floodScore}/100)
                </span>
              </div>
              <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${risk.floodScore}%`, height: '100%', background: risk.floodLevel.color, borderRadius: '3px' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. HOURLY FORECAST TAB */}
      {activeTab === 'forecast' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
            Next 12-hour precipitation forecast from Open-Meteo API:
          </div>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
            {(weather?.hourly || []).map((h, idx) => (
              <div
                key={idx}
                style={{
                  minWidth: '68px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px 4px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{h.time}</span>
                <span style={{ fontSize: '1.2rem' }}>{h.condition?.icon || '🌧️'}</span>
                <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a' }}>{h.temp}°C</span>
                <span style={{ fontSize: '0.68rem', color: '#0284c7', fontWeight: 600 }}>{h.rain}mm</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TERRAIN & HYDRO TAB */}
      {activeTab === 'terrain' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
            <span style={{ color: '#64748b' }}>Waterbody Proximity:</span>
            <strong style={{ color: '#0f172a' }}>{loc.riverName || 'Brahmaputra Basin'} ({loc.riverProximityKm || 1.2} km)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
            <span style={{ color: '#64748b' }}>Current Stage Level:</span>
            <strong style={{ color: (loc.riverLevel || 3) > (loc.warningMark || 2.8) ? '#dc2626' : '#0f172a' }}>
              {loc.riverLevel ? `${loc.riverLevel} m` : '1.4 m'}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
            <span style={{ color: '#64748b' }}>Danger Mark:</span>
            <strong style={{ color: '#64748b' }}>{loc.dangerMark ? `${loc.dangerMark} m` : '4.5 m'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
            <span style={{ color: '#64748b' }}>Soil Stability Index:</span>
            <strong style={{ color: '#d97706' }}>{Math.round((loc.soilRisk || 0.75) * 100)} / 100</strong>
          </div>
        </div>
      )}

      {/* 7. DYNAMIC NEARBY AREAS */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h4 style={{ fontSize: '0.78rem', fontWeight: 800, margin: 0, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            NEARBY MONITORED AREAS
          </h4>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Click to inspect</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {displayedNearby.map((nearby) => {
            const isCrit = (nearby.slope || 20) > 35 || (nearby.historicalFloodRisk || 0.5) > 0.8;
            return (
              <div
                key={nearby.id}
                onClick={() => onSelectLocation && onSelectLocation(nearby.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                    {nearby.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    {nearby.district || nearby.state || 'India'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: isCrit ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: isCrit ? '#dc2626' : '#d97706'
                    }}
                  >
                    {isCrit ? 'CRITICAL' : 'WATCH'}
                  </span>
                  <ArrowUpRight size={14} color="#94a3b8" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
