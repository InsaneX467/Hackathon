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
import { MONITORED_LOCATIONS, findLocationById } from './data/locations';
import AnalyticsSection from './components/analytics/AnalyticsSection';
import { Info } from 'lucide-react';

const INITIAL_VILLAGES = [
  // Primary Assam & Northeast Focus Sector (Dhemaji, Lakhimpur, Dibrugarh, Tinsukia)
  { 
    id: 'loc_dhemaji', name: 'Dhemaji', lat: 27.4816, lng: 94.5828, 
    rain: 124, moisture: 89, slope: 41,
    riverLevel: 87.4, warningMark: 86.8, dangerMark: 87.5, riverRiseRate: 1.8, discharge: 4600,
    shelter: { name: 'Dhemaji Higher Secondary Relief Center', dist: '0.8 km', elevation: '+25m', capacity: 1200, occupancy: '340 Beds Occupied', route: 'Take Northern High Embankment Bypass' },
    historicalData: { flood10yr: 87.2, flood50yr: 88.0, flood100yr: 88.8, maxHistorical2013: 87.9, maxHistorical2022: 88.2 }
  },
  { 
    id: 'loc_lakhimpur', name: 'North Lakhimpur', lat: 27.2368, lng: 94.1037, 
    rain: 88, moisture: 81, slope: 28,
    riverLevel: 3.4, warningMark: 3.2, dangerMark: 4.1, riverRiseRate: 1.2, discharge: 2400,
    shelter: { name: 'Lakhimpur Town Emergency Shelter', dist: '1.2 km', elevation: '+18m', capacity: 900, occupancy: '210 Beds Occupied', route: 'Subansiri Trunk Road Bypass' },
    historicalData: { flood10yr: 3.8, flood50yr: 4.5, flood100yr: 5.2, maxHistorical2013: 4.2, maxHistorical2020: 4.7 }
  },
  { 
    id: 'loc_dibrugarh', name: 'Dibrugarh', lat: 27.4728, lng: 94.9120, 
    rain: 115, moisture: 87, slope: 38,
    riverLevel: 105.8, warningMark: 105.2, dangerMark: 105.7, riverRiseRate: 2.1, discharge: 5800,
    shelter: { name: 'Dibrugarh University Relief Hall', dist: '1.5 km', elevation: '+32m', capacity: 1500, occupancy: '480 Beds Occupied', route: 'National Highway 37 High Corridor' },
    historicalData: { flood10yr: 105.9, flood50yr: 106.8, flood100yr: 107.5, maxHistorical2013: 106.2, maxHistorical2024: 106.5 }
  },
  { 
    id: 'loc_tinsukia', name: 'Tinsukia', lat: 27.5000, lng: 95.3667, 
    rain: 102, moisture: 84, slope: 34,
    riverLevel: 4.1, warningMark: 3.8, dangerMark: 4.8, riverRiseRate: 1.4, discharge: 3100,
    shelter: { name: 'Tinsukia Stadium Relief Camp', dist: '0.9 km', elevation: '+22m', capacity: 1100, occupancy: '190 Beds Occupied', route: 'Makum Bypass Trail' },
    historicalData: { flood10yr: 4.4, flood50yr: 5.1, flood100yr: 5.9, maxHistorical2013: 4.7, maxHistorical2021: 5.2 }
  },
  // Uttarakhand & Himalayan Wards (v1 - v8)
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
  },

  // Assam & North-East India Monitored Locations (v9 - v20)
  {
    id: 'v9', name: 'Guwahati (Brahmaputra Bank)', lat: 26.1445, lng: 91.7362,
    rain: 95, moisture: 82, slope: 28,
    riverLevel: 48.9, warningMark: 49.6, dangerMark: 50.5, riverRiseRate: 0.8, discharge: 4200,
    shelter: { name: 'Guwahati Cotton University Relief Center', dist: '1.2 km', elevation: '+45m', capacity: 1200, occupancy: '350 Beds Occupied', route: 'Take MG Road Bypass to University Campus' },
    historicalData: { flood10yr: 50.2, flood50yr: 51.4, flood100yr: 52.8, maxHistorical2013: 51.1, maxHistorical2021: 50.8 }
  },
  {
    id: 'v10', name: 'Silchar (Barak Basin)', lat: 24.8333, lng: 92.7789,
    rain: 115, moisture: 89, slope: 18,
    riverLevel: 19.8, warningMark: 19.8, dangerMark: 20.4, riverRiseRate: 1.2, discharge: 1850,
    shelter: { name: 'Silchar NIT Community Relief Camp', dist: '1.8 km', elevation: '+35m', capacity: 950, occupancy: '420 Beds Occupied', route: 'Take Trunk Road High Ground Bypass' },
    historicalData: { flood10yr: 20.5, flood50yr: 21.6, flood100yr: 22.4, maxHistorical2013: 21.2, maxHistorical2022: 21.9 }
  },
  {
    id: 'v11', name: 'Majuli River Island', lat: 26.9500, lng: 94.1667,
    rain: 88, moisture: 84, slope: 8,
    riverLevel: 86.4, warningMark: 86.5, dangerMark: 87.3, riverRiseRate: 1.4, discharge: 5600,
    shelter: { name: 'Garmur High Embankment Relief Camp', dist: '0.9 km', elevation: '+15m', capacity: 800, occupancy: '290 Beds Occupied', route: 'Follow Northern Embankment Track' },
    historicalData: { flood10yr: 87.2, flood50yr: 88.3, flood100yr: 89.1, maxHistorical2013: 87.9, maxHistorical2021: 87.5 }
  },
  {
    id: 'v12', name: 'Haflong (Dima Hasao)', lat: 25.1667, lng: 93.0167,
    rain: 105, moisture: 86, slope: 42,
    riverLevel: 3.2, warningMark: 4.0, dangerMark: 5.2, riverRiseRate: 2.1, discharge: 310,
    shelter: { name: 'Haflong District Sports Complex Shelter', dist: '0.7 km', elevation: '+510m', capacity: 500, occupancy: '110 Beds Occupied', route: 'Haflong Ridge Bypass Track' },
    historicalData: { flood10yr: 4.8, flood50yr: 6.0, flood100yr: 7.2, maxHistorical2013: 5.5, maxHistorical2022: 6.8 }
  },
  {
    id: 'v13', name: 'Cherrapunji (Sohra Ridge)', lat: 25.2833, lng: 91.7333,
    rain: 145, moisture: 92, slope: 46,
    riverLevel: 4.5, warningMark: 5.0, dangerMark: 6.5, riverRiseRate: 3.8, discharge: 840,
    shelter: { name: 'Sohra Civil Hospital High Altitude Camp', dist: '1.1 km', elevation: '+1430m', capacity: 650, occupancy: '210 Beds Occupied', route: 'Take Upper Plateau Bypass 2' },
    historicalData: { flood10yr: 6.2, flood50yr: 7.8, flood100yr: 9.1, maxHistorical2013: 7.1, maxHistorical2020: 8.4 }
  },
  {
    id: 'v14', name: 'Gangtok (Teesta Basin)', lat: 27.3389, lng: 88.6065,
    rain: 76, moisture: 79, slope: 45,
    riverLevel: 3.8, warningMark: 4.5, dangerMark: 5.8, riverRiseRate: 2.4, discharge: 620,
    shelter: { name: 'Gangtok Paljor Stadium Relief Center', dist: '0.8 km', elevation: '+1650m', capacity: 900, occupancy: '180 Beds Occupied', route: 'National Highway 10 Ridge Corridor' },
    historicalData: { flood10yr: 5.2, flood50yr: 6.8, flood100yr: 8.1, maxHistorical2013: 6.1, maxHistorical2023: 7.6 }
  },
  {
    id: 'v15', name: 'Aizawl (Slope Ward)', lat: 23.7271, lng: 92.7176,
    rain: 68, moisture: 72, slope: 43,
    riverLevel: 2.2, warningMark: 3.8, dangerMark: 4.8, riverRiseRate: 1.1, discharge: 190,
    shelter: { name: 'Aizawl Assam Rifles High Ground Camp', dist: '1.3 km', elevation: '+1130m', capacity: 700, occupancy: '95 Beds Occupied', route: 'Khatla Ridge Track' },
    historicalData: { flood10yr: 4.1, flood50yr: 5.4, flood100yr: 6.8, maxHistorical2013: 4.9, maxHistorical2022: 5.8 }
  },
  {
    id: 'v16', name: 'Itanagar (Dikrong Valley)', lat: 27.0844, lng: 93.6053,
    rain: 85, moisture: 77, slope: 39,
    riverLevel: 3.1, warningMark: 4.2, dangerMark: 5.5, riverRiseRate: 1.8, discharge: 480,
    shelter: { name: 'Itanagar Indira Gandhi Park Shelter', dist: '1.0 km', elevation: '+320m', capacity: 600, occupancy: '130 Beds Occupied', route: 'Bank Tinali Ridge Expressway' },
    historicalData: { flood10yr: 4.6, flood50yr: 5.9, flood100yr: 7.1, maxHistorical2013: 5.2, maxHistorical2021: 6.1 }
  },
  {
    id: 'v17', name: 'Kohima (Ridge Ward)', lat: 25.6701, lng: 94.1077,
    rain: 62, moisture: 68, slope: 40,
    riverLevel: 1.8, warningMark: 3.2, dangerMark: 4.2, riverRiseRate: 0.9, discharge: 140,
    shelter: { name: 'Kohima Local Ground High Relief Shelter', dist: '0.6 km', elevation: '+1440m', capacity: 500, occupancy: '70 Beds Occupied', route: 'Secretariat Road Bypass' },
    historicalData: { flood10yr: 3.5, flood50yr: 4.8, flood100yr: 6.0, maxHistorical2013: 4.1, maxHistorical2020: 5.2 }
  },
  {
    id: 'v18', name: 'Agartala (Haora Basin)', lat: 23.8315, lng: 91.2868,
    rain: 72, moisture: 75, slope: 14,
    riverLevel: 10.2, warningMark: 10.8, dangerMark: 11.5, riverRiseRate: 1.0, discharge: 520,
    shelter: { name: 'Agartala Umakanta Academy Shelter', dist: '1.5 km', elevation: '+28m', capacity: 850, occupancy: '240 Beds Occupied', route: 'VVIP Road High Embankment' },
    historicalData: { flood10yr: 11.0, flood50yr: 12.1, flood100yr: 13.2, maxHistorical2013: 11.6, maxHistorical2024: 12.4 }
  },
  {
    id: 'v19', name: 'Imphal (Imphal Valley)', lat: 24.8170, lng: 93.9368,
    rain: 90, moisture: 81, slope: 22,
    riverLevel: 785.2, warningMark: 786.0, dangerMark: 787.2, riverRiseRate: 1.5, discharge: 740,
    shelter: { name: 'Imphal Kangla Fort High Ground Camp', dist: '1.1 km', elevation: '+786m', capacity: 1000, occupancy: '310 Beds Occupied', route: 'Palace Compound Bypass Road' },
    historicalData: { flood10yr: 786.8, flood50yr: 788.0, flood100yr: 789.5, maxHistorical2013: 787.4, maxHistorical2024: 788.6 }
  },
  {
    id: 'v20', name: 'Kaziranga (Floodplain Ward)', lat: 26.5775, lng: 93.1711,
    rain: 110, moisture: 88, slope: 10,
    riverLevel: 74.8, warningMark: 75.0, dangerMark: 75.8, riverRiseRate: 2.2, discharge: 4900,
    shelter: { name: 'Kohora High Ridge Wildlife Relief Shelter', dist: '1.4 km', elevation: '+65m', capacity: 750, occupancy: '380 Beds Occupied', route: 'NH-37 Southern High Ridge Road' },
    historicalData: { flood10yr: 75.6, flood50yr: 76.8, flood100yr: 77.9, maxHistorical2013: 76.2, maxHistorical2020: 76.9 }
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

const NATIONWIDE_INITIAL_VILLAGES = MONITORED_LOCATIONS.map(loc => {
  const existing = INITIAL_VILLAGES.find(iv => iv.id === loc.id || iv.name.toLowerCase() === loc.name.toLowerCase());
  if (existing) {
    return { ...loc, ...existing };
  }
  return {
    id: loc.id,
    name: loc.name,
    district: loc.district,
    state: loc.state,
    lat: loc.lat,
    lng: loc.lng,
    rain: loc.rain || Math.floor((loc.historicalLandslideRisk || 0.6) * 85) + 12,
    moisture: loc.soilRisk ? Math.floor(loc.soilRisk * 100) : 74,
    slope: loc.slope || 32,
    riverLevel: loc.riverLevel || 2.2,
    warningMark: loc.warningMark || 3.0,
    dangerMark: loc.dangerMark || 4.0,
    riverRiseRate: 1.1,
    discharge: 180,
    shelter: {
      name: `${loc.name} Disaster Relief & Evacuation Center`,
      dist: '1.2 km',
      elevation: '+35m',
      capacity: 800,
      occupancy: '120 Beds Occupied',
      route: 'Designated High Ground Escarpment Route'
    },
    historicalData: {
      flood10yr: 3.5,
      flood50yr: 4.8,
      flood100yr: 6.0,
      maxHistorical2013: 5.4,
      maxHistorical2021: 4.9
    }
  };
});

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [activeMode, setActiveMode] = useState('landslide');
  const [selectedVillageId, setSelectedVillageId] = useState('loc_shimla');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdatedTime, setLastUpdatedTime] = useState(new Date());

  const [theme, setTheme] = useState(() => localStorage.getItem('bhoomirakshak_theme') || 'light');
  const [sirenEnabled, setSirenEnabled] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(15);

  const [villages, setVillages] = useState(() => 
    NATIONWIDE_INITIAL_VILLAGES.map(v => {
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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('bhoomirakshak_theme', newTheme);
  };

  const handleRefreshTelemetry = () => {
    fetchLiveData();
  };

  const selectedVillage = villages.find(v => v.id === selectedVillageId) || findLocationById(selectedVillageId) || villages[0];
  const activeAlertsCount = alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH' || a.critical).length;

  return (
    <div className="app-viewport-container" data-theme={theme} style={{
      display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh',
      background: 'var(--bg-dark)',
      color: 'var(--text-primary)',
    }}>
      <Toast toasts={toasts} onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      {/* LEFT SIDEBAR NAVIGATION */}
      <Sidebar 
        activePage={activePage} 
        onPageChange={setActivePage} 
        activeAlertsCount={activeAlertsCount}
      />

      {/* MAIN VIEWPORT CONTAINER */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', minWidth: 0, background: 'var(--bg-dark)', overflow: 'hidden' }}>
        
        {/* Top Operational Header */}
        <Header 
          villages={villages} 
          alerts={alerts} 
          mode={activeMode} 
          onModeChange={setActiveMode}
          lastUpdatedTime={lastUpdatedTime}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectVillage={(id) => {
            setSelectedVillageId(id);
            setActivePage('dashboard');
          }}
          onRefreshData={handleRefreshTelemetry}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Content Body View Wrapped in ErrorBoundary */}
        <div className="main-content-viewport" style={{ 
          flex: 1, 
          padding: activePage === 'dashboard' ? '8px 12px' : '16px', 
          overflowY: activePage === 'dashboard' ? 'hidden' : 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: activePage === 'dashboard' ? '8px' : '12px',
          minHeight: 0
        }}>
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
              <div style={{ flex: 1, background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--card-border)', padding: '16px', color: 'var(--text-primary)' }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                
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
                  gap: '10px', 
                  flex: 1,
                  minHeight: 0,
                  height: '100%',
                  overflow: 'hidden'
                }}>
                  
                  {/* Central Map Panel (65% width) */}
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
                    <MapPanel 
                      villages={villages} 
                      selectedId={selectedVillageId} 
                      onSelect={setSelectedVillageId} 
                      mode={activeMode}
                      lastUpdatedTime={lastUpdatedTime}
                    />
                  </div>

                  {/* Selected Location Panel & Nearby Areas (35% width) */}
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
                    <SelectedLocationCard 
                      village={selectedVillage} 
                      villages={villages}
                      onSelectVillage={setSelectedVillageId}
                      mode={activeMode}
                      lastUpdatedTime={lastUpdatedTime}
                    />
                  </div>
                </div>

                {/* 4. NEW ANALYTICS & MONITORING SECTION (BELOW LIVE HAZARD MAP) */}
                <AnalyticsSection
                  selectedLocation={selectedVillage}
                  mode={activeMode}
                  onNavigateToMap={() => setActivePage('map')}
                  onTriggerToast={(msg) => {
                    setToasts(prev => [
                      ...prev,
                      { id: `toast-${Date.now()}`, message: msg, type: 'info', timestamp: new Date() }
                    ]);
                  }}
                />
              </div>
            )}
          </ErrorBoundary>
        </div>

        {/* Telemetry Status Bar / Bottom Operational Status Bar */}
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
