import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MapPanel from './components/MapPanel';
import ControlsPanel from './components/ControlsPanel';
import ModelInformationPage from './components/ModelInformationPage';
import DataSourcesPage from './components/DataSourcesPage';
import SystemHealthPage from './components/SystemHealthPage';
import SettingsPage from './components/SettingsPage';
import SelectedLocationCard from './components/SelectedLocationCard';
import TopSummaryCards from './components/TopSummaryCards';
import RiskList from './components/RiskList';
import AlertsLog from './components/AlertsLog';
import TrendChart from './components/TrendChart';
import Toast from './components/Toast';
import AlertBanner from './components/AlertBanner';
import ErrorBoundary from './components/ErrorBoundary';
import { INITIAL_REALTIME_ALERTS, fetchLocationsWithRisk, fetchActiveAlerts } from './services/telemetryService';
import { Info } from 'lucide-react';

const INITIAL_VILLAGES = [
  { 
    id: 'v1', name: 'Joshimath Ward 1', lat: 30.5506, lng: 79.5660, 
    rain: 126, moisture: 87, slope: 41,
    riverLevel: 2.4, warningMark: 3.2, dangerMark: 4.2, riverRiseRate: 1.5, discharge: 52,
    shelter: { name: 'Joshimath Govt Secondary School & Relief Camp', dist: '1.1 km', elevation: '+120m', capacity: 450, occupancy: '80 Beds Occupied', route: 'Take North Ridge Route 1B' },
    historicalData: { flood10yr: 3.5, flood50yr: 4.9, flood100yr: 6.2, maxHistorical2013: 5.6, maxHistorical2021: 4.8 }
  },
  { 
    id: 'v2', name: 'Tapovan', lat: 30.4900, lng: 79.6200, 
    rain: 45, moisture: 62, slope: 38,
    riverLevel: 2.1, warningMark: 3.5, dangerMark: 4.5, riverRiseRate: 3.0, discharge: 78,
    shelter: { name: 'Tapovan Tunnel Ridge Community Shelter', dist: '0.8 km', elevation: '+160m', capacity: 300, occupancy: '45 Beds Occupied', route: 'Ascend Eastern Bypass Trail' },
    historicalData: { flood10yr: 3.8, flood50yr: 5.2, flood100yr: 6.6, maxHistorical2013: 5.9, maxHistorical2021: 5.1 }
  },
  { 
    id: 'v3', name: 'Reni Village', lat: 30.4850, lng: 79.6900, 
    rain: 82, moisture: 78, slope: 44,
    riverLevel: 2.8, warningMark: 3.4, dangerMark: 4.2, riverRiseRate: 4.5, discharge: 110,
    shelter: { name: 'Reni Hilltop Primary School Relief Center', dist: '1.4 km', elevation: '+210m', capacity: 350, occupancy: '110 Beds Occupied', route: 'Take Upper Reni Forest Pathway' },
    historicalData: { flood10yr: 3.6, flood50yr: 5.0, flood100yr: 6.4, maxHistorical2013: 5.8, maxHistorical2021: 5.3 }
  },
  { 
    id: 'v4', name: 'Auli', lat: 30.5300, lng: 79.5700, 
    rain: 32, moisture: 54, slope: 32,
    riverLevel: 1.2, warningMark: 3.0, dangerMark: 4.0, riverRiseRate: 0.5, discharge: 32,
    shelter: { name: 'Auli High Altitude Sports Complex Shelter', dist: '0.5 km', elevation: '+290m', capacity: 800, occupancy: '60 Beds Occupied', route: 'Auli Cable Car Bypass Road' },
    historicalData: { flood10yr: 3.2, flood50yr: 4.5, flood100yr: 5.8, maxHistorical2013: 5.1, maxHistorical2021: 4.2 }
  },
  { 
    id: 'v5', name: 'Pipalkoti', lat: 30.4300, lng: 79.4300, 
    rain: 28, moisture: 48, slope: 28,
    riverLevel: 1.5, warningMark: 3.3, dangerMark: 4.3, riverRiseRate: 1.2, discharge: 45,
    shelter: { name: 'Pipalkoti College Relief Camp', dist: '0.9 km', elevation: '+110m', capacity: 500, occupancy: '75 Beds Occupied', route: 'Highway Bypass 7' },
    historicalData: { flood10yr: 3.4, flood50yr: 4.7, flood100yr: 6.0, maxHistorical2013: 5.3, maxHistorical2021: 4.5 }
  },
  { 
    id: 'v6', name: 'Helang', lat: 30.5100, lng: 79.5100, 
    rain: 18, moisture: 36, slope: 24,
    riverLevel: 1.4, warningMark: 3.1, dangerMark: 4.1, riverRiseRate: 0.8, discharge: 38,
    shelter: { name: 'Helang Upper Ridge Shelter', dist: '1.0 km', elevation: '+130m', capacity: 250, occupancy: '30 Beds Occupied', route: 'Western Ridge Track' },
    historicalData: { flood10yr: 3.3, flood50yr: 4.6, flood100yr: 5.9, maxHistorical2013: 5.2, maxHistorical2021: 4.4 }
  },
  { 
    id: 'v7', name: 'Lata', lat: 30.4950, lng: 79.7200, 
    rain: 14, moisture: 30, slope: 22,
    riverLevel: 1.1, warningMark: 3.2, dangerMark: 4.0, riverRiseRate: 0.4, discharge: 25,
    shelter: { name: 'Lata Nanda Devi Biosphere Ridge Camp', dist: '1.6 km', elevation: '+250m', capacity: 600, occupancy: '140 Beds Occupied', route: 'Lata Sanctuary Trail' },
    historicalData: { flood10yr: 3.5, flood50yr: 4.8, flood100yr: 6.1, maxHistorical2013: 5.5, maxHistorical2021: 4.7 }
  },
  { 
    id: 'v8', name: 'Gopeshwar', lat: 30.4100, lng: 79.3200, 
    rain: 12, moisture: 28, slope: 20,
    riverLevel: 1.3, warningMark: 3.5, dangerMark: 4.6, riverRiseRate: 0.4, discharge: 40,
    shelter: { name: 'Gopeshwar Municipal Stadium Shelter', dist: '0.7 km', elevation: '+80m', capacity: 700, occupancy: '90 Beds Occupied', route: 'District Hospital Main Road' },
    historicalData: { flood10yr: 3.7, flood50yr: 5.1, flood100yr: 6.5, maxHistorical2013: 5.7, maxHistorical2021: 4.8 }
  }
];

function calculateRisk(v, mode = 'landslide') {
  const rain = v.rain || 0;
  const moisture = v.moisture || 0;
  const slope = v.slope || 30;
  const riverLevel = v.riverLevel || 1.4;
  const dangerMark = v.dangerMark || 4.0;

  if (mode === 'flash_flood') {
    const normRain = Math.min(rain / 120, 1);
    const normRiver = Math.min(riverLevel / dangerMark, 1);
    const normMoisture = Math.min(moisture / 100, 1);
    const score = (normRiver * 0.45) + (normRain * 0.35) + (normMoisture * 0.20);
    return Math.round(score * 100);
  } else {
    const normRain = Math.min(rain / 130, 1);
    const normMoisture = Math.min(moisture / 100, 1);
    const normSlope = Math.min(slope / 60, 1);
    const score = (normRain * 0.40) + (normMoisture * 0.35) + (normSlope * 0.25);
    return Math.round(score * 100);
  }
}

function getRiskCategory(score) {
  if (score < 40) return { label: 'LOW', color: '#10b981', hex: '#10b981' };
  if (score < 60) return { label: 'WATCH', color: '#f59e0b', hex: '#f59e0b' };
  if (score < 80) return { label: 'WARNING', color: '#f97316', hex: '#f97316' };
  return { label: 'CRITICAL', color: '#ef4444', hex: '#ef4444' };
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [activeMode, setActiveMode] = useState('landslide');
  const [selectedVillageId, setSelectedVillageId] = useState('v1');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdatedTime, setLastUpdatedTime] = useState(new Date());

  const [theme, setTheme] = useState(() => localStorage.getItem('bhoomirakshak_theme') || 'light');
  const [sirenEnabled, setSirenEnabled] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(15);

  const [villages, setVillages] = useState(() => 
    INITIAL_VILLAGES.map(v => {
      const score = calculateRisk(v, 'landslide');
      return { ...v, score, cat: getRiskCategory(score) };
    })
  );

  const [alerts, setAlerts] = useState(INITIAL_REALTIME_ALERTS);
  const [toasts, setToasts] = useState([]);

  const fetchLiveData = async () => {
    try {
      const [backendLocs, backendAlerts] = await Promise.all([
        fetchLocationsWithRisk(),
        fetchActiveAlerts()
      ]);

      if (backendLocs && Array.isArray(backendLocs)) {
        setVillages(prev => {
          return prev.map(v => {
            const locData = backendLocs.find(l => l.id === v.id);
            if (!locData) return v;

            const hazardRisk = activeMode === 'flash_flood' 
              ? locData.flashFloodRisk 
              : locData.landslideRisk;

            const score = (hazardRisk && typeof hazardRisk.score === 'number') 
              ? hazardRisk.score 
              : calculateRisk({ ...v, ...locData }, activeMode);

            const cat = hazardRisk?.category 
              ? { label: hazardRisk.category, color: hazardRisk.color, hex: hazardRisk.color }
              : getRiskCategory(score);

            return {
              ...v,
              ...locData,
              score,
              cat,
              landslideRisk: locData.landslideRisk,
              flashFloodRisk: locData.flashFloodRisk
            };
          });
        });
        setLastUpdatedTime(new Date());
      }

      if (backendAlerts && Array.isArray(backendAlerts)) {
        setAlerts(backendAlerts);
      }
    } catch (e) {
      console.warn('Real-time sync warning:', e);
    }
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [activeMode, refreshInterval]);

  const handleToggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('bhoomirakshak_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleRefreshTelemetry = () => {
    fetchLiveData();
  };

  const selectedVillage = villages.find(v => v.id === selectedVillageId) || villages[0];
  const activeAlertsCount = alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH' || a.critical).length;

  return (
    <div className="app-viewport-container" data-theme={theme} style={{
      display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh',
      background: theme === 'dark' ? '#090d16' : '#f8fafc',
      color: theme === 'dark' ? '#f8fafc' : '#0f172a',
      overflow: 'hidden'
    }}>
      <Toast toasts={toasts} onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      {/* LEFT SIDEBAR NAVIGATION */}
      <Sidebar 
        activePage={activePage} 
        onPageChange={setActivePage} 
        activeAlertsCount={activeAlertsCount}
      />

      {/* MAIN VIEWPORT CONTAINER */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', width: 'calc(100vw - 240px)', overflow: 'hidden' }}>
        
        {/* Top Operational Header */}
        <Header 
          villages={villages} 
          alerts={alerts} 
          mode={activeMode} 
          lastUpdatedTime={lastUpdatedTime}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Content Body View Wrapped in ErrorBoundary */}
        <div className="main-content-viewport" style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ErrorBoundary>
            {activePage === 'datasources' && <DataSourcesPage />}

            {activePage === 'modelinfo' && <ModelInformationPage />}

            {activePage === 'systemhealth' && <SystemHealthPage />}

            {activePage === 'settings' && (
              <SettingsPage 
                theme={theme}
                onToggleTheme={handleToggleTheme}
                sirenEnabled={sirenEnabled}
                onToggleSiren={setSirenEnabled}
                refreshInterval={refreshInterval}
                onRefreshIntervalChange={setRefreshInterval}
              />
            )}


            {activePage === 'locations' && (
              <RiskList 
                villages={villages} 
                selectedId={selectedVillageId} 
                onSelect={(id) => setSelectedVillageId(id)} 
                onFocusMap={(id) => {
                  setSelectedVillageId(id);
                  setActivePage('dashboard');
                }}
                mode={activeMode}
              />
            )}

            {activePage === 'alerts' && (
              <div style={{ flex: 1, background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px' }}>
                <AlertsLog alerts={alerts} onClearAlerts={() => setAlerts([])} />
              </div>
            )}

            {activePage === 'analytics' && (
              <TrendChart village={selectedVillage} mode={activeMode} />
            )}

            {activePage === 'map' && (
              <div style={{ flex: 1, minHeight: '520px', borderRadius: '12px', overflow: 'hidden' }}>
                <MapPanel 
                  villages={villages} 
                  selectedId={selectedVillageId} 
                  onSelect={setSelectedVillageId} 
                  mode={activeMode}
                  lastUpdatedTime={lastUpdatedTime}
                />
              </div>
            )}

            {activePage === 'dashboard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                
                {/* 1. TOP SUMMARY CARDS (6 Cards) */}
                <TopSummaryCards 
                  villages={villages}
                  alerts={alerts}
                  lastUpdatedTime={lastUpdatedTime}
                />

                {/* 2. CRITICAL EMERGENCY ALERT BANNER */}
                <AlertBanner 
                  activeAlerts={alerts} 
                  onSelectLocation={(id) => {
                    setSelectedVillageId(id);
                    setActivePage('dashboard');
                  }}
                />

                {/* 3. MAIN OPERATIONAL GRID (MAP 65% : DATA 35%) */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '65% 35%', 
                  gap: '16px', 
                  flex: 1,
                  minHeight: '480px' 
                }}>
                  
                  {/* Central Map Panel (65% width) */}
                  <MapPanel 
                    villages={villages} 
                    selectedId={selectedVillageId} 
                    onSelect={setSelectedVillageId} 
                    mode={activeMode}
                    lastUpdatedTime={lastUpdatedTime}
                  />

                  {/* Selected Location Panel & Nearby Areas (35% width) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
                    <SelectedLocationCard 
                      village={selectedVillage} 
                      villages={villages}
                      onSelectVillage={setSelectedVillageId}
                      mode={activeMode}
                      lastUpdatedTime={lastUpdatedTime}
                    />
                  </div>
                </div>
              </div>
            )}
          </ErrorBoundary>
        </div>

        {/* Global Command Footer Bar */}
        <footer style={{
          background: '#0f172a',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '6px 16px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          fontSize: '0.725rem',
          color: '#94a3b8'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <span style={{ color: '#38bdf8' }}>BHOOMIRAKSHAK</span>
            <span>|</span>
            <span>Protecting Communities, Saving Lives</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>Data Sources: <strong>IoT Sensors</strong> | <strong>IMD</strong> | <strong>CWC</strong> | <strong>IndLands</strong> | <strong>SDMA</strong></span>
            <Info size={13} color="#38bdf8" />
          </div>
        </footer>

        {/* Telemetry Status Bar */}
        <ControlsPanel 
          village={selectedVillage}
          onRefreshData={handleRefreshTelemetry}
          lastUpdatedTime={lastUpdatedTime}
          mode={activeMode}
        />
      </div>
    </div>
  );
}
