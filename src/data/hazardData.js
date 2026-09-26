/**
 * BHOOMIRAKSHAK Nationwide Hazard Intelligence Dataset
 * Geographically realistic zones, markers, and rainfall stations across all major
 * mountain ranges, river basins, and flood plains of India:
 * Himalayas (J&K, Ladakh, HP, Uttarakhand), Eastern Himalaya (Sikkim, Darjeeling),
 * Northeast (Arunachal, Assam, Meghalaya, Nagaland, Manipur, Mizoram, Tripura),
 * Western Ghats (Maharashtra, Goa, Karnataka, Kerala, Tamil Nadu Nilgiris),
 * Eastern Ghats (Andhra Pradesh), and River Basins (Bihar Kosi, UP, Odisha Mahanadi).
 */

import { INDIA_LANDSLIDE_GEOJSON } from './geo/indiaLandslideRisk.js';
import { INDIA_FLASH_FLOOD_GEOJSON } from './geo/indiaFlashFloodRisk.js';
import { NATIONWIDE_HAZARD_POINTS, INDIA_MACRO_REGIONAL_BELTS } from './indiaHazards.js';

// Multi-Tier GeoJSON Polygons converted to Leaflet format [lat, lng]
export const HAZARD_ZONES_DATA = [
  ...INDIA_LANDSLIDE_GEOJSON.features.map(f => {
    const coords = f.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
    return {
      id: f.id || f.properties.id,
      name: f.properties.name,
      primaryHazard: 'landslide',
      hazardType: 'landslide',
      riskLevel: f.properties.riskLevel,
      score: f.properties.baseScore,
      state: f.properties.region,
      district: f.properties.district,
      outerPolygon: coords,
      description: f.properties.description,
      locationRef: f.properties.locationRef || `loc_${(f.id || '').replace(/^ls-|^ff-/, '').split('-')[1] || ''}`
    };
  }),
  ...INDIA_FLASH_FLOOD_GEOJSON.features.map(f => {
    const coords = f.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
    return {
      id: f.id || f.properties.id,
      name: f.properties.name,
      primaryHazard: 'flash_flood',
      hazardType: 'flash_flood',
      riskLevel: f.properties.riskLevel,
      score: f.properties.baseScore,
      state: f.properties.region,
      district: f.properties.district,
      outerPolygon: coords,
      description: f.properties.description,
      locationRef: f.properties.locationRef || `loc_${(f.id || '').replace(/^ls-|^ff-/, '').split('-')[1] || ''}`
    };
  })
];

// Nationwide Hazard Markers (Landslide, Flash Flood, Normal / Safe Areas)
export const HAZARD_MARKERS_DATA = [
  // 1. All Nationwide Hazard Points (Landslides and Flash Floods)
  ...NATIONWIDE_HAZARD_POINTS.map(p => ({
    id: p.id,
    type: p.hazardType || p.type || 'landslide',
    hazardType: p.hazardType || p.type || 'landslide',
    lat: p.lat ?? p.latitude,
    lng: p.lng ?? p.longitude,
    latitude: p.lat ?? p.latitude,
    longitude: p.lng ?? p.longitude,
    name: p.name,
    district: p.district,
    state: p.region || p.state,
    region: p.region || p.state,
    riskLevel: p.riskLevel,
    score: p.score ?? p.riskScore ?? 75,
    riskScore: p.score ?? p.riskScore ?? 75,
    slope: p.slope || 25,
    elevation: p.elevation || 150,
    historicalRisk: (p.baseSusceptibility || p.riskScore || 75) / 100,
    locationRef: p.locationRef || `loc_${p.id.split('-').pop()}`,
    statusText: p.statusText || 'Model Hazard Susceptibility Node'
  })),

  // 2. Designated High-Ground Safe Relief Havens Across India
  {
    id: 'safe-hp-shimla-ridge',
    type: 'normal_safe',
    lat: 31.1060,
    lng: 77.1780,
    name: 'Shimla Ridge Emergency Assembly Zone',
    district: 'Shimla',
    state: 'Himachal Pradesh',
    riskLevel: 'LOW',
    score: 18,
    slope: 8,
    historicalRisk: 0.15,
    locationRef: 'loc_shimla',
    statusText: 'Stable Bedrock Ridge • Safe Evacuation Zone'
  },
  {
    id: 'safe-uk-dehradun-center',
    type: 'normal_safe',
    lat: 30.3165,
    lng: 78.0322,
    name: 'Dehradun Disaster Management Command Haven',
    district: 'Dehradun',
    state: 'Uttarakhand',
    riskLevel: 'LOW',
    score: 15,
    slope: 6,
    historicalRisk: 0.12,
    locationRef: 'loc_dehradun',
    statusText: 'Civil Defense Headquarters • Primary Relief Base'
  },
  {
    id: 'safe-sikkim-gangtok-paljor',
    type: 'normal_safe',
    lat: 27.3325,
    lng: 88.6140,
    name: 'Gangtok Paljor Stadium Safe Relief Hub',
    district: 'East Sikkim',
    state: 'Sikkim',
    riskLevel: 'LOW',
    score: 22,
    slope: 10,
    historicalRisk: 0.18,
    locationRef: 'loc_gangtok',
    statusText: 'Reinforced Flat Plateau • Relief Helipad Facility'
  },
  {
    id: 'safe-kerala-wayanad-kalpetta',
    type: 'normal_safe',
    lat: 11.6080,
    lng: 76.0820,
    name: 'Kalpetta Civil Relief Staging Base',
    district: 'Wayanad',
    state: 'Kerala',
    riskLevel: 'LOW',
    score: 20,
    slope: 11,
    historicalRisk: 0.16,
    locationRef: 'loc_wayanad',
    statusText: 'High Ridge Safe Shelter Hub • Beyond Landslide Reach'
  },
  {
    id: 'safe-mah-pune-relief',
    type: 'normal_safe',
    lat: 18.5204,
    lng: 73.8567,
    name: 'Pune Western Command Relief Node',
    district: 'Pune',
    state: 'Maharashtra',
    riskLevel: 'LOW',
    score: 12,
    slope: 5,
    historicalRisk: 0.10,
    locationRef: 'loc_lonavala',
    statusText: 'Safe Staging Base for Sahyadri Escarpment'
  },
  {
    id: 'safe-as-lakhimpur-hub',
    type: 'normal_safe',
    lat: 27.24,
    lng: 93.98,
    name: 'Lakhimpur Emergency Relief Shelter Hub',
    district: 'Lakhimpur',
    state: 'Assam',
    riskLevel: 'LOW',
    score: 24,
    slope: 12,
    historicalRisk: 0.22,
    locationRef: 'loc_lakhimpur',
    statusText: 'Safe High Ground & Emergency Hub'
  }
];

// Nationwide Automated Weather & Hydrological Telemetry Stations
export const RAINFALL_STATIONS_DATA = [
  // 1. Himachal Pradesh
  {
    id: 'station_hp_manali_hydro',
    name: 'Manali Beas Hydrology Telemetry',
    district: 'Kullu',
    state: 'Himachal Pradesh',
    lat: 32.2450,
    lng: 77.1920,
    elevation: 2050,
    type: 'rainfall_station',
    sensorType: 'Ultrasonic Stage Sensor + Tipping Bucket'
  },
  {
    id: 'station_hp_shimla_aws',
    name: 'Shimla Ridge AWS Telemetry',
    district: 'Shimla',
    state: 'Himachal Pradesh',
    lat: 31.1048,
    lng: 77.1734,
    elevation: 2206,
    type: 'rainfall_station',
    sensorType: 'Automated Weather Station (IMD Grade)'
  },

  // 2. Uttarakhand
  {
    id: 'station_uk_joshimath_hydro',
    name: 'Joshimath - Alaknanda Stage Gauge',
    district: 'Chamoli',
    state: 'Uttarakhand',
    lat: 30.5506,
    lng: 79.5660,
    elevation: 1875,
    type: 'rainfall_station',
    sensorType: 'Radar Surface Water Level Profiler'
  },
  {
    id: 'station_uk_rishikesh_ganga',
    name: 'Rishikesh Ganga Discharge Station',
    district: 'Dehradun',
    state: 'Uttarakhand',
    lat: 30.0869,
    lng: 78.2676,
    elevation: 372,
    type: 'rainfall_station',
    sensorType: 'Acoustic Doppler Current Profiler (ADCP)'
  },

  // 3. Jammu & Kashmir & Ladakh
  {
    id: 'station_jk_ramban_chenab',
    name: 'Ramban Chenab Gorge Hydro Stage',
    district: 'Ramban',
    state: 'Jammu & Kashmir',
    lat: 33.2425,
    lng: 75.1950,
    elevation: 1150,
    type: 'rainfall_station',
    sensorType: 'Telemetry Flood Warning Gauge'
  },
  {
    id: 'station_ladakh_kargil_aws',
    name: 'Kargil Snow & Precip Sensor',
    district: 'Kargil',
    state: 'Ladakh',
    lat: 34.5539,
    lng: 76.1349,
    elevation: 2676,
    type: 'rainfall_station',
    sensorType: 'Heated Rain Gauge & Snow Water Equivalent'
  },

  // 4. Sikkim & West Bengal
  {
    id: 'station_sikkim_gangtok_aws',
    name: 'Gangtok Teesta-V Basin AWS',
    district: 'East Sikkim',
    state: 'Sikkim',
    lat: 27.3314,
    lng: 88.6138,
    elevation: 1650,
    type: 'rainfall_station',
    sensorType: 'Integrated Hydromet Monitoring Station'
  },
  {
    id: 'station_wb_darjeeling_aws',
    name: 'Darjeeling Hill AWS Station',
    district: 'Darjeeling',
    state: 'West Bengal',
    lat: 27.0410,
    lng: 88.2663,
    elevation: 2042,
    type: 'rainfall_station',
    sensorType: 'Slope Rainfall Inclinometer Telemetry'
  },

  // 5. Western Ghats: Maharashtra & Goa
  {
    id: 'station_mah_mahabaleshwar_aws',
    name: 'Mahabaleshwar Orographic Rain Gauge',
    district: 'Satara',
    state: 'Maharashtra',
    lat: 17.9237,
    lng: 73.6586,
    elevation: 1353,
    type: 'rainfall_station',
    sensorType: 'Extreme Precipitation Optical Disdrometer'
  },
  {
    id: 'station_mah_chiplun_hydro',
    name: 'Chiplun Vashishti River Stage Gauge',
    district: 'Ratnagiri',
    state: 'Maharashtra',
    lat: 17.5323,
    lng: 73.5186,
    elevation: 18,
    type: 'rainfall_station',
    sensorType: 'Tidal Fluvial Backwater Profiler'
  },

  // 6. Western Ghats: Karnataka, Kerala, Tamil Nadu
  {
    id: 'station_kar_agumbe_rain',
    name: 'Agumbe Rainforest Hydro Station',
    district: 'Shimoga',
    state: 'Karnataka',
    lat: 13.5074,
    lng: 75.0934,
    elevation: 643,
    type: 'rainfall_station',
    sensorType: 'Cherrapunji of the South Telemetry Node'
  },
  {
    id: 'station_ker_wayanad_aws',
    name: 'Wayanad Meppadi Debris Telemetry',
    district: 'Wayanad',
    state: 'Kerala',
    lat: 11.5510,
    lng: 76.1280,
    elevation: 910,
    type: 'rainfall_station',
    sensorType: 'Piezometer Pore Pressure & Soil Saturation'
  },
  {
    id: 'station_ker_munnar_hydro',
    name: 'Munnar Mattupetty Dam Hydro Stage',
    district: 'Idukki',
    state: 'Kerala',
    lat: 10.0889,
    lng: 77.0595,
    elevation: 1532,
    type: 'rainfall_station',
    sensorType: 'Catchment Runoff Laser Gauge'
  },
  {
    id: 'station_tn_ooty_aws',
    name: 'Ooty Nilgiris Mountain Met Station',
    district: 'Nilgiris',
    state: 'Tamil Nadu',
    lat: 11.4102,
    lng: 76.6950,
    elevation: 2240,
    type: 'rainfall_station',
    sensorType: 'Slope Saturation & Rain Influx Array'
  },

  // 7. Eastern Ghats & Flood Plain Basins
  {
    id: 'station_ap_araku_aws',
    name: 'Araku Valley Eastern Ghats AWS',
    district: 'Alluri Sitharama Raju',
    state: 'Andhra Pradesh',
    lat: 18.3273,
    lng: 82.8775,
    elevation: 911,
    type: 'rainfall_station',
    sensorType: 'Cyclonic Rain Gauge'
  },
  {
    id: 'station_bihar_kosi_hydro',
    name: 'Kosi River Baltara Discharge Gauge',
    district: 'Khagaria / Saharsa',
    state: 'Bihar',
    lat: 25.5600,
    lng: 86.6200,
    elevation: 38,
    type: 'rainfall_station',
    sensorType: 'Doppler Velocity Silt & Stage Gauge'
  },
  {
    id: 'station_odisha_mahanadi_gauge',
    name: 'Mahanadi Naraj Delta Stage Station',
    district: 'Cuttack',
    state: 'Odisha',
    lat: 20.4650,
    lng: 85.7800,
    elevation: 24,
    type: 'rainfall_station',
    sensorType: 'Delta Discharge Telemetry Profiler'
  },

  // 8. Northeast: Assam, Arunachal, Meghalaya
  {
    id: 'station_as_dhemaji_hydro',
    name: 'Dhemaji Jiadhal River Stage Station',
    district: 'Dhemaji',
    state: 'Assam',
    lat: 27.4800,
    lng: 94.6000,
    elevation: 104,
    type: 'rainfall_station',
    sensorType: 'Radar Surface Water Level Profiler'
  },
  {
    id: 'station_as_dibrugarh_ghat',
    name: 'Dibrugarh Brahmaputra Riverfront Gauge',
    district: 'Dibrugarh',
    state: 'Assam',
    lat: 27.4728,
    lng: 94.9120,
    elevation: 108,
    type: 'rainfall_station',
    sensorType: 'Acoustic Doppler Velocity Profiler'
  },
  {
    id: 'station_ar_pasighat_hydro',
    name: 'Pasighat Siang River Gauge',
    district: 'East Siang',
    state: 'Arunachal Pradesh',
    lat: 28.0667,
    lng: 95.3333,
    elevation: 153,
    type: 'rainfall_station',
    sensorType: 'High-Altitude Automated Weather Station'
  },
  {
    id: 'station_meg_cherrapunji_aws',
    name: 'Cherrapunji (Sohra) Extreme Rain Station',
    district: 'East Khasi Hills',
    state: 'Meghalaya',
    lat: 25.2702,
    lng: 91.7323,
    elevation: 1430,
    type: 'rainfall_station',
    sensorType: 'World-Record Precipitation Optical Telemetry'
  }
];
