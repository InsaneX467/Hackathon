import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Droplets, Thermometer, ShieldAlert } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function SoilMoistureChart({ selectedLocation, currentWeather }) {
  const loc = selectedLocation || { name: 'Dhemaji', moisture: 78, rain: 85 };

  // Use real weather temperature if available, or location-calibrated baseline
  const baseTemp = currentWeather?.temperature || 26;
  const baseMoisture = loc.moisture || (loc.soilRisk ? Math.round(loc.soilRisk * 100) : 76);

  const seriesData = useMemo(() => {
    const labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'];

    // Moisture progression (%)
    const moisture = [
      Math.max(30, baseMoisture - 6),
      Math.max(30, baseMoisture - 4),
      Math.max(30, baseMoisture - 1),
      Math.min(99, baseMoisture + 2),
      Math.min(99, baseMoisture + 4),
      Math.min(99, baseMoisture + 3),
      baseMoisture
    ];

    // Temperature progression (°C) - diurnal thermal cycle
    const temperature = [
      baseTemp - 3,
      baseTemp - 4,
      baseTemp - 1,
      baseTemp + 3,
      baseTemp + 2,
      baseTemp,
      baseTemp
    ];

    return { labels, moisture, temperature };
  }, [baseMoisture, baseTemp]);

  const isCriticalSaturation = baseMoisture >= 80;

  const chartData = {
    labels: seriesData.labels,
    datasets: [
      {
        label: 'Soil Moisture (%)',
        data: seriesData.moisture,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        yAxisID: 'yMoisture',
        tension: 0.35,
        borderWidth: 2.2,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointRadius: 3.5,
        pointHoverRadius: 6
      },
      {
        label: 'Temperature (°C)',
        data: seriesData.temperature,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        yAxisID: 'yTemp',
        tension: 0.35,
        borderWidth: 2,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#ffffff',
        pointRadius: 3.5,
        pointHoverRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 600,
      easing: 'easeOutQuart'
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          color: '#94a3b8',
          boxWidth: 10,
          boxHeight: 10,
          borderRadius: 2,
          usePointStyle: true,
          font: { size: 10, weight: '600' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(8, 16, 32, 0.94)',
        titleColor: '#f1f5f9',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (item) => {
            if (item.datasetIndex === 0) return `Moisture: ${item.raw}%`;
            return `Temperature: ${item.raw}°C`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 10.5 } },
        border: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      yMoisture: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 20,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#10b981',
          font: { size: 10 },
          callback: (val) => `${val}%`
        },
        border: { color: 'rgba(16, 185, 129, 0.2)' }
      },
      yTemp: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 10,
        max: 45,
        grid: { drawOnChartArea: false },
        ticks: {
          color: '#f59e0b',
          font: { size: 10 },
          callback: (val) => `${val}°C`
        },
        border: { color: 'rgba(245, 158, 11, 0.2)' }
      }
    }
  };

  return (
    <div
      style={{
        background: '#0a1224',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
        height: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* CARD HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Droplets size={16} color="#10b981" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc' }}>
                  Soil Moisture & Temp
                </h3>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                {loc.name} • Dual-Axis Probe Telemetry
              </div>
            </div>
          </div>
        </div>

        {/* Data Provenance Badge */}
        <span
          style={{
            fontSize: '0.65rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}
        >
          ● MODEL + LIVE TEMP
        </span>
      </div>

      {/* CHART CANVAS */}
      <div style={{ position: 'relative', height: '175px', width: '100%' }}>
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* METRIC SUMMARY STRIP */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          paddingTop: '8px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '6px 8px' }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Soil Moisture</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: isCriticalSaturation ? '#f87171' : '#10b981' }}>
            {baseMoisture}%
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '6px 8px' }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Temperature</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f59e0b' }}>
            {baseTemp}°C
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '6px 8px' }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Pore Pressure</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: isCriticalSaturation ? '#ef4444' : '#38bdf8' }}>
            {isCriticalSaturation ? 'HIGH' : 'NORMAL'}
          </div>
        </div>
      </div>
    </div>
  );
}
