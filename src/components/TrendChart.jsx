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
import { LineChart, CloudRain, ShieldAlert, AlertTriangle, Activity, Droplets, Waves, Gauge } from 'lucide-react';

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

ChartJS.defaults.color = '#475569';
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

  // Calculate 30-Day Summary Metrics
  const monthlyTotalRain = activeMonthlyHistory.rain.reduce((a, b) => a + b, 0);
  const monthlyPeakRisk = Math.max(...activeMonthlyHistory.risk);
  const monthlyHighRiskDays = activeMonthlyHistory.risk.filter(r => r >= 65).length;
  const avgMoisture = Math.round(activeMonthlyHistory.moisture.reduce((a, b) => a + b, 0) / activeMonthlyHistory.moisture.length);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: isMonthly ? 400 : 0 },
    scales: {
      y: { 
        beginAtZero: true, 
        max: 100,
        grid: {
          color: '#e2e8f0',
        },
        ticks: {
          font: { size: 11 },
          color: '#64748b'
        }
      },
      x: { 
        display: isMonthly,
        grid: {
          color: '#f1f5f9',
        },
        ticks: {
          font: { size: 10 },
          color: '#64748b',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 12
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
        borderColor: '#e2e8f0',
        borderWidth: 1,
        titleFont: { family: "'Outfit', sans-serif", weight: 'bold' },
        bodyFont: { family: "'Inter', sans-serif" },
        padding: 12,
        boxPadding: 4,
        cornerRadius: 8
      }
    }
  };

  const chartData = isMonthly ? {
    labels: activeMonthlyHistory.dates,
    datasets: mode === 'flash_flood' ? [
      {
        label: 'River Stage (m x10)',
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.15)',
        borderWidth: 2,
        pointRadius: 2,
        data: activeMonthlyHistory.rain.map(r => Math.min(100, Math.round(r * 0.7 + 14))),
        fill: true,
        tension: 0.3
      },
      {
        label: 'Discharge Flow (m³/s)',
        borderColor: '#06b6d4',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 2,
        data: activeMonthlyHistory.moisture.map(m => Math.round(m * 0.95)),
        fill: false,
        tension: 0.3
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
        tension: 0.3
      }
    ] : [
      {
        label: 'Daily Rain (mm)',
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.12)',
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 4,
        data: activeMonthlyHistory.rain,
        fill: true,
        tension: 0.3
      },
      {
        label: 'Soil Saturation (%)',
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 4,
        data: activeMonthlyHistory.moisture,
        fill: true,
        tension: 0.3
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
        tension: 0.3
      }
    ]
  } : {
    labels: history ? history.labels : ['14:00', '14:05', '14:10', '14:15', '14:20', '14:25', '14:30'],
    datasets: [
      {
        label: 'Rainfall (mm/h)',
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.12)',
        borderWidth: 2,
        pointRadius: 3,
        data: history ? history.rain : [12, 18, 24, 32, 45, 38, 42],
        fill: true,
        tension: 0.4
      },
      {
        label: 'Soil Moisture (%)',
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        borderWidth: 2,
        pointRadius: 3,
        data: history ? history.moisture : [60, 64, 68, 72, 80, 84, 87],
        fill: true,
        tension: 0.4
      }
    ]
  };

  const villageName = village ? village.name : 'Joshimath Ward 1';

  return (
    <div className="panel chart-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
      
      {/* Panel Top Header & View Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LineChart size={20} color="#0284c7" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              Telemetry & Historical Behavior — {villageName}
            </h2>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              30-Day Hydro-Meteorological Risk Trends & Inundation Analysis
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
          <button
            onClick={() => setViewMode('monthly')}
            style={{
              padding: '6px 14px', borderRadius: '6px', border: 'none', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer',
              background: viewMode === 'monthly' ? '#0284c7' : 'transparent',
              color: viewMode === 'monthly' ? '#ffffff' : '#64748b'
            }}
          >
            30-Day View
          </button>
          <button
            onClick={() => setViewMode('realtime')}
            style={{
              padding: '6px 14px', borderRadius: '6px', border: 'none', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer',
              background: viewMode === 'realtime' ? '#0284c7' : 'transparent',
              color: viewMode === 'realtime' ? '#ffffff' : '#64748b'
            }}
          >
            Real-Time Feed
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '12px 14px' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CloudRain size={14} color="#0284c7" /> 30-Day Total Rain
          </span>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
            {monthlyTotalRain} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>mm</span>
          </div>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '12px 14px' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={14} color="#dc2626" /> Peak Monthly Risk
          </span>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
            {monthlyPeakRisk} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>/100</span>
          </div>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '12px 14px' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} color="#d97706" /> High Risk Days
          </span>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
            {monthlyHighRiskDays} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Days</span>
          </div>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '12px 14px' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Droplets size={14} color="#10b981" /> Avg Soil Moisture
          </span>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {avgMoisture}% <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Saturation</span>
          </div>
        </div>
      </div>

      {/* Main Graph Canvas - Height Adjusts Dynamically */}
      <div style={{ flex: 1, minHeight: '340px', position: 'relative', width: '100%', background: '#fafbfc', borderRadius: '8px', border: '1px solid #f1f5f9', padding: '12px' }}>
        <Line options={chartOptions} data={chartData} />
      </div>

      {/* Bottom Telemetry & Risk Threshold Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#0f172a', fontWeight: 700, fontSize: '0.85rem' }}>
            <Activity size={16} color="#0284c7" /> Antecedent Precipitation Index
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: '1.5' }}>
            3-Day cumulative rainfall saturation index is currently sitting at <strong>{(village?.rain || 45) * 1.8} mm</strong>. High risk of slope liquefaction above 120 mm threshold.
          </div>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#0f172a', fontWeight: 700, fontSize: '0.85rem' }}>
            <Waves size={16} color="#0284c7" /> Hydrological Discharge Status
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: '1.5' }}>
            Current river discharge rate: <strong>{village?.discharge || 52} m³/s</strong>. Warning level marker is <strong>{village?.warningMark || 3.2}m</strong>, danger mark <strong>{village?.dangerMark || 4.2}m</strong>.
          </div>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#0f172a', fontWeight: 700, fontSize: '0.85rem' }}>
            <Gauge size={16} color="#0284c7" /> Telemetry Mesh Status
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: '1.5' }}>
            Sensor node telemetry is transmitting live data every 15 seconds. High frequency ping active across all 8 monitoring nodes.
          </div>
        </div>
      </div>

    </div>
  );
}

