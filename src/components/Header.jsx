import { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, MapPin, X, Clock, RefreshCw, Sun, Moon, Globe } from 'lucide-react';
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
      {/* Search Input Bar with Live Open-Meteo Geocoding Dropdown */}
      <div ref={searchContainerRef} style={{ position: 'relative', width: '380px' }}>
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
            onMouseEnter={(e) => (e.currentTarget.style.background = '#bae6fd')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#e0f2fe')}
          >
            <Search size={14} color="#0284c7" />
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
        {isOpen && searchQuery.trim().length > 0 && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 99999,
            padding: '6px'
          }}>
            <div style={{ padding: '4px 8px', fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>
              {isSearching ? 'Querying GIS & Open-Meteo Geocoder...' : `Results for "${searchQuery}"`}
            </div>

            {searchResults.length > 0 ? (
              searchResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
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
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.isMonitored ? (
                      <MapPin size={15} color="#0284c7" />
                    ) : (
                      <Globe size={15} color="#64748b" />
                    )}
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {item.admin1 ? `${item.admin1}, ` : ''}{item.country || 'India'} • Lat {item.lat.toFixed(2)}°, Lng {item.lng.toFixed(2)}°
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '8px',
                      background: item.isMonitored ? '#e0f2fe' : '#f1f5f9',
                      color: item.isMonitored ? '#0369a1' : '#64748b'
                    }}>
                      {item.isMonitored ? 'MONITORED' : 'GEOCODED'}
                    </span>
                  </div>
                </div>
              ))
            ) : !isSearching ? (
              <div style={{ padding: '12px', textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8' }}>
                No matching locations found.
              </div>
            ) : null}
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
        {/* Dynamic Status Indicator */}
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
          }} />
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
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
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
              }} title="Live IST Clock Running" />
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
                  type="button"
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
                onMouseEnter={(e) => (e.currentTarget.style.background = '#0369a1')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#0284c7')}
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
