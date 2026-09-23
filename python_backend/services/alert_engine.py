"""
alert_engine.py
---------------
Centralized Alert State Machine with Hysteresis & History Tracking.

Processes location risk assessments, manages active emergency alerts, 
enforces alert escalation and resolution with hysteresis to prevent flickering, 
and preserves full event logs in alert history.
"""

from datetime import datetime, timezone
import uuid
from config.thresholds import RISK_THRESHOLDS, HYSTERESIS_MARGIN

class AlertEngine:
    def __init__(self):
        self.active_alerts = {}   # Key: f"{location_id}_{hazard}" -> Alert Dict
        self.alert_history = []  # List of all alerts (active & resolved)

    def evaluate_location_risk(self, location_id, location_name, hazard_type, risk_assessment):
        """
        Evaluates risk assessment for a location and hazard.
        Updates active alerts and returns the updated alert state.
        """
        risk_score = risk_assessment.get("riskScore")
        classification = risk_assessment.get("classification")
        indicators = risk_assessment.get("indicators", [])
        data_status = risk_assessment.get("dataStatus", "LIVE")

        alert_key = f"{location_id}_{hazard_type}"
        existing_alert = self.active_alerts.get(alert_key)
        now_iso = datetime.now(timezone.utc).isoformat()

        # Handle OFFLINE or DATA INSUFFICIENT telemetry
        if data_status == "OFFLINE" or risk_score is None:
            if existing_alert and existing_alert["status"] == "ACTIVE":
                existing_alert["dataStatus"] = "OFFLINE"
                existing_alert["indicators"] = ["Telemetry connection lost / offline"]
                existing_alert["updatedAt"] = now_iso
            return existing_alert

        target_severity = classification # 'LOW', 'WATCH', 'WARNING', 'CRITICAL'

        # -----------------------------------------------------------------
        # 1. HYSTERESIS & RESOLUTION CHECK
        # -----------------------------------------------------------------
        if existing_alert and existing_alert["status"] == "ACTIVE":
            curr_sev = existing_alert["severity"]

            # Calculate Hysteresis Resolution Threshold
            trigger_min = RISK_THRESHOLDS.get(curr_sev, {}).get("min", 60)
            resolution_threshold = max(trigger_min - HYSTERESIS_MARGIN, 0)

            # Check if risk dropped below resolution threshold
            if risk_score < resolution_threshold:
                # RESOLVE ALERT
                existing_alert["status"] = "RESOLVED"
                existing_alert["resolvedAt"] = now_iso
                existing_alert["finalRiskScore"] = risk_score
                existing_alert["resolutionReason"] = f"Risk score ({risk_score}) dropped below resolution threshold ({resolution_threshold})"
                
                # Move from active map to archive
                self.alert_history.append(existing_alert)
                del self.active_alerts[alert_key]
                print(f"[AlertEngine] RESOLVED alert {existing_alert['id']} for {location_name} ({hazard_type})")
                return None

        # -----------------------------------------------------------------
        # 2. NEW ALERT CREATION (CRITICAL or WARNING)
        # -----------------------------------------------------------------
        if target_severity in ["CRITICAL", "WARNING"]:
            hazard_label = "Landslide Susceptibility" if hazard_type == "landslide" else "Flash Flood Surge"
            
            if not existing_alert:
                # Create NEW Alert
                new_alert = {
                    "id": f"ALT-{uuid.uuid4().hex[:6].upper()}",
                    "locationId": location_id,
                    "villageId": location_id,
                    "villageName": location_name,
                    "location": location_name,
                    "hazard": hazard_label,
                    "hazardType": hazard_type,
                    "severity": target_severity,
                    "critical": target_severity == "CRITICAL",
                    "status": "ACTIVE",
                    "riskScore": risk_score,
                    "triggerData": " • ".join(indicators),
                    "actionText": f"Initiate {location_name} Safety Protocol. Monitor telemetry.",
                    "indicators": indicators,
                    "dataStatus": data_status,
                    "createdAt": now_iso,
                    "updatedAt": now_iso,
                    "resolvedAt": None
                }
                self.active_alerts[alert_key] = new_alert
                self.alert_history.append(new_alert)
                print(f"[AlertEngine] CREATED {target_severity} alert for {location_name}: Risk {risk_score}")
                return new_alert

            else:
                # ---------------------------------------------------------
                # 3. ESCALATION / UPDATE EXISTING ALERT
                # ---------------------------------------------------------
                old_sev = existing_alert["severity"]
                existing_alert["riskScore"] = risk_score
                existing_alert["updatedAt"] = now_iso
                existing_alert["indicators"] = indicators
                existing_alert["triggerData"] = " • ".join(indicators)
                existing_alert["dataStatus"] = data_status

                # Check Escalation (e.g. WARNING -> CRITICAL)
                if target_severity == "CRITICAL" and old_sev != "CRITICAL":
                    existing_alert["severity"] = "CRITICAL"
                    existing_alert["critical"] = True
                    print(f"[AlertEngine] ESCALATED alert for {location_name} to CRITICAL")
                
                return existing_alert

        return existing_alert

    def get_active_alerts(self):
        return list(self.active_alerts.values())

    def get_alert_history(self):
        return self.alert_history


# Singleton Instance
alert_engine_instance = AlertEngine()
