import { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, MapPin, X, Clock, RefreshCw, Sun, Moon } from 'lucide-react';
import { getSystemHealthSummary, formatDataAgeSeconds } from '../services/dataStatusService';
import { searchLocationsWithGeocoding } from '../services/geocodingService';
import { MONITORED_LOCATIONS } from '../data/locations';
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
  theme = 'dark',
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
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Live IST Clock effect
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Debounced search with Open-Meteo Geocoding + Local Locations
  useEffect(() => {
    let active = true;
    const query = searchQuery.trim();

    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const results = await searchLocationsWithGeocoding(query);
        if (active) {
          setSearchResults(results);
          setIsSearching(false);
        }
      } catch (err) {
        if (active) setIsSearching(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [searchQuery]);

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

  const handleSelect = (item) => {
    if (onSelectVillage) {
      // Pass the item id
      onSelectVillage(item.id || item.locationData?.id);
    }
    if (onSearchChange) {
      onSearchChange('');
    }
    setIsOpen(false);
  };

  const handleSearchButtonClick = () => {
    if (searchResults.length > 0) {
      handleSelect(searchResults[0]);
    } else {
      setIsOpen(true);
      searchInputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (searchResults.length > 0) {
        handleSelect(searchResults[0]);
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
      background: 'var(--header-bg)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--panel-border)',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      height: '64px',
      minHeight: '64px',
      maxHeight: '64px',
      position: 'relative',
      zIndex: 100,
      flexShrink: 0,
      color: 'var(--text-primary)'
    }}>
      {/* Search Input Bar with Live Dropdown & Search Button */}
      <div ref={searchContainerRef} style={{ position: 'relative', width: '320px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--input-bg)',
          border: '1px solid var(--input-border)',
          borderRadius: '8px',
          padding: '6px 12px',
          width: '100%',
          transition: 'all 0.2s ease'
        }}>
          <button
            type="button"
            onClick={handleSearchButtonClick}
            title="Click to search location"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              padding: 0,
              flexShrink: 0
            }}
          >
            <Search size={15} color="#94a3b8" />
          </button>
          
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search ward, village, district or location..."
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
              color: 'var(--text-primary)',
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
                justify: 'center' 
              }}
            >
              <X size={14} color="var(--text-muted)" />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown List */}
        {isOpen && searchQuery.trim().length > 0 && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '12px',
            boxShadow: 'var(--glass-shadow)',
            maxHeight: '280px',
            overflowY: 'auto',
            zIndex: 99999,
            padding: '6px'
          }}>
            {matchingVillages.length > 0 ? (
              matchingVillages.map((v) => {
                const badgeColor = v.score >= 80 ? 'var(--risk-high)' : v.score >= 60 ? 'var(--risk-medium)' : v.score >= 40 ? 'var(--risk-medium)' : 'var(--risk-low)';
                const badgeBg = v.score >= 80 ? 'var(--risk-high-bg)' : v.score >= 60 ? 'var(--risk-medium-bg)' : v.score >= 40 ? 'var(--risk-medium-bg)' : 'var(--risk-low-bg)';
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
                      justify: 'space-between',
                      alignItems: 'center',
                      transition: 'background 0.15s ease',
                      borderBottom: '1px solid var(--card-border)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--input-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={15} color="var(--accent-blue)" />
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {v.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
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
                        border: `1px solid ${badgeColor}40`
                      }}>
                        {v.score} {label}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '12px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
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
      />

      {/* Right Controls: Status Indicator, Live IST Time Button, Notifications, User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Status Critical Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '9999px',
          background: 'var(--risk-high-bg)',
          border: '1px solid var(--risk-high-border)',
          color: 'var(--risk-high)',
          fontSize: '0.725rem',
          fontWeight: 700,
          letterSpacing: '0.03em'
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--risk-high)',
            boxShadow: '0 0 6px var(--risk-high)'
          }}></span>
          <span>STATUS: CRITICAL</span>
        </div>

        {/* Live IST Date & Time */}
        <div ref={timeContainerRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowTimePopover(!showTimePopover)}
            title="Click for Telemetry Time Details & Refresh"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '8px',
              background: 'var(--input-bg)',
              border: '1px solid var(--card-border)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              color: 'var(--text-primary)'
            }}
          >
            <Clock size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{formattedDate}, {formattedTime} IST</span>
          </button>

          {/* Time & Telemetry Status Popover */}
          {showTimePopover && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '280px',
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              boxShadow: 'var(--glass-shadow)',
              padding: '14px',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={15} color="var(--accent-blue)" /> System Time & Sync
                </div>
                <button
                  type="button"
                  onClick={() => setShowTimePopover(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <X size={14} color="var(--text-muted)" />
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Current IST Time:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{formattedTime} IST</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Last Data Ingested:</span>
                  <strong style={{ color: 'var(--accent-blue)' }}>{formattedAge}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Auto-Refresh Cycle:</span>
                  <strong style={{ color: 'var(--risk-low)' }}>Every 15s</strong>
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
                  justify: 'center',
                  gap: '6px',
                  background: 'var(--accent-blue)',
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
              >
                <RefreshCw size={13} /> Sync Telemetry Now
              </button>
            </div>
          )}
        </div>

        {/* Theme Switcher Button */}
        <button
          type="button"
          onClick={() => onToggleTheme && onToggleTheme(theme === 'dark' ? 'light' : 'dark')}
          title={`Switch Theme`}
          style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--input-bg)',
            border: '1px solid var(--card-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)'
          }}
        >
          {theme === 'dark' ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#0284c7" />}
        </button>

        {/* Notification Bell Badge */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px', background: 'var(--input-bg)',
            border: '1px solid var(--card-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Bell size={15} color="var(--text-muted)" />
          </div>
          {activeAlertsCount > 0 && (
            <span style={{
              position: 'absolute', top: '-2px', right: '-2px',
              background: 'var(--risk-high)', color: '#fff', fontSize: '0.65rem',
              fontWeight: 800, width: '16px', height: '16px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {activeAlertsCount}
            </span>
          )}
        </div>

        {/* User Profile Avatar Icon */}
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.2)',
          border: '1px solid rgba(37, 99, 235, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}>
          <User size={15} color="#60a5fa" />
        </div>
      </div>
    </header>
  );
}
