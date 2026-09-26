import { useState } from 'react';
import { Camera, Satellite, Radio, ExternalLink, Play, Maximize2, ShieldCheck, RefreshCw } from 'lucide-react';

export default function LiveMonitoringCard({ selectedLocation, onNavigateToMap }) {
  const [activeFeedModal, setActiveFeedModal] = useState(null);
  const loc = selectedLocation || { name: 'Dhemaji', riverName: 'Brahmaputra River', district: 'Dhemaji' };

  const riverName = loc.riverName || 'Brahmaputra River';

  // 4 Monitoring Streams (Dynamic based on selected location)
  const cameras = [
    {
      id: 'cam-01',
      name: `${riverName} (Live)`,
      type: 'River Embankment & Surge Stage',
      status: 'Online',
      badge: 'DEMO CAMERA',
      fps: '30 FPS',
      timestamp: '26 Sep 2026, 14:48:12 IST',
      camCode: 'CWC-HYDRO-CAM-01',
      bgGradient: 'radial-gradient(ellipse at 40% 50%, rgba(2, 132, 199, 0.45) 0%, rgba(7, 15, 30, 0.95) 75%)',
      riverVisual: true,
      description: 'Automated optical water-level monitoring node with infrared night illuminator.'
    },
    {
      id: 'cam-02',
      name: `${loc.district ? `${loc.district} Highway` : 'NH-15 Corridor'}`,
      type: 'Landslide Slope Inclinometer Cam',
      status: 'Online',
      badge: 'DEMO CAMERA',
      fps: '25 FPS',
      timestamp: '26 Sep 2026, 14:48:09 IST',
      camCode: 'BRO-SLOPE-CAM-04',
      bgGradient: 'radial-gradient(ellipse at 50% 60%, rgba(249, 115, 22, 0.35) 0%, rgba(7, 15, 30, 0.95) 75%)',
      mountainVisual: true,
      description: 'Continuous rockfall debris trajectory optical tracker focused on active shear scarp.'
    },
    {
      id: 'cam-03',
      name: `${loc.name} High Ridge Sentinel`,
      type: 'Catchment Cloudburst Radar Station',
      status: 'Online',
      badge: 'DEMO CAMERA',
      fps: '30 FPS',
      timestamp: '26 Sep 2026, 14:48:15 IST',
      camCode: 'IMD-DOPPLER-CAM-02',
      bgGradient: 'radial-gradient(ellipse at 60% 40%, rgba(16, 185, 129, 0.35) 0%, rgba(7, 15, 30, 0.95) 75%)',
      radarVisual: true,
      description: 'High-altitude panoramic optical weather tracker observing incoming convective cells.'
    },
    {
      id: 'sat-01',
      name: 'Sentinel-2 Satellite SAR',
      type: 'Multi-Spectral Ground Saturation',
      status: 'Updated',
      badge: 'SATELLITE ORBIT',
      isSatellite: true,
      timestamp: '26 Sep 2026, 09:45 AM',
      camCode: 'ESA-SAR-BAND-B08',
      bgGradient: 'radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.4) 0%, rgba(8, 14, 28, 0.95) 80%)',
      satelliteVisual: true,
      description: 'Synthetic Aperture Radar (SAR) soil penetration pass detecting subsurface saturated zones.'
    }
  ];

  return (
    <div
      style={{
        background: '#0a1224',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
      }}
    >
      {/* SECTION HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '7px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Camera size={17} color="#38bdf8" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
              Live Cameras & Satellite View
            </h3>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
              Optical Sentinel Nodes & Earth Observation Feeds • {loc.name} Sector
            </div>
          </div>
        </div>

        {/* View All Action */}
        <button
          type="button"
          onClick={() => {
            if (onNavigateToMap) onNavigateToMap();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(56, 189, 248, 0.12)',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '8px',
            padding: '6px 14px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(56, 189, 248, 0.22)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)';
          }}
        >
          <span>View All</span>
          <span style={{ fontSize: '1rem', lineHeight: '1' }}>→</span>
        </button>
      </div>

      {/* 4 HORIZONTAL MONITORING CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '14px'
        }}
      >
        {cameras.map((feed) => (
          <div
            key={feed.id}
            style={{
              background: '#070e1c',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              cursor: feed.isSatellite ? 'pointer' : 'default',
              transition: 'transform 0.18s ease, border-color 0.18s ease'
            }}
            onClick={() => {
              if (feed.isSatellite && onNavigateToMap) {
                onNavigateToMap();
              } else {
                setActiveFeedModal(feed);
              }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* CAMERA PREVIEW CANVAS / SIMULATION */}
            <div
              style={{
                position: 'relative',
                height: '135px',
                background: feed.bgGradient,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '8px 10px',
                overflow: 'hidden'
              }}
            >
              {/* Scanline / Grid Effect */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 0)',
                  backgroundSize: '16px 16px',
                  opacity: 0.45,
                  pointerEvents: 'none'
                }}
              />

              {/* Watermark Details: Camera ID & Rec Indicator */}
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: feed.isSatellite ? '#38bdf8' : '#ef4444',
                      boxShadow: `0 0 8px ${feed.isSatellite ? '#38bdf8' : '#ef4444'}`
                    }}
                  />
                  <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '0.5px' }}>
                    {feed.isSatellite ? 'SAT PASS' : 'REC ●'}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.62rem',
                    background: 'rgba(0, 0, 0, 0.65)',
                    color: '#94a3b8',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontFamily: 'monospace'
                  }}
                >
                  {feed.fps}
                </span>
              </div>

              {/* Visual Horizon / Terrain Reticle */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.85
                }}
              >
                {feed.isSatellite ? (
                  <Satellite size={32} color="#38bdf8" />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '24px', height: '1px', background: 'rgba(255,255,255,0.4)', marginBottom: '3px' }} />
                    <Camera size={24} color="#94a3b8" />
                    <div style={{ width: '24px', height: '1px', background: 'rgba(255,255,255,0.4)', marginTop: '3px' }} />
                  </div>
                )}
                <span
                  style={{
                    fontSize: '0.62rem',
                    color: '#cbd5e1',
                    marginTop: '4px',
                    fontFamily: 'monospace',
                    letterSpacing: '0.6px'
                  }}
                >
                  {feed.camCode}
                </span>
              </div>

              {/* Bottom Stream Bar: Timecode & Tag */}
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.62rem',
                    color: '#94a3b8',
                    fontFamily: 'monospace'
                  }}
                >
                  {feed.timestamp.split(',')[1] || feed.timestamp}
                </span>
                <span
                  style={{
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    background: feed.isSatellite ? 'rgba(56, 189, 248, 0.25)' : 'rgba(245, 158, 11, 0.25)',
                    color: feed.isSatellite ? '#7dd3fc' : '#fcd34d',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    border: `1px solid ${feed.isSatellite ? 'rgba(56, 189, 248, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
                  }}
                >
                  {feed.badge}
                </span>
              </div>
            </div>

            {/* CARD META FOOTER */}
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                  {feed.name}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#10b981',
                      boxShadow: '0 0 6px #10b981'
                    }}
                  />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#34d399' }}>
                    {feed.status}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                {feed.type}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Updated: {feed.timestamp}</span>
                {feed.isSatellite && (
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>Open Map ↗</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FEED MODAL DIALOG */}
      {activeFeedModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setActiveFeedModal(null)}
        >
          <div
            style={{
              background: '#0a1224',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '14px',
              padding: '24px',
              maxWidth: '560px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.72rem', background: '#38bdf825', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    {activeFeedModal.camCode}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                    ● LIVE TELEMETRY STREAM
                  </span>
                </div>
                <h3 style={{ margin: '6px 0 0 0', fontSize: '1.25rem', color: '#ffffff', fontWeight: 800 }}>
                  {activeFeedModal.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveFeedModal(null)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                ✕ Close
              </button>
            </div>

            <div
              style={{
                height: '240px',
                borderRadius: '8px',
                background: activeFeedModal.bgGradient,
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              <Camera size={48} color="#38bdf8" style={{ opacity: 0.8 }} />
              <div style={{ color: '#ffffff', fontWeight: 700, marginTop: '8px', fontSize: '0.95rem' }}>
                Simulated Optical Monitoring Stream
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '4px', maxWidth: '380px', textAlign: 'center' }}>
                {activeFeedModal.description}
              </div>
              <div style={{ position: 'absolute', bottom: '12px', right: '12px', fontSize: '0.68rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                FPS: 30 • RES: 1080p • CODEC: H.264
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#94a3b8' }}>
              <span>Interface ready for RTSP / HLS live IP camera stream ingestion.</span>
              <button
                type="button"
                onClick={() => setActiveFeedModal(null)}
                style={{
                  background: '#1d68d8',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
