export default function MapControls({ onZoomIn, onZoomOut, onRecenter, onToggleLayers, showLayers }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '68px',
        left: '16px',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.96)',
        borderRadius: '8px',
        boxShadow: '0 4px 18px rgba(0,0,0,0.35)',
        overflow: 'hidden',
        width: '36px'
      }}
    >
      {/* Zoom In */}
      <button
        type="button"
        onClick={onZoomIn}
        title="Zoom In"
        style={{
          height: '36px',
          border: 'none',
          borderBottom: '1px solid #e2e8f0',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#0f172a',
          transition: 'background 0.15s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        +
      </button>

      {/* Zoom Out */}
      <button
        type="button"
        onClick={onZoomOut}
        title="Zoom Out"
        style={{
          height: '36px',
          border: 'none',
          borderBottom: '1px solid #e2e8f0',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          fontWeight: 'bold',
          color: '#0f172a',
          transition: 'background 0.15s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        −
      </button>

      {/* Center / Locate Target */}
      <button
        type="button"
        onClick={onRecenter}
        title="Center on Monitored Hazard Sector"
        style={{
          height: '36px',
          border: 'none',
          borderBottom: '1px solid #e2e8f0',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0f172a',
          transition: 'background 0.15s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="22" y1="12" x2="18" y2="12" />
          <line x1="6" y1="12" x2="2" y2="12" />
          <line x1="12" y1="6" x2="12" y2="2" />
          <line x1="12" y1="22" x2="12" y2="18" />
        </svg>
      </button>

      {/* Toggle Layers */}
      <button
        type="button"
        onClick={onToggleLayers}
        title="Toggle Hazard Layers"
        style={{
          height: '36px',
          border: 'none',
          background: showLayers ? '#e2e8f0' : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0f172a',
          transition: 'background 0.15s ease'
        }}
        onMouseEnter={(e) => {
          if (!showLayers) e.currentTarget.style.background = '#f1f5f9';
        }}
        onMouseLeave={(e) => {
          if (!showLayers) e.currentTarget.style.background = 'transparent';
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      </button>
    </div>
  );
}
