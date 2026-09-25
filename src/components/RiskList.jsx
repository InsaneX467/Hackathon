import { useState, useRef } from 'react';
import { Search, MapPin, CloudRain, Droplets, Mountain, ShieldAlert, Waves, Clock, Navigation, Home, History, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { formatDataAgeSeconds } from '../services/dataStatusService';

export default function RiskList({ villages = [], selectedId, onSelect, onFocusMap, mode = 'landslide' }) {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('ALL');
  const [activeSubTab, setActiveSubTab] = useState('dossier'); // 'dossier' | 'shelter' | 'history'
  const searchInputRef = useRef(null);

  // Standardize filter category matching
  const filteredVillages = villages.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase());
    const label = v.cat?.label || (v.score >= 80 ? 'CRITICAL' : v.score >= 60 ? 'WARNING' : v.score >= 40 ? 'WATCH' : 'LOW');
    const matchesCat = filterCat === 'ALL' || label === filterCat;
    return matchesSearch && matchesCat;
  });

  const sortedVillages = [...filteredVillages].sort((a, b) => b.score - a.score);
  const selectedVillage = villages.find(v => v.id === selectedId) || sortedVillages[0] || villages[0];

  const getCategoryBadgeStyle = (score) => {
    if (score >= 80) return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', label: 'CRITICAL' };
    if (score >= 60) return { bg: '#fff7ed', text: '#ea580c', border: '#ffedd5', label: 'WARNING' };
    if (score >= 40) return { bg: '#fffbeb', text: '#d97706', border: '#fef3c7', label: 'WATCH' };
    return { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0', label: 'LOW' };
  };

  const selectedBadge = selectedVillage ? getCategoryBadgeStyle(selectedVillage.score) : null;

  return (
    <div className="page-container locations-page" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', color: '#0f172a', minHeight: '100%' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={22} color="#0284c7" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Monitored Wards & Regional Risk Matrix</h1>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '2px 0 0 0' }}>
              Real-time hydro-meteorological hazard assessments and disaster shelter routing across {villages.length} Himalayan & North-East wards
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, background: '#ffffff', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            {villages.length} of {villages.length} Wards Monitored
          </span>
        </div>
      </div>

      {/* Main 2-Column Master-Detail Split Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)', gap: '16px', flex: 1 }}>
        
        {/* LEFT COLUMN: WARD SELECTION LIST */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          
          {/* Search Box & Filter Pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <button
                type="button"
                onClick={() => {
                  if (sortedVillages.length > 0) {
                    onSelect(sortedVillages[0].id);
                  } else {
                    searchInputRef.current?.focus();
                  }
                }}
                title="Click to select top matching location"
                style={{
                  position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
                  background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <Search size={16} color="#0284c7" />
              </button>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search ward or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && sortedVillages.length > 0) {
                    onSelect(sortedVillages[0].id);
                  }
                }}
                style={{
                  width: '100%', padding: '8px 32px 8px 36px', borderRadius: '8px',
                  border: '1px solid #e2e8f0', fontSize: '0.82rem', background: '#f8fafc',
                  outline: 'none', color: '#0f172a'
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  title="Clear search"
                  style={{
                    position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <X size={14} color="#64748b" />
                </button>
              )}
            </div>

            {/* Standard Filter Pills */}
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px', overflowX: 'auto' }}>
              {['ALL', 'CRITICAL', 'WARNING', 'WATCH', 'LOW'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  style={{
                    padding: '5px 10px', borderRadius: '6px', border: 'none',
                    fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', flex: 1,
                    background: filterCat === cat ? (cat === 'CRITICAL' ? '#dc2626' : '#0284c7') : 'transparent',
                    color: filterCat === cat ? '#ffffff' : '#64748b',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List of Wards */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '520px' }}>
            {sortedVillages.map((v, index) => {
              const isSelected = selectedId === v.id;
              const badge = getCategoryBadgeStyle(v.score);

              return (
                <div
                  key={v.id}
                  onClick={() => onSelect(v.id)}
                  style={{
                    background: isSelected ? '#f0f9ff' : '#ffffff',
                    border: isSelected ? '1px solid #0284c7' : '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 6px rgba(2, 132, 199, 0.15)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', width: '20px' }}>
                      #{index + 1}
                    </span>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: isSelected ? '#0284c7' : '#0f172a' }}>
                        {v.name}
                      </div>
                      <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', color: '#64748b', marginTop: '3px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <CloudRain size={12} color="#0284c7" /> {Math.round(v.rain)} mm/h
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Droplets size={12} color="#10b981" /> {Math.round(v.moisture)}%
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Mountain size={12} color="#f59e0b" /> {Math.round(v.slope)}°
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800,
                      background: badge.bg, color: badge.text, border: `1px solid ${badge.border}`
                    }}>
                      {v.score} {badge.label}
                    </span>
                  </div>
                </div>
              );
            })}

            {sortedVillages.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                No wards match the selected filter parameters.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SELECTED WARD DOSSIER */}
        {selectedVillage && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            
            {/* Header Banner */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>{selectedVillage.name}</h2>
                  <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', color: '#64748b', fontWeight: 600 }}>
                    Lat {selectedVillage.lat.toFixed(4)}°, Lng {selectedVillage.lng.toFixed(4)}°
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                  Chamoli District, Garhwal Himalayas • Target Monitoring Ward 1
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800,
                  background: selectedBadge.bg, color: selectedBadge.text, border: `1px solid ${selectedBadge.border}`
                }}>
                  {selectedBadge.label} HAZARD (SCORE: {selectedVillage.score}/100)
                </span>
              </div>
            </div>

            {/* Dossier Navigation Sub-Tabs */}
            <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
              {[
                { id: 'dossier', label: 'Hazard & Telemetry Dossier' },
                { id: 'shelter', label: 'Evacuation Shelter & Route' },
                { id: 'history', label: 'Historical Benchmarks' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  style={{
                    padding: '6px 14px', borderRadius: '6px', border: 'none',
                    fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer',
                    background: activeSubTab === tab.id ? '#e0f2fe' : 'transparent',
                    color: activeSubTab === tab.id ? '#0284c7' : '#64748b'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: HAZARD & TELEMETRY DOSSIER */}
            {activeSubTab === 'dossier' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* 2 Hazard Breakdown Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  
                  {/* Landslide Card */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mountain size={16} color="#0284c7" /> Landslide Hazard
                      </span>
                      <span style={{ fontWeight: 800, fontSize: '0.85rem', color: selectedVillage.score >= 60 ? '#dc2626' : '#10b981' }}>
                        {selectedVillage.score} / 100
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: '1.5' }}>
                      <div>Rainfall Rate: <strong>{Math.round(selectedVillage.rain)} mm/h</strong></div>
                      <div>Soil Saturation: <strong>{Math.round(selectedVillage.moisture)}%</strong></div>
                      <div>Slope Angle: <strong>{Math.round(selectedVillage.slope)}° incline</strong></div>
                    </div>
                  </div>

                  {/* Flash Flood Card */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Waves size={16} color="#38bdf8" /> Flash Flood Inundation
                      </span>
                      <span style={{ fontWeight: 800, fontSize: '0.85rem', color: (selectedVillage.riverLevel || 1.4) >= (selectedVillage.dangerMark || 4.2) ? '#dc2626' : '#0284c7' }}>
                        {(selectedVillage.riverLevel || 1.4).toFixed(1)}m Stage
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: '1.5' }}>
                      <div>Warning Mark: <strong>{selectedVillage.warningMark || 3.2}m</strong></div>
                      <div>Danger Mark: <strong>{selectedVillage.dangerMark || 4.2}m</strong></div>
                      <div>Rise Rate: <strong>+{(selectedVillage.riverRiseRate || 1.5).toFixed(1)} m/h</strong></div>
                    </div>
                  </div>

                </div>

                {/* Key Indicators List */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                  <h4 style={{ fontSize: '0.82rem', fontWeight: 700, margin: '0 0 6px 0', color: '#0f172a' }}>
                    CONTRIBUTING RISK FACTORS & TELEMETRY OBSERVED
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#475569', lineHeight: '1.6' }}>
                    {selectedVillage.rain > 30 && <li>🌧 Heavy precipitation observed in catchment area ({Math.round(selectedVillage.rain)} mm/h)</li>}
                    {selectedVillage.moisture > 70 && <li>💧 High soil moisture saturation ({Math.round(selectedVillage.moisture)}%) increases landslide risk</li>}
                    {selectedVillage.slope > 35 && <li>⛰ Steep terrain slope inclination ({Math.round(selectedVillage.slope)}°) increases shear stress</li>}
                    <li>📡 Telemetry transmission active via IoT Sensor Mesh</li>
                  </ul>
                </div>

              </div>
            )}

            {/* TAB 2: EVACUATION SHELTER & ROUTE */}
            {activeSubTab === 'shelter' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Home size={18} color="#0284c7" /> Designated Relief Shelter
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#ffffff', color: '#0284c7', padding: '2px 8px', borderRadius: '10px', border: '1px solid #7dd3fc' }}>
                      {selectedVillage.shelter?.dist || '1.1 km away'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                    {selectedVillage.shelter?.name || 'Joshimath Secondary School Relief Camp'}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: '#475569', marginTop: '8px' }}>
                    <span>Capacity: <strong>{selectedVillage.shelter?.capacity || 450} Beds</strong></span>
                    <span>Status: <strong style={{ color: '#15803d' }}>{selectedVillage.shelter?.occupancy || '80 Beds Occupied'}</strong></span>
                    <span>Elevation: <strong>{selectedVillage.shelter?.elevation || '+120m'}</strong></span>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Navigation size={15} color="#0284c7" /> Recommended Evacuation Route Track
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700 }}>
                    {selectedVillage.shelter?.route || 'Take North Ridge Route 1B (Bypasses Lower Sinking Slope)'}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: HISTORICAL BENCHMARKS */}
            {activeSubTab === 'history' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <History size={16} color="#0284c7" /> Historical Flood & Landslide Benchmarks
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '6px 0', color: '#64748b' }}>10-Year Return Flood Mark</td>
                        <td style={{ padding: '6px 0', fontWeight: 700, textAlign: 'right', color: '#0f172a' }}>{selectedVillage.historicalData?.flood10yr || 3.5} m</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '6px 0', color: '#64748b' }}>50-Year Return Flood Mark</td>
                        <td style={{ padding: '6px 0', fontWeight: 700, textAlign: 'right', color: '#0f172a' }}>{selectedVillage.historicalData?.flood50yr || 4.9} m</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '6px 0', color: '#64748b' }}>2013 Kedarnath Event Peak</td>
                        <td style={{ padding: '6px 0', fontWeight: 700, textAlign: 'right', color: '#dc2626' }}>{selectedVillage.historicalData?.maxHistorical2013 || 5.6} m</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px 0', color: '#64748b' }}>2021 Chamoli Flood Peak</td>
                        <td style={{ padding: '6px 0', fontWeight: 700, textAlign: 'right', color: '#dc2626' }}>{selectedVillage.historicalData?.maxHistorical2021 || 4.8} m</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bottom Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
              <button
                onClick={() => onFocusMap && onFocusMap(selectedVillage.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '8px', border: 'none',
                  background: '#0284c7', color: '#ffffff', fontSize: '0.82rem', fontWeight: 700,
                  cursor: 'pointer', boxShadow: '0 2px 4px rgba(2, 132, 199, 0.2)'
                }}
              >
                Focus on Interactive Map <ExternalLink size={14} />
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}


