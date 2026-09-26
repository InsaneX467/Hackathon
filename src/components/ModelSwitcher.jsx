import React from 'react';
import { Mountain, Waves } from 'lucide-react';

export default function ModelSwitcher({ selectedModel = 'landslide', onModelChange }) {
  const isLandslide = selectedModel === 'landslide';
  const isFlood = selectedModel === 'flash_flood' || selectedModel === 'flood';

  const handleSelect = (mode) => {
    if (onModelChange) {
      onModelChange(mode);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      background: 'var(--input-bg)',
      border: '1px solid var(--card-border)',
      padding: '4px 6px',
      borderRadius: '12px'
    }}>
      <span style={{
        fontSize: '0.68rem',
        fontWeight: 700,
        color: 'var(--text-muted)',
        padding: '0 10px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        Primary Hazard View
      </span>

      <button
        type="button"
        onClick={() => handleSelect('landslide')}
        title="Switch to Landslide Hazard View"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 12px',
          borderRadius: '8px',
          border: 'none',
          fontSize: '0.75rem',
          fontWeight: 700,
          cursor: 'pointer',
          background: isLandslide ? 'var(--accent-blue)' : 'transparent',
          color: isLandslide ? '#ffffff' : 'var(--text-secondary)',
          transition: 'all 0.15s ease'
        }}
      >
        <Mountain size={13} color={isLandslide ? '#ffffff' : 'var(--text-secondary)'} />
        <span>LANDSLIDE</span>
      </button>

      <button
        type="button"
        onClick={() => handleSelect('flash_flood')}
        title="Switch to Flash Flood View"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 12px',
          borderRadius: '8px',
          border: 'none',
          fontSize: '0.75rem',
          fontWeight: 700,
          cursor: 'pointer',
          background: isFlood ? 'var(--accent-blue)' : 'transparent',
          color: isFlood ? '#ffffff' : 'var(--text-secondary)',
          transition: 'all 0.15s ease'
        }}
      >
        <Waves size={13} color={isFlood ? '#ffffff' : 'var(--text-secondary)'} />
        <span>FLASH FLOOD</span>
      </button>
    </div>
  );
}
