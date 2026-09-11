# NAKSHATRA-X 🚀

> **AI + Satellite Intelligence for Manganese Prospectivity Mapping & Autonomous Mineral Supply Chain**  
> *Developed for MOIL Limited & Ministry of Steel (Smart India Hackathon 2026)*

---

## ⚡ Quick Start for Developers (1-Minute Setup)

### 1. Clone the Repository
```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Anti26/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment configuration:
```bash
cp .env.example .env.local
```
*(Your team lead can provide the live Supabase credentials for `.env.local`)*

### 4. Launch Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🧭 Key Application Routes

| Route | Description |
| :--- | :--- |
| `/` | **Main Platform:** 788-Frame Cinematic Video & Space Intelligence Dashboard |
| `/login` | **User Access Console:** Google OAuth (Supabase) + Real Email OTP + Demo |
| `/dashboard` | **Mission Control Room:** Telemetry, STAC satellite imagery, and ESG auditing |
| `/admin/setup` | **Single-Slot Setup:** Initialize the Primary Commander account *(Permanently locks once claimed)* |
| `/admin/login` | **Commander Terminal:** Master passphrase authentication |
| `/admin` | **Global Command Center:** Live user sign-in database, search, filter, and CSV export |
| `/admin/profile` | **User Database:** Fullscreen registered operator registry |

---

## 🛠️ Technology Stack
* **Frontend:** Next.js 16 (App Router + Turbopack), React 19, TypeScript, Tailwind CSS
* **3D & Visualization:** Three.js, React Globe GL, React Flow, Lucide Icons, Recharts
* **Backend & Auth:** Supabase Auth (Google OAuth + Email) & Cloud PostgreSQL
* **AI & Satellite:** STAC Sentinel-2 imagery processing, XGBoost mineral prospectivity models

---

## 👥 Team Collaboration Guidelines
1. Never commit `.env` or `.env.local` files containing secrets.
2. Create a feature branch for your work:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. Test production builds before pushing:
   ```bash
   npm run build
   ```
