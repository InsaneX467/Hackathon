export default function MapLegend() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 500,
        background: 'rgba(8, 16, 32, 0.88)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '12px',
        padding: '12px 18px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.55)',
        minWidth: '180px',
        pointerEvents: 'auto'
      }}
    >
      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.6px', marginBottom: '8px' }}>
        HAZARD TYPES
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* 1. Landslide Risk */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '22px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="20" viewBox="0 0 32 30" fill="none">
              <path d="M16 3 C16.6 3 17.2 3.4 17.5 4 L28.5 24 C29 25 28.3 26.5 27.1 26.5 L4.9 26.5 C3.7 26.5 3 25 3.5 24 L14.5 4 C14.8 3.4 15.4 3 16 3 Z" fill="#ef4444" stroke="#ffffff" strokeWidth="1.2" />
              <path d="M10 23 L16 13" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="18" cy="16" r="1.5" fill="#ffffff" />
              <circle cx="21" cy="20" r="1.3" fill="#ffffff" />
            </svg>
          </div>
          <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>Landslide Risk</span>
        </div>

        {/* 2. Flash Flood Risk */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '22px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="5" fill="#f97316" stroke="#ffffff" strokeWidth="1" />
              <path d="M5 10 C6.5 9 8 11 9.5 10 C11 9 12.5 11 14 10 C15.5 9 17 11 18.5 10" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M5 14 C6.5 13 8 15 9.5 14 C11 13 12.5 15 14 14 C15.5 13 17 15 18.5 14" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>Flash Flood Risk</span>
        </div>

        {/* 3. Normal / Safe */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '22px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
              <path d="M6 10 C7.5 9 9 11 10.5 10 C12 9 13.5 11 15 10 C16.5 9 18 11 18 10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M6 14 C7.5 13 9 15 10.5 14 C12 13 13.5 15 15 14 C16.5 13 18 15 18 14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>Normal / Safe</span>
        </div>

        {/* 4. Rainfall Station */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '22px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="22" viewBox="0 0 24 28" fill="none">
              <path d="M12 2 C12 2 20 11.5 20 17 C20 21.4 16.4 25 12 25 C7.6 25 4 21.4 4 17 C4 11.5 12 2 12 2 Z" fill="#0284c7" stroke="#ffffff" strokeWidth="1.2" />
              <path d="M12 10 C12 10 16 15 16 18 C16 20.2 14.2 22 12 22 C9.8 22 8 20.2 8 18 C8 15 12 10 12 10 Z" fill="#ffffff" />
            </svg>
          </div>
          <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>Rainfall Station</span>
        </div>

        {/* 5. River */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '22px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '22px', height: '2.5px', background: '#0284c7', borderRadius: '2px' }} />
          </div>
          <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>River</span>
        </div>

        {/* 6. District Boundary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '22px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '22px', borderBottom: '2px dashed #94a3b8' }} />
          </div>
          <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>District Boundary</span>
        </div>
      </div>
    </div>
  );
}
