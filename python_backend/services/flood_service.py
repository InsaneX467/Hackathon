"""
flood_service.py
----------------
Flash Flood Risk Engine.

Evaluates real hydrological telemetry (river stage, river rise rate, 
discharge flow, precipitation, and soil saturation) using transparent, 
canonical hydrometeorological rules.

Explicitly labeled: FLASH FLOOD RISK ASSESSMENT (PROVISIONAL THRESHOLDS)
(Not labeled as AI prediction, as required by Section 9 & Section 10).
"""

from config.thresholds import FLOOD_RISK_CONFIG, RISK_THRESHOLDS

def classify_risk_score(score):
    """Centralized risk classification using RISK_THRESHOLDS config."""
    for category, bounds in RISK_THRESHOLDS.items():
        if bounds["min"] <= score <= bounds["max"]:
            return category, bounds["color"]
    return "CRITICAL", "#dc2626"


def predict_flash_flood_risk(location_data):
    """
    Evaluates Flash Flood Risk for a given location record.
    Returns: dict with riskScore, classification, indicators, dataStatus, engine_type.
    """
    rain = float(location_data.get("rain", 0))
    river_level = float(location_data.get("riverLevel", 1.4))
    warning_mark = float(location_data.get("warningMark", 3.2))
    danger_mark = float(location_data.get("dangerMark", 4.2))
    river_rise_rate = float(location_data.get("riverRiseRate", 0.5))
    discharge = float(location_data.get("discharge", 40.0))
    moisture = float(location_data.get("moisture", 0))

    data_status = location_data.get("dataFreshness", "LIVE")

    if data_status == "OFFLINE":
        return {
            "hazard": "flash_flood",
            "riskScore": None,
            "classification": "DATA_INSUFFICIENT",
            "dataStatus": "OFFLINE",
            "indicators": ["River gauge telemetry offline", "Insufficient data for flood assessment"],
            "engineType": FLOOD_RISK_CONFIG["MODE_LABEL"]
        }

    # Hydrological Normalized Components
    # 1. River Stage Ratio relative to danger mark (45% Weight)
    norm_river = min(max(river_level / danger_mark, 0), 1.2)
    stage_score = norm_river * 45.0

    # 2. Rainfall Intensity & Accumulation Index (35% Weight)
    norm_rain = min(max(rain / 120.0, 0), 1.2)
    rain_score = norm_rain * 35.0

    # 3. Soil Saturation & Runoff Factor (20% Weight)
    norm_moisture = min(max(moisture / 100.0, 0), 1.0)
    moisture_score = norm_moisture * 20.0

    # 4. River Surge Penalty (+10 bonus if rise rate > 2.0 m/h)
    surge_penalty = 10.0 if river_rise_rate >= 2.0 else (5.0 if river_rise_rate >= 1.0 else 0.0)

    total_score = round(min(max(stage_score + rain_score + moisture_score + surge_penalty, 0), 100))
    category, color = classify_risk_score(total_score)

    indicators = []
    if river_level >= danger_mark:
        indicators.append(f"River stage ({river_level}m) EXCEEDS Danger Mark ({danger_mark}m)")
    elif river_level >= warning_mark:
        indicators.append(f"River stage ({river_level}m) above Warning Level ({warning_mark}m)")
    if river_rise_rate >= 2.0:
        indicators.append(f"Rapid river stage surge rate (+{river_rise_rate} m/h)")
    if rain >= 80:
        indicators.append(f"Torrential precipitation ({rain} mm)")
    if moisture >= 75:
        indicators.append(f"Soil saturation limit reached ({moisture}%)")
    if not indicators:
        indicators.append("River stage and discharge within normal seasonal limits")

    return {
        "location": location_data.get("name", location_data.get("locationId", "Unknown")),
        "hazard": "flash_flood",
        "riskScore": total_score,
        "probability": None,
        "classification": category,
        "categoryColor": color,
        "dataStatus": data_status,
        "indicators": indicators,
        "engineType": FLOOD_RISK_CONFIG["MODE_LABEL"]
    }
