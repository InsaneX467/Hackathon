import { useState, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  CloudRain, 
  Droplets, 
  Mountain, 
  Waves, 
  Clock, 
  Navigation, 
  Home, 
  History, 
  ExternalLink, 
  ShieldCheck, 
  X,
  Radio
} from 'lucide-react';
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

  const getDistrictStateCode = (village) => {
    if (!village) return 'UKD';
    if (village.name.includes('Cherrapunji')) return 'MEG';
    if (village.name.includes('Guwahati') || village.name.includes('Silchar') || village.name.includes('Haflong') || village.name.includes('Majuli') || village.name.includes('Kaziranga')) return 'ASM';
    if (village.name.includes('Gangtok')) return 'SKM';
    if (village.name.includes('Aizawl')) return 'MIZ';
    if (village.name.includes('Itanagar')) return 'ARN';
    if (village.name.includes('Kohima')) return 'NGL';
    if (village.name.includes('Agartala')) return 'TRP';
    if (village.name.includes('Imphal')) return 'MNP';
    return 'UKD';
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', color: '#0f172a', minHeight: '100%' }}>
      
      {/* 1. PAGE HEADER BANNER */}
      <section style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        border: '1px solid rgba(226, 232, 240, 0.9)',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.06)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color: '#0284c7',
            flexShrink: 0
          }}>
            <MapPin size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Monitored Wards & Regional Risk Matrix
              </h1>
              <span style={{
                fontSize: '0.68rem',
                fontFamily: 'monospace',
                fontWeight: 700,
                background: '#ecfdf5',
                color: '#047857',
                border: '1px solid #a7f3d0',
                padding: '2px 8px',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }}></span>
                Live Stream
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 500, margin: '2px 0 0 0' }}>
              Real-time hydro-meteorological hazard assessments and disaster shelter routing across {villages.length} Himalayan & North-East wards
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.75rem',
            color: '#334155',
            fontWeight: 700,
            background: '#f1f5f9',
            padding: '6px 14px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }}></span>
            {villages.length} of {villages.length} Wards Monitored
          </span>
        </div>
      </section>

      {/* 2. MASTER-DETAIL 2-COLUMN GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 7fr)', gap: '16px', flex: 1 }}>
        
        {/* LEFT COLUMN: WARD SELECTION LIST */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.06)'
        }}>
          
          {/* Search Box & Category Filter Pills */}
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
                  position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <Search size={15} color="#94a3b8" />
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
                  width: '100%', padding: '8px 32px 8px 34px', borderRadius: '8px',
                  border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#f8fafc',
                  outline: 'none', color: '#0f172a', fontWeight: 500
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  title="Clear search"
                  style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <X size={14} color="#94a3b8" />
                </button>
              )}
            </div>

            {/* Severity Category Filter Pills */}
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px', overflowX: 'auto' }}>
              {[
                { id: 'ALL', count: villages.length },
                { id: 'CRITICAL', count: villages.filter(v => v.score >= 80).length },
                { id: 'WARNING', count: villages.filter(v => v.score >= 60 && v.score < 80).length },
                { id: 'WATCH', count: villages.filter(v => v.score >= 40 && v.score < 60).length },
                { id: 'LOW', count: villages.filter(v => v.score < 40).length }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCat(cat.id)}
                  style={{
                    padding: '5px 8px', borderRadius: '6px', border: 'none',
                    fontWeight: 700, fontSize: '0.68rem', cursor: 'pointer', flex: 1,
                    textTransform: 'uppercase', letterSpacing: '0.04em', whitespace: 'nowrap',
                    background: filterCat === cat.id ? '#0f172a' : 'transparent',
                    color: filterCat === cat.id ? '#ffffff' : '#64748b',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat.id} ({cat.count})
                </button>
              ))}
            </div>
          </div>

          {/* List of Wards */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '540px' }}>
            {sortedVillages.map((v, index) => {
              const isSelected = selectedId === v.id;
              const badge = getCategoryBadgeStyle(v.score);
              const stateCode = getDistrictStateCode(v);

              return (
                <div
                  key={v.id}
                  onClick={() => onSelect(v.id)}
                  style={{
                    background: isSelected ? '#f0f9ff' : '#ffffff',
                    border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.15)' : '0 1px 3px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', minWidth: 0 }}>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 800, color: isSelected ? '#0284c7' : '#94a3b8', marginTop: '2px' }}>
                      #{String(index + 1).padStart(2, '0')}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: isSelected ? '#0284c7' : '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {v.name}
                        </h3>
                        <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: isSelected ? '#0369a1' : '#64748b', fontWeight: 700 }}>
                          {stateCode}
                        </span>
                        {isSelected && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284c7', boxShadow: '0 0 6px #0284c7' }}></span>}
                      </div>

                      <div style={{ display: 'flex', gap: '10px', fontSize: '0.72rem', fontFamily: 'monospace', color: '#475569', marginTop: '4px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                          🌧 {Math.round(v.rain)} <span style={{ fontSize: '0.65rem', color: '#64748b' }}>mm/h</span>
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                          💧 {Math.round(v.moisture)}%
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                          📐 {Math.round(v.slope)}°
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '6px' }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: '4px', fontSize: '0.68rem', fontFamily: 'monospace', fontWeight: 800,
                      background: badge.bg, color: badge.text, border: `1px solid ${badge.border}`, textTransform: 'uppercase',
                      letterSpacing: '0.04em'
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
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: 'var(--glass-shadow)'
          }}>
            
            {/* Header Banner */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--card-border)', paddingBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{selectedVillage.name}</h2>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', background: 'var(--input-bg)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)', fontWeight: 600, border: '1px solid var(--card-border)' }}>
                    Lat {selectedVillage.lat.toFixed(4)}°, Lng {selectedVillage.lng.toFixed(4)}°
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span>Chamoli District, Garhwal Himalayas</span>
                  <span>•</span>
                  <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Station ID: JSH-01-NW</span>
                  <span>•</span>
                  <span>Target Monitoring Ward 1</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  padding: '4px 12px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, fontFamily: 'monospace',
                  background: selectedBadge.bg, color: selectedBadge.text, border: `1px solid ${selectedBadge.border}`,
                  letterSpacing: '0.04em'
                }}>
                  {selectedBadge.label} HAZARD (SCORE: {selectedVillage.score}/100)
                </span>
              </div>
            </div>

            {/* Dossier Navigation Sub-Tabs */}
            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '2px' }}>
              {[
                { id: 'dossier', label: 'Hazard & Telemetry Dossier' },
                { id: 'shelter', label: 'Evacuation Shelter & Route' },
                { id: 'history', label: 'Historical Benchmarks' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  style={{
                    padding: '8px 4px', border: 'none', background: 'transparent',
                    fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                    color: activeSubTab === tab.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    borderBottom: activeSubTab === tab.id ? '2px solid var(--accent-blue)' : '2px solid transparent'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: HAZARD & TELEMETRY DOSSIER */}
            {activeSubTab === 'dossier' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* 2 Hazard Comparison Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  
                  {/* Landslide Card */}
                  <div style={{ background: 'var(--input-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid var(--card-border)', paddingBottom: '6px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <Mountain size={14} color="var(--accent-blue)" /> LANDSLIDE HAZARD
                      </span>
                      <span style={{ fontWeight: 800, fontSize: '0.78rem', fontFamily: 'monospace', color: selectedVillage.score >= 60 ? 'var(--risk-high)' : 'var(--risk-low)', background: 'var(--risk-high-bg)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--risk-high-border)' }}>
                        {selectedVillage.score} / 100
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'sans-serif', color: 'var(--text-muted)' }}>Rainfall Rate:</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{Math.round(selectedVillage.rain)} mm/h</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'sans-serif', color: 'var(--text-muted)' }}>Soil Saturation:</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{Math.round(selectedVillage.moisture)}%</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'sans-serif', color: 'var(--text-muted)' }}>Slope Angle:</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{Math.round(selectedVillage.slope)}° incline</strong>
                      </div>
                    </div>
                  </div>

                  {/* Flash Flood Card */}
                  <div style={{ background: 'var(--input-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid var(--card-border)', paddingBottom: '6px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <Waves size={14} color="var(--accent-blue)" /> FLASH FLOOD INUNDATION
                      </span>
                      <span style={{ fontWeight: 800, fontSize: '0.78rem', fontFamily: 'monospace', color: (selectedVillage.riverLevel || 1.4) >= (selectedVillage.dangerMark || 4.2) ? 'var(--risk-high)' : 'var(--accent-blue)', background: 'var(--accent-blue-glow)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--card-border)' }}>
                        {(selectedVillage.riverLevel || 1.4).toFixed(1)}m Stage
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'sans-serif', color: 'var(--text-muted)' }}>Warning Mark:</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{selectedVillage.warningMark || 3.2}m</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'sans-serif', color: 'var(--text-muted)' }}>Danger Mark:</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{selectedVillage.dangerMark || 4.2}m</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'sans-serif', color: 'var(--text-muted)' }}>Rise Rate:</span>
                        <strong style={{ color: 'var(--risk-low)' }}>+{(selectedVillage.riverRiseRate || 1.5).toFixed(1)} m/h</strong>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Contributing Factors & Telemetry Observed Box */}
                <div style={{ background: 'var(--input-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ fontSize: '0.72rem', fontWeight: 800, margin: 0, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-blue)' }}></span>
                      CONTRIBUTING RISK FACTORS & TELEMETRY OBSERVED
                    </h4>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--text-muted)', fontWeight: 600 }}>4 PARAMETERS FLAGGED</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>🌧</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Heavy precipitation observed in catchment area</span>
                      </div>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)', background: 'var(--input-bg)', padding: '2px 6px', borderRadius: '4px' }}>
                        {Math.round(selectedVillage.rain)} mm/h
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>💧</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>High soil moisture saturation increases landslide risk</span>
                      </div>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--risk-high)', background: 'var(--risk-high-bg)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--risk-high-border)' }}>
                        {Math.round(selectedVillage.moisture)}% Sat
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📐</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Steep terrain slope inclination increases shear stress</span>
                      </div>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--risk-medium)', background: 'var(--risk-medium-bg)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--risk-medium-border)' }}>
                        {Math.round(selectedVillage.slope)}° Grade
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📡</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Telemetry transmission active via IoT Sensor Mesh</span>
                      </div>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--risk-low)', background: 'var(--risk-low-bg)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--risk-low-border)', fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                        SYNCED
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: EVACUATION SHELTER & ROUTE */}
            {activeSubTab === 'shelter' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: 'var(--accent-blue-glow)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Home size={18} color="var(--accent-blue)" /> Designated Relief Shelter
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, background: 'var(--card-bg)', color: 'var(--accent-blue)', padding: '2px 8px', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                      {selectedVillage.shelter?.dist || '1.1 km away'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {selectedVillage.shelter?.name || 'Joshimath Secondary School Relief Camp'}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    <span>Capacity: <strong>{selectedVillage.shelter?.capacity || 450} Beds</strong></span>
                    <span>Status: <strong style={{ color: 'var(--risk-low)' }}>{selectedVillage.shelter?.occupancy || '80 Beds Occupied'}</strong></span>
                    <span>Elevation: <strong>{selectedVillage.shelter?.elevation || '+120m'}</strong></span>
                  </div>
                </div>

                <div style={{ background: 'var(--input-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Navigation size={15} color="var(--accent-blue)" /> Recommended Evacuation Route Track
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 700 }}>
                    {selectedVillage.shelter?.route || 'Take North Ridge Route 1B (Bypasses Lower Sinking Slope)'}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: HISTORICAL BENCHMARKS */}
            {activeSubTab === 'history' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: 'var(--input-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <History size={16} color="var(--accent-blue)" /> Historical Flood & Landslide Benchmarks
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                        <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>10-Year Return Flood Mark</td>
                        <td style={{ padding: '6px 0', fontWeight: 700, textAlign: 'right', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{selectedVillage.historicalData?.flood10yr || 3.5} m</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                        <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>50-Year Return Flood Mark</td>
                        <td style={{ padding: '6px 0', fontWeight: 700, textAlign: 'right', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{selectedVillage.historicalData?.flood50yr || 4.9} m</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                        <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>2013 Kedarnath Event Peak</td>
                        <td style={{ padding: '6px 0', fontWeight: 700, textAlign: 'right', color: 'var(--risk-high)', fontFamily: 'monospace' }}>{selectedVillage.historicalData?.maxHistorical2013 || 5.6} m</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>2021 Chamoli Flood Peak</td>
                        <td style={{ padding: '6px 0', fontWeight: 700, textAlign: 'right', color: 'var(--risk-high)', fontFamily: 'monospace' }}>{selectedVillage.historicalData?.maxHistorical2021 || 4.8} m</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bottom Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--card-border)', paddingTop: '12px' }}>
              <button
                onClick={() => onFocusMap && onFocusMap(selectedVillage.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '8px', border: 'none',
                  background: 'var(--accent-blue)', color: '#ffffff', fontSize: '0.8rem', fontWeight: 700,
                  cursor: 'pointer', boxShadow: '0 2px 6px var(--accent-blue-glow)',
                  transition: 'background 0.15s ease'
                }}
              >
                Focus on Interactive Map <ExternalLink size={13} />
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
