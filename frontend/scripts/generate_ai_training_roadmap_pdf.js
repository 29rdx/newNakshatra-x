const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>NAKSHATRA-X AI & ML Training Roadmap</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #1e293b;
      background-color: #ffffff;
      line-height: 1.6;
      font-size: 11pt;
    }
    .header-banner {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 24px;
      border-bottom: 4px solid #00ff88;
    }
    .header-banner h1 { margin: 0; font-size: 22pt; color: #ffffff; }
    .header-banner h1 span { color: #38bdf8; }
    h2 {
      font-size: 14pt;
      color: #0f172a;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 24px;
    }
    h3 { font-size: 12pt; color: #334155; }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      background-color: #f8fafc;
    }
    .card h4 { margin: 0 0 8px 0; color: #00aa55; font-size: 12pt; }
    .code-block {
      background-color: #0f172a;
      color: #38bdf8;
      font-family: monospace;
      padding: 12px;
      border-radius: 6px;
      font-size: 9pt;
      margin: 10px 0;
    }
  </style>
</head>
<body>

  <div class="header-banner">
    <h1>NAKSHATRA<span>-X</span> AI & ML Training Roadmap</h1>
    <p>Comprehensive guide to model architecture, data pipelines, and continuous improvement.</p>
  </div>

  <h2>1. Data Ingestion & Preprocessing Pipeline</h2>
  <p>To train models accurately, data must be clean. The pipeline merges three distinct data sources:</p>
  <ul>
    <li><strong>Historical MOIL Data (ERP):</strong> 50 years of excavation rates, equipment downtime logs, and target vs. actuals.</li>
    <li><strong>Live Telemetry (Open-Meteo & ISRO):</strong> 14-day rainfall sums, soil moisture percentages, and land surface temperatures.</li>
    <li><strong>Geological Satellite Feeds:</strong> SWIR (Short-Wave Infrared) band anomaly data from Sentinel-2.</li>
  </ul>
  <p><em>Improvement Strategy:</em> We normalize all variables using Min-Max scaling and handle missing ERP entries using K-Nearest Neighbors (KNN) imputation before passing data to the models.</p>

  <h2>2. AI Model Architectures & Training Strategies</h2>

  <div class="card">
    <h4>A. Production Forecaster (XGBoost + Facebook Prophet)</h4>
    <p><strong>Goal:</strong> Predict exactly how much ore will be mined next week based on weather and equipment health.</p>
    <p><strong>Training Method:</strong> Time-series forecasting. We feed Prophet the seasonal trends (e.g., monsoons in July lower production) and use XGBoost to calculate non-linear risks (e.g., if rainfall > 100mm AND pump #4 is down, production drops 40%).</p>
    <p><strong>How to Improve:</strong> Implement a weekly feedback loop. If the model predicted 10,000 Tonnes but MOIL mined 12,000 Tonnes, the delta is fed back into the XGBoost weights (Gradient Descent) to self-correct for the next month.</p>
  </div>

  <div class="card">
    <h4>B. Ore Blending Optimizer (SciPy Simplex LP)</h4>
    <p><strong>Goal:</strong> Calculate the cheapest way to mix different stockpiles to achieve exactly 41% Manganese purity.</p>
    <p><strong>Training Method:</strong> This is a deterministic Mathematical Optimization model, not a probabilistic ML model. It runs Linear Programming algorithms to minimize cost while satisfying chemical constraints (Mn &ge; 41%, Silica &le; 6%).</p>
    <p><strong>How to Improve:</strong> Add dynamic pricing inputs. If the cost of crushing low-grade ore rises, the algorithm dynamically adjusts the blending ratio to favor high-grade stockpiles.</p>
  </div>

  <div class="card">
    <h4>C. AI Copilot Chatbot (Local TF-IDF / NLU)</h4>
    <p><strong>Goal:</strong> Allow managers to ask questions ("What is the flood risk today?") and get answers without needing the internet.</p>
    <p><strong>Training Method:</strong> Instead of relying on a cloud LLM like ChatGPT (which breaks offline), we use <strong>TF-IDF Vectorization</strong> and <strong>Cosine Similarity</strong> running entirely in the browser (IndexedDB). It is pre-trained on a corpus of 500+ standard MOIL operational intents.</p>
    <p><strong>How to Improve:</strong> As managers type new, unrecognized questions into the Copilot, the system logs the "Unmatched Intents." An admin can review these logs weekly, map them to correct actions, and push an updated JSON vocabulary to the frontend, making the offline bot smarter over time.</p>
  </div>

  <h2>3. The "Continuous Learning" Loop</h2>
  <p>AI models degrade over time (Model Drift) if they aren't fed new data. To ensure NAKSHATRA-X improves:</p>
  <div class="code-block">
    Step 1: Capture live Open-Meteo weather + Actual end-of-day MOIL extraction (Real Data).<br>
    Step 2: Compare against the AI's prediction (Calculate Loss/Error).<br>
    Step 3: Trigger automated retrain (CRON Job on Server) if Error > 5%.<br>
    Step 4: Push updated model weights to the Offline Browser Cache (IndexedDB).
  </div>

  <h2>4. Future AI Roadmap</h2>
  <ul>
    <li><strong>Phase 1 (Current):</strong> Hybrid XGBoost forecasting, local NLP Chatbot, and mathematical blending.</li>
    <li><strong>Phase 2 (Q2):</strong> Computer Vision (CNNs) for drone imagery. Drones will fly over the mine, and AI will automatically calculate the exact volume of the stockpiles using photogrammetry.</li>
    <li><strong>Phase 3 (Q4):</strong> Reinforcement Learning (RL) for dispatch. The AI will learn by "playing" a simulation of the mine thousands of times to discover the most efficient routing paths for dump trucks.</li>
  </ul>

</body>
</html>
`

const htmlPath = path.join(__dirname, '..', 'public', 'temp_ai_training.html')
const publicPdfPath = path.join(__dirname, '..', 'public', 'AI_Training_Roadmap.pdf')
const artifactPdfPath = '/Users/ruprajdatta/.gemini/antigravity-ide/brain/10c0379d-f42a-432e-8393-ce514dcefdce/AI_Training_Roadmap.pdf'

fs.writeFileSync(htmlPath, htmlContent, 'utf-8')
console.log('Temporary HTML document created at:', htmlPath)

const chromeProcess = spawn(chromePath, [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  `--print-to-pdf=${publicPdfPath}`,
  htmlPath
])

chromeProcess.on('exit', (code) => {
  console.log(`Chrome Headless exited with code ${code}`)
  if (fs.existsSync(publicPdfPath)) {
    fs.copyFileSync(publicPdfPath, artifactPdfPath)
    console.log('Successfully generated official PDF at:')
    console.log('Artifact Path:', artifactPdfPath)
    try { fs.unlinkSync(htmlPath) } catch {}
  } else {
    console.error('PDF generation failed.')
  }
})
