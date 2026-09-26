/**
 * BHOOMIRAKSHAK Risk Assessment Engine
 * Clearly Designated as: Demonstration / Simulation Hazard Model
 * Computes multi-hazard risk scores by combining live atmospheric weather
 * with terrain topography and hydro-meteorological indices.
 */

export function calculateLocationRisk({
  rainfall = 0,
  slope = 20,
  elevation = 150,
  riverProximityKm = 2.0,
  soilMoisture = 60,
  historicalFloodRisk = 0.5,
  historicalLandslideRisk = 0.5,
  mode = 'landslide'
}) {
  // Normalize parameters
  // Rainfall weight: heavy rain (>15mm/hr or >60mm cumulative) significantly elevates risk
  const normRain = Math.min(rainfall / 80, 1.0);
  const normSlope = Math.min(slope / 50, 1.0);
  const normMoisture = Math.min(soilMoisture / 100, 1.0);
  // River proximity: < 1km gives high exposure (1.0), > 10km gives low exposure (0.1)
  const normRiver = Math.max(0.1, Math.min(1.0, 1.0 - (riverProximityKm / 10)));

  // Landslide Risk Calculation
  // Heavily driven by slope steepness, soil moisture saturation, and precipitation intensity
  const landslideRaw = (normSlope * 0.40) + (normMoisture * 0.30) + (normRain * 0.20) + (historicalLandslideRisk * 0.10);
  const landslideScore = Math.min(100, Math.max(10, Math.round(landslideRaw * 100)));

  // Flash Flood Risk Calculation
  // Driven by river proximity, rainfall volume, low flat topography (inverse slope), and historical basin flooding
  const flatSlopeFactor = 1.0 - (normSlope * 0.5);
  const floodRaw = (normRiver * 0.35) + (normRain * 0.35) + (flatSlopeFactor * 0.15) + (historicalFloodRisk * 0.15);
  const floodScore = Math.min(100, Math.max(10, Math.round(floodRaw * 100)));

  // Composite / Active Risk
  const activeScore = mode === 'flash_flood' ? floodScore : landslideScore;

  function getLevel(score) {
    if (score >= 80) return { label: 'CRITICAL', color: '#ef4444', badge: '🔴' };
    if (score >= 60) return { label: 'WARNING', color: '#f97316', badge: '🟠' };
    if (score >= 40) return { label: 'WATCH', color: '#f59e0b', badge: '🟡' };
    return { label: 'LOW', color: '#10b981', badge: '🟢' };
  }

  const landslideLevel = getLevel(landslideScore);
  const floodLevel = getLevel(floodScore);
  const overallLevel = getLevel(activeScore);

  // Key Contributing Factors
  const factors = [];
  if (rainfall > 30) {
    factors.push({ name: 'Intense Precipitation', impact: 'High', value: `${Math.round(rainfall)} mm` });
  } else if (rainfall > 10) {
    factors.push({ name: 'Moderate Rainfall', impact: 'Medium', value: `${Math.round(rainfall)} mm` });
  }

  if (slope > 35) {
    factors.push({ name: 'Steep Escarpment Angle', impact: 'Critical', value: `${Math.round(slope)}°` });
  } else if (slope < 10) {
    factors.push({ name: 'Low Basin Topography', impact: 'High for Inundation', value: `${Math.round(slope)}°` });
  }

  if (riverProximityKm < 1.5) {
    factors.push({ name: 'Immediate River Proximity', impact: 'High', value: `${riverProximityKm} km` });
  }

  if (soilMoisture > 75) {
    factors.push({ name: 'Saturated Soil Matrix', impact: 'High Failure Risk', value: `${Math.round(soilMoisture)}%` });
  }

  return {
    disclaimer: 'Risk Assessment Demonstration Model (Not official civil defense alert)',
    activeScore,
    overallLevel,
    landslideScore,
    landslideLevel,
    floodScore,
    floodLevel,
    factors
  };
}
