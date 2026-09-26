import { useState } from 'react';
import { 
  Sliders, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  ShieldAlert, 
  Check, 
  Monitor, 
  Database, 
  Zap, 
  RotateCcw, 
  Sparkles, 
  Info 
} from 'lucide-react';

export default function SettingsPage({ 
  theme = 'dark', 
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
    if (onToggleTheme) onToggleTheme('dark');
    if (onToggleSiren) onToggleSiren(false);
    if (onRefreshIntervalChange) onRefreshIntervalChange(15);
    setSensitivity('standard');
    showNotification('Settings Reset to Default Values!');
  };

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
      
      {/* Hero Banner Header Card */}
      <div 
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          padding: '20px 24px',
          boxShadow: 'var(--glass-shadow)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'var(--accent-blue-glow)',
            border: '1px solid var(--card-border)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color: 'var(--accent-blue)'
          }}>
            <Sliders size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                System Settings & Operational Control
              </h1>
              <span style={{
                background: 'var(--accent-blue-glow)',
                color: 'var(--accent-blue)',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid var(--card-border)',
                fontFamily: 'monospace'
              }}>
                v2.4 STABLE
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
              Customize visual appearance themes, audio siren alarms, live IoT telemetry sync frequency, and risk model sensitivity parameters.
            </p>
          </div>
        </div>

        {saveToast && (
          <div style={{
            background: 'var(--risk-low-bg)',
            border: '1px solid var(--risk-low-border)',
            color: 'var(--risk-low)',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '0.82rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Check size={18} /> {toastMessage}
          </div>
        )}
      </div>

      {/* 3-Column Settings Controls Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '18px'
      }}>
        
        {/* CARD 1: Appearance Theme Engine */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: 'var(--glass-shadow)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
              <Monitor size={18} color="var(--accent-blue)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Appearance Theme Engine</h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '10px 0 14px 0', lineHeight: '1.5' }}>
              Switch between Light Mode (Clean GIS High-Visibility) and Dark Mode (Night Command Operations Center).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Light Theme Option */}
              <div
                onClick={() => onToggleTheme && onToggleTheme('light')}
                style={{
                  background: '#ffffff',
                  border: theme === 'light' ? '2px solid var(--accent-blue)' : '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sun size={20} color="#0284c7" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a' }}>Light Theme</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Clean Daylight GIS</div>
                </div>

                {theme === 'light' && (
                  <span style={{
                    background: '#0284c7', color: '#ffffff', fontSize: '0.65rem', fontWeight: 800,
                    padding: '2px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    <Check size={11} /> ACTIVE
                  </span>
                )}
              </div>

              {/* Dark Theme Option */}
              <div
                onClick={() => onToggleTheme && onToggleTheme('dark')}
                style={{
                  background: '#1e293b',
                  border: theme === 'dark' ? '2px solid #38bdf8' : '1px solid #334155',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Moon size={20} color="#38bdf8" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#ffffff' }}>Dark Theme</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Night Ops Center</div>
                </div>

                {theme === 'dark' && (
                  <span style={{
                    background: '#0284c7', color: '#ffffff', fontSize: '0.65rem', fontWeight: 800,
                    padding: '2px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    <Check size={11} /> ACTIVE
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Emergency Siren Audio Alarm */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: 'var(--glass-shadow)',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
              <ShieldAlert size={18} color="var(--risk-high)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Emergency Siren Audio Alarm</h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '10px 0 14px 0', lineHeight: '1.5' }}>
              Play audio chime alerts when a NEW Critical Evacuation Alert (Risk Score &ge; 80) is triggered.
            </p>

            <div style={{
              background: 'var(--input-bg)',
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid var(--card-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '8px',
                    background: sirenEnabled ? 'var(--risk-high-bg)' : 'var(--accent-blue-glow)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {sirenEnabled ? <Volume2 size={16} color="var(--risk-high)" /> : <VolumeX size={16} color="var(--text-muted)" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                      {sirenEnabled ? 'Audio Siren Active' : 'Siren Audio Muted'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      {sirenEnabled ? 'Sound enabled on Critical Evacuation' : 'Visual notification banners only'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleSiren && onToggleSiren(!sirenEnabled)}
                  style={{
                    padding: '6px 12px', borderRadius: '8px', border: 'none',
                    fontWeight: 800, fontSize: '0.72rem', cursor: 'pointer',
                    background: sirenEnabled ? 'var(--risk-high)' : 'var(--text-muted)',
                    color: '#ffffff'
                  }}
                >
                  {sirenEnabled ? 'ENABLED' : 'MUTED'}
                </button>
              </div>

              <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Test audio chime:</span>
                <button
                  type="button"
                  onClick={playSampleSiren}
                  disabled={testingAudio}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '4px 10px', borderRadius: '6px',
                    border: '1px solid var(--card-border)', background: 'var(--card-bg)',
                    color: 'var(--accent-blue)', fontSize: '0.72rem', fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Sparkles size={12} />
                  {testingAudio ? 'Testing...' : 'Test Audio Alarm'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: Telemetry Sync Polling Rate */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: 'var(--glass-shadow)',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
              <RefreshCw size={18} color="var(--accent-blue)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Telemetry Sync Polling Rate</h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '10px 0 14px 0', lineHeight: '1.5' }}>
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
                    padding: '10px 4px',
                    borderRadius: '8px',
                    border: refreshInterval === item.sec ? '2px solid var(--accent-blue)' : '1px solid var(--card-border)',
                    background: refreshInterval === item.sec ? 'var(--accent-blue-glow)' : 'var(--input-bg)',
                    color: refreshInterval === item.sec ? 'var(--accent-blue)' : 'var(--text-primary)',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{item.label}</span>
                  <span style={{ fontSize: '0.62rem', color: refreshInterval === item.sec ? 'var(--accent-blue)' : 'var(--text-muted)' }}>{item.badge}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Hazard Sensitivity Tuning Section Card */}
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: 'var(--glass-shadow)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
          <Zap size={18} color="var(--risk-medium)" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Hazard Sensitivity Tuning</h3>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
          Adjust classification threshold sensitivity for early landslide and flash flood warning triggers.
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
                padding: '8px 14px',
                borderRadius: '10px',
                border: sensitivity === opt.id ? '1px solid var(--risk-medium)' : '1px solid var(--card-border)',
                fontWeight: 700,
                fontSize: '0.76rem',
                cursor: 'pointer',
                background: sensitivity === opt.id ? 'var(--risk-medium-bg)' : 'var(--input-bg)',
                color: sensitivity === opt.id ? 'var(--risk-medium)' : 'var(--text-secondary)'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Diagnostics & Action Footer */}
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <Database size={16} color="var(--accent-blue)" />
          <span>Active Dataset: <strong>IndLands Remote Sensing (30,000 Points)</strong></span>
          <span>•</span>
          <span>Active Nodes: <strong>14 Sensors Online</strong></span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleResetDefaults}
            style={{
              padding: '8px 16px', borderRadius: '10px',
              border: '1px solid var(--card-border)', background: 'transparent',
              color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>

          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: '8px 20px', borderRadius: '10px', border: 'none',
              background: 'var(--accent-blue)', color: '#ffffff', fontSize: '0.8rem', fontWeight: 800,
              cursor: 'pointer', boxShadow: 'var(--accent-blue-glow)',
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
