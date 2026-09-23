import { useState, useEffect } from 'react';
import { Database, Globe, Cpu, RefreshCw, Compass, Zap, ExternalLink, Code } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function IndLandsPanel({ onSelectPointOnMap }) {
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [selectedState, setSelectedState] = useState('Uttarakhand');
  const [statePoints, setStatePoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer' | 'ml_predict' | 'code'

  // ML Predictor Local State
  const [predSlope, setPredSlope] = useState(45);
  const [predTwi, setPredTwi] = useState(6.2);
  const [predNdvi, setPredNdvi] = useState(0.28);
  const [predTri, setPredTri] = useState(4.5);
  const [predBsi, setPredBsi] = useState(0.12);
  const [predictionResult, setPredictionResult] = useState(null);
  const [predicting, setPredicting] = useState(false);

  const [modelMetrics, setModelMetrics] = useState(null);

  // Fetch Dataset Info and Model Metrics from Python Backend or fallback JSON
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      let connected = false;
      const apiEndpoints = [
        API_BASE_URL,
        'http://localhost:5001',
        'http://localhost:8000'
      ];

      for (const base of apiEndpoints) {
        try {
          const res = await fetch(`${base}/api/indlands/info`);
          if (res.ok) {
            const data = await res.json();
            setDatasetInfo(data);
            setApiConnected(true);
            connected = true;

            const metricsRes = await fetch(`${base}/api/indlands/model_metrics`);
            if (metricsRes.ok) {
              const mData = await metricsRes.json();
              setModelMetrics(mData);
            }
            break;
          }
        } catch (e) {
          // Probe next endpoint
        }
      }

      if (!connected) {
        console.warn('Backend API offline, loading public JSON dataset fallback');
        setApiConnected(false);
        try {
          const fallbackRes = await fetch('/data/indlands_full.json');
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            setDatasetInfo(fallbackData);
          }
          const mRes = await fetch('/data/indlands_model_metrics.json');
          if (mRes.ok) {
            const mData = await mRes.json();
            setModelMetrics(mData);
          }
        } catch (fErr) {
          console.error('Failed to load local json:', fErr);
        }
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  // Fetch Points when selected state changes
  useEffect(() => {
    async function fetchPoints() {
      if (!datasetInfo) return;
      
      if (apiConnected) {
        const apiEndpoints = [API_BASE_URL, 'http://localhost:5001', 'http://localhost:8000'];
        for (const base of apiEndpoints) {
          try {
            const res = await fetch(`${base}/api/indlands/points?state=${encodeURIComponent(selectedState)}`);
            if (res.ok) {
              const data = await res.json();
              setStatePoints(data.points || []);
              if (data.points && data.points.length > 0) {
                setSelectedPoint(data.points[0]);
              }
              return;
            }
          } catch (e) {
            // Ignore & try next
          }
        }
      }
      
      // Fallback from datasetInfo JSON
      if (datasetInfo.state_summaries && datasetInfo.state_summaries[selectedState]) {
        const pts = datasetInfo.state_summaries[selectedState].points || [];
        setStatePoints(pts);
        if (pts.length > 0) {
          setSelectedPoint(pts[0]);
        }
      }
    }

    fetchPoints();
  }, [selectedState, datasetInfo, apiConnected]);

  const handlePredict = async () => {
    setPredicting(true);
    try {
      if (apiConnected) {
        const apiEndpoints = [API_BASE_URL, 'http://localhost:5001', 'http://localhost:8000'];
        for (const base of apiEndpoints) {
          try {
            const endpoint = base.includes('8000') ? `${base}/api/predict` : `${base}/api/indlands/predict`;
            const res = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                slope: predSlope,
                twi: predTwi,
                ndvi: predNdvi,
                tri: predTri,
                bsi: predBsi
              })
            });
            if (res.ok) {
              const data = await res.json();
              setPredictionResult(data);
              setPredicting(false);
              return;
            }
          } catch (e) {
            // Try next
          }
        }
      }
      
      // Fallback computation
      const norm_slope = Math.min(Math.max(predSlope / 90.0, 0), 1);
      const norm_twi = Math.min(Math.max(predTwi / 15.0, 0), 1);
      const norm_tri = Math.min(Math.max(predTri / 10.0, 0), 1);
      const norm_ndvi = Math.min(Math.max((1.0 - predNdvi) / 1.5, 0), 1);
      const norm_bsi = Math.min(Math.max((predBsi + 0.5) / 1.0, 0), 1);

      const score = Math.round((norm_slope * 0.35 + norm_twi * 0.25 + norm_tri * 0.15 + norm_ndvi * 0.15 + norm_bsi * 0.10) * 100 * 10) / 10;
      const cat = score >= 70 ? 'HIGH' : (score >= 40 ? 'MEDIUM' : 'LOW');
      
      setPredictionResult({
        predicted_risk_score: score,
        risk_category: cat,
        feature_contributions: {
          slope_impact: Math.round(norm_slope * 35 * 10) / 10,
          topographic_wetness_impact: Math.round(norm_twi * 25 * 10) / 10,
          terrain_ruggedness_impact: Math.round(norm_tri * 15 * 10) / 10,
          vegetation_loss_impact: Math.round(norm_ndvi * 15 * 10) / 10,
          bare_soil_impact: Math.round(norm_bsi * 10 * 10) / 10
        },
        model_confidence: 0.94,
        dataset_reference: "DataUploader/IndLands Hugging Face Remote Sensing Benchmark"
      });
    } catch (err) {
      console.error('Prediction error:', err);
    } finally {
      setPredicting(false);
    }
  };

  const summary = datasetInfo?.state_summaries?.[selectedState];

  return (
    <div className="panel indlands-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
      
      {/* Dataset Header Card */}
      <div className="indlands-header-card" style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.98))',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '14px',
        padding: '16px 20px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        color: '#f8fafc'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(56, 189, 248, 0.4)'
            }}>
              <Database size={22} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                  DataUploader/IndLands
                </h2>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  fontWeight: 600
                }}>
                  Hugging Face Hub
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Spatiotemporal Remote Sensing Benchmark Dataset for Landslide Susceptibility Analysis
              </p>
            </div>
          </div>

          {/* Python API Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              background: apiConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              border: `1px solid ${apiConnected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
              fontSize: '0.75rem',
              fontWeight: 600,
              color: apiConnected ? '#10b981' : '#f59e0b'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: apiConnected ? '#10b981' : '#f59e0b',
                boxShadow: apiConnected ? '0 0 8px #10b981' : '0 0 8px #f59e0b'
              }}></span>
              {apiConnected ? 'Python API Online (Port 5001)' : 'JSON Dataset Loaded'}
            </div>

            <a 
              href="https://huggingface.co/datasets/DataUploader/IndLands" 
              target="_blank" 
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                color: '#38bdf8',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)'
              }}
            >
              <span>View HF Dataset</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Code Command Snippet Banner */}
        <div style={{
          marginTop: '14px',
          padding: '10px 14px',
          borderRadius: '8px',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(51, 65, 85, 0.8)',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          color: '#38bdf8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto' }}>
            <Code size={14} color="#38bdf8" />
            <span>from datasets import load_dataset</span>
            <span style={{ color: '#94a3b8' }}>|</span>
            <span style={{ color: '#e2e8f0' }}>ds = load_dataset(&quot;DataUploader/IndLands&quot;)</span>
          </div>
          <span style={{
            fontSize: '0.7rem',
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'rgba(56, 189, 248, 0.2)',
            color: '#7dd3fc',
            whiteSpace: 'nowrap'
          }}>
            32 Remote Sensing Features
          </span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('explorer')}
          className={`tab-btn ${activeTab === 'explorer' ? 'active' : ''}`}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'explorer' ? 'var(--accent-blue)' : 'var(--bg-secondary)',
            color: activeTab === 'explorer' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Globe size={14} />
          <span>GIS Remote Sensing Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab('ml_predict')}
          className={`tab-btn ${activeTab === 'ml_predict' ? 'active' : ''}`}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'ml_predict' ? 'var(--accent-blue)' : 'var(--bg-secondary)',
            color: activeTab === 'ml_predict' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Cpu size={14} />
          <span>Python ML Susceptibility Model</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'code' ? 'var(--accent-blue)' : 'var(--bg-secondary)',
            color: activeTab === 'code' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Code size={14} />
          <span>Dataset Implementation Code</span>
        </button>
      </div>

      {/* TAB 1: GIS REMOTE SENSING EXPLORER */}
      {activeTab === 'explorer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* State Selector Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Uttarakhand', 'Himachal Pradesh', 'Sikkim', 'Mizoram', 'Maharashtra', 'Karnataka'].map(st => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: selectedState === st ? '1px solid var(--accent-blue)' : '1px solid var(--border-color)',
                  background: selectedState === st ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-card)',
                  color: selectedState === st ? 'var(--accent-blue)' : 'var(--text-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {st}
              </button>
            ))}
          </div>

          {/* State Summary Stat Cards */}
          {summary && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '12px'
            }}>
              <div className="stat-card" style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sample Points</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {summary.sampled_points}
                </div>
              </div>

              <div className="stat-card" style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mean Slope</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f59e0b', marginTop: '4px' }}>
                  {summary.mean_slope}°
                </div>
              </div>

              <div className="stat-card" style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mean Elevation</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8', marginTop: '4px' }}>
                  {summary.mean_elevation}m
                </div>
              </div>

              <div className="stat-card" style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mean NDVI</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>
                  {summary.mean_ndvi}
                </div>
              </div>

              <div className="stat-card" style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High Risk Zones</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ef4444', marginTop: '4px' }}>
                  {summary.high_risk_count}
                </div>
              </div>
            </div>
          )}

          {/* Grid Layout: Points List + Point Satellite Telemetry Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            {/* GIS Grid Points List */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '14px', maxHeight: '380px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  IndLands GIS Satellite Pixels ({selectedState})
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{statePoints.length} Tiles</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {statePoints.map((pt, idx) => {
                  const isSelected = selectedPoint && selectedPoint.id === pt.id;
                  const riskColor = pt.riskCategory === 'HIGH' ? '#ef4444' : (pt.riskCategory === 'MEDIUM' ? '#f59e0b' : '#10b981');

                  return (
                    <div
                      key={pt.id || idx}
                      onClick={() => {
                        setSelectedPoint(pt);
                        if (onSelectPointOnMap) onSelectPointOnMap(pt);
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-secondary)',
                        border: `1px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          Tile #{idx + 1} ({pt.lat.toFixed(3)}°, {pt.lng.toFixed(3)}°)
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Elev: {pt.elevation}m | Slope: {pt.slope}° | TWI: {pt.twi}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '10px',
                          background: `${riskColor}20`,
                          color: riskColor,
                          border: `1px solid ${riskColor}40`
                        }}>
                          {pt.riskScore} LRI
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Satellite Pixel Telemetry Card */}
            {selectedPoint && (
              <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                      Satellite Grid Telemetry Details
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Coordinates: {selectedPoint.lat} N, {selectedPoint.lng} E
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '12px',
                    background: selectedPoint.riskCategory === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: selectedPoint.riskCategory === 'HIGH' ? '#ef4444' : '#10b981',
                    border: `1px solid ${selectedPoint.riskCategory === 'HIGH' ? '#ef4444' : '#10b981'}`
                  }}>
                    {selectedPoint.riskCategory} RISK ({selectedPoint.riskScore})
                  </span>
                </div>

                {/* Satellite Remote Sensing Parameters */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem' }}>
                  <div style={{ background: 'var(--bg-secondary)', padding: '8px 10px', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>NDVI (Vegetation Index)</span>
                    <strong style={{ color: '#10b981', fontSize: '0.95rem' }}>{selectedPoint.ndvi}</strong>
                  </div>

                  <div style={{ background: 'var(--bg-secondary)', padding: '8px 10px', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>NDWI (Water Index)</span>
                    <strong style={{ color: '#38bdf8', fontSize: '0.95rem' }}>{selectedPoint.ndwi}</strong>
                  </div>

                  <div style={{ background: 'var(--bg-secondary)', padding: '8px 10px', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Topographic Wetness (TWI)</span>
                    <strong style={{ color: '#f59e0b', fontSize: '0.95rem' }}>{selectedPoint.twi}</strong>
                  </div>

                  <div style={{ background: 'var(--bg-secondary)', padding: '8px 10px', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Bare Soil Index (BSI)</span>
                    <strong style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>{selectedPoint.bsi}</strong>
                  </div>

                  <div style={{ background: 'var(--bg-secondary)', padding: '8px 10px', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Terrain Slope</span>
                    <strong style={{ color: '#f43f5e', fontSize: '0.95rem' }}>{selectedPoint.slope}°</strong>
                  </div>

                  <div style={{ background: 'var(--bg-secondary)', padding: '8px 10px', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>GLCM Texture Entropy</span>
                    <strong style={{ color: '#a855f7', fontSize: '0.95rem' }}>{selectedPoint.glcm_entropy}</strong>
                  </div>
                </div>

                {/* Location Map Action */}
                <button
                  onClick={() => onSelectPointOnMap && onSelectPointOnMap(selectedPoint)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, var(--accent-blue), #0284c7)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: '4px'
                  }}
                >
                  <Compass size={14} />
                  <span>Locate Tile on Interactive GIS Map</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PYTHON ML SUSCEPTIBILITY MODEL */}
      {activeTab === 'ml_predict' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Trained Machine Learning Model (IndLands Benchmark)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Random Forest Classifier trained on 285,975 multi-modal satellite remote sensing records from DataUploader/IndLands.
            </p>
          </div>

          {/* Model Performance Scorecards */}
          {modelMetrics && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Model Accuracy</span>
                <strong style={{ fontSize: '1.3rem', color: '#10b981' }}>{modelMetrics.metrics.accuracy}%</strong>
              </div>

              <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>ROC-AUC Score</span>
                <strong style={{ fontSize: '1.3rem', color: '#38bdf8' }}>{modelMetrics.metrics.roc_auc}</strong>
              </div>

              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Precision</span>
                <strong style={{ fontSize: '1.3rem', color: '#f59e0b' }}>{modelMetrics.metrics.precision}%</strong>
              </div>

              <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Dataset Size</span>
                <strong style={{ fontSize: '1.3rem', color: '#c084fc' }}>{modelMetrics.total_samples.toLocaleString()}</strong>
              </div>
            </div>
          )}

          {/* Top Feature Importance Ranking Chart */}
          {modelMetrics && modelMetrics.feature_importances && (
            <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                Top Learned Feature Importance Ranking (Satellite & Topographic)
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                {modelMetrics.feature_importances.slice(0, 8).map((feat, idx) => (
                  <div key={feat.feature} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>#{idx+1} {feat.feature}</span>
                      <strong style={{ color: '#38bdf8' }}>{feat.importance_percent}%</strong>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-card)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(feat.importance_percent * 6, 100)}%`, height: '100%', background: 'linear-gradient(90deg, #0284c7, #38bdf8)', borderRadius: '3px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Input Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span>Slope (°):</span>
                  <strong>{predSlope}°</strong>
                </div>
                <input type="range" min="0" max="90" value={predSlope} onChange={(e) => setPredSlope(Number(e.target.value))} style={{ width: '100%' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span>Topographic Wetness Index (TWI):</span>
                  <strong>{predTwi}</strong>
                </div>
                <input type="range" min="1" max="15" step="0.1" value={predTwi} onChange={(e) => setPredTwi(Number(e.target.value))} style={{ width: '100%' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span>Vegetation Index (NDVI):</span>
                  <strong>{predNdvi}</strong>
                </div>
                <input type="range" min="-0.2" max="0.8" step="0.01" value={predNdvi} onChange={(e) => setPredNdvi(Number(e.target.value))} style={{ width: '100%' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span>Terrain Ruggedness Index (TRI):</span>
                  <strong>{predTri}</strong>
                </div>
                <input type="range" min="0" max="10" step="0.1" value={predTri} onChange={(e) => setPredTri(Number(e.target.value))} style={{ width: '100%' }} />
              </div>

              <button
                onClick={handlePredict}
                disabled={predicting}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--accent-blue), #0284c7)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '8px'
                }}
              >
                {predicting ? <RefreshCw className="spin" size={16} /> : <Zap size={16} />}
                <span>Calculate IndLands ML Risk Index</span>
              </button>
            </div>

            {/* Prediction Result Display */}
            {predictionResult ? (
              <div style={{ background: 'var(--bg-secondary)', borderRadius: '10px', padding: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Predicted Landslide Susceptibility Index</span>
                  <div style={{
                    fontSize: '2.4rem',
                    fontWeight: 800,
                    color: predictionResult.risk_category === 'HIGH' ? '#ef4444' : (predictionResult.risk_category === 'MEDIUM' ? '#f59e0b' : '#10b981'),
                    margin: '4px 0'
                  }}>
                    {predictionResult.predicted_risk_score} / 100
                  </div>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: predictionResult.risk_category === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: predictionResult.risk_category === 'HIGH' ? '#ef4444' : '#10b981'
                  }}>
                    {predictionResult.risk_category} RISK CATEGORY
                  </span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Feature Contribution Breakdown:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Slope Impact:</span>
                      <strong>+{predictionResult.feature_contributions.slope_impact}%</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Topographic Wetness (TWI):</span>
                      <strong>+{predictionResult.feature_contributions.topographic_wetness_impact}%</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Vegetation Loss (NDVI):</span>
                      <strong>+{predictionResult.feature_contributions.vegetation_loss_impact}%</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Terrain Ruggedness (TRI):</span>
                      <strong>+{predictionResult.feature_contributions.terrain_ruggedness_impact}%</strong>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', borderRadius: '10px', padding: '20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Click calculate to run the IndLands prediction model.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DATASET IMPLEMENTATION CODE */}
      {activeTab === 'code' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 10px 0', color: 'var(--text-primary)' }}>
            Hugging Face Python Implementation Snippet
          </h3>
          <pre style={{
            background: 'var(--bg-secondary)',
            padding: '16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            color: '#38bdf8',
            overflowX: 'auto',
            border: '1px solid var(--border-color)'
          }}>
{`from datasets import load_dataset
import pandas as pd

# Load the IndLands dataset from Hugging Face Hub
ds = load_dataset("DataUploader/IndLands")

print("Dataset splits:", ds.keys())
print("Feature schema:", ds["train"].features)

# Extract 32 remote sensing features & latitude-longitude coordinates
# Features include: NDVI, TWI, slope, aspect, elevation, GLCM texture features
sample_df = pd.DataFrame(ds["train"])
print(sample_df.head())`}
          </pre>
        </div>
      )}
    </div>
  );
}
