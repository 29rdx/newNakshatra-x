-- ==============================================================================
-- NAKSHATRA-X : ISRO RADAR SYNCED EARLY FLOOD ALERT & AUTOMATED SCADA PUMP DB SCHEMA
-- ==============================================================================

-- 1. Create Enums for Flood Risk Levels and SCADA Dewatering Statuses
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'flood_risk_level') THEN
    CREATE TYPE flood_risk_level AS ENUM ('NOMINAL', 'MODERATE', 'CRITICAL');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'scada_pump_status') THEN
    CREATE TYPE scada_pump_status AS ENUM ('STANDBY', 'ENGAGED', 'OFFLINE', 'MAINTENANCE');
  END IF;
END $$;

-- 2. Real-Time Flood Telemetry & Satellite Sensor Ingestion Table
CREATE TABLE IF NOT EXISTS public.flood_alert_telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Geographical Location Metadata
  location_name TEXT NOT NULL,
  state_code VARCHAR(10) NOT NULL DEFAULT 'MH',
  latitude NUMERIC(9,6) NOT NULL,
  longitude NUMERIC(9,6) NOT NULL,
  
  -- Open-Meteo & Satellite Telemetry Data
  rainfall_14d_mm NUMERIC(8,2) NOT NULL DEFAULT 0.0,
  soil_moisture_pct NUMERIC(5,2) NOT NULL DEFAULT 0.0, -- Topsoil 0-1cm Volumetric %
  land_surface_temp_c NUMERIC(5,2),
  humidity_pct NUMERIC(5,2),
  live_precipitation_rate_mm_hr NUMERIC(6,2) DEFAULT 0.0,
  
  -- ISRO Radar & SCADA Risk Evaluation
  flood_risk_level flood_risk_level NOT NULL DEFAULT 'NOMINAL',
  radar_lead_time_minutes INTEGER NOT NULL DEFAULT 30,
  scada_pump_status scada_pump_status NOT NULL DEFAULT 'STANDBY',
  
  -- Audit & Source Traceability
  telemetry_source TEXT DEFAULT 'LIVE Open-Meteo & ISRO MOSDAC Radar Stream',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for high-performance spatial & location telemetry lookup
CREATE INDEX IF NOT EXISTS idx_flood_telemetry_lat_lng ON public.flood_alert_telemetry(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_flood_telemetry_risk ON public.flood_alert_telemetry(flood_risk_level);

-- 3. Automated Sub-Surface Dewatering Pump Inventory & SCADA Control Table
CREATE TABLE IF NOT EXISTS public.scada_dewatering_pumps (
  pump_id VARCHAR(64) PRIMARY KEY,
  mine_code VARCHAR(32) NOT NULL,
  mine_name TEXT NOT NULL,
  shaft_level_m TEXT DEFAULT '-340m RL Sump',
  
  -- Pump Operational Metrics
  discharge_capacity_m3h NUMERIC(8,2) DEFAULT 1270.0, -- Discharge volume m³/hr
  current_power_duty_pct NUMERIC(5,2) DEFAULT 0.0,
  status scada_pump_status NOT NULL DEFAULT 'STANDBY',
  
  -- Trigger Metadata
  auto_trigger_enabled BOOLEAN DEFAULT true,
  last_cloudburst_trigger_at TIMESTAMP WITH TIME ZONE,
  last_maintenance_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. 30-Minute Cloudburst Lead Time Predictive Vector Table
CREATE TABLE IF NOT EXISTS public.cloudburst_predictive_vectors (
  vector_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telemetry_id UUID REFERENCES public.flood_alert_telemetry(id) ON DELETE CASCADE,
  location_name TEXT NOT NULL,
  
  -- Predictive Lead-Time Timeline (T-30m, T-15m, T0, T+30m, T+60m, T+90m)
  lead_time_label VARCHAR(32) NOT NULL,
  time_step_index INTEGER NOT NULL,
  predicted_rain_intensity_mm_hr NUMERIC(6,2) NOT NULL,
  recommended_scada_duty_pct NUMERIC(5,2) NOT NULL,
  isro_radar_confidence_pct NUMERIC(5,2) DEFAULT 94.2,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Seed Telemetry Data for Key MOIL Mines & Central India Sectors
INSERT INTO public.flood_alert_telemetry 
  (location_name, state_code, latitude, longitude, rainfall_14d_mm, soil_moisture_pct, land_surface_temp_c, humidity_pct, flood_risk_level, scada_pump_status)
VALUES
  ('Dongri Buzurg Mining Sector (MH)', 'MH', 20.990000, 79.340000, 124.50, 44.00, 31.5, 78.0, 'CRITICAL', 'ENGAGED'),
  ('Balaghat Deep Mine Sector (MP)', 'MP', 21.830000, 80.190000, 118.00, 42.50, 32.0, 75.0, 'CRITICAL', 'ENGAGED'),
  ('Chikla Mining Pit (MH)', 'MH', 21.300000, 79.660000, 88.00, 34.00, 33.2, 70.0, 'MODERATE', 'STANDBY'),
  ('Tirodi Sub-surface Sector (MP)', 'MP', 22.160000, 79.680000, 96.50, 38.00, 30.8, 76.0, 'MODERATE', 'STANDBY'),
  ('Nagpur Central Mining Sector (MH)', 'MH', 21.140000, 79.080000, 42.00, 22.50, 34.5, 62.0, 'NOMINAL', 'STANDBY')
ON CONFLICT DO NOTHING;

-- Seed Dewatering Pump Inventory
INSERT INTO public.scada_dewatering_pumps
  (pump_id, mine_code, mine_name, shaft_level_m, discharge_capacity_m3h, current_power_duty_pct, status)
VALUES
  ('PUMP-DON-01', 'MOIL-DON-05', 'Dongri Buzurg', 'Open Cast Pit Sump 1', 1270.00, 100.0, 'ENGAGED'),
  ('PUMP-BAL-01', 'MOIL-BAL-01', 'Balaghat Mine', '-340m Shaft Level Sump 3B', 1500.00, 85.0, 'ENGAGED'),
  ('PUMP-CHK-01', 'MOIL-CHK-06', 'Chikla Mine', 'Perimeter Haul Road Sump 2', 950.00, 20.0, 'STANDBY'),
  ('PUMP-TIR-01', 'MOIL-TIR-04', 'Tirodi Mine', 'Pit Floor Sump 1A', 1100.00, 25.0, 'STANDBY')
ON CONFLICT (pump_id) DO NOTHING;
