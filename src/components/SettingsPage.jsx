import { useState } from 'react';
import { 
  Settings, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  ShieldAlert, 
  Check, 
  Monitor, 
  Sliders,
  Database,
  Radio,
  Zap,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

export default function SettingsPage({ 
  theme = 'light', 
  onToggleTheme,
  sirenEnabled = false,
  onToggleSiren,
  refreshInterval = 15,
  onRefreshIntervalChange
}) {
  const [saveToast, setSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [sensitivity, setSensitivity] = useState('standard');
  const [testingAudio, setTestingAudio] = useState(false);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleSave = () => {
    showNotification('System Preferences Saved Successfully!');
  };

  const handleResetDefaults = () => {
    if (onToggleTheme) onToggleTheme('light');
    if (onToggleSiren) onToggleSiren(false);
    if (onRefreshIntervalChange) onRefreshIntervalChange(15);
    setSensitivity('standard');
    showNotification('Settings Reset to Default Values!');
  };

  // Web Audio API emergency siren chime preview
  const playSampleSiren = () => {
    try {
      setTestingAudio(true);
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);

      setTimeout(() => setTestingAudio(false), 600);
    } catch (e) {
      setTestingAudio(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="page-container settings-page" style={{
      padding: '24px',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      flex: 1,
      overflowY: 'auto',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    }}>
      
      {/* 1. TOP HEADER BAR */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        background: isDark ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid var(--panel-border)',
        borderRadius: '16px',
        padding: '20px 24px',
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: isDark ? 'rgba(56, 189, 248, 0.15)' : '#e0f2fe',
            border: isDark ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid #bae6fd',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isDark ? '0 0 15px rgba(56, 189, 248, 0.2)' : 'none'
          }}>
            <Sliders size={24} color={isDark ? '#38bdf8' : '#0284c7'} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                System Settings & Operational Control
              </h1>
              <span style={{
                background: isDark ? 'rgba(56, 189, 248, 0.2)' : '#e0f2fe',
                color: isDark ? '#38bdf8' : '#0284c7',
                fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px'
              }}>
                v2.4 STABLE
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', margin: '4px 0 0 0' }}>
              Customize visual appearance themes, audio siren alarms, live IoT telemetry sync frequency, and risk model sensitivity parameters.
            </p>
          </div>
        </div>

        {saveToast && (
          <div style={{
            background: isDark ? '#064e3b' : '#dcfce7',
            border: isDark ? '1px solid #059669' : '1px solid #86efac',
            color: isDark ? '#6ee7b7' : '#15803d',
            padding: '8px 16px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: '8px',
            animation: 'fadeIn 0.2s ease-in-out'
          }}>
            <Check size={18} /> {toastMessage}
          </div>
        )}
      </div>

      {/* 2. MAIN 2-COLUMN SETTINGS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        
        {/* CARD 1: VISUAL APPEARANCE & LIGHT/DARK THEME SELECTOR */}
        <div style={{
          background: isDark ? '#0f172a' : '#ffffff',
          border: '1px solid var(--panel-border)',
          borderRadius: '16px',
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          gap: '18px',
          boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Monitor size={20} color={isDark ? '#38bdf8' : '#0284c7'} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Appearance Theme Engine
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 16px 0' }}>
              Switch between Light Mode (Clean GIS High-Visibility) and Dark Mode (Night Command Operations Center).
            </p>

            {/* Interactive Theme Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {/* LIGHT MODE SELECTION CARD */}
              <div
                onClick={() => onToggleTheme && onToggleTheme('light')}
                style={{
                  background: '#ffffff',
                  border: theme === 'light' ? '2px solid #0284c7' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: theme === 'light' ? '0 4px 14px rgba(2, 132, 199, 0.2)' : 'none',
                  transition: 'all 0.2s ease',
                  transform: theme === 'light' ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sun size={22} color="#0284c7" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>Light Theme</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Clean Daylight GIS</div>
                </div>

                {/* Visual Mockup Preview */}
                <div style={{ width: '100%', height: '40px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px 6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ width: '60%', height: '6px', background: '#0284c7', borderRadius: '3px' }}></div>
                  <div style={{ width: '100%', height: '14px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '3px' }}></div>
                </div>

                {theme === 'light' && (
                  <span style={{
                    background: '#0284c7', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800,
                    padding: '2px 10px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    <Check size={12} /> ACTIVE
                  </span>
                )}
              </div>

              {/* DARK MODE SELECTION CARD */}
              <div
                onClick={() => onToggleTheme && onToggleTheme('dark')}
                style={{
                  background: '#090d16',
                  border: theme === 'dark' ? '2px solid #38bdf8' : '1px solid #1e293b',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: theme === 'dark' ? '0 4px 16px rgba(56, 189, 248, 0.25)' : 'none',
                  transition: 'all 0.2s ease',
                  transform: theme === 'dark' ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Moon size={22} color="#38bdf8" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#f8fafc' }}>Dark Theme</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>Night Ops Center</div>
                </div>

                {/* Visual Mockup Preview */}
                <div style={{ width: '100%', height: '40px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '4px 6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ width: '60%', height: '6px', background: '#38bdf8', borderRadius: '3px' }}></div>
                  <div style={{ width: '100%', height: '14px', background: '#1e293b', border: '1px solid #334155', borderRadius: '3px' }}></div>
                </div>

                {theme === 'dark' && (
                  <span style={{
                    background: '#38bdf8', color: '#0f172a', fontSize: '0.68rem', fontWeight: 800,
                    padding: '2px 10px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    <Check size={12} /> ACTIVE
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: EMERGENCY SIREN & AUDIO ALARM CONTROLS */}
        <div style={{
          background: isDark ? '#0f172a' : '#ffffff',
          border: '1px solid var(--panel-border)',
          borderRadius: '16px',
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          gap: '18px',
          boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <ShieldAlert size={20} color="#dc2626" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Emergency Siren Audio Alarm
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 16px 0' }}>
              Play audio chime alerts when a NEW Critical Evacuation Alert (Risk Score &ge; 80) is triggered.
            </p>

            <div style={{
              background: isDark ? '#1e293b' : '#f8fafc',
              padding: '16px',
              borderRadius: '12px',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: sirenEnabled ? '#fee2e2' : '#f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {sirenEnabled ? <Volume2 size={18} color="#dc2626" /> : <VolumeX size={18} color="#64748b" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      {sirenEnabled ? 'Audio Siren Active' : 'Siren Audio Muted'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {sirenEnabled ? 'Plays sound on Critical Evacuation' : 'Visual notification banners only'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleSiren && onToggleSiren(!sirenEnabled)}
                  style={{
                    padding: '8px 16px', borderRadius: '20px', border: 'none',
                    fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer',
                    background: sirenEnabled ? '#dc2626' : '#cbd5e1',
                    color: sirenEnabled ? '#ffffff' : '#475569',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {sirenEnabled ? 'SIREN ENABLED' : 'MUTED'}
                </button>
              </div>

              {/* Sample Siren Test Button */}
              <div style={{ borderTop: isDark ? '1px solid #334155' : '1px solid #e2e8f0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Test audio chime synth:</span>
                <button
                  type="button"
                  onClick={playSampleSiren}
                  disabled={testingAudio}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '5px 12px', borderRadius: '8px',
                    border: '1px solid #cbd5e1', background: isDark ? '#0f172a' : '#ffffff',
                    color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Sparkles size={13} color="#0284c7" />
                  {testingAudio ? 'Playing Chime...' : 'Test Audio Alarm'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: TELEMETRY REFRESH POLLING RATE */}
        <div style={{
          background: isDark ? '#0f172a' : '#ffffff',
          border: '1px solid var(--panel-border)',
          borderRadius: '16px',
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          gap: '18px',
          boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <RefreshCw size={20} color={isDark ? '#38bdf8' : '#0284c7'} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Telemetry Sync Polling Rate
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 16px 0' }}>
              Configure high-frequency polling interval for live IoT rain gauges, soil moisture probes, and river stage sensors.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[
                { sec: 15, label: '15s', badge: 'LIVE' },
                { sec: 30, label: '30s', badge: 'FAST' },
                { sec: 60, label: '60s', badge: 'ECO' },
                { sec: 0, label: 'Off', badge: 'MANUAL' }
              ].map(item => (
                <button
                  key={item.sec}
                  type="button"
                  onClick={() => onRefreshIntervalChange && onRefreshIntervalChange(item.sec)}
                  style={{
                    padding: '12px 6px',
                    borderRadius: '10px',
                    border: refreshInterval === item.sec ? '2px solid #0284c7' : (isDark ? '1px solid #1e293b' : '1px solid #e2e8f0'),
                    background: refreshInterval === item.sec ? (isDark ? 'rgba(2, 132, 199, 0.2)' : '#e0f2fe') : (isDark ? '#1e293b' : '#f8fafc'),
                    color: refreshInterval === item.sec ? (isDark ? '#38bdf8' : '#0284c7') : 'var(--text-primary)',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{item.label}</span>
                  <span style={{ fontSize: '0.65rem', color: refreshInterval === item.sec ? '#0284c7' : 'var(--text-muted)' }}>{item.badge}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 4: SVM HAZARD MODEL SENSITIVITY */}
        <div style={{
          background: isDark ? '#0f172a' : '#ffffff',
          border: '1px solid var(--panel-border)',
          borderRadius: '16px',
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          gap: '18px',
          boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Zap size={20} color="#f59e0b" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Hazard Sensitivity Tuning
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 16px 0' }}>
              Adjust classification threshold sensitivity for early landslide and flash flood warning triggers.
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { id: 'standard', label: 'Standard (80 Threshold)' },
                { id: 'high', label: 'High Early Warning (70)' },
                { id: 'conservative', label: 'Conservative (60)' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSensitivity(opt.id)}
                  style={{
                    flex: 1, padding: '10px 8px', borderRadius: '10px',
                    border: sensitivity === opt.id ? '2px solid #f59e0b' : (isDark ? '1px solid #1e293b' : '1px solid #e2e8f0'),
                    fontWeight: 700, fontSize: '0.74rem', cursor: 'pointer',
                    background: sensitivity === opt.id ? (isDark ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb') : (isDark ? '#1e293b' : '#f8fafc'),
                    color: sensitivity === opt.id ? '#d97706' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 3. SYSTEM DIAGNOSTICS & FOOTER BAR */}
      <div style={{
        background: isDark ? '#0f172a' : '#ffffff',
        border: '1px solid var(--panel-border)',
        borderRadius: '16px',
        padding: '18px 24px',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <Database size={16} color="#0284c7" />
          <span>Active Dataset: <strong>IndLands Remote Sensing (30,000 Points)</strong></span>
          <span>•</span>
          <span>Active Nodes: <strong>14 Sensors Online</strong></span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={handleResetDefaults}
            style={{
              padding: '10px 18px', borderRadius: '10px',
              border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
              background: 'transparent', color: 'var(--text-secondary)',
              fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>

          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: '10px 24px', borderRadius: '10px', border: 'none',
              background: '#0284c7', color: '#ffffff', fontSize: '0.85rem', fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <Check size={16} /> Save Settings
          </button>
        </div>
      </div>

    </div>
  );
}
