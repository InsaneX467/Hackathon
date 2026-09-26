import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';

export default function DynamicScaleBar() {
  const map = useMap();
  const [scaleKm, setScaleKm] = useState(30);

  useEffect(() => {
    if (!map) return;

    const updateScale = () => {
      const zoom = map.getZoom();
      const center = map.getCenter();
      const latRad = (center.lat * Math.PI) / 180;
      // meters per pixel at current zoom
      const mPerPx = (156543.03392 * Math.cos(latRad)) / Math.pow(2, zoom);
      const totalKm = (mPerPx * 130) / 1000;

      // Pick nearest clean round number
      let rounded = 30;
      if (totalKm > 200) rounded = Math.round(totalKm / 50) * 50;
      else if (totalKm > 50) rounded = Math.round(totalKm / 20) * 20;
      else if (totalKm > 20) rounded = Math.round(totalKm / 10) * 10;
      else if (totalKm > 5) rounded = Math.round(totalKm / 5) * 5;
      else rounded = Math.max(1, Math.round(totalKm));

      setScaleKm(rounded);
    };

    updateScale();
    map.on('zoomend', updateScale);
    map.on('moveend', updateScale);

    return () => {
      map.off('zoomend', updateScale);
      map.off('moveend', updateScale);
    };
  }, [map]);

  const tick1 = Math.round(scaleKm / 3);
  const tick2 = Math.round((scaleKm * 2) / 3);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#ffffff',
        textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8)',
        pointerEvents: 'none'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '130px', fontWeight: 700 }}>
        <span>0</span>
        <span>{tick1}</span>
        <span>{tick2}</span>
        <span>{scaleKm} km</span>
      </div>
      <div style={{ width: '130px', height: '4px', border: '1px solid #ffffff', borderTop: 'none', display: 'flex' }}>
        <div style={{ flex: 1, borderRight: '1px solid #ffffff' }} />
        <div style={{ flex: 1, borderRight: '1px solid #ffffff' }} />
        <div style={{ flex: 1 }} />
      </div>
    </div>
  );
}
