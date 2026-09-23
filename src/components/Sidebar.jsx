import { 
  Home, 
  Map, 
  BellRing, 
  MapPin, 
  BarChart3, 
  Cpu, 
  Activity, 
  Database, 
  Settings, 
  ShieldAlert 
} from 'lucide-react';

export default function Sidebar({ activePage, onPageChange, activeAlertsCount = 0 }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'map', label: 'Live Map', icon: Map },
    { id: 'alerts', label: 'Alerts', icon: BellRing, badge: activeAlertsCount > 0 ? activeAlertsCount : null },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'modelinfo', label: 'Model Information', icon: Cpu },
    { id: 'systemhealth', label: 'System Health', icon: Activity },
    { id: 'datasources', label: 'Data Sources', icon: Database } // Data Sources at the LAST of the sidebar!
  ];

  return (
    <aside className="app-sidebar" style={{
      width: '240px',
      minWidth: '240px',
      background: '#0b1329',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between',
      height: '100vh',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      zIndex: 500,
      userSelect: 'none'
    }}>
      {/* Top Brand Area */}
      <div>
        <div style={{
          padding: '20px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)'
          }}>
            <ShieldAlert size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, letterSpacing: '0.5px', color: '#ffffff' }}>
              BHOOMIRAKSHAK
            </h1>
            <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 600, margin: '2px 0 0 0' }}>
              Disaster Early Warning
            </div>
          </div>
        </div>

        {/* Navigation Items List */}
        <nav style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => {
            const IconComp = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? '#0284c7' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <IconComp size={18} color={isActive ? '#ffffff' : '#94a3b8'} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span style={{
                    background: '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '10px',
                    minWidth: '18px',
                    textAlign: 'center'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Settings Link & Footer */}
      <div style={{ padding: '14px 10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <button
          onClick={() => onPageChange('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: 'none',
            background: activePage === 'settings' ? '#0284c7' : 'transparent',
            color: activePage === 'settings' ? '#ffffff' : '#94a3b8',
            fontWeight: activePage === 'settings' ? 700 : 500,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Settings size={18} color={activePage === 'settings' ? '#ffffff' : '#94a3b8'} />
          <span>Settings</span>
        </button>

        <div style={{ padding: '10px 14px 4px 14px', fontSize: '0.68rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
          <span>v2.4 Operational Build</span>
        </div>
      </div>
    </aside>
  );
}
