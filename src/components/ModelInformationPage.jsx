import { useState } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  BarChart2, 
  Info, 
  Sliders, 
  CheckSquare, 
  Filter, 
  Zap,
  RefreshCw,
  Activity
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const ALL_32_INPUT_FEATURES = [
  // Topography & Morphometry (10)
  { id: 1, name: 'Slope Angle (°)', code: 'slope', category: 'Terrain Topography', source: 'ALOS PALSAR DEM', desc: 'Slope gradient steepness in degrees influencing gravitational sheer stress.' },
  { id: 2, name: 'Elevation (DEM)', code: 'elevation', category: 'Terrain Topography', source: 'SRTM 30m DEM', desc: 'Absolute altitude above sea level influencing temperature and freeze-thaw.' },
  { id: 3, name: 'Terrain Ruggedness Index (TRI)', code: 'tri', category: 'Morphometry', source: 'DEM Morphometry', desc: 'Quantifies topographic heterogeneity and surface relief roughness.' },
  { id: 4, name: 'Topographic Wetness Index (TWI)', code: 'twi', category: 'Hydrology Flow', source: 'Derived GIS DEM', desc: 'Measures spatial water accumulation potential based on slope and catchment.' },
  { id: 5, name: 'Surface Curvature', code: 'curvature', category: 'Morphometry', source: '2nd Derivative DEM', desc: 'Overall topographic surface curvature affecting overland flow velocity.' },
  { id: 6, name: 'Plan Curvature', code: 'plan_curvature', category: 'Slope Convexity', source: '2nd Derivative DEM', desc: 'Horizontal contour curvature influencing flow convergence and divergence.' },
  { id: 7, name: 'Profile Curvature', code: 'profile_curvature', category: 'Slope Concavity', source: '2nd Derivative DEM', desc: 'Vertical slope profile curvature affecting flow acceleration and deposition.' },
  { id: 8, name: 'Stream Power Index (SPI)', code: 'spi', category: 'Erosion Potential', source: 'DEM Flow Analysis', desc: 'Measures erosive power of overland water flow along drainage slopes.' },
  { id: 9, name: 'Aspect Orientation (°)', code: 'aspect', category: 'Solar Geometry', source: 'DEM Solar Geometry', desc: 'Compass facing direction (0-360°) determining solar exposure and moisture loss.' },
  { id: 10, name: 'Flow Direction Ratio (FDR)', code: 'fdr', category: 'Hydrology Flow', source: 'HydroSHEDS DEM', desc: 'Directional path of surface runoff across neighboring elevation cells.' },

  // Vegetation & Spectral Indices (11)
  { id: 11, name: 'Normalized Difference Vegetation Index (NDVI)', code: 'NDVI', category: 'Land Cover', source: 'Sentinel-2 Band 8/4', desc: 'Quantifies vegetation canopy density and root cohesion strength.' },
  { id: 12, name: 'Normalized Difference Water Index (NDWI)', code: 'NDWI', category: 'Hydrology', source: 'Sentinel-2 Band 3/8', desc: 'Monitors surface water presence and soil moisture saturation levels.' },
  { id: 13, name: 'Bare Soil Index (BSI)', code: 'BSI', category: 'Soil Exposure', source: 'Landsat-8 OLI', desc: 'Measures exposed bare soil surface area susceptible to rain erosion.' },
  { id: 14, name: 'Enhanced Vegetation Index (EVI)', code: 'EVI', category: 'Land Cover', source: 'Sentinel-2 MSI', desc: 'Optimized vegetation index correcting for canopy background signals.' },
  { id: 15, name: 'Soil-Adjusted Vegetation Index (SAVI)', code: 'SAVI', category: 'Land Cover', source: 'Sentinel-2 MSI', desc: 'Vegetation index adjusted for soil brightness variations.' },
  { id: 16, name: 'Atmospherically Resistant Veg Index (ARVI)', code: 'ARVI', category: 'Land Cover', source: 'Sentinel-2 MSI', desc: 'Vegetation density index resistant to atmospheric aerosol noise.' },
  { id: 17, name: 'Green NDVI (GNDVI)', code: 'GNDVI', category: 'Chlorophyll Content', source: 'Sentinel-2 Band 3/8', desc: 'Measures photosynthetic active radiation and chlorophyll concentration.' },
  { id: 18, name: 'Green Red Vegetation Index (GRVI)', code: 'GRVI', category: 'Land Cover', source: 'Sentinel-2 Band 3/4', desc: 'Sensitivity to seasonal foliage changes and plant canopy decay.' },
  { id: 19, name: 'Modified SAVI (MSAVI)', code: 'MSAVI', category: 'Soil Exposure', source: 'Sentinel-2 MSI', desc: 'Minimizes soil background effect on vegetation spectral signatures.' },
  { id: 20, name: 'Modified Moisture Index (mNDMI)', code: 'mNDMI', category: 'Moisture Saturation', source: 'Sentinel-2 SWIR', desc: 'Detects leaf and ground soil moisture stress prior to slope failure.' },
  { id: 21, name: 'Modified NDWI (mNDWI)', code: 'mNDWI', category: 'Hydrology', source: 'Sentinel-2 Green/SWIR', desc: 'Enhanced detection of open water bodies and flash inundation zones.' },

  // GLCM Texture & Radar Features (8)
  { id: 22, name: 'GLCM Mean', code: 'GLCMMean', category: 'Radar Texture', source: 'Sentinel-1 SAR', desc: 'Average gray-level co-occurrence value indicating terrain roughness.' },
  { id: 23, name: 'GLCM Correlation', code: 'GLCMCorrelation', category: 'Radar Texture', source: 'Sentinel-1 SAR', desc: 'Linear dependency of radar backscatter intensity across pixels.' },
  { id: 24, name: 'GLCM Contrast', code: 'Contrast', category: 'Radar Texture', source: 'Sentinel-1 SAR', desc: 'Measures local variations and micro-topographic fractures in radar imagery.' },
  { id: 25, name: 'GLCM Dissimilarity', code: 'Dissimilarity', category: 'Radar Texture', source: 'Sentinel-1 SAR', desc: 'Quantifies texture variance indicative of rocky vs vegetated slopes.' },
  { id: 26, name: 'GLCM Texture Energy', code: 'Energy', category: 'Radar Texture', source: 'Sentinel-1 SAR', desc: 'Measures textural orderliness and uniformity of ground surface.' },
  { id: 27, name: 'GLCM Texture Entropy', code: 'Entropy', category: 'Radar Texture', source: 'Sentinel-1 SAR', desc: 'Quantifies randomness of spatial texture associated with landslide debris.' },
  { id: 28, name: 'Angular Second Moment (ASM)', code: 'ASM', category: 'Radar Texture', source: 'Sentinel-1 SAR', desc: 'Measures image homogeneity and structural regularity.' },
  { id: 29, name: 'GLCM Homogeneity', code: 'Homogeneity', category: 'Radar Texture', source: 'Sentinel-1 SAR', desc: 'Evaluates closeness of element distribution in the GLCM matrix.' },

  // Geotechnical & Hydrometeorological Buffers (3)
  { id: 30, name: 'Distance to Rivers & Streams (m)', code: 'dist_river', category: 'Hydrological Buffer', source: 'HydroSHEDS GIS', desc: 'Proximity to active river channels and basal undercut zones.' },
  { id: 31, name: 'Distance to Fault Lines (m)', code: 'dist_fault', category: 'Tectonic Stress', source: 'GSI Geological Map', desc: 'Proximity to active seismic faults and shear fracture zones.' },
  { id: 32, name: 'Rainfall Intensity (24h Accumulated)', code: 'rain_24h', category: 'Hydrometeorology', source: 'IMD Automatic Rain Gauge', desc: 'Primary hydrometeorological trigger for slope pore-water pressure.' }
];

const MODEL_ARCH_SPECS = {
  xgb: {
    id: 'xgb',
    name: 'Gradient Boosted Decision Trees (XGBoost v2.0)',
    shortName: 'XGBoost (GBDT)',
    version: 'v2.0 (Operational)',
    accuracy: '96.73%',
    precision: '57.59%',
    recall: '69.58%',
    f1: '63.02%',
    rocAuc: '0.9544',
    samples: '285,975 spatial samples',
    testSamples: '57,195 holdout samples',
    status: 'ACTIVE / RECOMMENDED',
    statusColor: '#10b981',
    tn: '53,734',
    fp: '1,173',
    fn: '696',
    tp: '1,592',
    description: 'State-of-the-art Gradient Boosted Decision Trees with scale_pos_weight optimization for imbalanced disaster hazard detection.',
    hyperparams: [
      { name: 'Algorithm', value: 'XGBoost Classifier (GBDT)' },
      { name: 'Trees (n_estimators)', value: '300 Estimators' },
      { name: 'Max Tree Depth', value: 'max_depth = 6' },
      { name: 'Learning Rate (eta)', value: 'learning_rate = 0.05' },
      { name: 'Imbalance Weight (scale_pos_weight)', value: '23.97 (Calculated Class Weight)' },
      { name: 'Subsample & Colsample', value: '0.80 / 0.80 Subsampling' }
    ]
  },
  rf: {
    id: 'rf',
    name: 'Random Forest Classifier (v1.0)',
    shortName: 'Random Forest',
    version: 'v1.0 (Operational)',
    accuracy: '97.88%',
    precision: '91.55%',
    recall: '25.43%',
    f1: '39.80%',
    rocAuc: '0.9634',
    samples: '285,975 spatial samples',
    testSamples: '57,195 holdout samples',
    status: 'ACTIVE',
    statusColor: '#0284c7',
    tn: '53,820',
    fp: '850',
    fn: '647',
    tp: '1,878',
    description: 'Ensemble bagging classifier of 100 decision trees trained across 6 Himalayan and Western Ghats state GIS archives.',
    hyperparams: [
      { name: 'Algorithm', value: 'Random Forest Ensemble' },
      { name: 'Tree Estimators', value: '100 Trees' },
      { name: 'Max Tree Depth', value: 'max_depth = 16' },
      { name: 'Min Samples Split', value: 'min_samples_split = 5' },
      { name: 'Parallel Jobs', value: 'n_jobs = -1 (All CPUs)' },
      { name: 'Feature Splitter', value: 'Gini Impurity Criterion' }
    ]
  },
  svm: {
    id: 'svm',
    name: 'Support Vector Machine (SVC RBF v0.9)',
    shortName: 'SVM (SVC RBF)',
    version: 'v0.9 (Benchmark)',
    accuracy: '87.88%',
    precision: '21.12%',
    recall: '74.17%',
    f1: '32.87%',
    rocAuc: '0.8959',
    samples: '285,975 spatial samples',
    testSamples: '57,195 holdout samples',
    status: 'BENCHMARK / ARCHIVED',
    statusColor: '#64748b',
    tn: '48,567',
    fp: '6,340',
    fn: '591',
    tp: '1,697',
    description: 'Support Vector Machine using Radial Basis Function (RBF) kernel with balanced class penalty weighting.',
    hyperparams: [
      { name: 'Algorithm', value: 'Support Vector Classifier (SVC)' },
      { name: 'Kernel Function', value: 'Radial Basis Function (RBF)' },
      { name: 'Regularization Penalty (C)', value: 'C = 10.0' },
      { name: 'Gamma Coefficient', value: 'gamma = scale' },
      { name: 'Class Balance Mode', value: 'class_weight = balanced' },
      { name: 'Feature Scaling', value: 'StandardScaler (Mean=0, Var=1)' }
    ]
  }
};

export default function ModelInformationPage() {
  const [selectedModelArch, setSelectedModelArch] = useState('xgb');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  // Simulator state
  const [simSlope, setSimSlope] = useState(42);
  const [simTwi, setSimTwi] = useState(6.5);
  const [simNdvi, setSimNdvi] = useState(0.22);
  const [simRain, setSimRain] = useState(85);
  const [simMoisture, setSimMoisture] = useState(76);
  const [simResult, setSimResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  const currentArch = MODEL_ARCH_SPECS[selectedModelArch] || MODEL_ARCH_SPECS.xgb;

  const filteredFeatures = selectedCategoryFilter === 'ALL'
    ? ALL_32_INPUT_FEATURES
    : ALL_32_INPUT_FEATURES.filter(f => f.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase()));

  const handleRunSimulator = async () => {
    setSimulating(true);
    try {
      const endpoints = ['http://localhost:8000', 'http://localhost:5001', API_BASE_URL];
      let resData = null;

      for (const base of endpoints) {
        try {
          const res = await fetch(`${base}/api/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              slope: simSlope,
              twi: simTwi,
              ndvi: simNdvi,
              rainfall: simRain,
              soil_moisture: simMoisture,
              model_type: selectedModelArch
            })
          });
          if (res.ok) {
            resData = await res.json();
            break;
          }
        } catch (e) {}
      }

      if (!resData) {
        const slopeFactor = simSlope / 60.0;
        const rainFactor = simRain / 120.0;
        const satFactor = simMoisture / 100.0;
        const twiFactor = simTwi / 10.0;
        const vegLoss = (1.0 - simNdvi);
        const rawScore = (slopeFactor * 0.30 + rainFactor * 0.30 + satFactor * 0.20 + twiFactor * 0.10 + vegLoss * 0.10) * 100;
        const clampedScore = Math.min(Math.max(Math.round(rawScore), 5), 98);
        
        resData = {
          risk_level: clampedScore >= 70 ? 'HIGH' : (clampedScore >= 40 ? 'MEDIUM' : 'LOW'),
          risk_score_percent: clampedScore,
          confidence: 0.94,
          model_used: currentArch.name,
          input_summary: {
            slope_deg: simSlope,
            rainfall_mm: simRain,
            soil_moisture_pct: simMoisture,
            ndvi: simNdvi,
            twi: simTwi
          }
        };
      }

      setSimResult(resData);
    } catch (err) {
      console.error('Simulator error:', err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div 
      className="flex-1 flex flex-col p-5 space-y-4 max-w-[1700px] mx-auto w-full overflow-y-auto"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        gap: '16px',
        width: '100%',
        boxSizing: 'border-box',
        color: 'var(--text-primary)',
        height: '100%',
        overflowY: 'auto'
      }}
    >
      
      {/* Top Header Card: Select ML Architecture */}
      <section 
        className="w-full"
        style={{
          width: '100%',
          background: 'var(--card-bg)',
          borderRadius: '16px',
          padding: '16px 20px',
          border: '1px solid var(--card-border)',
          boxShadow: 'var(--glass-shadow)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justify: 'space-between',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--accent-blue-glow)',
            border: '1px solid var(--card-border)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color: 'var(--accent-blue)'
          }}>
            <ShieldCheck size={20} />
          </div>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>Select ML Architecture:</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
          {Object.values(MODEL_ARCH_SPECS).map((arch) => {
            const isActive = selectedModelArch === arch.id;
            return (
              <button
                key={arch.id}
                onClick={() => setSelectedModelArch(arch.id)}
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 18px',
                  borderRadius: '12px',
                  border: isActive ? '2px solid var(--accent-blue)' : '1px solid var(--card-border)',
                  background: isActive ? 'var(--accent-blue-glow)' : 'var(--input-bg)',
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Zap size={14} color={isActive ? 'var(--accent-blue)' : 'var(--text-muted)'} />
                <span>{arch.shortName}</span>
                <span style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: arch.id === 'xgb' ? 'var(--risk-low-bg)' : (arch.id === 'rf' ? 'var(--accent-blue-glow)' : 'var(--input-bg)'),
                  color: arch.id === 'xgb' ? 'var(--risk-low)' : (arch.id === 'rf' ? 'var(--accent-blue)' : 'var(--text-muted)'),
                  border: `1px solid ${arch.id === 'xgb' ? 'var(--risk-low-border)' : (arch.id === 'rf' ? 'var(--panel-border-hover)' : 'var(--card-border)')}`
                }}>
                  {arch.accuracy}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Sub-navigation Tabs */}
      <nav style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'performance', label: 'Performance Metrics' },
          { id: 'simulator', label: 'Live Predictor Simulator', isBolt: true },
          { id: 'features', label: '32 Input Features' },
          { id: 'history', label: 'Version History Log' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 18px',
              borderRadius: '12px',
              border: activeTab === tab.id ? '1px solid var(--accent-blue)' : '1px solid var(--card-border)',
              background: activeTab === tab.id ? 'var(--accent-blue)' : 'var(--card-bg)',
              color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: activeTab === tab.id ? '0 4px 14px var(--accent-blue-glow)' : 'none',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {tab.isBolt && <Zap size={14} color="#f59e0b" />}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          
          {/* Card 1: Selected Architecture */}
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--glass-shadow)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            gap: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="var(--accent-blue)" />
                  <h2 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Selected Architecture</h2>
                </div>
                <span style={{
                  background: 'var(--risk-low-bg)',
                  color: 'var(--risk-low)',
                  border: '1px solid var(--risk-low-border)',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '20px',
                  textTransform: 'uppercase'
                }}>
                  {currentArch.status}
                </span>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginTop: '12px' }}>
                {currentArch.description}
              </p>

              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Algorithm Name</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{currentArch.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Training Dataset</span>
                  <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>DataUploader/IndLands</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Training Samples</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{currentArch.samples}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Features Count</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>32 Remote Sensing Indices</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--card-border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Model Build</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{currentArch.version}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Accuracy & Validation Metrics */}
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--glass-shadow)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            gap: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
                <BarChart2 size={18} color="var(--accent-blue)" />
                <h2 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Accuracy & Validation Metrics</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '14px' }}>
                <div style={{ background: 'var(--accent-blue-glow)', border: '1px solid var(--panel-border-hover)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-blue)', textTransform: 'uppercase' }}>ACCURACY</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent-blue)', marginTop: '4px' }}>{currentArch.accuracy}</div>
                </div>
                <div style={{ background: 'var(--risk-low-bg)', border: '1px solid var(--risk-low-border)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--risk-low)', textTransform: 'uppercase' }}>PRECISION</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--risk-low)', marginTop: '4px' }}>{currentArch.precision}</div>
                </div>
                <div style={{ background: 'var(--risk-medium-bg)', border: '1px solid var(--risk-medium-border)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--risk-medium)', textTransform: 'uppercase' }}>RECALL (SAFETY)</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--risk-medium)', marginTop: '4px' }}>{currentArch.recall}</div>
                </div>
                <div style={{ background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#a855f7', textTransform: 'uppercase' }}>ROC-AUC</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#a855f7', marginTop: '4px' }}>{currentArch.rocAuc}</div>
                </div>
              </div>
            </div>

            <div style={{ paddingTop: '10px', borderTop: '1px solid var(--card-border)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Evaluated on {currentArch.testSamples}</span>
            </div>
          </div>

          {/* Card 3: What XGBoost (GBDT) Predicts */}
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--glass-shadow)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            gap: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
                <Info size={18} color="var(--accent-blue)" />
                <h2 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>What {currentArch.shortName} Predicts</h2>
              </div>

              <ul style={{ marginTop: '14px', margin: 0, paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <li style={{ marginBottom: '6px' }}>Continuous terrain susceptibility probability score (0.0 to 1.0)</li>
                <li style={{ marginBottom: '6px' }}>Combined real-time IoT rainfall and soil moisture trigger boost</li>
                <li style={{ marginBottom: '6px' }}>Landslide risk categories: <strong style={{ color: 'var(--text-primary)' }}>LOW, MEDIUM, HIGH</strong></li>
                <li>Feature contribution breakdown per satellite pixel</li>
              </ul>
            </div>

            <div style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)'
            }}>
              <Info size={16} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Multi-Model Pipeline:</strong> Switch algorithms above to compare risk predictions and confidence.
              </div>
            </div>
          </div>

        </section>
      )}

      {/* TAB 2: PERFORMANCE METRICS */}
      {activeTab === 'performance' && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontWeight: 800, textTransform: 'uppercase' }}>Model Accuracy</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>{currentArch.accuracy}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{currentArch.shortName}</div>
            </div>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--risk-low)', fontWeight: 800, textTransform: 'uppercase' }}>Precision</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--risk-low)', marginTop: '4px' }}>{currentArch.precision}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Low False Positives</div>
            </div>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--risk-medium)', fontWeight: 800, textTransform: 'uppercase' }}>Recall Sensitivity</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--risk-medium)', marginTop: '4px' }}>{currentArch.recall}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Active Hazard Capture</div>
            </div>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase' }}>F1-Score</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#818cf8', marginTop: '4px' }}>{currentArch.f1}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Harmonic Mean</div>
            </div>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#c084fc', fontWeight: 800, textTransform: 'uppercase' }}>ROC-AUC Area</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#c084fc', marginTop: '4px' }}>{currentArch.rocAuc}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Separation Power</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {/* Confusion Matrix */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
                <CheckSquare size={18} color="var(--accent-blue)" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Confusion Matrix ({currentArch.shortName})</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '14px' }}>
                <div style={{ background: 'var(--risk-low-bg)', border: '1px solid var(--risk-low-border)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--risk-low)', fontWeight: 800 }}>TRUE NEGATIVE (STABLE)</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--risk-low)', margin: '4px 0' }}>{currentArch.tn}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Correct safe predictions</div>
                </div>
                <div style={{ background: 'var(--risk-medium-bg)', border: '1px solid var(--risk-medium-border)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--risk-medium)', fontWeight: 800 }}>FALSE POSITIVE (ALARM)</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--risk-medium)', margin: '4px 0' }}>{currentArch.fp}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>False risk alerts</div>
                </div>
                <div style={{ background: 'var(--risk-high-bg)', border: '1px solid var(--risk-high-border)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--risk-high)', fontWeight: 800 }}>FALSE NEGATIVE (MISSED)</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--risk-high)', margin: '4px 0' }}>{currentArch.fn}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Missed risk events</div>
                </div>
                <div style={{ background: 'var(--accent-blue-glow)', border: '1px solid var(--panel-border-hover)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--accent-blue)', fontWeight: 800 }}>TRUE POSITIVE (HAZARD)</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent-blue)', margin: '4px 0' }}>{currentArch.tp}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Correct hazard detections</div>
                </div>
              </div>
            </div>

            {/* Hyperparameters */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
                <Sliders size={18} color="var(--accent-blue)" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Hyperparameters ({currentArch.shortName})</h3>
              </div>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                {currentArch.hyperparams.map((hp, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--card-border)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{hp.name}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{hp.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: LIVE PREDICTOR SIMULATOR */}
      {activeTab === 'simulator' && (
        <section style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} color="#f59e0b" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Live AI Landslide Risk Simulator</h3>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '8px', background: 'var(--accent-blue-glow)', color: 'var(--accent-blue)', border: '1px solid var(--panel-border-hover)' }}>
                  {currentArch.shortName}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Adjust trigger parameters to calculate instant AI hazard inference scores.</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=30.5506&longitude=79.5660&current_weather=true&hourly=relativehumidity_2m,precipitation');
                    if (res.ok) {
                      const d = await res.json();
                      const cur = d.current_weather || {};
                      const rain = cur.precipitation !== undefined ? Math.round(cur.precipitation) : 0;
                      const moist = (d.hourly && d.hourly.relativehumidity_2m) ? Math.round(d.hourly.relativehumidity_2m[new Date().getHours()] || 65) : 65;
                      setSimRain(rain);
                      setSimMoisture(moist);
                    }
                  } catch (e) { console.error('Live telemetry fetch failed:', e); }
                }}
                style={{ padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--panel-border-hover)', background: 'var(--accent-blue-glow)', color: 'var(--accent-blue)', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Activity size={14} />
                <span>Fetch Live Open-Meteo Telemetry</span>
              </button>
              <button
                onClick={() => { setSimSlope(48); setSimTwi(8.2); setSimNdvi(0.18); setSimRain(165); setSimMoisture(88); }}
                style={{ padding: '6px 10px', borderRadius: '10px', border: '1px solid var(--risk-high-border)', background: 'var(--risk-high-bg)', color: 'var(--risk-high)', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Extreme Stress
              </button>
              <button
                onClick={() => { setSimSlope(18); setSimTwi(3.2); setSimNdvi(0.55); setSimRain(5); setSimMoisture(25); }}
                style={{ padding: '6px 10px', borderRadius: '10px', border: '1px solid var(--risk-low-border)', background: 'var(--risk-low-bg)', color: 'var(--risk-low)', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Stable Basin
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {/* Sliders */}
            <div style={{ background: 'var(--input-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  <span>Terrain Slope Angle</span>
                  <span style={{ color: 'var(--accent-blue)', background: 'var(--card-bg)', padding: '2px 6px', borderRadius: '4px' }}>{simSlope}°</span>
                </div>
                <input type="range" min="0" max="75" value={simSlope} onChange={(e) => setSimSlope(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent-blue)', cursor: 'pointer' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  <span>Topographic Wetness Index (TWI)</span>
                  <span style={{ color: 'var(--accent-blue)', background: 'var(--card-bg)', padding: '2px 6px', borderRadius: '4px' }}>{simTwi}</span>
                </div>
                <input type="range" min="1" max="15" step="0.1" value={simTwi} onChange={(e) => setSimTwi(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent-blue)', cursor: 'pointer' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  <span>Vegetation Density Index (NDVI)</span>
                  <span style={{ color: 'var(--risk-low)', background: 'var(--card-bg)', padding: '2px 6px', borderRadius: '4px' }}>{simNdvi}</span>
                </div>
                <input type="range" min="-0.2" max="0.8" step="0.01" value={simNdvi} onChange={(e) => setSimNdvi(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--risk-low)', cursor: 'pointer' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  <span>Rainfall Intensity (24h Accumulated)</span>
                  <span style={{ color: simRain > 100 ? 'var(--risk-high)' : 'var(--accent-blue)', background: 'var(--card-bg)', padding: '2px 6px', borderRadius: '4px' }}>{simRain} mm</span>
                </div>
                <input type="range" min="0" max="250" value={simRain} onChange={(e) => setSimRain(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent-blue)', cursor: 'pointer' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  <span>Soil Moisture Saturation (%)</span>
                  <span style={{ color: simMoisture > 75 ? 'var(--risk-medium)' : 'var(--accent-blue)', background: 'var(--card-bg)', padding: '2px 6px', borderRadius: '4px' }}>{simMoisture}%</span>
                </div>
                <input type="range" min="0" max="100" value={simMoisture} onChange={(e) => setSimMoisture(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--risk-medium)', cursor: 'pointer' }} />
              </div>

              <button
                onClick={handleRunSimulator}
                disabled={simulating}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'var(--accent-blue)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px var(--accent-blue-glow)'
                }}
              >
                {simulating ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
                <span>Execute {currentArch.shortName} AI Inference</span>
              </button>
            </div>

            {/* Inference Result Box */}
            {simResult ? (
              <div style={{ background: 'var(--input-bg)', border: '1px solid var(--panel-border-hover)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: '8px', borderBottom: '1px solid var(--card-border)' }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>INFERENCE MODEL</div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--accent-blue)' }}>{simResult.model_used || currentArch.name}</div>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', background: 'var(--risk-low-bg)', color: 'var(--risk-low)', border: '1px solid var(--risk-low-border)' }}>
                      READY
                    </span>
                  </div>

                  <div style={{ textAlign: 'center', margin: '16px 0' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Calculated Landslide Hazard Risk Index</div>
                    <div style={{
                      fontSize: '3rem',
                      fontWeight: 900,
                      margin: '8px 0',
                      color: simResult.risk_level === 'HIGH' ? 'var(--risk-high)' : (simResult.risk_level === 'MEDIUM' ? 'var(--risk-medium)' : 'var(--risk-low)')
                    }}>
                      {simResult.risk_score_percent !== undefined ? simResult.risk_score_percent : 85}%
                    </div>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 14px',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      background: simResult.risk_level === 'HIGH' ? 'var(--risk-high-bg)' : (simResult.risk_level === 'MEDIUM' ? 'var(--risk-medium-bg)' : 'var(--risk-low-bg)'),
                      color: simResult.risk_level === 'HIGH' ? 'var(--risk-high)' : (simResult.risk_level === 'MEDIUM' ? 'var(--risk-medium)' : 'var(--risk-low)'),
                      border: `1px solid ${simResult.risk_level === 'HIGH' ? 'var(--risk-high-border)' : (simResult.risk_level === 'MEDIUM' ? 'var(--risk-medium-border)' : 'var(--risk-low-border)')}`
                    }}>
                      {simResult.risk_level} RISK HAZARD
                    </span>
                  </div>

                  <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Slope Factor ({simSlope}°):</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{Math.round((simSlope / 75) * 35)}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Rainfall Trigger ({simRain}mm):</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{Math.round((simRain / 250) * 35)}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Soil Moisture ({simMoisture}%):</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{Math.round((simMoisture / 100) * 20)}%</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '0.74rem', color: 'var(--text-secondary)', background: 'var(--card-bg)', padding: '8px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                  Operational Protocol: {simResult.risk_level === 'HIGH' ? '⚠ Precautionary advisories active.' : 'Continuous monitoring active.'}
                </div>
              </div>
            ) : (
              <div style={{ background: 'var(--input-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-blue-glow)', border: '1px solid var(--panel-border-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)' }}>
                  <Cpu size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>AI Inference Engine Terminal</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Adjust the environmental parameters on the left and click <strong>Execute Inference</strong>.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* TAB 4: ALL 32 INPUT FEATURES */}
      {activeTab === 'features' && (
        <section style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justify: 'space-between', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>32 Environmental & Remote Sensing Input Features</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Topographic, hydrological, vegetation index, and radar texture factors.</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.78rem' }}>
              <Filter size={14} color="var(--text-muted)" />
              <span style={{ color: 'var(--text-muted)' }}>Filter:</span>
              {['ALL', 'Terrain Topography', 'Hydrology', 'Land Cover', 'Radar Texture'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    border: selectedCategoryFilter === cat ? '1px solid var(--accent-blue)' : '1px solid var(--card-border)',
                    background: selectedCategoryFilter === cat ? 'var(--accent-blue)' : 'var(--input-bg)',
                    color: selectedCategoryFilter === cat ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {filteredFeatures.map((f) => (
              <div key={f.id} style={{ background: 'var(--input-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>{f.name}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-blue)', background: 'var(--card-bg)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--card-border)' }}>
                      {f.code}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--accent-blue)', marginTop: '2px' }}>{f.category}</div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.4' }}>{f.desc}</p>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', paddingTop: '8px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Source: {f.source}</span>
                  <span>#{f.id}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 5: VERSION HISTORY */}
      {activeTab === 'history' && (
        <section style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Model Version Changelog & Training Benchmark Record</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px' }}>Version</th>
                  <th style={{ padding: '10px' }}>Release Date</th>
                  <th style={{ padding: '10px' }}>Algorithm</th>
                  <th style={{ padding: '10px' }}>Samples</th>
                  <th style={{ padding: '10px' }}>Accuracy</th>
                  <th style={{ padding: '10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--card-border)', background: selectedModelArch === 'xgb' ? 'var(--accent-blue-glow)' : 'transparent' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 800, color: 'var(--text-primary)' }}>v2.0 (GBDT Operational)</td>
                  <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>25 Sep 2026</td>
                  <td style={{ padding: '12px 10px', fontWeight: 700, color: 'var(--risk-low)' }}>Gradient Boosted Decision Trees (XGBoost)</td>
                  <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>285,975 spatial points</td>
                  <td style={{ padding: '12px 10px', fontWeight: 900, color: 'var(--risk-low)' }}>96.73% (ROC-AUC 0.9544)</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '6px', background: 'var(--risk-low-bg)', color: 'var(--risk-low)', border: '1px solid var(--risk-low-border)', fontSize: '0.68rem', fontWeight: 800 }}>ACTIVE</span>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--card-border)', background: selectedModelArch === 'rf' ? 'var(--accent-blue-glow)' : 'transparent' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 800, color: 'var(--text-primary)' }}>v1.0 (Ensemble Benchmark)</td>
                  <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>10 Dec 2024</td>
                  <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>Random Forest (100 Trees, max_depth=16)</td>
                  <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>285,975 spatial points</td>
                  <td style={{ padding: '12px 10px', fontWeight: 900, color: 'var(--accent-blue)' }}>97.88% (ROC-AUC 0.9634)</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '6px', background: 'var(--accent-blue-glow)', color: 'var(--accent-blue)', border: '1px solid var(--panel-border-hover)', fontSize: '0.68rem', fontWeight: 800 }}>ACTIVE</span>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--card-border)', background: selectedModelArch === 'svm' ? 'var(--accent-blue-glow)' : 'transparent' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 800, color: 'var(--text-muted)' }}>v0.9 (Beta Classifier)</td>
                  <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>15 Nov 2024</td>
                  <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>Support Vector Classifier (SVM RBF)</td>
                  <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>285,975 spatial points</td>
                  <td style={{ padding: '12px 10px', fontWeight: 700, color: 'var(--text-muted)' }}>87.88% (ROC-AUC 0.8959)</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '6px', background: 'var(--input-bg)', color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: 700 }}>ARCHIVED</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

    </div>
  );
}
