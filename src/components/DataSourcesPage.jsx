import { useState } from 'react';
import { 
  Database, 
  Radio, 
  CloudRain, 
  Waves, 
  Globe, 
  History, 
  Info, 
  ExternalLink 
} from 'lucide-react';

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
      lastUpdate: 'Last update: 2 days ago',
      provider: 'Hugging Face Hub (DataUploader/IndLands)'
    },
    {
      id: 'archive',
      name: 'Historical Disaster Archive',
      status: 'AVAILABLE',
      statusType: 'available',
      icon: History,
      desc: 'Historical flood marks and landslide event frequency records (2013 Kedarnath and 2021 Chamoli events).',
      stats: 'Verified Records',
      lastUpdate: 'Last update: 1 month ago',
      provider: 'State Disaster Management Authority'
    }
  ];

  return (
    <div 
      className="flex-1 flex flex-col p-6 space-y-5 max-w-[1700px] mx-auto w-full overflow-y-auto"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        gap: '20px',
        width: '100%',
        boxSizing: 'border-box',
        color: 'var(--text-primary)',
        height: '100%',
        overflowY: 'auto'
      }}
    >
      {/* Header Section */}
      <div 
        className="flex items-center justify-between pb-4"
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--card-border)',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--accent-blue-glow)',
            border: '1px solid var(--card-border)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color: 'var(--accent-blue)'
          }}>
            <Database size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Data Sources</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: '3px 0 0 0' }}>
              Overview of all environmental data streams feeding Bhoomirakshak
            </p>
          </div>
        </div>

        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '10px',
          border: '1px solid var(--card-border)',
          background: 'var(--card-bg)',
          color: 'var(--text-primary)',
          fontSize: '0.8rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: 'var(--glass-shadow)'
        }}>
          <ExternalLink size={14} color="var(--accent-blue)" />
          <span>View Data Details</span>
        </button>
      </div>

      {/* 2-Column Grid of Environmental Data Source Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '18px'
      }}>
        {sources.map((s) => {
          const IconComp = s.icon;
          const isLive = s.statusType === 'live';

          return (
            <div 
              key={s.id} 
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: 'var(--glass-shadow)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                gap: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: 'var(--accent-blue-glow)',
                      border: '1px solid var(--card-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                      color: 'var(--accent-blue)'
                    }}>
                      <IconComp size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{s.name}</h3>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{s.provider}</span>
                    </div>
                  </div>

                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    background: isLive ? 'var(--risk-low-bg)' : 'var(--accent-blue-glow)',
                    color: isLive ? 'var(--risk-low)' : 'var(--accent-blue)',
                    border: `1px solid ${isLive ? 'var(--risk-low-border)' : 'var(--card-border)'}`,
                    letterSpacing: '0.05em'
                  }}>
                    {s.status}
                  </span>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                  {s.desc}
                </p>
              </div>

              <div style={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                borderTop: '1px solid var(--card-border)',
                paddingTop: '12px'
              }}>
                <span style={{ fontWeight: 800, color: isLive ? 'var(--risk-low)' : 'var(--text-primary)' }}>{s.stats}</span>
                <span style={{ fontFamily: 'monospace' }}>{s.lastUpdate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Information Note */}
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '12px',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)'
      }}>
        <Info size={16} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
        <span>Data sources are automatically synchronized. Status indicators display real-time stream status.</span>
      </div>
    </div>
  );
}
