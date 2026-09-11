const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>NAKSHATRA-X - 3 Minute Judges Pitch Speech & Technical Cheat Sheet</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 15mm 15mm;
    }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #0f172a;
      background-color: #ffffff;
      line-height: 1.5;
      font-size: 10pt;
    }
    .header-banner {
      background: linear-gradient(135deg, #0b1329 0%, #1e293b 100%);
      color: #ffffff;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 18px;
      border-bottom: 4px solid #00ff88;
    }
    .header-banner h1 {
      margin: 0 0 4px 0;
      font-size: 20pt;
      font-weight: 800;
      letter-spacing: 0.04em;
    }
    .header-banner h1 span {
      color: #ff3366;
    }
    .header-banner p {
      margin: 2px 0 0 0;
      font-size: 9.5pt;
      color: #94a3b8;
    }
    .tag-container {
      margin-top: 10px;
    }
    .tag {
      display: inline-block;
      padding: 3px 8px;
      font-size: 8pt;
      font-weight: 700;
      border-radius: 4px;
      background-color: rgba(0, 255, 136, 0.15);
      color: #00aa55;
      border: 1px solid rgba(0, 255, 136, 0.4);
      margin-right: 6px;
    }
    .tag-cyan {
      background-color: rgba(56, 189, 248, 0.15);
      color: #0284c7;
      border-color: rgba(56, 189, 248, 0.4);
    }
    .tag-purple {
      background-color: rgba(168, 85, 247, 0.15);
      color: #7e22ce;
      border-color: rgba(168, 85, 247, 0.4);
    }

    .section-title {
      font-size: 13pt;
      font-weight: 800;
      color: #0f172a;
      border-left: 4px solid #00ff88;
      padding-left: 10px;
      margin-top: 18px;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .speech-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 16px;
      margin-bottom: 12px;
      position: relative;
    }

    .speech-timestamp {
      display: inline-block;
      font-family: monospace;
      font-weight: 800;
      font-size: 8.5pt;
      background: #0f172a;
      color: #00ff88;
      padding: 2px 8px;
      border-radius: 4px;
      margin-bottom: 6px;
    }

    .speech-heading {
      font-size: 10.5pt;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .speech-text {
      font-size: 9.5pt;
      color: #334155;
      line-height: 1.55;
    }
    .speech-text strong {
      color: #0f172a;
      background-color: #f1f5f9;
      padding: 0 3px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      margin-bottom: 16px;
      font-size: 8.5pt;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 6px 10px;
      text-align: left;
    }
    th {
      background-color: #0f172a;
      color: #ffffff;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 8pt;
    }
    tr:nth-child(even) {
      background-color: #f8fafc;
    }

    .qa-card {
      background-color: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 6px;
      padding: 10px 12px;
      margin-bottom: 8px;
    }
    .qa-question {
      font-weight: 700;
      color: #1e40af;
      font-size: 9pt;
      margin-bottom: 3px;
    }
    .qa-answer {
      font-size: 8.5pt;
      color: #1e293b;
    }

    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 8pt;
      color: #64748b;
    }

    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header-banner">
    <h1>NAKSHATRA<span>-X</span> Pitch Speech</h1>
    <p>3-Minute Official Hackathon Presentation & Technical Q&A Reference | Ministry of Steel & MOIL Ltd.</p>
    <div class="tag-container">
      <span class="tag">SIH 2026 Problem ID 26009</span>
      <span class="tag tag-cyan">Target Time: 3 Minutes (~450 Words)</span>
      <span class="tag tag-purple">Audience: Technical & Executive Judges</span>
    </div>
  </div>

  <!-- SECTION 1: 3-MINUTE SPOKEN SPEECH SCRIPT -->
  <div class="section-title">1. Word-for-Word 3-Minute Presentation Script</div>

  <!-- 0:00 - 0:30 -->
  <div class="speech-box">
    <div class="speech-timestamp">0:00 - 0:30 (30 sec)</div>
    <div class="speech-heading">The Hook & Problem Statement</div>
    <div class="speech-text">
      "Respected Judges, Manganese is the unsung hero of industrial steel and modern EV batteries. Yet, last year India spent over <strong>₹4,000 Crores importing manganese ore</strong> because operational disruptions—such as monsoon haulage road flooding, pit blasting delays, and grade dilution—frequently stall output across central India mines like Balaghat. Existing mining decisions are reactive. Presenting <strong>NAKSHATRA-X</strong>: India’s first Autonomous Space-Geological Decision Support Platform built for Ministry of Steel & MOIL Ltd."
    </div>
  </div>

  <!-- 0:30 - 1:15 -->
  <div class="speech-box">
    <div class="speech-timestamp">0:30 - 1:15 (45 sec)</div>
    <div class="speech-heading">Architecture & Core Technical Stack</div>
    <div class="speech-text">
      "Our system is engineered on a high-performance 3-tier architecture: On the <strong>Frontend</strong>, we use Next.js 16 with Turbopack, React 19, and Leaflet ISRO Bhuvan GIS layers for sub-second UI responsiveness. On the <strong>Backend</strong>, Next.js serverless proxy and Python FastAPI microservices execute mathematical routines in under 15 milliseconds. For <strong>Authentication & Database</strong>, we combine Firebase Identity with Copernicus STAC metadata to guarantee 100% cryptographic auditability for every decision."
    </div>
  </div>

  <!-- 1:15 - 2:15 -->
  <div class="speech-box">
    <div class="speech-timestamp">1:15 - 2:15 (60 sec)</div>
    <div class="speech-heading">Feature-by-Feature AI & Machine Learning Engine</div>
    <div class="speech-text">
      "Where NAKSHATRA-X excels is its 5 core AI/ML engines working in harmony: First, <strong>3D Ordinary Kriging</strong> ingests 10,829 GSI core drill logs to map hidden manganese block deposits before drilling. Second, our <strong>Mine Twin Simulator</strong> acts as a digital flight simulator, calculating shift optimization and equipment redeployment to recover +2,420 extra tonnes. Third, a <strong>SciPy Simplex Solver</strong> optimizes ore blending across stockpiles for guaranteed 42%+ Mn steel grade. Fourth, an <strong>Isolation Forest Model</strong> connects ISRO MOSDAC weather telemetry directly to SCADA pumps for monsoon risk control. And fifth, <strong>XGBoost + FBProphet</strong> analyzes a 50-Year MOIL Historical Database to forecast extraction through 2040 with TreeSHAP explainability."
    </div>
  </div>

  <!-- 2:15 - 2:45 -->
  <div class="speech-box">
    <div class="speech-timestamp">2:15 - 2:45 (30 sec)</div>
    <div class="speech-heading">Measurable Benefits & Strategic Impact</div>
    <div class="speech-text">
      "The benefits are measurable and immediate: We target a <strong>+136% extraction increase to 3.6 Million Tonnes annually</strong> by 2040, eliminating India's manganese import reliance. Furthermore, our offline-capable <strong>On-Device AI-X Assistant</strong> gives pit supervisors immediate natural language guidance directly on site without internet dependency."
    </div>
  </div>

  <!-- 2:45 - 3:00 -->
  <div class="speech-box">
    <div class="speech-timestamp">2:45 - 3:00 (15 sec)</div>
    <div class="speech-heading">Closing Punchline</div>
    <div class="speech-text">
      "Judges, NAKSHATRA-X bridges satellite intelligence with ground mining logistics—turning raw space telemetry into zero-risk, high-yield operational directives. Thank you, and we welcome your questions!"
    </div>
  </div>

  <div class="page-break"></div>

  <!-- SECTION 2: TECHNICAL ARCHITECTURE & FEATURE MATRIX -->
  <div class="section-title">2. Technical Stack Breakdown by Feature</div>

  <table>
    <thead>
      <tr>
        <th>Feature Module</th>
        <th>Frontend Tech</th>
        <th>Backend & API</th>
        <th>AI / ML / Math Model</th>
        <th>Data Source / DB</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Orbital Feed & Hero View</strong></td>
        <td>Next.js 16, React 19, Three.js / Cesium</td>
        <td>Serverless API Proxy</td>
        <td>Copernicus Sentinel Optical Stream</td>
        <td>ISRO Bhuvan / STAC Catalog</td>
      </tr>
      <tr>
        <td><strong>Mine Twin Simulator</strong></td>
        <td>Framer Motion, Custom Tailwind Glass UI</td>
        <td>/api/v1/mine-twin (Node/FastAPI)</td>
        <td>Parametric Shift & Friction Multiplier Matrix</td>
        <td>Cloud Database + Local Cache</td>
      </tr>
      <tr>
        <td><strong>Reserve Intelligence</strong></td>
        <td>Recharts, Canvas 3D Block Viewer</td>
        <td>/api/v1/mines/[id]/telemetry</td>
        <td>3D Ordinary Kriging Spatial Interpolation</td>
        <td>10,829 GSI Core Drill Hole Logs</td>
      </tr>
      <tr>
        <td><strong>Smart Ore Blending</strong></td>
        <td>Lucide Icons, Interactive Sliders</td>
        <td>/api/v1/ore-blending</td>
        <td>SciPy linprog Simplex Optimization</td>
        <td>MOIL Stockpile SP-1, SP-2 Assays</td>
      </tr>
      <tr>
        <td><strong>Risk & Constraint Cockpit</strong></td>
        <td>Recharts Precipitation Disruption Curve</td>
        <td>/api/v1/risk/analyze</td>
        <td>Isolation Forest Anomaly Scoring + SCADA Interlocks</td>
        <td>ISRO MOSDAC Weather Satellite</td>
      </tr>
      <tr>
        <td><strong>50-Yr Archive & 2040 Predictions</strong></td>
        <td>Portaled Glass Modal (createPortal)</td>
        <td>/api/v1/historical-forecasts</td>
        <td>XGBoost Gradient Descent + FBProphet & TreeSHAP</td>
        <td>50-Year MOIL Database (1977–2026)</td>
      </tr>
      <tr>
        <td><strong>AI-X On-Device Assistant</strong></td>
        <td>React Modal, Framer Motion Drawer</td>
        <td>Client-side LLM Web Worker API</td>
        <td>Quantized On-Device Natural Language Model</td>
        <td>Local Embeddings Knowledge Base</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 3: JUDGES' Q&A CHEAT SHEET -->
  <div class="section-title">3. Judges' Q&A Defense Strategy</div>

  <div class="qa-card">
    <div class="qa-question">Q1: How do you handle satellite cloud cover during heavy monsoons?</div>
    <div class="qa-answer">
      <strong>Answer:</strong> We ingest Sentinel-1 SAR (Synthetic Aperture Radar) microwave imagery which penetrates cloud cover 100%, combined with ground SCADA water pump sensor feeds and our 50-year Kriging spatial baseline.
    </div>
  </div>

  <div class="qa-card">
    <div class="qa-question">Q2: Is the Mine Twin simulation accurate or just a visual gimmick?</div>
    <div class="qa-answer">
      <strong>Answer:</strong> It is built on empirical operational friction matrices calibrated against 50 years of MOIL production data, calculating haulage shift bonuses, blasting delay penalties, and shovel redeployment gains.
    </div>
  </div>

  <div class="qa-card">
    <div class="qa-question">Q3: How is data privacy and auditability handled for Ministry of Steel review?</div>
    <div class="qa-answer">
      <strong>Answer:</strong> Every action order is recorded with SHA-256 cryptographic audit hashes and STAC GeoJSON metadata lineage stored securely in our Cryptographic Provenance Ledger.
    </div>
  </div>

  <div class="footer">
    NAKSHATRA-X Technical Documentation | Ministry of Steel & MOIL Ltd. | Generated automatically by Antigravity IDE
  </div>

</body>
</html>
`

const outputPath = path.join(__dirname, '../nakshatra_x_3min_judges_speech.pdf')
const artifactPath = path.join('/Users/ruprajdatta/.gemini/antigravity-ide/brain/dcc8cd7a-01d1-4253-8ecd-8ea4ca337719', 'nakshatra_x_3min_judges_speech.pdf')

const tempHtmlPath = path.join(__dirname, '../temp_speech.html')
fs.writeFileSync(tempHtmlPath, htmlContent)

console.log('Generating PDF via Headless Chrome...')

const chromeProcess = spawn(chromePath, [
  '--headless',
  '--disable-gpu',
  '--print-to-pdf=' + outputPath,
  '--no-pdf-header-footer',
  tempHtmlPath,
])

chromeProcess.on('close', (code) => {
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath)
  }
  if (code === 0 && fs.existsSync(outputPath)) {
    fs.copyFileSync(outputPath, artifactPath)
    console.log('PDF generated successfully!')
    console.log('File path 1:', outputPath)
    console.log('File path 2 (Artifact):', artifactPath)
  } else {
    console.error('PDF generation failed with exit code:', code)
  }
})
