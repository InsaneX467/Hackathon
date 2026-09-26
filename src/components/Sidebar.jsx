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
    { id: 'datasources', label: 'Data Sources', icon: Database }
  ];

  return (
    <aside className="app-sidebar" style={{
      width: '256px',
      minWidth: '256px',
      background: 'var(--sidebar-bg)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between',
      height: '100vh',
      borderRight: '1px solid var(--sidebar-border)',
      zIndex: 500,
      userSelect: 'none',
      flexShrink: 0
    }}>
      {/* Top Brand Area */}
      <div>
        <div style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid var(--sidebar-border)'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'var(--accent-blue)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            boxShadow: '0 4px 12px var(--accent-blue-glow)',
            color: '#ffffff'
          }}>
            <ShieldAlert size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              BHOOMIRAKSHAK
            </h1>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
              Disaster Early Warning
            </div>
          </div>
        </div>

        {/* Navigation Items List */}
        <nav style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: isActive ? '1px solid var(--panel-border-hover)' : '1px solid transparent',
                  background: isActive ? 'var(--accent-blue-glow)' : 'transparent',
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <IconComp size={16} color={isActive ? 'var(--accent-blue)' : 'var(--text-secondary)'} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span style={{
                    background: 'var(--risk-high-bg)',
                    color: 'var(--risk-high)',
                    border: '1px solid var(--risk-high-border)',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '9999px',
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
      <div style={{ padding: '12px 10px', borderTop: '1px solid var(--sidebar-border)' }}>
        <button
          onClick={() => onPageChange('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '9px 12px',
            borderRadius: '8px',
            border: activePage === 'settings' ? '1px solid var(--panel-border-hover)' : '1px solid transparent',
            background: activePage === 'settings' ? 'var(--accent-blue-glow)' : 'transparent',
            color: activePage === 'settings' ? 'var(--accent-blue)' : 'var(--text-secondary)',
            fontWeight: activePage === 'settings' ? 700 : 500,
            fontSize: '0.84rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Settings size={16} color={activePage === 'settings' ? 'var(--accent-blue)' : 'var(--text-secondary)'} />
          <span>Settings</span>
        </button>

        <div style={{ padding: '8px 12px 2px 12px', fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>v2.4 Operational Build</span>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }}></span>
        </div>
      </div>
    </aside>
  );
}
