"""
thresholds.py
-------------
Centralized Configuration for BhoomiRakshak Risk Assessment, 
Hysteresis Margins, Data Freshness Bounds, and Hazard Thresholds.

All hazard classifications (LOW, WATCH, WARNING, CRITICAL) reference 
these canonical values to enforce single-source-of-truth consistency.
"""

# Risk Classification Boundaries (0-100 Score Range)
RISK_THRESHOLDS = {
    "LOW": {"min": 0, "max": 39, "label": "LOW", "color": "#10b981"},
    "WATCH": {"min": 40, "max": 59, "label": "WATCH", "color": "#f59e0b"},
    "WARNING": {"min": 60, "max": 79, "label": "WARNING", "color": "#f97316"},
    "CRITICAL": {"min": 80, "max": 100, "label": "CRITICAL", "color": "#dc2626"}
}

# Hysteresis Margin (points) to prevent alert flickering (e.g. 79 <-> 80)
# An alert triggers at threshold (e.g., 80 for CRITICAL) and stays active 
# until risk falls below (threshold - HYSTERESIS_MARGIN), i.e., 70.
HYSTERESIS_MARGIN = 10

# Data Freshness Thresholds (Seconds)
DATA_FRESHNESS = {
    "LIVE_MAX_SECONDS": 300,      # < 5 minutes: LIVE telemetry
    "STALE_MAX_SECONDS": 900,     # 5 - 15 minutes: STALE telemetry
    # > 15 minutes: OFFLINE telemetry
}

# Flash Flood Engine - Provisional Hydrological Thresholds
# Documented: Rule-based hydrological index based on precipitation, river stage, and soil saturation
FLOOD_RISK_CONFIG = {
    "MODE_LABEL": "FLASH FLOOD RISK ASSESSMENT (PROVISIONAL HYDROMETEOROLOGICAL THRESHOLDS)",
    "RAIN_24H_CRITICAL_MM": 100.0,
    "RIVER_STAGE_WARNING_RATIO": 0.75,  # 75% of danger mark
    "RIVER_STAGE_DANGER_RATIO": 0.95,   # 95% of danger mark
    "SOIL_SATURATION_CRITICAL_PCT": 80.0
}
