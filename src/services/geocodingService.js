/**
 * BHOOMIRAKSHAK Location Search & Geocoding Service
 * Uses Open-Meteo Geocoding API + Local Monitored Locations
 */

import { MONITORED_LOCATIONS } from '../data/locations';

const geocodeCache = new Map();

export async function searchLocationsWithGeocoding(query) {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.trim().toLowerCase();

  // 1. Check local catalog first (instant matching)
  const localMatches = MONITORED_LOCATIONS.filter(loc =>
    loc.name.toLowerCase().includes(cleanQuery) ||
    loc.district.toLowerCase().includes(cleanQuery) ||
    loc.state.toLowerCase().includes(cleanQuery)
  ).map(loc => ({
    id: loc.id,
    name: loc.name,
    admin1: loc.district,
    country: loc.state,
    lat: loc.lat,
    lng: loc.lng,
    isMonitored: true,
    locationData: loc
  }));

  // 2. Query Open-Meteo Geocoding API if query is 3+ chars
  if (cleanQuery.length >= 3) {
    if (geocodeCache.has(cleanQuery)) {
      const cached = geocodeCache.get(cleanQuery);
      return mergeResults(localMatches, cached);
    }

    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=5&language=en&format=json`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const results = (data.results || []).map(r => ({
          id: `geo_${r.id}`,
          name: r.name,
          admin1: r.admin1 || r.country,
          country: r.country || 'India',
          lat: r.latitude,
          lng: r.longitude,
          isMonitored: false
        }));
        geocodeCache.set(cleanQuery, results);
        return mergeResults(localMatches, results);
      }
    } catch (err) {
      console.warn('[GeocodingService] API lookup skipped:', err.message);
    }
  }

  return localMatches;
}

function mergeResults(local, remote) {
  const seen = new Set();
  const merged = [];

  for (const item of local) {
    seen.add(item.name.toLowerCase());
    merged.push(item);
  }

  for (const item of remote) {
    if (!seen.has(item.name.toLowerCase())) {
      seen.add(item.name.toLowerCase());
      merged.push(item);
    }
  }

  return merged;
}
