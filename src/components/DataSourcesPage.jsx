import { Database, Radio, CloudRain, Waves, Globe, History, Info, ExternalLink, RefreshCw } from 'lucide-react';
import { SENSOR_NODES } from '../services/telemetryService';

export default function DataSourcesPage() {
  const sources = [
    {
      id: 'iot',
      name: 'IoT Sensor Mesh',
      status: 'LIVE',
      statusType: 'live',
      icon: Radio,
      desc: '8 sensors measuring rainfall, river stage, soil moisture, and terrain displacement conditions across critical wards.',
      stats: '8 / 8 Online',
      lastUpdate: 'Last update: 15 sec ago',
      provider: 'BhoomiRakshak Mesh Network'
    },
    {
      id: 'imd',
      name: 'India Meteorological Department (IMD)',
      status: 'LIVE',
      statusType: 'live',
      icon: CloudRain,
      desc: 'Regional precipitation telemetry, Doppler weather radar forecasts, and extreme rainfall alerts.',
      stats: 'Continuous Feed',
      lastUpdate: 'Last update: 12 min ago',
      provider: 'IMD Meteorological Network'
    },
    {
      id: 'cwc',
      name: 'Central Water Commission (CWC)',
      status: 'LIVE',
      statusType: 'live',
      icon: Waves,
      desc: 'Alaknanda and Dhauliganga river stage meters, flow discharge rates, and downstream inundation levels.',
      stats: 'Gauge Active',
      lastUpdate: 'Last update: 5 min ago',
      provider: 'CWC Hydrological Monitoring'
    },
    {
      id: 'indlands',
      name: 'IndLands Remote Sensing Dataset',
      status: 'AVAILABLE',
      statusType: 'available',
      icon: Globe,
      desc: '30,000 spatial raster points with 32 remote sensing bands (Sentinel-2, Landsat-8, ALOS PALSAR DEM).',
      stats: '30,000 Samples',
      lastUpdate: 'Last updated: 2 days ago',
      provider: 'Hugging Face Hub (DataUploader/IndLands)'
    },
    {
      id: 'archive',
      name: 'Historical Disaster Archive',
      status: 'AVAILABLE',
      statusType: 'available',
      icon: History,
      desc: 'Historical flood marks and landslide event frequency records (2013 Kedarnath and 2021 Chamoli events).',
      stats: 'Archival Reference',
      lastUpdate: 'Last updated: 2021',
      provider: 'State Disaster Management Authority'
    }
  ];

  return (
    <div className="page-container data-sources-page" style={{ padding: '24px', color: '#0f172a', overflowY: 'auto', maxHeight: 'calc(100vh - 110px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Database size={22} color="#0284c7" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Data Sources</h1>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
              Overview of all environmental data streams feeding BhoomiRakshak
            </p>
          </div>
        </div>

        <button style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 16px', borderRadius: '8px', border: '1px solid #0284c7',
          background: '#ffffff', color: '#0284c7', fontSize: '0.82rem', fontWeight: 600,
          cursor: 'pointer', transition: 'all 0.2s'
        }}>
          <ExternalLink size={14} /> View Data Details
        </button>
      </div>

      {/* Perfectly Arranged 2-Column Balanced Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px', marginBottom: '24px' }}>
        {sources.map((s, idx) => {
          const IconComp = s.icon;
          const isLive = s.statusType === 'live';
          const isFullWidth = idx === sources.length - 1; // Last card spans nicely or fits clean grid

          return (
            <div 
              key={s.id} 
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                gridColumn: isFullWidth ? 'span 2' : 'span 1'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: isLive ? '#e0f2fe' : '#f1f5f9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <IconComp size={20} color={isLive ? '#0284c7' : '#64748b'} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>{s.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.provider}</span>
                    </div>
                  </div>

                  <span style={{
                    padding: '3px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700,
                    background: isLive ? '#dcfce7' : '#e0f2fe',
                    color: isLive ? '#15803d' : '#0369a1',
                    border: `1px solid ${isLive ? '#86efac' : '#7dd3fc'}`
                  }}>
                    {s.status}
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                  {s.desc}
                </p>
              </div>

              <div style={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                fontSize: '0.78rem',
                color: '#64748b',
                borderTop: '1px solid #f1f5f9',
                paddingTop: '12px'
              }}>
                <span style={{ fontWeight: 600, color: isLive ? '#15803d' : '#64748b' }}>{s.stats}</span>
                <span>{s.lastUpdate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Info Note */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.82rem',
        color: '#64748b'
      }}>
        <Info size={18} color="#0284c7" />
        <span>Data sources are automatically synchronized. Status indicators show the latest available data.</span>
      </div>
    </div>
  );
}
