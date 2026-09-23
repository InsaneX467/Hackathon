"""
location_service.py
-------------------
Location State Manager for BhoomiRakshak.

Maintains independent telemetry, risk assessments, and alert states 
for all monitored wards and villages in the Garhwal Himalayas.
"""

from services.landslide_service import predict_landslide_risk
from services.flood_service import predict_flash_flood_risk
from services.alert_engine import alert_engine_instance
from utils.validation import validate_telemetry_payload

INITIAL_LOCATIONS = {
    'v1': {
        'id': 'v1', 'name': 'Joshimath Ward 1', 'lat': 30.5506, 'lng': 79.5660,
        'rain': 126.0, 'moisture': 87.0, 'slope': 41.0, 'elevation': 2100.0,
        'riverLevel': 2.4, 'warningMark': 3.2, 'dangerMark': 4.2, 'riverRiseRate': 1.5, 'discharge': 52.0,
        'twi': 6.5, 'tri': 4.8, 'ndvi': 0.32, 'bsi': 0.12, 'aspect': 180.0
    },
    'v2': {
        'id': 'v2', 'name': 'Tapovan', 'lat': 30.4900, 'lng': 79.6200,
        'rain': 45.0, 'moisture': 62.0, 'slope': 38.0, 'elevation': 1820.0,
        'riverLevel': 2.1, 'warningMark': 3.5, 'dangerMark': 4.5, 'riverRiseRate': 3.0, 'discharge': 78.0,
        'twi': 5.8, 'tri': 3.9, 'ndvi': 0.45, 'bsi': 0.06, 'aspect': 140.0
    },
    'v3': {
        'id': 'v3', 'name': 'Reni Village', 'lat': 30.4850, 'lng': 79.6900,
        'rain': 82.0, 'moisture': 78.0, 'slope': 44.0, 'elevation': 1950.0,
        'riverLevel': 2.8, 'warningMark': 3.4, 'dangerMark': 4.2, 'riverRiseRate': 4.5, 'discharge': 110.0,
        'twi': 6.2, 'tri': 4.5, 'ndvi': 0.38, 'bsi': 0.09, 'aspect': 210.0
    },
    'v4': {
        'id': 'v4', 'name': 'Auli', 'lat': 30.5300, 'lng': 79.5700,
        'rain': 32.0, 'moisture': 54.0, 'slope': 32.0, 'elevation': 2800.0,
        'riverLevel': 1.2, 'warningMark': 3.0, 'dangerMark': 4.0, 'riverRiseRate': 0.5, 'discharge': 32.0,
        'twi': 4.8, 'tri': 3.2, 'ndvi': 0.55, 'bsi': 0.04, 'aspect': 160.0
    },
    'v5': {
        'id': 'v5', 'name': 'Pipalkoti', 'lat': 30.4300, 'lng': 79.4300,
        'rain': 28.0, 'moisture': 48.0, 'slope': 28.0, 'elevation': 1320.0,
        'riverLevel': 1.5, 'warningMark': 3.3, 'dangerMark': 4.3, 'riverRiseRate': 1.2, 'discharge': 45.0,
        'twi': 5.1, 'tri': 2.8, 'ndvi': 0.60, 'bsi': 0.03, 'aspect': 190.0
    },
    'v6': {
        'id': 'v6', 'name': 'Helang', 'lat': 30.5100, 'lng': 79.5100,
        'rain': 18.0, 'moisture': 36.0, 'slope': 24.0, 'elevation': 1550.0,
        'riverLevel': 1.4, 'warningMark': 3.1, 'dangerMark': 4.1, 'riverRiseRate': 0.8, 'discharge': 38.0,
        'twi': 4.5, 'tri': 2.5, 'ndvi': 0.62, 'bsi': 0.02, 'aspect': 175.0
    },
    'v7': {
        'id': 'v7', 'name': 'Lata', 'lat': 30.4950, 'lng': 79.7200,
        'rain': 14.0, 'moisture': 30.0, 'slope': 22.0, 'elevation': 2310.0,
        'riverLevel': 1.1, 'warningMark': 3.2, 'dangerMark': 4.0, 'riverRiseRate': 0.4, 'discharge': 25.0,
        'twi': 4.2, 'tri': 2.2, 'ndvi': 0.68, 'bsi': 0.01, 'aspect': 200.0
    },
    'v8': {
        'id': 'v8', 'name': 'Gopeshwar', 'lat': 30.4100, 'lng': 79.3200,
        'rain': 12.0, 'moisture': 28.0, 'slope': 20.0, 'elevation': 1470.0,
        'riverLevel': 1.3, 'warningMark': 3.5, 'dangerMark': 4.6, 'riverRiseRate': 0.4, 'discharge': 40.0,
        'twi': 4.0, 'tri': 2.0, 'ndvi': 0.70, 'bsi': 0.01, 'aspect': 180.0
    }
}

class LocationStateManager:
    def __init__(self):
        self.locations = {k: v.copy() for k, v in INITIAL_LOCATIONS.items()}

    def get_all_locations_with_risk(self):
        results = []
        for loc_id, loc in self.locations.items():
            ls_risk = predict_landslide_risk(loc)
            ff_risk = predict_flash_flood_risk(loc)

            # Evaluate Alert Engine
            alert_engine_instance.evaluate_location_risk(loc_id, loc['name'], 'landslide', ls_risk)
            alert_engine_instance.evaluate_location_risk(loc_id, loc['name'], 'flash_flood', ff_risk)

            results.append({
                **loc,
                'landslideRisk': ls_risk,
                'flashFloodRisk': ff_risk
            })
        return results

    def get_location_risk(self, location_id):
        loc = self.locations.get(location_id)
        if not loc:
            return None
        ls_risk = predict_landslide_risk(loc)
        ff_risk = predict_flash_flood_risk(loc)

        alert_engine_instance.evaluate_location_risk(location_id, loc['name'], 'landslide', ls_risk)
        alert_engine_instance.evaluate_location_risk(location_id, loc['name'], 'flash_flood', ff_risk)

        return {
            **loc,
            'landslideRisk': ls_risk,
            'flashFloodRisk': ff_risk
        }

    def update_location_telemetry(self, raw_payload):
        is_valid, sanitized, status_code, err_msg = validate_telemetry_payload(raw_payload)
        if not is_valid:
            return False, status_code, err_msg

        loc_id = sanitized["locationId"]
        if loc_id not in self.locations:
            return False, "LOCATION_NOT_FOUND", f"Location {loc_id} is not registered in sensor mesh"

        # Update telemetry parameters
        loc = self.locations[loc_id]
        for key in ["rain", "moisture", "riverLevel", "dataFreshness"]:
            if key in sanitized:
                loc[key] = sanitized[key]

        # Re-assess risk & alert engine
        risk_result = self.get_location_risk(loc_id)
        return True, "SUCCESS", risk_result


location_manager = LocationStateManager()
