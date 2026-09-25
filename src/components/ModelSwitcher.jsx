import React from 'react';
import { Mountain, Waves } from 'lucide-react';

export default function ModelSwitcher({ selectedModel = 'landslide', onModelChange, theme = 'light' }) {
  const isLandslide = selectedModel === 'landslide';
  const isFlood = selectedModel === 'flash_flood' || selectedModel === 'flood';

  const handleSelect = (mode) => {
    if (onModelChange) {
      onModelChange(mode);
    }
  };

  return (
    <div className="model-switcher-container" style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '4px'
    }}>
      <div style={{
        fontSize: '0.65rem',
        fontWeight: 800,
        letterSpacing: '0.05em',
        color: theme === 'dark' ? '#94a3b8' : '#64748b',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        PRIMARY HAZARD VIEW
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '3px',
        borderRadius: '20px',
        background: theme === 'dark' ? '#1e293b' : '#e2e8f0',
        border: theme === 'dark' ? '1px solid #334155' : '1px solid #cbd5e1',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <button
          type="button"
          onClick={() => handleSelect('landslide')}
          title="Switch to Landslide Hazard Prediction View"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 14px',
            borderRadius: '16px',
            border: 'none',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: isLandslide 
              ? '#0284c7' 
              : 'transparent',
            color: isLandslide 
              ? '#ffffff' 
              : (theme === 'dark' ? '#cbd5e1' : '#475569'),
            boxShadow: isLandslide ? '0 2px 6px rgba(2, 132, 199, 0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Mountain size={14} color={isLandslide ? '#ffffff' : '#0284c7'} />
          <span>⛰ LANDSLIDE</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelect('flash_flood')}
          title="Switch to Flash Flood Hazard Assessment View"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 14px',
            borderRadius: '16px',
            border: 'none',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: isFlood 
              ? '#0284c7' 
              : 'transparent',
            color: isFlood 
              ? '#ffffff' 
              : (theme === 'dark' ? '#cbd5e1' : '#475569'),
            boxShadow: isFlood ? '0 2px 6px rgba(2, 132, 199, 0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Waves size={14} color={isFlood ? '#ffffff' : '#38bdf8'} />
          <span>🌊 FLASH FLOOD</span>
        </button>
      </div>
    </div>
  );
}
