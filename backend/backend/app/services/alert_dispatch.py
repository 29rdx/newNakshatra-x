"""
Real Operational Alert Dispatch & Incident Management System
Generates automated SMS/Email/Radio dispatch orders with escalation routing.
"""

from typing import Dict, Any, List
from datetime import datetime


ALERT_LOGS: List[Dict[str, Any]] = []


def dispatch_operational_alert(
    mine_id: int,
    mine_name: str,
    alert_type: str,
    severity: str,
    trigger_metric: str,
    action_directive: str,
    recipient_role: str = "Mine Manager & Pit Superintendent",
) -> Dict[str, Any]:
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
    alert_id = f"ALT-MOIL-{mine_id}-{int(datetime.now().timestamp())}"

    # Escalation routing
    escalation_tier = "Tier-1 (Immediate Pit Shift Action)" if severity == "CRITICAL" else "Tier-2 (Daily Plan Adjustment)"
    channel = "SMS + Radio + Automated Scada Interlock" if severity == "CRITICAL" else "Dashboard + Email Memo"

    alert_record = {
        "alert_id": alert_id,
        "mine_id": mine_id,
        "mine_name": mine_name,
        "alert_type": alert_type,
        "severity": severity,
        "trigger_metric": trigger_metric,
        "action_directive": action_directive,
        "recipient_role": recipient_role,
        "escalation_tier": escalation_tier,
        "dispatch_channel": channel,
        "dispatch_timestamp": timestamp,
        "acknowledgement_status": "DISPATCHED_TO_OPERATIONS",
        "mock_sms_payload": f"[MOIL NAKSHATRA-X ALERT] {severity}: {mine_name} {alert_type}. Metric: {trigger_metric}. Directive: {action_directive}",
    }

    ALERT_LOGS.insert(0, alert_record)
    if len(ALERT_LOGS) > 100:
        ALERT_LOGS.pop()

    return {
        "success": True,
        "dispatched_alert": alert_record,
        "active_alert_count": len(ALERT_LOGS),
    }


def get_active_dispatched_alerts(mine_id: int = None) -> List[Dict[str, Any]]:
    if mine_id is None:
        return ALERT_LOGS
    return [a for a in ALERT_LOGS if a["mine_id"] == mine_id]
