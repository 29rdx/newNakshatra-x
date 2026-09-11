const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const TARGET_URL = 'http://localhost:3000';
const OUT_DIR = path.join(__dirname, '..', '..', 'public', 'screenshots');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Copy to artifacts dir if available
const artifactDir = '/Users/ruprajdatta/.gemini/antigravity-ide/brain/b0e312fa-81f1-45f7-a0b6-c8cefec99276';
const artOutDir = path.join(artifactDir, 'screenshots');
if (fs.existsSync(artifactDir) && !fs.existsSync(artOutDir)) {
  fs.mkdirSync(artOutDir, { recursive: true });
}

async function run() {
  console.log('Launching headless Google Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,950'],
    defaultViewport: { width: 1400, height: 950 }
  });

  try {
    const page = await browser.newPage();
    console.log(`Navigating to ${TARGET_URL}...`);
    await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    
    console.log('Waiting for landing page to load...');
    await new Promise(r => setTimeout(r, 3000));

    // Scroll down to the Mission Control dashboard
    console.log('Scrolling down to the Dashboard...');
    await page.evaluate(() => {
      const dashboard = document.getElementById('mission-control');
      if (dashboard) {
        dashboard.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        window.scrollTo(0, 1000);
      }
    });
    await new Promise(r => setTimeout(r, 2000));

    // Screenshot 1: Dashboard overview
    console.log('Capturing Screenshot 1: Dashboard Landing...');
    const path1 = path.join(OUT_DIR, '01_dashboard_landing.png');
    await page.screenshot({ path: path1 });
    if (fs.existsSync(artOutDir)) {
      fs.copyFileSync(path1, path.join(artOutDir, '01_dashboard_landing.png'));
    }

    // Switch map layer to Geology (SWIR Heatmap)
    console.log('Switching layer to SWIR Mineral Probability Heatmap...');
    const clickedGeology = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const geoBtn = buttons.find(b => b.textContent && b.textContent.includes('SWIR Mineral Probability Heatmap'));
      if (geoBtn) {
        geoBtn.click();
        return true;
      }
      return false;
    });
    console.log(`Layer button clicked status: ${clickedGeology}`);
    await new Promise(r => setTimeout(r, 3000));

    // Screenshot 2: Geology ML Layer
    console.log('Capturing Screenshot 2: SWIR ML Layer Grid...');
    const path2 = path.join(OUT_DIR, '02_geology_ml_layer.png');
    await page.screenshot({ path: path2 });
    if (fs.existsSync(artOutDir)) {
      fs.copyFileSync(path2, path.join(artOutDir, '02_geology_ml_layer.png'));
    }

    // Open first gridded point popup (Leaflet circle marker uses SVG path with class leaflet-interactive)
    console.log('Clicking a prospectivity node to open popup...');
    await page.evaluate(() => {
      // Find leaflet interactive paths (circles)
      const paths = Array.from(document.querySelectorAll('path.leaflet-interactive'));
      // In our code, we draw 725 gridded circles. We click one of them.
      if (paths.length > 5) {
        // click the 10th path which corresponds to a grid point
        const target = paths[10];
        const event = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        target.dispatchEvent(event);
      }
    });
    await new Promise(r => setTimeout(r, 1500));

    // Screenshot 3: ML Telemetry Popup
    console.log('Capturing Screenshot 3: ML Node Telemetry Popup...');
    const path3 = path.join(OUT_DIR, '03_node_telemetry_popup.png');
    await page.screenshot({ path: path3 });
    if (fs.existsSync(artOutDir)) {
      fs.copyFileSync(path3, path.join(artOutDir, '03_node_telemetry_popup.png'));
    }

    // Scroll to Judges deck
    console.log('Scrolling to Judges Architecture Deck...');
    await page.evaluate(() => {
      const judgesCorner = document.getElementById('judges-corner');
      if (judgesCorner) {
        judgesCorner.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    });
    await new Promise(r => setTimeout(r, 1500));

    // Screenshot 4: Judges Deck Pipeline Flow
    console.log('Capturing Screenshot 4: Judges Deck Pipeline...');
    const path4 = path.join(OUT_DIR, '04_judges_pipeline_flow.png');
    await page.screenshot({ path: path4 });
    if (fs.existsSync(artOutDir)) {
      fs.copyFileSync(path4, path.join(artOutDir, '04_judges_pipeline_flow.png'));
    }

    // Click Model Specs tab
    console.log('Clicking Model Specs tab...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const specsBtn = buttons.find(b => b.textContent && b.textContent.includes('Model Specs'));
      if (specsBtn) specsBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Screenshot 5: Judges Deck Model Specs
    console.log('Capturing Screenshot 5: Judges Model Specs...');
    const path5 = path.join(OUT_DIR, '05_judges_model_specs.png');
    await page.screenshot({ path: path5 });
    if (fs.existsSync(artOutDir)) {
      fs.copyFileSync(path5, path.join(artOutDir, '05_judges_model_specs.png'));
    }

    // Click Feature Importances tab
    console.log('Clicking Feature Importances tab...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const impBtn = buttons.find(b => b.textContent && b.textContent.includes('Feature Importances'));
      if (impBtn) impBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Screenshot 6: Feature Importances
    console.log('Capturing Screenshot 6: Feature Importances Chart...');
    const path6 = path.join(OUT_DIR, '06_judges_feature_importances.png');
    await page.screenshot({ path: path6 });
    if (fs.existsSync(artOutDir)) {
      fs.copyFileSync(path6, path.join(artOutDir, '06_judges_feature_importances.png'));
    }

    console.log('Successfully captured all screenshots.');
  } catch (err) {
    console.error('Error during screenshot generation:', err);
  } finally {
    await browser.close();
  }
}

run();
