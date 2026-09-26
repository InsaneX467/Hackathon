import HazardDetails from './hazard/HazardDetails';
import { MONITORED_LOCATIONS } from '../data/locations';

export default function SelectedLocationCard({
  village,
  villages = [],
  onSelectVillage,
  mode = 'landslide',
  lastUpdatedTime
}) {
  // Resolve location: prioritize MONITORED_LOCATIONS matching the village ID or name
  const resolvedLocation = 
    (village ? MONITORED_LOCATIONS.find(l => l.id === village.id || l.name.toLowerCase() === village.name?.toLowerCase()) : null) ||
    village ||
    MONITORED_LOCATIONS[0];

  return (
    <HazardDetails
      selectedLocation={resolvedLocation}
      onSelectLocation={onSelectVillage}
      mode={mode}
      lastUpdatedTime={lastUpdatedTime}
    />
  );
}
