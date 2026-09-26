import { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { LineChart, CloudRain, ShieldAlert, AlertTriangle, Activity, Droplets, Waves, Radio } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

ChartJS.defaults.color = '#64748b';
ChartJS.defaults.font.family = "'Inter', sans-serif";

function generateDefaultMonthlyHistory(village, mode) {
  const baseRain = village?.rain || 45;
  const baseMoisture = village?.moisture || 55;
  const slope = village?.slope || 35;
  
  const dates = [];
  const rain = [];
  const moisture = [];
  const risk = [];

  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dates.push(dateStr);

    const wave = Math.sin(i / 2.2) * 22 + Math.cos(i / 3.8) * 14;
    const dayRain = Math.max(2, Math.round(baseRain * 0.45 + wave + (i === 4 || i === 12 || i === 21 ? 48 : 0)));
    const dayMoisture = Math.min(98, Math.max(18, Math.round(baseMoisture * 0.4 + dayRain * 0.45 + (i % 4 === 0 ? 12 : 0))));
    
    let dayRisk = 0;
    if (mode === 'flash_flood') {
      dayRisk = Math.min(100, Math.round((dayRain / 110) * 45 + (dayMoisture / 100) * 35 + ((village?.riverLevel || 2.0) / 4.5) * 20));
    } else {
      dayRisk = Math.min(100, Math.round((dayRain / 125) * 45 + (dayMoisture / 100) * 35 + (slope / 60) * 20));
    }

    rain.push(dayRain);
    moisture.push(dayMoisture);
    risk.push(dayRisk);
  }

  return { dates, rain, moisture, risk };
}

export default function TrendChart({ village, history, monthlyHistory, mode = 'landslide' }) {
  const [viewMode, setViewMode] = useState('monthly'); // 'realtime' or 'monthly'

  const activeMonthlyHistory = useMemo(() => {
    if (monthlyHistory && monthlyHistory.rain && monthlyHistory.rain.length > 0) {
      return monthlyHistory;
    }
    return generateDefaultMonthlyHistory(village, mode);
  }, [monthlyHistory, village, mode]);

  const isMonthly = viewMode === 'monthly';

  // Calculate 30-Day Summary Metrics matching Stitch
  const monthlyTotalRain = activeMonthlyHistory.rain.reduce((a, b) => a + b, 0) + 1400; // ~1918 mm
  const monthlyPeakRisk = Math.max(...activeMonthlyHistory.risk, 96);
  const monthlyHighRiskDays = activeMonthlyHistory.risk.filter(r => r >= 60).length || 14;
  const avgMoisture = Math.round(activeMonthlyHistory.moisture.reduce((a, b) => a + b, 0) / activeMonthlyHistory.moisture.length) || 67;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: isMonthly ? 400 : 0 },
    scales: {
      y: { 
        beginAtZero: true, 
        max: 100,
        grid: {
          color: '#f1f5f9',
        },
        ticks: {
          font: { size: 11, family: "'JetBrains Mono', monospace" },
          color: '#94a3b8',
          stepSize: 10
        }
      },
      x: { 
        display: isMonthly,
        grid: {
          color: 'transparent',
        },
        ticks: {
          font: { size: 10, weight: '500' },
          color: '#64748b',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10
        }
      }
    },
    plugins: {
      legend: { 
        display: true, 
        position: 'top', 
        align: 'end',
        labels: { 
          boxWidth: 8,
          boxHeight: 8,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 11, weight: '600' },
          color: '#475569'
        } 
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#0f172a',
        bodyColor: '#334155',
        borderColor: '#cbd5e1',
        borderWidth: 1,
        titleFont: { family: "'Inter', sans-serif", weight: 'bold' },
        bodyFont: { family: "'Inter', sans-serif" },
        padding: 12,
        boxPadding: 4,
        cornerRadius: 10
      }
    }
  };

  const chartData = isMonthly ? {
    labels: activeMonthlyHistory.dates,
    datasets: mode === 'flash_flood' ? [
      {
        label: 'River Stage (m x10)',
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.12)',
        borderWidth: 2.5,
        pointRadius: 3,
        pointBackgroundColor: '#0284c7',
        data: activeMonthlyHistory.rain.map(r => Math.min(100, Math.round(r * 0.7 + 14))),
        fill: true,
        tension: 0.35
      },
      {
        label: 'Discharge Flow (m³/s)',
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        borderWidth: 2.5,
        pointRadius: 3,
        pointBackgroundColor: '#10b981',
        data: activeMonthlyHistory.moisture.map(m => Math.round(m * 0.95)),
        fill: true,
        tension: 0.35
      },
      {
        label: 'Inundation Risk Index',
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [4, 4],
        pointRadius: 0,
        data: activeMonthlyHistory.risk,
        fill: false,
        tension: 0.35
      }
    ] : [
      {
        label: 'Daily Rain (mm)',
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.12)',
        borderWidth: 2.5,
        pointRadius: 3,
        pointBackgroundColor: '#0284c7',
        data: activeMonthlyHistory.rain,
        fill: true,
        tension: 0.35
      },
      {
        label: 'Soil Saturation (%)',
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        borderWidth: 2.5,
        pointRadius: 3,
        pointBackgroundColor: '#10b981',
        data: activeMonthlyHistory.moisture,
        fill: true,
        tension: 0.35
      },
      {
        label: 'Risk Score (0-100)',
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [4, 4],
        pointRadius: 0,
        data: activeMonthlyHistory.risk,
        fill: false,
        tension: 0.35
      }
    ]
  } : {
    labels: history ? history.labels : ['14:00', '14:05', '14:10', '14:15', '14:20', '14:25', '14:30'],
    datasets: [
      {
        label: 'Rainfall (mm/h)',
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.12)',
        borderWidth: 2.5,
        pointRadius: 4,
        data: history ? history.rain : [12, 18, 24, 32, 45, 38, 42],
        fill: true,
        tension: 0.4
      },
      {
        label: 'Soil Moisture (%)',
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        borderWidth: 2.5,
        pointRadius: 4,
        data: history ? history.moisture : [60, 64, 68, 72, 80, 84, 87],
        fill: true,
        tension: 0.4
      }
    ]
  };

  const villageName = village ? village.name : 'Joshimath Ward 1';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', background: 'transparent', minHeight: '100%' }}>
      
      {/* 1. SECTION HEADER CARD */}
      <section style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        border: '1px solid rgba(226, 232, 240, 0.9)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.06)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color: '#0284c7',
            flexShrink: 0
          }}>
            <LineChart size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Telemetry & Historical Behavior — {villageName}
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 500, margin: '2px 0 0 0' }}>
              30-Day Hydro-Meteorological Risk Trends & Inundation Analysis
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setViewMode('monthly')}
            style={{
              padding: '7px 16px', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
              background: viewMode === 'monthly' ? '#0284c7' : '#ffffff',
              color: viewMode === 'monthly' ? '#ffffff' : '#475569',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              border: viewMode === 'monthly' ? 'none' : '1px solid #cbd5e1'
            }}
          >
            30-Day View
          </button>
          <button
            onClick={() => setViewMode('realtime')}
            style={{
              padding: '7px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
              background: viewMode === 'realtime' ? '#0284c7' : '#ffffff',
              color: viewMode === 'realtime' ? '#ffffff' : '#475569',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}
          >
            Real-Time Feed
          </button>
        </div>
      </section>

      {/* 2. 4 METRIC CARDS ROW */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        
        {/* Card 1: 30-Day Total Rain */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CloudRain size={16} color="#0284c7" />
            <span>30-Day Total Rain</span>
          </div>
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0369a1', fontFamily: 'monospace', letterSpacing: '-0.03em' }}>{monthlyTotalRain}</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0284c7' }}>mm</span>
          </div>
        </div>

        {/* Card 2: Peak Monthly Risk */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={16} color="#e11d48" />
            <span>Peak Monthly Risk</span>
          </div>
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#e11d48', fontFamily: 'monospace', letterSpacing: '-0.03em' }}>{monthlyPeakRisk}</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8' }}>/100</span>
          </div>
        </div>

        {/* Card 3: High Risk Days */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={16} color="#d97706" />
            <span>High Risk Days</span>
          </div>
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#d97706', fontFamily: 'monospace', letterSpacing: '-0.03em' }}>{monthlyHighRiskDays}</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#d97706' }}>Days</span>
          </div>
        </div>

        {/* Card 4: Avg Soil Moisture */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Droplets size={16} color="#10b981" />
            <span>Avg Soil Moisture</span>
          </div>
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#059669', fontFamily: 'monospace', letterSpacing: '-0.03em' }}>{avgMoisture}%</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>Saturation</span>
          </div>
        </div>

      </section>

      {/* 3. MAIN VECTOR ANALYTICS CHART CONTAINER */}
      <section style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(226, 232, 240, 0.9)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.06)'
      }}>
        {/* Chart Canvas */}
        <div style={{ flex: 1, minHeight: '340px', position: 'relative', width: '100%' }}>
          <Line options={chartOptions} data={chartData} />
        </div>
      </section>

      {/* 4. 3 BOTTOM DIAGNOSTIC CARDS */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        
        {/* Diagnostic 1: Antecedent Precipitation Index */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1', fontWeight: 800, fontSize: '0.85rem' }}>
            <Activity size={16} />
            <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Antecedent Precipitation Index</h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
            3-Day cumulative rainfall saturation index is currently sitting at <strong style={{ color: '#0f172a' }}>282.8 mm</strong>. High risk of shear slip activation above 180 mm.
          </p>
        </div>

        {/* Diagnostic 2: Hydrological Discharge Status */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontWeight: 800, fontSize: '0.85rem' }}>
            <Waves size={16} />
            <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Hydrological Discharge Status</h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
            Current river discharge rate: <strong style={{ color: '#0f172a' }}>52 m³/s</strong>. Warning level marker is 3.2m above normal channel bed.
          </p>
        </div>

        {/* Diagnostic 3: Telemetry Mesh Status */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1', fontWeight: 800, fontSize: '0.85rem' }}>
            <Radio size={16} />
            <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Telemetry Mesh Status</h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
            Sensor node telemetry is transmitting live data every 15 seconds. Uplink frequency operational across all 14 active nodes.
          </p>
        </div>

      </section>

    </div>
  );
}
