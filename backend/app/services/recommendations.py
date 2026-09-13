def generate_action_recommendations(
    mine_name: str,
    rainfall_14d_mm: float,
    downtime_hours: float,
    blasting_delay_days: float,
    planned_tonnes: float,
    available_tonnes: float,
) -> list[dict]:
    actions = []

    if rainfall_14d_mm > 50:
        actions.append({
            "id": "act-rain",
            "type": "HAUL_ROUTE",
            "title": "Drainage Inspection & Haul Route Shift",
            "reason": f"Heavy 14-day rainfall accumulation ({rainfall_14d_mm} mm) poses slope softening and pit waterlogging risks.",
            "impact_est": "+1,400 tonnes protected / shift",
            "recovery_tonnes": 1400,
            "priority": "HIGH" if rainfall_14d_mm > 100 else "MEDIUM",
            "target": f"{mine_name} Pit B & Ramp West",
        })

    if downtime_hours > 12:
        actions.append({
            "id": "act-down",
            "type": "EQUIPMENT",
            "title": "Deploy Standby Hydraulic Excavator (HEX-4)",
            "reason": f"Equipment downtime exceeded {downtime_hours} hrs; throughput currently constrained by 18%.",
            "impact_est": "+2,200 tonnes / 48 hrs",
            "recovery_tonnes": 2200,
            "priority": "HIGH",
            "target": f"{mine_name} Loading Face 2",
        })

    if blasting_delay_days > 0.5:
        actions.append({
            "id": "act-blast",
            "type": "BLASTING",
            "title": "Advance Blast Block Sequencing & Verification",
            "reason": f"Blasting delay is at {blasting_delay_days} days. Pre-strip mucking will stall within 36 hours.",
            "impact_est": "+1,800 tonnes mucked / day",
            "recovery_tonnes": 1800,
            "priority": "HIGH" if blasting_delay_days > 1.5 else "MEDIUM",
            "target": f"{mine_name} Block 7 East",
        })

    if available_tonnes < planned_tonnes:
        gap = round(planned_tonnes - available_tonnes)
        actions.append({
            "id": "act-stock",
            "type": "STOCKPILE",
            "title": "Rebalance Dispatch from Confirmed Stockpile",
            "reason": f"Production gap of {gap:,} tonnes against monthly target. Blend from high-grade stockpile #3.",
            "impact_est": f"+{min(gap, 3000):,} tonnes blended",
            "recovery_tonnes": min(gap, 3000),
            "priority": "MEDIUM",
            "target": f"{mine_name} Rail Siding Dispatch",
        })

    if not actions:
        actions.append({
            "id": "act-nominal",
            "type": "MONITORING",
            "title": "Nominal Extraction Cadence",
            "reason": "All environmental and operational telemetry within standard tolerances.",
            "impact_est": "Baseline output maintained",
            "recovery_tonnes": 0,
            "priority": "LOW",
            "target": f"{mine_name} All Faces",
        })

    return actions
