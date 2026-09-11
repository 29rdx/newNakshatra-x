import pandas as pd
import numpy as np
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")
os.makedirs(OUTPUT_DIR, exist_ok=True)
sys.path.insert(0, os.path.join(BASE_DIR, "scripts"))
import real_data_client  # noqa: E402

dataset_path = os.path.join(OUTPUT_DIR, "dataset_points.csv")
if not os.path.exists(dataset_path):
    import subprocess
    subprocess.run(["python3", os.path.join(BASE_DIR, "scripts", "01_make_dataset.py")], check=True)

points = pd.read_csv(dataset_path)

KNOWN_FAULTS = [
    (21.83, 80.19),  # Balaghat-Bharweli Fault
    (21.86, 80.26),  # Bharweli North Shear
    (21.44, 79.25),  # Mansar-Ramtek Gondite Thrust
    (20.99, 79.34),  # Dongri Buzurg Syncline
    (22.16, 79.68),  # Tirodi Gneissic Border
    (21.93, 80.52),  # Ukwa Footwall Fault
    (21.30, 79.66),  # Chikla Lineament
    (21.38, 79.32),  # Kandri Fault Structure
    (21.33, 79.03),  # Gumgaon South Fault
    (21.16, 79.18),  # Beldongri Structural Axis
]


def dist_to_fault_km(lat, lng):
    min_d = min(np.sqrt((lat - f[0]) ** 2 + (lng - f[1]) ** 2) for f in KNOWN_FAULTS)
    return round(min_d * 111.0, 3)


def spectral_proxy_from_real_data(proximity, elevation_m, soil_moisture):
    """
    Derives geology/vegetation-response proxies from REAL inputs (structural fault
    proximity + real NASA POWER elevation/soil-moisture). There is no keyless public
    source for actual Sentinel-2 spectral bands, so iron-oxide/ferrous/SWIR remain a
    physically-motivated proxy (higher near known ore-bearing structures, damped by
    real soil moisture) rather than raw satellite reflectance. NDVI is derived from
    real soil wetness, which genuinely correlates with vegetation greenness.
    """
    moisture_dev = soil_moisture - 0.5
    noise = lambda scale: np.random.normal(0, scale)

    iron_oxide = max(0.05, round(0.30 + 0.45 * proximity + 0.05 * moisture_dev + noise(0.02), 4))
    ferrous = max(0.05, round(0.22 + 0.38 * proximity + 0.04 * moisture_dev + noise(0.02), 4))
    swir_b11 = max(0.05, round(0.20 + 0.30 * proximity - 0.05 * soil_moisture + noise(0.015), 4))
    swir_b12 = max(0.05, round(0.24 + 0.32 * proximity - 0.04 * soil_moisture + noise(0.015), 4))
    slope = max(0.3, round(2.0 + 9.0 * proximity + 0.015 * max(0.0, elevation_m - 250.0) + noise(0.6), 1))
    ndvi = min(0.9, max(0.05, round(0.25 + 0.35 * soil_moisture - 0.10 * proximity + noise(0.03), 4)))

    return {
        "iron_oxide_index": iron_oxide,
        "ferrous_mineral_index": ferrous,
        "swir_b11_reflectance": swir_b11,
        "swir_b12_reflectance": swir_b12,
        "ndvi": ndvi,
        "slope_deg": slope,
    }


print(f"Fetching real live terrain + climate data (NASA POWER) for {len(points)} dataset points...")
coords = list(zip(points["lat"].tolist(), points["lng"].tolist()))
real_data = real_data_client.fetch_many(coords, progress_label="training points")

rows = []
for (idx, row), real in zip(points.iterrows(), real_data):
    lat, lng, label = row["lat"], row["lng"], row["label"]

    fault_d = dist_to_fault_km(lat, lng)
    proximity = max(0.0, (15.0 - min(fault_d, 15.0)) / 15.0)

    specs = spectral_proxy_from_real_data(proximity, real["elevation_m"], real["soil_moisture"])

    rows.append({
        "name": row["name"],
        "lat": lat,
        "lng": lng,
        "label": label,
        "iron_oxide_index": specs["iron_oxide_index"],
        "ferrous_mineral_index": specs["ferrous_mineral_index"],
        "swir_b11_reflectance": specs["swir_b11_reflectance"],
        "swir_b12_reflectance": specs["swir_b12_reflectance"],
        "ndvi": specs["ndvi"],
        "elevation_m": real["elevation_m"],
        "slope_deg": specs["slope_deg"],
        "dist_to_fault_km": fault_d,
        "temp_c": real["land_temp_c"],
        "rainfall_mm": real["rainfall_mm_monsoon"],
        "soil_moisture": real["soil_moisture"],
        "data_source_live": real["is_live"],
    })

features_df = pd.DataFrame(rows)
train_table_path = os.path.join(OUTPUT_DIR, "training_table.csv")
features_df.to_csv(train_table_path, index=False)

live_count = int(features_df["data_source_live"].sum())
print(f"[SUCCESS] Extracted features for {len(features_df)} points "
      f"({live_count} from live NASA POWER API, {len(features_df) - live_count} fallback).")
print(f"Saved training table to {train_table_path}")
