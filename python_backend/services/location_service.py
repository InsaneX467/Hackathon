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
    },

    # Assam & North-East India Locations
    'v9': {
        'id': 'v9', 'name': 'Guwahati (Brahmaputra Bank)', 'lat': 26.1445, 'lng': 91.7362,
        'rain': 95.0, 'moisture': 82.0, 'slope': 28.0, 'elevation': 55.0,
        'riverLevel': 48.9, 'warningMark': 49.6, 'dangerMark': 50.5, 'riverRiseRate': 0.8, 'discharge': 4200.0,
        'twi': 7.8, 'tri': 1.8, 'ndvi': 0.48, 'bsi': 0.08, 'aspect': 120.0
    },
    'v10': {
        'id': 'v10', 'name': 'Silchar (Barak Basin)', 'lat': 24.8333, 'lng': 92.7789,
        'rain': 115.0, 'moisture': 89.0, 'slope': 18.0, 'elevation': 35.0,
        'riverLevel': 19.8, 'warningMark': 19.8, 'dangerMark': 20.4, 'riverRiseRate': 1.2, 'discharge': 1850.0,
        'twi': 8.2, 'tri': 1.2, 'ndvi': 0.52, 'bsi': 0.05, 'aspect': 90.0
    },
    'v11': {
        'id': 'v11', 'name': 'Majuli River Island', 'lat': 26.9500, 'lng': 94.1667,
        'rain': 88.0, 'moisture': 84.0, 'slope': 8.0, 'elevation': 84.0,
        'riverLevel': 86.4, 'warningMark': 86.5, 'dangerMark': 87.3, 'riverRiseRate': 1.4, 'discharge': 5600.0,
        'twi': 9.1, 'tri': 0.8, 'ndvi': 0.58, 'bsi': 0.04, 'aspect': 45.0
    },
    'v12': {
        'id': 'v12', 'name': 'Haflong (Dima Hasao)', 'lat': 25.1667, 'lng': 93.0167,
        'rain': 105.0, 'moisture': 86.0, 'slope': 42.0, 'elevation': 510.0,
        'riverLevel': 3.2, 'warningMark': 4.0, 'dangerMark': 5.2, 'riverRiseRate': 2.1, 'discharge': 310.0,
        'twi': 6.8, 'tri': 4.2, 'ndvi': 0.65, 'bsi': 0.06, 'aspect': 210.0
    },
    'v13': {
        'id': 'v13', 'name': 'Cherrapunji (Sohra Ridge)', 'lat': 25.2833, 'lng': 91.7333,
        'rain': 145.0, 'moisture': 92.0, 'slope': 46.0, 'elevation': 1430.0,
        'riverLevel': 4.5, 'warningMark': 5.0, 'dangerMark': 6.5, 'riverRiseRate': 3.8, 'discharge': 840.0,
        'twi': 7.2, 'tri': 5.1, 'ndvi': 0.72, 'bsi': 0.09, 'aspect': 180.0
    },
    'v14': {
        'id': 'v14', 'name': 'Gangtok (Teesta Basin)', 'lat': 27.3389, 'lng': 88.6065,
        'rain': 76.0, 'moisture': 79.0, 'slope': 45.0, 'elevation': 1650.0,
        'riverLevel': 3.8, 'warningMark': 4.5, 'dangerMark': 5.8, 'riverRiseRate': 2.4, 'discharge': 620.0,
        'twi': 6.4, 'tri': 4.9, 'ndvi': 0.56, 'bsi': 0.07, 'aspect': 160.0
    },
    'v15': {
        'id': 'v15', 'name': 'Aizawl (Slope Ward)', 'lat': 23.7271, 'lng': 92.7176,
        'rain': 68.0, 'moisture': 72.0, 'slope': 43.0, 'elevation': 1130.0,
        'riverLevel': 2.2, 'warningMark': 3.8, 'dangerMark': 4.8, 'riverRiseRate': 1.1, 'discharge': 190.0,
        'twi': 5.9, 'tri': 4.3, 'ndvi': 0.61, 'bsi': 0.05, 'aspect': 200.0
    },
    'v16': {
        'id': 'v16', 'name': 'Itanagar (Dikrong Valley)', 'lat': 27.0844, 'lng': 93.6053,
        'rain': 85.0, 'moisture': 77.0, 'slope': 39.0, 'elevation': 320.0,
        'riverLevel': 3.1, 'warningMark': 4.2, 'dangerMark': 5.5, 'riverRiseRate': 1.8, 'discharge': 480.0,
        'twi': 6.3, 'tri': 3.8, 'ndvi': 0.69, 'bsi': 0.04, 'aspect': 150.0
    },
    'v17': {
        'id': 'v17', 'name': 'Kohima (Ridge Ward)', 'lat': 25.6701, 'lng': 94.1077,
        'rain': 62.0, 'moisture': 68.0, 'slope': 40.0, 'elevation': 1440.0,
        'riverLevel': 1.8, 'warningMark': 3.2, 'dangerMark': 4.2, 'riverRiseRate': 0.9, 'discharge': 140.0,
        'twi': 5.6, 'tri': 3.9, 'ndvi': 0.63, 'bsi': 0.04, 'aspect': 190.0
    },
    'v18': {
        'id': 'v18', 'name': 'Agartala (Haora Basin)', 'lat': 23.8315, 'lng': 91.2868,
        'rain': 72.0, 'moisture': 75.0, 'slope': 14.0, 'elevation': 28.0,
        'riverLevel': 10.2, 'warningMark': 10.8, 'dangerMark': 11.5, 'riverRiseRate': 1.0, 'discharge': 520.0,
        'twi': 7.5, 'tri': 1.5, 'ndvi': 0.54, 'bsi': 0.06, 'aspect': 130.0
    },
    'v19': {
        'id': 'v19', 'name': 'Imphal (Imphal Valley)', 'lat': 24.8170, 'lng': 93.9368,
        'rain': 90.0, 'moisture': 81.0, 'slope': 22.0, 'elevation': 786.0,
        'riverLevel': 785.2, 'warningMark': 786.0, 'dangerMark': 787.2, 'riverRiseRate': 1.5, 'discharge': 740.0,
        'twi': 7.1, 'tri': 2.4, 'ndvi': 0.57, 'bsi': 0.05, 'aspect': 170.0
    },
    'v20': {
        'id': 'v20', 'name': 'Kaziranga (Floodplain Ward)', 'lat': 26.5775, 'lng': 93.1711,
        'rain': 110.0, 'moisture': 88.0, 'slope': 10.0, 'elevation': 65.0,
        'riverLevel': 74.8, 'warningMark': 75.0, 'dangerMark': 75.8, 'riverRiseRate': 2.2, 'discharge': 4900.0,
        'twi': 8.8, 'tri': 1.0, 'ndvi': 0.74, 'bsi': 0.03, 'aspect': 80.0
    }
}

from services.weather_service import fetch_live_weather

class LocationStateManager:
    def __init__(self):
        self.locations = {k: v.copy() for k, v in INITIAL_LOCATIONS.items()}

    def get_all_locations_with_risk(self):
        results = []
        live_w = None
        try:
            live_w = fetch_live_weather()
        except Exception:
            pass

        for loc_id, loc in self.locations.items():
            if live_w:
                if 'precipitation' in live_w and live_w['precipitation'] is not None:
                    loc['liveRainfall'] = float(live_w['precipitation'])
                if 'temperature' in live_w:
                    loc['liveTemperature'] = float(live_w['temperature'])
                if 'humidity' in live_w:
                    loc['liveHumidity'] = float(live_w['humidity'])
                loc['dataFreshness'] = live_w.get('dataFreshness', 'LIVE')
                loc['weatherSource'] = live_w.get('source', 'Open-Meteo Live API')

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
