import { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, MapPin, X, Clock, RefreshCw, CheckCircle2, Sun, Moon } from 'lucide-react';
import { getSystemHealthSummary, formatDataAgeSeconds } from '../services/dataStatusService';
import ModelSwitcher from './ModelSwitcher';

export default function Header({ 
  villages = [], 
  alerts = [], 
  mode = 'landslide', 
  onModeChange,
  lastUpdatedTime,
  searchQuery = '',
  onSearchChange,
  onSelectVillage,
  onRefreshData,
  theme = 'light',
  onToggleTheme
}) {
  const health = getSystemHealthSummary();
  const activeAlertsCount = alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH' || a.critical).length;
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const timeContainerRef = useRef(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [showTimePopover, setShowTimePopover] = useState(false);
  const [liveTime, setLiveTime] = useState(new Date());

  // Live IST Clock effect
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const query = searchQuery.trim().toLowerCase();
  const matchingVillages = query
    ? villages.filter(v => v.name.toLowerCase().includes(query))
    : [];

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
      if (timeContainerRef.current && !timeContainerRef.current.contains(e.target)) {
        setShowTimePopover(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (villageId) => {
    if (onSelectVillage) {
      onSelectVillage(villageId);
    }
    if (onSearchChange) {
      onSearchChange('');
    }
    setIsOpen(false);
  };

  const handleSearchButtonClick = () => {
    if (matchingVillages.length > 0) {
      handleSelect(matchingVillages[0].id);
    } else {
      setIsOpen(true);
      searchInputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (matchingVillages.length > 0) {
        handleSelect(matchingVillages[0].id);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Formatting live IST timestamp
  const formattedDate = liveTime.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const formattedTime = liveTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const formattedAge = formatDataAgeSeconds(lastUpdatedTime || new Date());

  return (
    <header className="dashboard-header" style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '56px',
      minHeight: '56px',
      position: 'relative',
      zIndex: 100
    }}>
      {/* Search Input Bar with Live Dropdown & Search Button */}
      <div ref={searchContainerRef} style={{ position: 'relative', width: '360px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#f1f5f9',
          border: '1px solid #cbd5e1',
          borderRadius: '20px',
          padding: '6px 14px',
          width: '100%',
          boxShadow: isOpen ? '0 0 0 2px rgba(2, 132, 199, 0.2)' : 'none',
          transition: 'all 0.2s ease'
        }}>
          <button
            type="button"
            onClick={handleSearchButtonClick}
            title="Click to search location"
            style={{
              background: '#e0f2fe',
              border: 'none',
              borderRadius: '50%',
              width: '26px',
              height: '26px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              flexShrink: 0,
              transition: 'transform 0.15s ease, background 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#bae6fd'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#e0f2fe'}
          >
            <Search size={14} color="#0284c7" />
          </button>
          
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search ward, village or location..."
            value={searchQuery}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              if (onSearchChange) onSearchChange(e.target.value);
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.82rem',
              color: '#0f172a',
              width: '100%'
            }}
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                if (onSearchChange) onSearchChange('');
                setIsOpen(false);
                searchInputRef.current?.focus();
              }}
              title="Clear search"
              style={{ 
                background: 'transparent', 
                border: 'none', 
                cursor: 'pointer', 
                padding: '2px', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center' 
              }}
            >
              <X size={14} color="#64748b" />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown List */}
        {isOpen && query.length > 0 && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
            maxHeight: '280px',
            overflowY: 'auto',
            zIndex: 99999,
            padding: '6px'
          }}>
            {matchingVillages.length > 0 ? (
              matchingVillages.map((v) => {
                const badgeColor = v.score >= 80 ? '#dc2626' : v.score >= 60 ? '#ea580c' : v.score >= 40 ? '#d97706' : '#16a34a';
                const badgeBg = v.score >= 80 ? '#fef2f2' : v.score >= 60 ? '#fff7ed' : v.score >= 40 ? '#fffbeb' : '#f0fdf4';
                const label = v.cat?.label || (v.score >= 80 ? 'CRITICAL' : v.score >= 60 ? 'WARNING' : v.score >= 40 ? 'WATCH' : 'LOW');

                return (
                  <div
                    key={v.id}
                    onClick={() => handleSelect(v.id)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'background 0.15s ease',
                      borderBottom: '1px solid #f8fafc'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={15} color="#0284c7" />
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                          {v.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Lat {v.lat.toFixed(2)}°, Lng {v.lng.toFixed(2)}° • Chamoli
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: '10px',
                        background: badgeBg,
                        color: badgeColor,
                        border: `1px solid ${badgeColor}30`
                      }}>
                        {v.score} {label}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '12px', textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8' }}>
                No wards or locations match "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center Segmented Primary Hazard View Model Switcher */}
      <ModelSwitcher 
        selectedModel={mode}
        onModelChange={onModeChange}
        theme={theme}
      />

      {/* Right Controls: Operational Status, Live IST Time Button, Notifications, User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* System Health Status */}
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

        {/* Live IST Time Button with Popover */}
        <div ref={timeContainerRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowTimePopover(!showTimePopover)}
            title="Click for Telemetry Time Details & Refresh"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              color: '#0f172a',
              boxShadow: showTimePopover ? '0 0 0 2px rgba(2, 132, 199, 0.2)' : 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
          >
            <Clock size={15} color="#0284c7" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
              <span>{formattedDate}, {formattedTime} IST</span>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 6px #10b981'
              }} title="Live IST Clock Running"></span>
            </div>
          </button>

          {/* Time & Telemetry Status Popover */}
          {showTimePopover && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '280px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              padding: '14px',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={15} color="#0284c7" /> System Time & Sync
                </div>
                <button
                  onClick={() => setShowTimePopover(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <X size={14} color="#64748b" />
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Current IST Time:</span>
                  <strong style={{ color: '#0f172a' }}>{formattedTime} IST</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Last Data Ingested:</span>
                  <strong style={{ color: '#0284c7' }}>{formattedAge}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Auto-Refresh Cycle:</span>
                  <strong style={{ color: '#16a34a' }}>Every 15s</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onRefreshData) onRefreshData();
                  setShowTimePopover(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '7px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '4px',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#0369a1'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#0284c7'}
              >
                <RefreshCw size={13} /> Sync Telemetry Now
              </button>
            </div>
          )}
        </div>

        {/* Sun/Moon Quick Theme Switcher */}
        <button
          type="button"
          onClick={() => onToggleTheme && onToggleTheme(theme === 'dark' ? 'light' : 'dark')}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: theme === 'dark' ? '#1e293b' : '#f1f5f9',
            border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s ease'
          }}
        >
          {theme === 'dark' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#0284c7" />}
        </button>

        {/* Notification Bell Badge */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', background: theme === 'dark' ? '#1e293b' : '#f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Bell size={16} color={theme === 'dark' ? '#f8fafc' : '#0f172a'} />
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
          width: '32px', height: '32px', borderRadius: '50%', background: theme === 'dark' ? '#0369a1' : '#e0f2fe',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}>
          <User size={16} color={theme === 'dark' ? '#38bdf8' : '#0284c7'} />
        </div>
      </div>
    </header>
  );
}

