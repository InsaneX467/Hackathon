"""
validation.py
-------------
Strict Data Validation & Data Freshness Utility.

Validates incoming sensor and telemetry inputs against physical bounds 
and timestamp freshness constraints. Rejects invalid / corrupted / stale values 
and flags DATA INSUFFICIENT / OFFLINE states rather than defaulting to 0 or safe.
"""

from datetime import datetime, timezone
import math
from config.thresholds import DATA_FRESHNESS

def validate_telemetry_payload(data):
    """
    Validates an incoming telemetry record.
    Returns: (is_valid, sanitized_dict, status_code, error_message)
    """
    if not isinstance(data, dict):
        return False, {}, "INVALID_FORMAT", "Payload must be a JSON object"

    # Require location id / name
    location_id = data.get("locationId") or data.get("id") or data.get("location")
    if not location_id:
        return False, {}, "MISSING_LOCATION", "Telemetry must specify a valid location identifier"

    # Validate numerical fields
    sanitized = {"locationId": str(location_id)}
    
    # Rainfall validation (0.0 to 500.0 mm/h)
    rain = data.get("rain") or data.get("rainfall")
    if rain is not None:
        try:
            val = float(rain)
            if math.isnan(val) or val < 0 or val > 500:
                return False, {}, "INVALID_RAINFALL", f"Rainfall value {val} out of physical bounds (0-500mm)"
            sanitized["rain"] = val
        except (ValueError, TypeError):
            return False, {}, "INVALID_RAINFALL", "Rainfall must be a valid numeric float"

    # Soil moisture validation (0.0 to 100.0 %)
    moisture = data.get("moisture") or data.get("soil_moisture")
    if moisture is not None:
        try:
            val = float(moisture)
            if math.isnan(val) or val < 0 or val > 100:
                return False, {}, "INVALID_MOISTURE", f"Soil moisture value {val} out of bounds (0-100%)"
            sanitized["moisture"] = val
        except (ValueError, TypeError):
            return False, {}, "INVALID_MOISTURE", "Soil moisture must be a valid numeric float"

    # River stage validation (0.0 to 30.0 m)
    river_level = data.get("riverLevel") or data.get("river_level")
    if river_level is not None:
        try:
            val = float(river_level)
            if math.isnan(val) or val < 0 or val > 30:
                return False, {}, "INVALID_RIVER_STAGE", f"River stage value {val} out of bounds (0-30m)"
            sanitized["riverLevel"] = val
        except (ValueError, TypeError):
            return False, {}, "INVALID_RIVER_STAGE", "River stage must be a valid numeric float"

    # Timestamp & Data Freshness
    ts_str = data.get("timestamp")
    freshness, seconds_age = check_timestamp_freshness(ts_str)
    sanitized["dataFreshness"] = freshness
    sanitized["dataAgeSeconds"] = seconds_age
    sanitized["timestamp"] = ts_str or datetime.now(timezone.utc).isoformat()

    return True, sanitized, "VALID", None


def check_timestamp_freshness(timestamp_val):
    """
    Evaluates timestamp age against DATA_FRESHNESS thresholds.
    Returns: (freshness_status, age_seconds)
    """
    if not timestamp_val:
        return "LIVE", 0  # Default to fresh if timestamp omitted on real-time payload

    try:
        if isinstance(timestamp_val, (int, float)):
            dt = datetime.fromtimestamp(timestamp_val, timezone.utc)
        else:
            # Handle standard ISO strings
            dt_str = str(timestamp_val).replace("Z", "+00:00")
            dt = datetime.fromisoformat(dt_str)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
        
        now = datetime.now(timezone.utc)
        age_sec = (now - dt).total_seconds()
        
        if age_sec < 0:
            age_sec = 0 # Handle slight clock drift

        if age_sec <= DATA_FRESHNESS["LIVE_MAX_SECONDS"]:
            return "LIVE", round(age_sec, 1)
        elif age_sec <= DATA_FRESHNESS["STALE_MAX_SECONDS"]:
            return "STALE", round(age_sec, 1)
        else:
            return "OFFLINE", round(age_sec, 1)
    except Exception:
        return "STALE", 999.0
