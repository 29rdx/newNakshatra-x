export type KnowledgeChunk = {
  id: string
  category:
    | 'project'
    | 'mission'
    | 'ai'
    | 'moil'
    | 'satellite'
    | 'features'
    | 'team'
    | 'faq'
    | 'geology'
    | 'profit'
    | 'tech'
    | 'security'
    | 'operations'
    | 'safety'
  keywords: string[]
  question: string
  answer: string
  actionButton?: {
    label: string
    type: 'blending' | 'dewatering' | 'borehole' | 'risk' | 'guidance'
    data?: any
  }
}

export const knowledgeBase: KnowledgeChunk[] = [
  {
    id: 'k1',
    category: 'project',
    keywords: ['what', 'is', 'nakshatra', 'project', 'about', 'overview', 'discovery', 'hidden', 'summary'],
    question: 'How does NAKSHATRA-X discover hidden manganese reserves?',
    answer:
      "NAKSHATRA-X combines Sentinel-2 SWIR satellite absorption bands (11/12 & 4/2) with 10,829 GSI deep borehole core logs using 3D Ordinary Kriging interpolation. Satellites identify surface alteration anomalies; physics and geostatistical math calculate depth and grade—slashing blind exploratory drilling costs by up to 60% (saving ₹2.25 Crores per mineral block)!",
    actionButton: {
      label: 'View 3D Lithology Seam Block Map',
      type: 'borehole',
    },
  },
  {
    id: 'k2',
    category: 'mission',
    keywords: ['mission', 'goal', 'objective', 'motive', 'why', 'future', 'india', 'self-reliant', 'atmanirbhar', '300mt'],
    question: 'What is our core national vision and mission?',
    answer:
      "Our mission is to achieve 100% manganese self-reliance for India and power the National Steel Policy target of 300 Million Tonnes of Steel by 2030. By eliminating ₹4,000 Crores of foreign manganese imports and protecting domestic mines from monsoon disruptions, NAKSHATRA-X turns raw space intelligence into over ₹1,200 Crores of annual national profit.",
  },
  {
    id: 'k3',
    category: 'features',
    keywords: ['monsoon', 'flooding', 'shortfall', 'prevent', 'weather', 'dewatering', 'haul road', 'rain', 'pumps', 'scada'],
    question: 'How do we prevent monsoon pit flooding and operational shortfall?',
    answer:
      "We connect directly to ISRO MOSDAC radar precipitation telemetry. When rainfall exceeds 20mm/hr within 15 km, our backend sends automated MQTT/Modbus triggers to SCADA dewatering pumps 30 minutes before water reaches haulage ramps. This prevents 45 days of monsoon downtime—saving ₹380 Crores across Indian PSUs.",
    actionButton: {
      label: 'Broadcast Emergency Dewatering Dispatch',
      type: 'dewatering',
    },
  },
  {
    id: 'k4',
    category: 'features',
    keywords: ['blend', 'blending', 'stockpile', 'scipy', 'grade', 'target', 'spec', 'simplex', 'linear', 'optimization'],
    question: 'How does the SciPy Ore Blending Optimization work?',
    answer:
      "Our SciPy Simplex Linear Programming (LP) solver calculates the mathematically optimal multi-stockpile blend ratio (e.g., 60% Grade-A + 40% Low-grade dump) in under 200 milliseconds. This guarantees export contracts always hit ≥42.0% Mn purity, eliminating 100% of grade penalty deductions and saving ₹2.8 Crores per million tonnes.",
    actionButton: {
      label: 'Apply Blending Ratios to Stockpile Dispatch',
      type: 'blending',
    },
  },
  {
    id: 'k5',
    category: 'satellite',
    keywords: ['satellite', 'accuracy', 'spectral', 'sentinel', 'swir', 'isro', 'bhuvan', 'radar', 'bands', 'cloud'],
    question: 'What satellite inputs are used and how do you handle monsoon cloud cover?',
    answer:
      "We use Sentinel-2 SWIR bands (1.61µm & 2.20µm) and Landsat-8/9 for mineral alteration mapping during dry seasons. During heavy monsoon cloud cover, the system switches automatically to Synthetic Aperture Radar (SAR / Sentinel-1 & ISRO-NASA NISAR), which penetrates 100% of cloud and rain to track pit wall stability and haul road flooding 24/7.",
  },
  {
    id: 'k6',
    category: 'ai',
    keywords: ['ai', 'models', 'random', 'forest', 'xgboost', 'accuracy', 'shap', 'explainability', 'kriging', 'prophet', 'algorithms'],
    question: 'Which AI and ML models power NAKSHATRA-X?',
    answer:
      "Our 4-Engine AI Stack includes:\n1. 3D Ordinary Kriging: Spatial grade interpolation from 10.8k core drill logs with uncertainty variance bounds.\n2. Random Forest (200 trees): Surface spectral alteration classification with 98.7% accuracy (0.995 ROC-AUC).\n3. SciPy Simplex Solver: Real-time cost-optimal stockpile blending.\n4. XGBoost + Prophet + TreeSHAP: 50-year historical MOIL trend analysis and explainable 2040 production forecasts.",
  },
  {
    id: 'k7',
    category: 'geology',
    keywords: ['borehole', 'kriging', '3d', 'balaghat', 'bharweli', 'unfc', '111', 'assay', 'dongri', 'tirodi'],
    question: 'How does 3D borehole Kriging model Balaghat & Central India mineral seams?',
    answer:
      "We ingested 10,829 historical core drill logs across the Sausar Ore Belt (Balaghat, Bharweli, Dongri Buzurg, Tirodi). 3D Kriging calculates directional semivariograms to generate voxel block models of UNFC 111 proved reserves, providing geologists with exact 3D lithology cross-sections and confidence scores before bench blasting.",
    actionButton: {
      label: 'View 3D Lithology Seam Block Map',
      type: 'borehole',
    },
  },
  {
    id: 'k8',
    category: 'profit',
    keywords: ['profit', 'roi', 'money', 'crore', 'savings', 'payback', 'cost', 'economics', 'financial'],
    question: 'What is the exact financial ROI and profit generated by NAKSHATRA-X?',
    answer:
      "NAKSHATRA-X delivers a payback period of under 60 days by plugging 3 major multi-crore drains:\n• ₹650 Cr saved by substituting low-grade ore with AI-optimized 42%+ blend (cutting imports)\n• ₹380 Cr protected by preventing 45-day monsoon pit flooding\n• ₹170 Cr saved in exploratory drilling CAPEX and dumper fuel optimization\nTotal annual national impact: Over ₹1,200 Crores in pure value.",
  },
  {
    id: 'k9',
    category: 'operations',
    keywords: ['twin', 'mine twin', 'simulator', 'flight simulator', 'dispatch', 'truck', 'dumper', 'fuel', 'shovel'],
    question: 'How does the 3D Mine Twin Simulator optimize daily shift operations?',
    answer:
      "The Mine Twin acts as a digital flight simulator running discrete-event optimization. It synchronizes excavator cycle times and dumper arrival queues to eliminate truck idling—cutting diesel burn by 11.4% (saving ₹55 Lakhs/year for 20 dumpers) and recovering +2,420 extra metric tonnes of ore per quarter worth ₹1.02 Crores.",
  },
  {
    id: 'k10',
    category: 'security',
    keywords: ['security', 'cloud', 'meghraj', 'nic', 'classified', 'data', 'sovereignty', 'encryption', 'offline', 'edge'],
    question: 'How is national geological data secured and how does it run offline?',
    answer:
      "Security & Sovereignty:\n• 100% hosted on Indian Government Cloud (NIC / MeghRaj) with military-grade AES-256 encryption at rest and TLS 1.3 in transit.\n• Offline-First Edge Architecture: Remote mines run locally on an on-site edge box with local SQLite/IndexedDB caching, ensuring 100% uptime with zero internet dependency.",
  },
  {
    id: 'k11',
    category: 'tech',
    keywords: ['tech', 'stack', 'frontend', 'backend', 'database', 'languages', 'nextjs', 'fastapi', 'postgis'],
    question: 'What is the complete technology stack of NAKSHATRA-X?',
    answer:
      "Architecture breakdown:\n• Frontend: Next.js 14, React 18, TailwindCSS, Three.js 3D Canvas, Web Speech API (Voice AI in Hindi/Marathi)\n• Backend: FastAPI (Python 3.10) for spatial math, Node.js API Gateway, Paho-MQTT & PyModbus for SCADA pump relays\n• Database: PostgreSQL + PostGIS (geospatial), TimescaleDB (sensor telemetry), SQLite (local edge cache), Redis\n• AI/ML: PyKrige, SciPy Optimize, Scikit-Learn, XGBoost, Prophet, GDAL/Rasterio.",
  },
  {
    id: 'k12',
    category: 'safety',
    keywords: ['safety', 'insar', 'landslide', 'slope', 'stability', 'wall', 'collapse', 'radar', 'danger'],
    question: 'How does InSAR satellite radar protect miners from fatal slope landslides?',
    answer:
      "InSAR radar measures millimeter-level phase shifts in open-pit rock faces. If bench subsidence exceeds safety thresholds, the system triggers audio-visual alarms 4 to 6 hours before a slope failure occurs—preventing fatal casualties and avoiding ₹8–12 Crores in excavator and equipment destruction.",
  },
  {
    id: 'k13',
    category: 'features',
    keywords: ['voice', 'hindi', 'marathi', 'multilingual', 'ui', 'traffic light', 'workers', 'operators'],
    question: 'How is the platform made simple for ground workers who are not tech-savvy?',
    answer:
      "NAKSHATRA-X uses a simple high-contrast Traffic Light UI (Green = Safe/Optimal, Amber = Blend Adjustment, Red = Storm Alert) and a Multilingual Voice AI Copilot supporting Hindi, Marathi, and English. Operators simply speak their query to receive instant, clear verbal directives.",
  },
  {
    id: 'k14',
    category: 'project',
    keywords: ['scale', 'nmdc', 'coal', 'nalco', 'iron', 'bauxite', 'expansion', 'minerals'],
    question: 'Can NAKSHATRA-X scale to other minerals like Iron Ore, Coal, or Bauxite?',
    answer:
      "Yes, 100%. The mathematical pipeline (Surface Band Ratios + 3D Kriging + Simplex Blending) is mineral-agnostic. We simply update the target spectral wavelength (e.g., Ferric absorption for NMDC Iron Ore) and the grade target matrix (64% Fe for Iron, 40% Al2O3 for NALCO Bauxite) to power India's entire extractive sector.",
  },
  {
    id: 'k15',
    category: 'team',
    keywords: ['team', 'built', 'sih', '26009', 'people', 'hackathon', 'who'],
    question: 'Who built NAKSHATRA-X and what is problem statement 26009?',
    answer:
      "NAKSHATRA-X is built for Smart India Hackathon (SIH Problem Statement 26009 for Ministry of Steel & MOIL Ltd). We are an interdisciplinary team bridging aerospace telemetry, geological engineering, and high-performance AI systems to deliver sovereign industrial solutions for India.",
  },
]

