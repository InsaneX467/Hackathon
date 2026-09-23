import { Activity, CheckCircle2, ShieldCheck, RefreshCw, Server, Database, Wifi } from 'lucide-react';
import { getSystemHealthSummary } from '../services/dataStatusService';
import { SENSOR_NODES } from '../services/telemetryService';

export default function SystemHealthPage() {
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
    { time: '14:24', text: 'All services operational' }
  ];

  return (
    <div className="page-container system-health-page" style={{ padding: '24px', color: '#0f172a', overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={22} color="#15803d" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>System Health & Operational Diagnostics</h1>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
              Real-time status of system components and data pipelines
            </p>
          </div>
        </div>

        <button style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '6px 14px', borderRadius: '8px', border: '1px solid #0284c7',
          background: '#ffffff', color: '#0284c7', fontSize: '0.8rem', fontWeight: 600,
          cursor: 'pointer'
        }}>
          <RefreshCw size={14} /> Refresh Status
        </button>
      </div>

      {/* Top Health Status Cards (4 Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} color="#15803d" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Overall System</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>OPERATIONAL</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>All services running normally</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} color="#15803d" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Data Ingestion</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>HEALTHY</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Receiving data from all sources</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} color="#15803d" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>ML Prediction Service</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>HEALTHY</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Model inference running</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} color="#15803d" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Database</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>HEALTHY</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>All systems operational</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Service Status (Left) & Sensor Network Status (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '20px' }}>
        
        {/* Service Status Table */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: '#0f172a' }}>Service Status</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Service</th>
                <th style={{ padding: '10px' }}>Status</th>
                <th style={{ padding: '10px' }}>Uptime</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Last Response</th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px', fontWeight: 600, color: '#0f172a' }}>{svc.name}</td>
                  <td style={{ padding: '10px', color: '#15803d', fontWeight: 700 }}>● {svc.status}</td>
                  <td style={{ padding: '10px', color: '#64748b' }}>{svc.uptime}</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>{svc.response}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sensor Network Status & Events */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: '#0f172a' }}>Sensor Network Status</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
              
              {/* Donut Gauge Visual */}
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%',
                border: '8px solid #10b981', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>8 / 8</span>
                <span style={{ fontSize: '0.65rem', color: '#15803d', fontWeight: 700 }}>Online</span>
              </div>

              {/* Legend list */}
              <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '6px', color: '#475569' }}>
                <div><span style={{ color: '#10b981' }}>●</span> 8 Online</div>
                <div><span style={{ color: '#ef4444' }}>●</span> 0 Offline</div>
                <div><span style={{ color: '#f59e0b' }}>●</span> 0 Stale</div>
                <div><span style={{ color: '#94a3b8' }}>●</span> 0 No Data</div>
              </div>
            </div>
          </div>

          {/* Recent System Events */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Recent System Events</h4>
              <span style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600, cursor: 'pointer' }}>View All →</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: '#475569' }}>
              {events.map((e, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', borderBottom: idx < events.length - 1 ? '1px solid #f1f5f9' : 'none', paddingBottom: '6px' }}>
                  <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{e.time}</span>
                  <span>{e.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
