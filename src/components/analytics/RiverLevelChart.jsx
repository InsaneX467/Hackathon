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
  Legend,
  Filler
} from 'chart.js';
import { Waves, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

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

export default function RiverLevelChart({ selectedLocation }) {
  const loc = selectedLocation || {
    name: 'Dhemaji',
    riverName: 'Brahmaputra River',
    riverLevel: 87.4,
    warningMark: 86.8,
    dangerMark: 87.5
  };

  const riverName = loc.riverName || (loc.state === 'Himachal Pradesh' ? 'Beas River' : loc.state === 'Uttarakhand' ? 'Alaknanda River' : loc.state === 'Kerala' ? 'Periyar River' : loc.state === 'Maharashtra' ? 'Vashishti River' : 'Brahmaputra River');

  // Compute 7-day river stage curve calibrated to location marks
  const stageData = useMemo(() => {
    const danger = loc.dangerMark || 12.0;
    const warning = loc.warningMark || (danger * 0.92);
    const current = loc.riverLevel || (danger * 0.88);

    const labels = ['Day -6', 'Day -5', 'Day -4', 'Day -3', 'Day -2', 'Yesterday', 'Today'];
    
    // Create realistic stage curve approaching or cresting
    const progression = [
      Number((current * 0.82).toFixed(1)),
      Number((current * 0.85).toFixed(1)),
      Number((current * 0.89).toFixed(1)),
      Number((current * 0.88).toFixed(1)),
      Number((current * 0.93).toFixed(1)),
      Number((current * 0.97).toFixed(1)),
      Number(current.toFixed(1))
    ];

    const dangerSeries = Array(7).fill(danger);
    const warningSeries = Array(7).fill(warning);

    return {
      labels,
      currentSeries: progression,
      dangerSeries,
      warningSeries,
      currentLevel: current,
      dangerMark: danger,
      warningMark: warning,
      margin: Number((danger - current).toFixed(1))
    };
  }, [loc.riverLevel, loc.dangerMark, loc.warningMark]);

  const isNearDanger = stageData.currentLevel >= stageData.warningMark;
  const isOverDanger = stageData.currentLevel >= stageData.dangerMark;

  const chartData = {
    labels: stageData.labels,
    datasets: [
      {
        label: 'Current Stage (m)',
        data: stageData.currentSeries,
        borderColor: isOverDanger ? '#ef4444' : isNearDanger ? '#f97316' : '#38bdf8',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 180);
          gradient.addColorStop(0, isOverDanger ? 'rgba(239, 68, 68, 0.35)' : 'rgba(56, 189, 248, 0.35)');
          gradient.addColorStop(1, 'rgba(56, 189, 248, 0.02)');
          return gradient;
        },
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#38bdf8',
        pointRadius: 3.5,
        pointHoverRadius: 6
      },
      {
        label: 'Danger Threshold (m)',
        data: stageData.dangerSeries,
        borderColor: '#ef4444',
        borderWidth: 2,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false
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
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          color: '#94a3b8',
          boxWidth: 12,
          boxHeight: 2,
          font: { size: 10, weight: '600' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(8, 16, 32, 0.94)',
        titleColor: '#f1f5f9',
        bodyColor: '#38bdf8',
        borderColor: 'rgba(56, 189, 248, 0.3)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (item) => `${item.dataset.label}: ${item.raw} m`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 10.5 } },
        border: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 10 },
          callback: (val) => `${val}m`
        },
        border: { dash: [4, 4], color: 'rgba(255, 255, 255, 0.1)' }
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
                background: 'rgba(14, 165, 233, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Waves size={16} color="#0ea5e9" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc' }}>
                  River Water Level
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                  (m)
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 600, marginTop: '2px' }}>
                {riverName}
              </div>
            </div>
          </div>
        </div>

        {/* CWC Model / Demo Data Badge */}
        <span
          style={{
            fontSize: '0.65rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#fbbf24',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}
          title="Demonstration hydrograph. CWC Central Water Commission sensor interface ready."
        >
          ● MODEL / DEMO
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
          <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Current Stage</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: isOverDanger ? '#ef4444' : isNearDanger ? '#f97316' : '#38bdf8' }}>
            {stageData.currentLevel} <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>m</span>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '6px 8px' }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Danger Mark</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f87171' }}>
            {stageData.dangerMark} <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>m</span>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '6px 8px' }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Safety Margin</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: stageData.margin <= 0 ? '#ef4444' : stageData.margin < 1.0 ? '#f97316' : '#34d399' }}>
            {stageData.margin > 0 ? `+${stageData.margin}` : stageData.margin} <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>m</span>
          </div>
        </div>
      </div>
    </div>
  );
}
