import { useState, useEffect } from 'react';
import RainfallTrendChart from './RainfallTrendChart';
import RiverLevelChart from './RiverLevelChart';
import SoilMoistureChart from './SoilMoistureChart';
import LiveMonitoringCard from './LiveMonitoringCard';
import QuickActions from './QuickActions';
import { getLocationWeather } from '../../services/weatherService';

export default function AnalyticsSection({
  selectedLocation,
  mode = 'landslide',
  onNavigateToMap,
  onTriggerToast
}) {
  const [weather, setWeather] = useState(null);

  // Fetch or reuse cached weather for current coordinates
  useEffect(() => {
    let active = true;
    if (selectedLocation?.lat && selectedLocation?.lng) {
      getLocationWeather(selectedLocation.lat, selectedLocation.lng)
        .then(data => {
          if (active && data) setWeather(data);
        })
        .catch(() => {});
    }
    return () => {
      active = false;
    };
  }, [selectedLocation?.lat, selectedLocation?.lng]);

  return (
    <div
      className="dashboard-analytics-section"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        marginTop: '6px'
      }}
    >
      {/* SECTION DIVIDER WITH SUBTLE LABEL */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0 2px 0' }}>
        <div style={{ height: '1px', flex: 1, background: 'rgba(255, 255, 255, 0.1)' }} />
        <span style={{
          fontSize: '0.72rem',
          fontWeight: 800,
          color: '#38bdf8',
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          background: 'rgba(56, 189, 248, 0.1)',
          padding: '2px 10px',
          borderRadius: '12px',
          border: '1px solid rgba(56, 189, 248, 0.2)'
        }}>
          Hydro-Meteorological Telemetry & Sentinel Observations
        </span>
        <div style={{ height: '1px', flex: 1, background: 'rgba(255, 255, 255, 0.1)' }} />
      </div>

      {/* 
        3-CARD HORIZONTAL ANALYTICS GRID
        Desktop: 3 columns | Tablet: 2 columns | Mobile: 1 column
        Equal height cards
      */}
      <div
        className="analytics-charts-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '16px',
          alignItems: 'stretch'
        }}
      >
        {/* Card 1: 7 Day Rainfall Trend */}
        <RainfallTrendChart selectedLocation={selectedLocation} />

        {/* Card 2: River Water Level */}
        <RiverLevelChart selectedLocation={selectedLocation} />

        {/* Card 3: Soil Moisture & Temperature */}
        <SoilMoistureChart
          selectedLocation={selectedLocation}
          currentWeather={weather}
        />
      </div>

      {/* SECTION 4: LIVE CAMERAS & SATELLITE VIEW */}
      <LiveMonitoringCard
        selectedLocation={selectedLocation}
        onNavigateToMap={onNavigateToMap}
      />

      {/* SECTION 5: QUICK ACTIONS */}
      <QuickActions
        selectedLocation={selectedLocation}
        onNavigateToMap={onNavigateToMap}
        onTriggerToast={onTriggerToast}
      />
    </div>
  );
}
