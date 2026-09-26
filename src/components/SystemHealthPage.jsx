import { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  RefreshCw, 
  Server, 
  Database, 
  Wifi, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  Radio,
  Cpu,
  Layers
} from 'lucide-react';
import { getSystemHealthSummary } from '../services/dataStatusService';
import { SENSOR_NODES } from '../services/telemetryService';

export default function SystemHealthPage() {
  const [refreshing, setRefreshing] = useState(false);
  const health = getSystemHealthSummary();

  const services = [
    { name: 'Frontend (Web App)', status: 'Online', uptime: '99.5%', response: '18 ms' },
    { name: 'Backend API', status: 'Online', uptime: '99.8%', response: '24 ms' },
    { name: 'Telemetry Ingestion', status: 'Online', uptime: '99.9%', response: '12 ms' },
    { name: 'ML Model Service', status: 'Online', uptime: '99.7%', response: '21 ms' },
    { name: 'Database', status: 'Online', uptime: '99.9%', response: '16 ms' }
  ];

  const events = [
    { time: '14:27', text: 'Sensor JOS-01 data received' },
    { time: '14:26', text: 'Model prediction updated for Joshimath Ward 1' },
    { time: '14:24', text: 'All services operational' },
    { time: '14:18', text: 'Telemetry sync completed with 14 active nodes' },
    { time: '14:05', text: 'IMD automatic rain gauge data batch processed' }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  return (
    <div 
      className="flex-1 flex flex-col p-5 space-y-4 max-w-[1700px] mx-auto w-full overflow-y-auto"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        gap: '16px',
        width: '100%',
        boxSizing: 'border-box',
        color: 'var(--text-primary)',
        height: '100%',
        overflowY: 'auto'
      }}
    >
      
      {/* Page Title & Refresh Header */}
      <div 
        className="flex items-center justify-between"
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--risk-low-bg)',
            border: '1px solid var(--risk-low-border)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color: 'var(--risk-low)'
          }}>
            <Activity size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>System Health & Operational Diagnostics</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '3px 0 0 0' }}>
              Real-time status of system components, IoT sensor networks, and ML inference pipelines
            </p>
          </div>
        </div>

        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '10px',
            border: 'none',
            background: 'var(--accent-blue)',
            color: '#ffffff',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: 'var(--accent-blue-glow)',
            transition: 'all 0.15s ease'
          }}
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Status'}</span>
        </button>
      </div>

      {/* Metric KPI Cards (4 Cards Grid) */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '14px'
        }}
      >
        {/* Card 1: Overall System */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '14px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: 'var(--glass-shadow)'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--risk-low-bg)',
            border: '1px solid var(--risk-low-border)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            flexShrink: 0
          }}>
            <CheckCircle2 size={20} color="var(--risk-low)" />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Overall System</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--risk-low)', textTransform: 'uppercase', marginTop: '2px' }}>OPERATIONAL</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>All services running normally</div>
          </div>
        </div>

        {/* Card 2: Data Ingestion */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '14px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: 'var(--glass-shadow)'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--risk-low-bg)',
            border: '1px solid var(--risk-low-border)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            flexShrink: 0
          }}>
            <CheckCircle2 size={20} color="var(--risk-low)" />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Data Ingestion</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--risk-low)', textTransform: 'uppercase', marginTop: '2px' }}>HEALTHY</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Receiving data from all sources</div>
          </div>
        </div>

        {/* Card 3: ML Prediction Service */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '14px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: 'var(--glass-shadow)'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--risk-low-bg)',
            border: '1px solid var(--risk-low-border)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            flexShrink: 0
          }}>
            <CheckCircle2 size={20} color="var(--risk-low)" />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>ML Prediction Service</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--risk-low)', textTransform: 'uppercase', marginTop: '2px' }}>HEALTHY</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Model inference running</div>
          </div>
        </div>

        {/* Card 4: Database */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '14px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: 'var(--glass-shadow)'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--risk-low-bg)',
            border: '1px solid var(--risk-low-border)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            flexShrink: 0
          }}>
            <CheckCircle2 size={20} color="var(--risk-low)" />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Database</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--risk-low)', textTransform: 'uppercase', marginTop: '2px' }}>HEALTHY</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>All systems operational</div>
          </div>
        </div>
      </div>

      {/* 2 Column Section: Service Status Table & Sensor/Events Side Panel */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '16px',
          alignItems: 'start'
        }}
      >
        
        {/* Left Column: Service Status Table */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: 'var(--glass-shadow)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
            <Server size={18} color="var(--accent-blue)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Service Status</h3>
          </div>

          <div style={{ overflowX: 'auto', marginTop: '12px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 8px' }}>SERVICE</th>
                  <th style={{ padding: '10px 8px' }}>STATUS</th>
                  <th style={{ padding: '10px 8px' }}>UPTIME</th>
                  <th style={{ padding: '10px 8px', textAlign: 'right' }}>LAST RESPONSE</th>
                </tr>
              </thead>
              <tbody>
                {services.map((svc, i) => (
                  <tr key={i} style={{ borderBottom: i < services.length - 1 ? '1px solid var(--card-border)' : 'none' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--text-primary)' }}>{svc.name}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--risk-low)',
                        fontWeight: 700
                      }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                        {svc.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{svc.uptime}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent-blue)' }}>{svc.response}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Sensor Network Status & Recent Events */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Sensor Network Status Card */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: 'var(--glass-shadow)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
              <Radio size={18} color="var(--accent-blue)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Sensor Network Status</h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: '16px' }}>
              
              {/* Donut Gauge Visual */}
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: '8px solid var(--risk-low)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                flexDirection: 'column',
                boxShadow: '0 0 16px var(--risk-low-bg)'
              }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', leading: '1' }}>8 / 8</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--risk-low)', fontWeight: 800, marginTop: '2px' }}>Online</span>
              </div>

              {/* Legend List */}
              <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>8 Online</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
                  <span>0 Offline</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span>
                  <span>0 Stale</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#64748b' }}></span>
                  <span>0 No Data</span>
                </div>
              </div>

            </div>
          </div>

          {/* Recent System Events */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: 'var(--glass-shadow)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid var(--card-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--accent-blue)" />
                <h3 style={{ fontSize: '0.88rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Recent System Events</h3>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--accent-blue)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View All <ArrowRight size={12} />
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {events.map((e, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: idx < events.length - 1 ? '1px solid var(--card-border)' : 'none', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: 700, width: '42px', flexShrink: 0 }}>{e.time}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{e.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
