import { useState } from 'react';
import { Map, Bell, PhoneCall, Download, ShieldCheck, X, CheckCircle2, FileText } from 'lucide-react';

export default function QuickActions({ selectedLocation, onNavigateToMap, onTriggerToast }) {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [reportDownloading, setReportDownloading] = useState(false);

  const loc = selectedLocation || { name: 'Dhemaji', district: 'Dhemaji', state: 'Assam' };

  // Emergency Hotlines Directory
  const emergencyContacts = [
    { agency: 'NDRF National Control Room', number: '1078 / 011-24363260', desc: 'Disaster Search & Rescue Ops', active: '24x7 Active' },
    { agency: 'State Disaster Management (SDMA)', number: '1070 / 1077', desc: 'State Operations Command Center', active: '24x7 Active' },
    { agency: 'District Emergency Operations (DEOC)', number: '03753-225345', desc: `${loc.district || loc.name} District Collectorate`, active: '24x7 Active' },
    { agency: 'Central Water Commission (CWC) Flood Cell', number: '1800-180-1551', desc: 'National Hydrometric Stage Advisory', active: 'Real-time Line' },
    { agency: 'Army Disaster Relief Task Force', number: '1904', desc: 'Emergency Heli-Rescue & Air Drops', active: 'Standby' }
  ];

  const handleSendAlert = (e) => {
    e.preventDefault();
    setAlertSent(true);
    if (onTriggerToast) {
      onTriggerToast(`Emergency Advisory Broadcasted to ${loc.name} Ward Operations Center`);
    }
    setTimeout(() => {
      setAlertSent(false);
      setShowAlertModal(false);
    }, 1800);
  };

  const handleDownloadReport = () => {
    setReportDownloading(true);
    setTimeout(() => {
      // Create and download synthetic incident intelligence summary report
      const content = `=====================================================
BHOOMIRAKSHAK DISASTER EARLY WARNING INTELLIGENCE
SITUATIONAL RISK ASSESSMENT & HAZARD SUMMARY REPORT
=====================================================
Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
System Node: BhoomiRakshak National GIS Core
Target Location: ${loc.name}, ${loc.district || ''}, ${loc.state || 'India'}
Coordinates: ${loc.lat || 27.48}, ${loc.lng || 94.58}
Elevation: ${loc.elevation || 110}m ASL

1. HYDRO-METEOROLOGICAL SUMMARY:
- 24h Precipitation: ${loc.rain || 85} mm
- Soil Saturation Level: ${loc.moisture || 78}%
- River Basin Proximity: ${loc.riverName || 'Brahmaputra River'} (${loc.riverLevel || 87.4}m current stage)
- Danger Mark: ${loc.dangerMark || 87.5}m

2. TERRAIN SUSCEPTIBILITY:
- Slope Inclination: ${loc.slope || 38}°
- Critical Landslide Susceptibility Index: HIGH
- Flash Flood Hydraulic Concentration Time: 1.8 hrs

3. RELIEF & EVACUATION DESIGNATION:
- Designated Shelter: ${loc.shelter?.name || `${loc.name} High Secondary Relief Camp`}
- Route: ${loc.shelter?.route || 'Northern High Embankment Bypass Corridor'}
- Shelter Capacity: ${loc.shelter?.capacity || 1200} persons

4. AUTHORIZATION & CONTACTS:
- SDRF Field Unit: Standby Protocol Level-2
- CWC Gauge Station: Continuous Optical Stage Profiling
=====================================================
National Disaster Management Authority (NDMA) Compliance
BhoomiRakshak Earth Observation & Disaster Intelligence
=====================================================`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `BhoomiRakshak_Report_${loc.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setReportDownloading(false);
      if (onTriggerToast) {
        onTriggerToast(`Situational report downloaded for ${loc.name}`);
      }
    }, 800);
  };

  return (
    <div
      style={{
        background: '#0a1224',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: '#f8fafc' }}>
            Quick Actions
          </h3>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
            Operational Command Dispatches & Field Action Protocols
          </div>
        </div>
        <span style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 600 }}>
          {loc.name} Node
        </span>
      </div>

      {/* 4 ACTION BUTTONS GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px'
        }}
      >
        {/* 1. View Detailed Map */}
        <button
          type="button"
          onClick={() => {
            if (onNavigateToMap) onNavigateToMap();
          }}
          style={{
            background: 'rgba(2, 132, 199, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.18s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(2, 132, 199, 0.28)';
            e.currentTarget.style.borderColor = '#38bdf8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(2, 132, 199, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Map size={16} color="#38bdf8" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>View Detailed Map</span>
          </div>
          <span style={{ fontSize: '1rem', color: '#38bdf8' }}>→</span>
        </button>

        {/* 2. Send Alert */}
        <button
          type="button"
          onClick={() => setShowAlertModal(true)}
          style={{
            background: 'rgba(239, 68, 68, 0.14)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.18s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
            e.currentTarget.style.borderColor = '#f87171';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.14)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.35)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={16} color="#f87171" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Send Alert</span>
          </div>
          <span style={{ fontSize: '1rem', color: '#f87171' }}>→</span>
        </button>

        {/* 3. Emergency Contacts */}
        <button
          type="button"
          onClick={() => setShowEmergencyModal(true)}
          style={{
            background: 'rgba(16, 185, 129, 0.14)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.18s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.25)';
            e.currentTarget.style.borderColor = '#34d399';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.14)';
            e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.35)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PhoneCall size={16} color="#34d399" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Emergency Contacts</span>
          </div>
          <span style={{ fontSize: '1rem', color: '#34d399' }}>→</span>
        </button>

        {/* 4. Download Report */}
        <button
          type="button"
          onClick={handleDownloadReport}
          disabled={reportDownloading}
          style={{
            background: 'rgba(245, 158, 11, 0.14)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: reportDownloading ? 'wait' : 'pointer',
            transition: 'all 0.18s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(245, 158, 11, 0.25)';
            e.currentTarget.style.borderColor = '#fbbf24';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(245, 158, 11, 0.14)';
            e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.35)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} color="#fbbf24" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
              {reportDownloading ? 'Generating...' : 'Download Report'}
            </span>
          </div>
          <span style={{ fontSize: '1rem', color: '#fbbf24' }}>→</span>
        </button>
      </div>

      {/* EMERGENCY CONTACTS MODAL */}
      {showEmergencyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.78)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowEmergencyModal(false)}
        >
          <div
            style={{
              background: '#0a1224',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '14px',
              padding: '24px',
              maxWidth: '520px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="#10b981" />
                  <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>
                    DISASTER EARLY RESPONSE DIRECTORY
                  </span>
                </div>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.25rem', color: '#ffffff', fontWeight: 800 }}>
                  Emergency Hotlines
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEmergencyModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  cursor: 'pointer'
                }}
              >
                ✕ Close
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {emergencyContacts.map((contact, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#f8fafc' }}>
                      {contact.agency}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {contact.desc}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <a
                      href={`tel:${contact.number.split('/')[0].trim()}`}
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        color: '#38bdf8',
                        textDecoration: 'none'
                      }}
                    >
                      {contact.number}
                    </a>
                    <div style={{ fontSize: '0.64rem', color: '#34d399', fontWeight: 700 }}>
                      ● {contact.active}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEND ALERT MODAL */}
      {showAlertModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.78)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowAlertModal(false)}
        >
          <div
            style={{
              background: '#0a1224',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '14px',
              padding: '24px',
              maxWidth: '480px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bell size={16} color="#ef4444" />
                  <span style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 700 }}>
                    CIVIL EMERGENCY BROADCAST SYSTEM
                  </span>
                </div>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.2rem', color: '#ffffff', fontWeight: 800 }}>
                  Broadcast Disaster Alert
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAlertModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  cursor: 'pointer'
                }}
              >
                ✕ Close
              </button>
            </div>

            {alertSent ? (
              <div style={{ textAlign: 'center', padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={48} color="#10b981" />
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>
                  Emergency Bulletin Dispatched!
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Forwarded to {loc.name} District Operations Center & Field NDRF Units.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendAlert} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>Target Sector</label>
                  <input
                    type="text"
                    readOnly
                    value={`${loc.name}, ${loc.district || loc.state}`}
                    style={{
                      width: '100%',
                      marginTop: '4px',
                      padding: '8px 12px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.84rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>Alert Severity</label>
                  <select
                    style={{
                      width: '100%',
                      marginTop: '4px',
                      padding: '8px 12px',
                      background: '#070e1c',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.84rem'
                    }}
                  >
                    <option value="CRITICAL">RED NOTICE • Immediate Evacuation</option>
                    <option value="HIGH">ORANGE ADVISORY • High Alert Standby</option>
                    <option value="WATCH">YELLOW WATCH • Precautionary Advisory</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>Action Instructions</label>
                  <textarea
                    rows={3}
                    defaultValue={`High soil saturation and rising river stage observed in ${loc.name}. Direct all vulnerable wards to designated relief shelters immediately.`}
                    style={{
                      width: '100%',
                      marginTop: '4px',
                      padding: '8px 12px',
                      background: '#070e1c',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      fontFamily: 'inherit',
                      resize: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAlertModal(false)}
                    style={{
                      background: 'transparent',
                      color: '#94a3b8',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 20px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 10px rgba(239, 68, 68, 0.4)'
                    }}
                  >
                    Transmit Bulletin
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
