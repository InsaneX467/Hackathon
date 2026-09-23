import { Search, Bell, User, CheckCircle, AlertTriangle } from 'lucide-react';
import { getSystemHealthSummary, formatDataAgeSeconds } from '../services/dataStatusService';

export default function Header({ 
  villages = [], 
  alerts = [], 
  mode = 'landslide', 
  lastUpdatedTime,
  searchQuery = '',
  onSearchChange
}) {
  const health = getSystemHealthSummary();
  const activeAlertsCount = alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH' || a.critical).length;
  const ageText = formatDataAgeSeconds(lastUpdatedTime || new Date());

  return (
    <header className="dashboard-header" style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      height: '56px',
      minHeight: '56px'
    }}>
      {/* Search Input Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '320px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#f1f5f9',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '6px 14px',
          width: '100%'
        }}>
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search ward, village or location..."
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.8rem',
              color: '#0f172a',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Right Controls: Operational Status, IST Time, Notifications, User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '16px',
          background: health.overallStatus === 'CRITICAL' ? '#fee2e2' : '#dcfce7',
          color: health.overallStatus === 'CRITICAL' ? '#991b1b' : '#15803d',
          fontSize: '0.75rem',
          fontWeight: 700,
          border: `1px solid ${health.overallStatus === 'CRITICAL' ? '#fca5a5' : '#86efac'}`
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: health.overallStatus === 'CRITICAL' ? '#ef4444' : '#10b981'
          }}></span>
          <span>STATUS: {health.overallStatus}</span>
        </div>

        <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>
          12 Dec 2024, 14:32 IST
        </div>

        {/* Notification Bell Badge */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Bell size={16} color="#0f172a" />
          </div>
          {activeAlertsCount > 0 && (
            <span style={{
              position: 'absolute', top: '-2px', right: '-2px',
              background: '#ef4444', color: '#fff', fontSize: '0.65rem',
              fontWeight: 800, width: '16px', height: '16px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {activeAlertsCount}
            </span>
          )}
        </div>

        {/* User Profile Icon */}
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%', background: '#e0f2fe',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}>
          <User size={16} color="#0284c7" />
        </div>
      </div>
    </header>
  );
}
