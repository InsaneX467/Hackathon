import LiveHazardMap from './map/LiveHazardMap';
import { MONITORED_LOCATIONS, findLocationById } from '../data/locations';

export default function MapPanel({
  villages = [],
  selectedId,
  onSelect,
  mode = 'landslide',
  indlandsPoint = null,
  lastUpdatedTime
}) {
  // Resolve location from MONITORED_LOCATIONS or fallback to passed villages
  const selectedLocation = 
    MONITORED_LOCATIONS.find(loc => loc.id === selectedId) ||
    villages.find(v => v.id === selectedId) ||
    (indlandsPoint ? { id: 'indlands', name: 'Inspection Target', lat: indlandsPoint.lat, lng: indlandsPoint.lng } : null) ||
    MONITORED_LOCATIONS[0];

  return (
    <LiveHazardMap
      selectedId={selectedId}
      selectedLocation={selectedLocation}
      onSelect={onSelect}
      mode={mode}
      lastUpdatedTime={lastUpdatedTime}
      status="CRITICAL"
    />
  );
}
