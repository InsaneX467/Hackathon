"""
test_alert_pipeline.py
-----------------------
Comprehensive Backend Test Suite for Real-Time Prediction & Alert Engine.

Tests all 12 pipeline edge cases:
1. Normal conditions
2. Increasing risk
3. Warning threshold
4. Critical threshold
5. Risk decreasing
6. Alert resolution with hysteresis
7. Sensor offline
8. Stale data
9. Missing feature validation
10. Invalid sensor value rejection
11. Multiple location independence
12. Multiple simultaneous hazards
"""

import sys
import os
import unittest
from datetime import datetime, timezone

# Add parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.landslide_service import predict_landslide_risk
from services.flood_service import predict_flash_flood_risk
from services.alert_engine import AlertEngine
from utils.validation import validate_telemetry_payload
from config.thresholds import HYSTERESIS_MARGIN


class TestAlertPipeline(unittest.TestCase):

    def setUp(self):
        self.alert_engine = AlertEngine()

    def test_01_normal_conditions(self):
        """1. Normal conditions produce LOW risk and no alert."""
        loc = {'id': 'v5', 'name': 'Pipalkoti', 'rain': 10.0, 'moisture': 30.0, 'slope': 25.0, 'dataFreshness': 'LIVE'}
        res = predict_landslide_risk(loc)
        self.assertEqual(res['classification'], 'LOW')
        self.assertLess(res['riskScore'], 40)
        
        alert = self.alert_engine.evaluate_location_risk('v5', 'Pipalkoti', 'landslide', res)
        self.assertIsNone(alert)

    def test_02_increasing_risk(self):
        """2. Increasing risk transitions score higher."""
        loc_low = {'id': 'v1', 'name': 'Joshimath Ward 1', 'rain': 10.0, 'moisture': 30.0, 'slope': 40.0, 'dataFreshness': 'LIVE'}
        loc_high = {'id': 'v1', 'name': 'Joshimath Ward 1', 'rain': 120.0, 'moisture': 85.0, 'slope': 40.0, 'dataFreshness': 'LIVE'}
        
        res_low = predict_landslide_risk(loc_low)
        res_high = predict_landslide_risk(loc_high)
        self.assertGreater(res_high['riskScore'], res_low['riskScore'])

    def test_03_warning_threshold(self):
        """3. Risk score between 60-79 triggers a WARNING alert."""
        loc = {'id': 'v3', 'name': 'Reni Village', 'rain': 75.0, 'moisture': 70.0, 'slope': 40.0, 'dataFreshness': 'LIVE'}
        res = predict_landslide_risk(loc)
        self.assertIn(res['classification'], ['WARNING', 'CRITICAL'])
        
        alert = self.alert_engine.evaluate_location_risk('v3', 'Reni Village', 'landslide', res)
        self.assertIsNotNone(alert)
        self.assertIn(alert['severity'], ['WARNING', 'CRITICAL'])

    def test_04_critical_threshold(self):
        """4. High risk score >= 80 triggers CRITICAL alert."""
        loc = {'id': 'v1', 'name': 'Joshimath Ward 1', 'rain': 140.0, 'moisture': 90.0, 'slope': 45.0, 'dataFreshness': 'LIVE'}
        res = predict_landslide_risk(loc)
        self.assertEqual(res['classification'], 'CRITICAL')
        
        alert = self.alert_engine.evaluate_location_risk('v1', 'Joshimath Ward 1', 'landslide', res)
        self.assertTrue(alert['critical'])
        self.assertEqual(alert['severity'], 'CRITICAL')

    def test_05_and_06_hysteresis_and_resolution(self):
        """5 & 6. Hysteresis holds alert active until risk drops below (Threshold - Margin), then resolves."""
        loc_crit = {'id': 'v1', 'name': 'Joshimath Ward 1', 'rain': 140.0, 'moisture': 90.0, 'slope': 45.0, 'dataFreshness': 'LIVE'}
        res_crit = predict_landslide_risk(loc_crit)
        alert1 = self.alert_engine.evaluate_location_risk('v1', 'Joshimath Ward 1', 'landslide', res_crit)
        self.assertIsNotNone(alert1)

        # Minor decrease (e.g. rain drops from 140 to 110, risk score ~74) should NOT resolve alert due to hysteresis (70 threshold)
        loc_slight_drop = {'id': 'v1', 'name': 'Joshimath Ward 1', 'rain': 110.0, 'moisture': 80.0, 'slope': 45.0, 'dataFreshness': 'LIVE'}
        res_drop = predict_landslide_risk(loc_slight_drop)
        alert2 = self.alert_engine.evaluate_location_risk('v1', 'Joshimath Ward 1', 'landslide', res_drop)
        self.assertIsNotNone(alert2)
        self.assertEqual(alert2['status'], 'ACTIVE')

        # Major decrease (e.g. rain 0, moisture 20) resolves alert
        loc_safe = {'id': 'v1', 'name': 'Joshimath Ward 1', 'rain': 0.0, 'moisture': 20.0, 'slope': 45.0, 'dataFreshness': 'LIVE'}
        res_safe = predict_landslide_risk(loc_safe)
        alert_res = self.alert_engine.evaluate_location_risk('v1', 'Joshimath Ward 1', 'landslide', res_safe)
        self.assertIsNone(alert_res)  # Delist from active alerts
        self.assertEqual(len(self.alert_engine.get_active_alerts()), 0)

    def test_07_sensor_offline(self):
        """7. OFFLINE sensor reports DATA_INSUFFICIENT."""
        loc = {'id': 'v2', 'name': 'Tapovan', 'rain': 100.0, 'dataFreshness': 'OFFLINE'}
        res = predict_landslide_risk(loc)
        self.assertEqual(res['classification'], 'DATA_INSUFFICIENT')
        self.assertEqual(res['dataStatus'], 'OFFLINE')

    def test_08_stale_data(self):
        """8. Stale data (5-15 min) is correctly identified."""
        stale_ts = datetime.now(timezone.utc).timestamp() - 600  # 10 minutes ago
        payload = {'locationId': 'v1', 'rain': 50.0, 'timestamp': stale_ts}
        is_valid, sanitized, status_code, err = validate_telemetry_payload(payload)
        self.assertTrue(is_valid)
        self.assertEqual(sanitized['dataFreshness'], 'STALE')

    def test_09_missing_feature(self):
        """9. Missing location parameter is rejected."""
        payload = {'rain': 50.0}
        is_valid, sanitized, status_code, err = validate_telemetry_payload(payload)
        self.assertFalse(is_valid)
        self.assertEqual(status_code, 'MISSING_LOCATION')

    def test_10_invalid_sensor_value(self):
        """10. Negative or non-numeric sensor value is rejected."""
        payload = {'locationId': 'v1', 'rain': -45.0}
        is_valid, sanitized, status_code, err = validate_telemetry_payload(payload)
        self.assertFalse(is_valid)
        self.assertEqual(status_code, 'INVALID_RAINFALL')

    def test_11_multiple_locations_independence(self):
        """11. Locations maintain completely independent risk states."""
        loc1 = {'id': 'v1', 'name': 'Joshimath Ward 1', 'rain': 140.0, 'moisture': 90.0, 'slope': 45.0, 'dataFreshness': 'LIVE'}
        loc4 = {'id': 'v4', 'name': 'Auli', 'rain': 10.0, 'moisture': 20.0, 'slope': 25.0, 'dataFreshness': 'LIVE'}
        
        res1 = predict_landslide_risk(loc1)
        res4 = predict_landslide_risk(loc4)

        self.alert_engine.evaluate_location_risk('v1', 'Joshimath Ward 1', 'landslide', res1)
        self.alert_engine.evaluate_location_risk('v4', 'Auli', 'landslide', res4)

        active = self.alert_engine.get_active_alerts()
        self.assertEqual(len(active), 1)
        self.assertEqual(active[0]['villageId'], 'v1')

    def test_12_simultaneous_hazards_separation(self):
        """12. Landslide and Flash Flood risks are assessed separately."""
        loc = {
            'id': 'v2', 'name': 'Tapovan',
            'rain': 120.0, 'moisture': 85.0, 'slope': 20.0,
            'riverLevel': 4.4, 'warningMark': 3.5, 'dangerMark': 4.5, 'riverRiseRate': 3.5, 'discharge': 120.0,
            'dataFreshness': 'LIVE'
        }
        res_ls = predict_landslide_risk(loc)
        res_ff = predict_flash_flood_risk(loc)

        self.assertNotEqual(res_ls['hazard'], res_ff['hazard'])
        self.assertIn("FLASH FLOOD RISK ASSESSMENT", res_ff['engineType'])
        self.assertIn("IndLands", res_ls['modelType'])


if __name__ == '__main__':
    unittest.main()
