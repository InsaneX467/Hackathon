/**
 * telemetryService.js
 * -------------------
 * Real-time data ingestion, telemetry status tracking, and alert state management.
 * Tracks source metadata, data freshness age, sensor health, and risk alerts.
 */

export const SENSOR_NODES = [
  { id: 'IND-S01', name: 'Joshimath Ridge Ultrasonic Gauge', type: 'River Stage', status: 'ONLINE', battery: 98, lastUpdate: new Date() },
  { id: 'IND-S02', name: 'Joshimath Automatic Rain Gauge (ARG)', type: 'Rainfall Rate', status: 'ONLINE', battery: 95, lastUpdate: new Date() },
  { id: 'IND-S03', name: 'Tapovan TDR Soil Moisture Probe', type: 'Soil Saturation', status: 'ONLINE', battery: 91, lastUpdate: new Date() },
  { id: 'IND-S04', name: 'Reni Hilltop Hydrodynamic Flow Sensor', type: 'Discharge Flow', status: 'ONLINE', battery: 100, lastUpdate: new Date() },
  { id: 'IND-S05', name: 'Gopeshwar Inclinometer & Tilt Probe', type: 'Slope Displacement', status: 'ONLINE', battery: 89, lastUpdate: new Date() },
  { id: 'IND-S06', name: 'Pipalkoti Optical Precipitation Sensor', type: 'Rainfall Rate', status: 'ONLINE', battery: 96, lastUpdate: new Date() },
  { id: 'IND-S07', name: 'Urgam Valley Stage Meter', type: 'River Stage', status: 'ONLINE', battery: 92, lastUpdate: new Date() },
  { id: 'IND-S08', name: 'Helang Soil Saturation Sensor', type: 'Soil Saturation', status: 'ONLINE', battery: 87, lastUpdate: new Date() }
];

export const INITIAL_REALTIME_ALERTS = [
  {
    id: 'ALT-1001',
    villageId: 'v1',
    villageName: 'Joshimath Ward 1',
    hazard: 'Landslide Slope Instability',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    riskScore: 78,
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    triggerData: 'Sustained slope shear stress (41°) + High TWI (6.5)',
    actionText: 'Initiate Ward Evacuation Protocol 1B. Alert District Operations Center.'
  },
  {
    id: 'ALT-1002',
    villageId: 'v3',
    villageName: 'Reni Village',
    hazard: 'Flash Flood River Stage Surge',
    severity: 'HIGH',
    status: 'ACTIVE',
    riskScore: 72,
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    triggerData: 'River stage 2.8m approaching danger threshold (4.2m)',
    actionText: 'Issue Community Flood Advisory. Monitor Catchment Runoff.'
  }
];

export function calculateDataAge(timestamp) {
  if (!timestamp) return 'Unknown';
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function getDataFreshnessBadge(timestamp) {
  if (!timestamp) return { label: 'NO DATA', color: '#94a3b8', isStale: true };
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
  if (seconds < 120) {
    return { label: '● LIVE', color: '#10b981', isStale: false };
  } else if (seconds < 600) {
    return { label: '⚠ DATA STALE', color: '#f59e0b', isStale: true };
  } else {
    return { label: '✖ OFFLINE', color: '#ef4444', isStale: true };
  }
}

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export async function fetchActiveAlerts() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/alerts/active`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return INITIAL_REALTIME_ALERTS;
}

export async function fetchLocationsWithRisk() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/locations`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return null;
}

export async function sendTelemetryUpdate(payload) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/telemetry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return null;
}

