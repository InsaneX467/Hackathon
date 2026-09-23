import { useState } from 'react';
import { Settings, Sun, Moon, Volume2, VolumeX, RefreshCw, ShieldAlert, Check, Monitor, Sliders } from 'lucide-react';

export default function SettingsPage({ 
  theme = 'light', 
  onToggleTheme,
  sirenEnabled = false,
  onToggleSiren,
  refreshInterval = 15,
  onRefreshIntervalChange
}) {
  const [saveToast, setSaveToast] = useState(false);
  const [sensitivity, setSensitivity] = useState('standard');

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="page-container settings-page" style={{ padding: '24px', color: '#0f172a', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflowY: 'auto' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={22} color="#0284c7" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Settings & Preferences</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
              Configure visual appearance, alert sirens, telemetry refresh rates, and risk thresholds
            </p>
          </div>
        </div>

        {saveToast && (
          <div style={{
            background: '#dcfce7', border: '1px solid #86efac', color: '#15803d',
            padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <Check size={16} /> Preferences Saved
          </div>
        )}
      </div>

      {/* Grid of Settings Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        
        {/* SECTION 1: APPEARANCE & THEME (LIGHT / DARK) */}
        <div style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--panel-border)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          gap: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Monitor size={20} color="#0284c7" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Appearance Theme Mode
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 16px 0' }}>
              Switch between Light Mode (Clean GIS White) and Dark Mode (High-Contrast Night Operations Center).
            </p>

            {/* Light / Dark Mode Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Light Mode Card Button */}
              <button
                onClick={() => onToggleTheme && onToggleTheme('light')}
                style={{
                  background: theme === 'light' ? '#f0f9ff' : '#ffffff',
                  border: theme === 'light' ? '2px solid #0284c7' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sun size={20} color="#0284c7" />
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: theme === 'light' ? '#0284c7' : '#0f172a' }}>
                  Light Mode
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Clean GIS Display</span>
                {theme === 'light' && (
                  <span style={{ background: '#0284c7', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', marginTop: '4px' }}>
                    ACTIVE
                  </span>
                )}
              </button>

              {/* Dark Mode Card Button */}
              <button
                onClick={() => onToggleTheme && onToggleTheme('dark')}
                style={{
                  background: theme === 'dark' ? '#0f172a' : '#ffffff',
                  border: theme === 'dark' ? '2px solid #38bdf8' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Moon size={20} color="#38bdf8" />
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: theme === 'dark' ? '#38bdf8' : '#0f172a' }}>
                  Dark Mode
                </span>
                <span style={{ fontSize: '0.72rem', color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>Night Operations</span>
                {theme === 'dark' && (
                  <span style={{ background: '#38bdf8', color: '#0f172a', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', marginTop: '4px' }}>
                    ACTIVE
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: EMERGENCY SIREN SOUND CONTROL */}
        <div style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--panel-border)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          gap: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <ShieldAlert size={20} color="#dc2626" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Emergency Alert Siren
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 16px 0' }}>
              Enable browser audio siren chime when a NEW Critical Evacuation Alert (Risk &gt; 80) is triggered.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {sirenEnabled ? <Volume2 size={20} color="#dc2626" /> : <VolumeX size={20} color="#64748b" />}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>
                    {sirenEnabled ? 'Audio Siren Active' : 'Siren Audio Muted'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {sirenEnabled ? 'Plays sound on Critical Evacuation' : 'Visual notification banners only'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onToggleSiren && onToggleSiren(!sirenEnabled)}
                style={{
                  padding: '6px 14px', borderRadius: '8px', border: 'none',
                  fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                  background: sirenEnabled ? '#dc2626' : '#e2e8f0',
                  color: sirenEnabled ? '#ffffff' : '#475569'
                }}
              >
                {sirenEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: TELEMETRY REFRESH INTERVAL */}
        <div style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--panel-border)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          gap: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <RefreshCw size={20} color="#0284c7" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Telemetry Sync Frequency
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 14px 0' }}>
              Configure automatic polling frequency for live IoT rainfall and river stage telemetry.
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              {[15, 30, 60, 0].map(sec => (
                <button
                  key={sec}
                  onClick={() => onRefreshIntervalChange && onRefreshIntervalChange(sec)}
                  style={{
                    flex: 1, padding: '10px 8px', borderRadius: '8px', border: 'none',
                    fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                    background: refreshInterval === sec ? '#0284c7' : '#f1f5f9',
                    color: refreshInterval === sec ? '#ffffff' : '#64748b'
                  }}
                >
                  {sec === 0 ? 'Manual Only' : `${sec} sec`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 4: THRESHOLD SENSITIVITY */}
        <div style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--panel-border)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          gap: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Sliders size={20} color="#0284c7" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Risk Sensitivity Level
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 14px 0' }}>
              Adjust hazard calculation sensitivity for early evacuation triggers.
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { id: 'standard', label: 'Standard (Default)' },
                { id: 'high', label: 'High Sensitivity' },
                { id: 'conservative', label: 'Conservative' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSensitivity(opt.id)}
                  style={{
                    flex: 1, padding: '10px 8px', borderRadius: '8px', border: 'none',
                    fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                    background: sensitivity === opt.id ? '#0284c7' : '#f1f5f9',
                    color: sensitivity === opt.id ? '#ffffff' : '#64748b'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Save Button Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <button
          onClick={handleSave}
          style={{
            padding: '10px 24px', borderRadius: '8px', border: 'none',
            background: '#0284c7', color: '#ffffff', fontSize: '0.85rem', fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)'
          }}
        >
          Save Preferences
        </button>
      </div>

    </div>
  );
}
