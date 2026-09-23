/**
 * dataStatusService.js
 * --------------------
 * SINGLE SOURCE OF TRUTH for Data Integrity, Telemetry Freshness, Sensor Mesh Status,
 * and Disaster Alert State across BhoomiRakshak.
 *
 * Ensures all components (Header, Map, Controls, Panels) display 100% consistent status.
 */

import { SENSOR_NODES, INITIAL_REALTIME_ALERTS } from './telemetryService';

export const SYSTEM_DATA_STATE = {
  telemetry: {
    source: 'Hydro-Meteorological IoT Sensor Mesh',
    configuredSensors: SENSOR_NODES.length,
    reportingSensors: SENSOR_NODES.filter(s => s.status === 'ONLINE').length,
    lastUpdateTimestamp: new Date(),
    status: 'LIVE', // 'LIVE' | 'STALE' | 'NO_TELEMETRY' | 'OFFLINE'
  },
  remoteSensing: {
    source: 'IndLands GIS Satellite Dataset (Hugging Face)',
    sampleSize: 30000,
    status: 'STATIONARY_DATASET', // Clearly demarcated as remote-sensing, not live telemetry!
    lastUpdated: 'Sep 2026 Batch Release'
  },
  mlModel: {
    name: 'SVM Landslide Susceptibility Classifier',
    version: 'SVM-v1.0 (RBF Kernel)',
    accuracy: 87.88,
    recall: 74.17,
    rocAuc: 0.8959,
    status: 'ONLINE'
  },
  activeAlerts: [...INITIAL_REALTIME_ALERTS]
};

export function getSystemHealthSummary() {
  const { configuredSensors, reportingSensors, status } = SYSTEM_DATA_STATE.telemetry;
  const activeCriticalAlerts = SYSTEM_DATA_STATE.activeAlerts.filter(a => a.severity === 'CRITICAL' && a.status === 'ACTIVE');
  const activeHighAlerts = SYSTEM_DATA_STATE.activeAlerts.filter(a => a.severity === 'HIGH' && a.status === 'ACTIVE');

  let overallStatus = 'ONLINE';
  let badgeColor = '#10b981';
  let label = '● SYSTEM ONLINE';

  if (activeCriticalAlerts.length > 0) {
    overallStatus = 'CRITICAL';
    badgeColor = '#ef4444';
    label = `🚨 ${activeCriticalAlerts.length} CRITICAL ALERTS`;
  } else if (activeHighAlerts.length > 0) {
    overallStatus = 'WARNING';
    badgeColor = '#f59e0b';
    label = `⚠ ${activeHighAlerts.length} WARNING ALERTS`;
  } else if (reportingSensors < configuredSensors) {
    overallStatus = 'DEGRADED';
    badgeColor = '#f59e0b';
    label = '⚠ SENSOR DEGRADED';
  } else if (status === 'OFFLINE' || reportingSensors === 0) {
    overallStatus = 'OFFLINE';
    badgeColor = '#ef4444';
    label = '✖ NO LIVE TELEMETRY';
  }

  return {
    overallStatus,
    badgeColor,
    label,
    configuredSensors,
    reportingSensors,
    criticalCount: activeCriticalAlerts.length,
    warningCount: activeHighAlerts.length,
    totalAlerts: SYSTEM_DATA_STATE.activeAlerts.length
  };
}

export function formatDataAgeSeconds(timestamp) {
  if (!timestamp) return 'No telemetry received';
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}
