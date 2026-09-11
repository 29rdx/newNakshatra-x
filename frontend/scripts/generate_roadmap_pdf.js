const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>NAKSHATRA-X AI Roadmap</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #1e293b;
      background-color: #ffffff;
      line-height: 1.6;
      font-size: 12pt;
    }
    .header-banner {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 24px;
      text-align: center;
    }
    .header-banner h1 {
      margin: 0;
      font-size: 24pt;
      color: #38bdf8;
    }
    h2 {
      color: #0f172a;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 5px;
      margin-top: 20px;
    }
    h3 {
      color: #334155;
    }
    .tool-card {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      background-color: #f8fafc;
    }
    .tool-card strong {
      color: #00aa55;
      font-size: 14pt;
    }
  </style>
</head>
<body>

  <div class="header-banner">
    <h1>NAKSHATRA-X : Full AI Roadmap</h1>
    <p>A Simple Guide to Our Tools & How They Work</p>
  </div>

  <h2>Our Goal</h2>
  <p>Make mining safer and more profitable using real-time AI and satellite data, without making things complicated.</p>

  <h2>The Tools We Use & How They Work</h2>

  <div class="tool-card">
    <strong>1. Open-Meteo & ISRO Bhuvan (The Eyes)</strong>
    <p><strong>What it is:</strong> Live satellite and weather data streams.</p>
    <p><strong>How we use it:</strong> It constantly watches the exact GPS location of MOIL mines. If heavy rain is coming, it tells the AI immediately so we can stop floods before they ruin the haul roads.</p>
  </div>

  <div class="tool-card">
    <strong>2. XGBoost & Prophet (The Brain)</strong>
    <p><strong>What it is:</strong> Powerful Machine Learning (AI) models.</p>
    <p><strong>How we use it:</strong> These models have memorized 50 years of mining history. They look at today's real weather from Open-Meteo and predict exactly how much manganese we will fail to mine next week if we don't take action today.</p>
  </div>

  <div class="tool-card">
    <strong>3. SciPy Simplex Optimizer (The Calculator)</strong>
    <p><strong>What it is:</strong> Advanced mathematical solver.</p>
    <p><strong>How we use it:</strong> Customers want 41% pure Manganese. We have different piles of ore (some 30%, some 50%). SciPy instantly calculates the cheapest and fastest way to mix these piles to hit the exact 41% target.</p>
  </div>

  <div class="tool-card">
    <strong>4. IndexedDB & WebCrypto (Offline Security)</strong>
    <p><strong>What it is:</strong> Secure browser storage.</p>
    <p><strong>How we use it:</strong> Mines often lose internet. We save an encrypted copy of the AI brain directly onto the manager's laptop browser. If the internet dies, the dashboard keeps running and predicting locally!</p>
  </div>

  <div class="tool-card">
    <strong>5. Next.js & React (The Face)</strong>
    <p><strong>What it is:</strong> Modern website builders.</p>
    <p><strong>How we use it:</strong> This is what the manager sees. It turns all the complex math and satellite data into simple, beautiful buttons and graphs that anyone can understand.</p>
  </div>

  <h2>Future Roadmap</h2>
  <ul>
    <li><strong>Phase 1 (Now):</strong> Predicting weather risks and mixing ores automatically.</li>
    <li><strong>Phase 2 (Next Year):</strong> Connecting real IoT sensors from the mining trucks directly to the AI to predict when a truck engine will break.</li>
    <li><strong>Phase 3 (Future):</strong> Fully automated drone dispatches for 3D mapping of the mine every morning.</li>
  </ul>

</body>
</html>
`

const htmlPath = path.join(__dirname, '..', 'public', 'temp_roadmap.html')
const publicPdfPath = path.join(__dirname, '..', 'public', 'AI_Roadmap_Simple.pdf')
const artifactPdfPath = '/Users/ruprajdatta/.gemini/antigravity-ide/brain/10c0379d-f42a-432e-8393-ce514dcefdce/AI_Roadmap_Simple.pdf'

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
