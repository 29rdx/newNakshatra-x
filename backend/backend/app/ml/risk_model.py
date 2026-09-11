def calculate_shortfall_risk(
    rainfall_14d_mm: float,
    equipment_downtime_hours: float,
    blasting_delay_days: float,
    planned_tonnes: float,
    available_tonnes: float,
) -> dict:
    weather_component = min(rainfall_14d_mm / 250, 1.0) * 30
    equipment_component = min(equipment_downtime_hours / 72, 1.0) * 35
    blasting_component = min(blasting_delay_days / 7, 1.0) * 20
    supply_gap_ratio = max(planned_tonnes - available_tonnes, 0) / max(planned_tonnes, 1)
    supply_component = min(supply_gap_ratio, 1.0) * 15

    score = round(
        weather_component + equipment_component + blasting_component + supply_component,
        1,
    )

    if score >= 70:
        severity = "critical"
    elif score >= 45:
        severity = "high"
    elif score >= 25:
        severity = "medium"
    else:
        severity = "low"

    # Predicted shortfall quantities across horizons
    shortfall_gap = max(0.0, planned_tonnes - available_tonnes)
    forecast_7d = round(shortfall_gap * 0.35 + (weather_component * 18), 0)
    forecast_14d = round(shortfall_gap * 0.65 + (equipment_component * 32), 0)
    forecast_30d = round(shortfall_gap * 1.10 + ((weather_component + equipment_component) * 45), 0)

    return {
        "risk_score": score,
        "severity": severity,
        "components": {
            "weather_impact": round(weather_component, 1),
            "equipment_impact": round(equipment_component, 1),
            "blasting_impact": round(blasting_component, 1),
            "supply_gap_impact": round(supply_component, 1),
        },
        "forecast_shortfall_tonnes": {
            "7_day": forecast_7d,
            "14_day": forecast_14d,
            "30_day": forecast_30d,
        }
    }
