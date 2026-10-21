# Lagos B2B Lead Funnel & Personalized Outreach Automation Factory

> **An End-to-End Autonomous Conversion Engine & Personalized Outreach System Tailored for 50 Real-World High-Friction B2B Enterprises in Lagos, Nigeria.**

Built with **React 19 + Vite + Tailwind CSS + Lucide Icons + Node.js CLI Automation**.

---

## 🌟 Key Features

1. **Polymorphic Multi-Tenant Architecture:**
   - One unified engine serving all 50 Lagos companies at `/demo/[company-slug]`.
   - Each company gets their own brand identity, location corridor, customized desk rates, and diagnostic operational leak teardown.

2. **The 4 Sector-Specific Solution Engines:**
   - 🚢 **Sector A: Freight Forwarding & Port Clearing (`FreightEstimatorEngine.jsx`)** — 15 Companies
     - Live Air Cargo (kg) vs. Ocean Freight (CBM) instant cost calculator (Guangzhou, Yiwu, London LHR, New York JFK, Dubai, Istanbul to Lagos).
     - Statutory Nigeria Customs Service duty estimator (HS codes, 1% CISS, 0.5% ETLS, 7% Port surcharge, 7.5% VAT, PAAR documentation).
     - Live flight consolidation cut-off countdown timer.
     - 1-Click WhatsApp booking card generator (`https://wa.me/...`).
   - 🪵 **Sector B: Bespoke Joinery & Millwork (`BespokeJoineryConfigurator.jsx`)** — 12 Companies
     - 5-step architectural millwork configurator (Kitchens, Wardrobes, Boardrooms, Suites, Wall Paneling).
     - Lagos substrate tiers: Egger Eurodekor MFC (1.0x), HMR MDF / Marine Plywood (1.45x), Kiln-Dried Nigerian Teak / Iroko (2.25x).
     - Heavy-Duty DTC vs. Austrian Blum Tandembox / Aventos HF (+32%).
     - 4x8ft board yield math (with 15% fabrication wastage) & edge-banding meterage.
     - Tiered budget gate (₦3.5M threshold) & 1-click Value-Engineering toggle.
     - Editorial Specifier Bill of Quantities (BOQ) generator.
   - 📦 **Sector C: Bulk Print & Industrial Packaging (`PackagingVolumeEngine.jsx`)** — 12 Companies
     - Sliding-scale MOQ unit cost calculator (500 → 1,000 → 2,500 → 5,000 → 10,000 → 50,000 units).
     - Demonstrates sharp economies of scale (e.g. ₦1,250 down to ₦260/unit).
     - Substrate GSM & finish selector (Spot UV, Gold/Silver Hot Foil, Matte Lamination, Embossing).
     - Automated artwork pre-flight validator (.AI / .PDF / .EPS with 300DPI, CMYK Fogra39, 3mm bleed checks).
     - 1-click Prototype Sample Kit checkout funnel (₦15,000 credited against bulk invoice).
   - 🚜 **Sector D: Heavy Equipment & Plant Hire (`HeavyEquipmentRFQPortal.jsx`)** — 11 Companies
     - Filterable fleet matrix: 50T Mobile Telescopic Cranes, 30T Excavators, 500kVA Generators, Lowbeds, Scaffolding.
     - Turnkey Wet Lease (certified operator + diesel allocation) vs. Machine Dry Lease.
     - Lagos & Offshore lowbed carrier mobilization radius estimator (Mainland, Island, Dangote Refinery, Riverine/Offshore).
     - Gated technical OEM calibration load chart PDF unlock (requires corporate CAC/RC number).
     - Enterprise RFQ dispatch to fleet desk.

3. **Master Agency Outreach Command Center (`OutreachCommandCenter.jsx`):**
   - Filterable, searchable pipeline of all 50 companies by Sector, Location, and CRM Stage.
   - Live telemetry: Total Targets, Audit Ready, Demos Sent, Calls Booked, Deals Closed, Pipeline Value in Naira (₦), and Monthly Hours Saved.
   - `localStorage` persistence with 1-click CSV & JSON export.
   - **Personalization Drawer:** Generates 4 custom scripts per company:
     - *Script 1: Direct WhatsApp Friction-Breaker* (with 1-click `wa.me` deep link and copy button).
     - *Script 2: LinkedIn Executive DM* (tailored to MD / Operations Director).
     - *Script 3: Cold Email with Diagnostic Teardown & ROI Math*.
     - *Script 4: 90-Second Loom Video Teleprompter Script* (timestamps 0:00–1:30).
     - *Phase 1–4 Commercial Scope Proposal* (Roadmap + pricing tier in ₦).

4. **🌗 High-Contrast Light & Dark Mode:**
   - Seamlessly toggle between dark obsidian carbon and crisp gallery white travertine.
   - Persists user preference to `localStorage`.
   - Accessible via the top navigation bar and floating clean-mode controls.

5. **📹 Loom-Ready Clean Mode:**
   - 1-click toggle strips away all agency headers and management chrome.
   - Provides a spotless full-bleed client interface with a discrete restore button, ideal for recording 90-second screen-share videos.

6. **⚡ Node.js Batch Automation CLI (`scripts/generate-outreach-pack.mjs`):**
   - Runnable via `npm run generate:outreach`.
   - Generates `/outreach-exports/master-crm-import.csv` (204KB) ready for HubSpot, Apollo, or Instantly.
   - Generates 4 standalone markdown sector playbooks with zero truncation.

---

## 🚀 Quick Start

### 1. Installation
```bash
git clone <repository-url>
cd lagos-b2b-automation-factory
npm install
```

### 2. Start Dev Server
```bash
npm run dev
# Server runs at http://localhost:3000
```

### 3. Generate Offline Outreach Pack
```bash
npm run generate:outreach
# Generates files in /outreach-exports/
```

### 4. Build for Production
```bash
npm run build
```

---

## 📁 Repository Structure

```
├── outreach-exports/
│   ├── master-crm-import.csv            # 50 records ready for Apollo / HubSpot
│   ├── sector-freight-playbook.md       # 15 freight forwarder outreach packs
│   ├── sector-furniture-playbook.md     # 12 custom millwork outreach packs
│   ├── sector-packaging-playbook.md     # 12 bulk packaging outreach packs
│   ├── sector-equipment-playbook.md     # 11 heavy plant hire outreach packs
│   └── README-outreach-execution-manual.md # Recommended 4-touch outreach sequence
├── scripts/
│   └── generate-outreach-pack.mjs       # Standalone Node.js CLI script
├── src/
│   ├── components/
│   │   ├── OutreachCommandCenter.jsx    # Master agency dashboard
│   │   ├── ThemeToggle.jsx              # Light / Dark mode toggle button
│   │   └── solutions/
│   │       ├── FreightEstimatorEngine.jsx
│   │       ├── BespokeJoineryConfigurator.jsx
│   │       ├── PackagingVolumeEngine.jsx
│   │       └── HeavyEquipmentRFQPortal.jsx
│   ├── context/
│   │   └── ThemeContext.jsx             # React Theme Context (Light/Dark)
│   ├── data/
│   │   └── lagosTargets50.js            # All 50 companies with rich metadata
│   ├── App.jsx                          # View switcher & Loom mode
│   ├── index.css                        # Tailwind v4 styles & theme variables
│   └── main.jsx                         # React entrypoint
└── package.json
```

---

## 🎯 Target Companies Overview (All 50)

- **Sector A: Freight Forwarding & Ocean Clearing (15):** Cargo Naija, Valuehandlers International, MDS Logistics, Bowwood Logistics, Fortune Global Shipping, Delog Nigeria, Skybridge Cargo, Horlog Freight, Sendme Global, Apex Cargo, G-Global Freight, Bolloré / AGL Nigeria, Eagle Global Cargo, Swift Freight Express, Prime Maritime.
- **Sector B: Bespoke Joinery & Millwork (12):** Woodify NG, Oak & Teak Interiors, Majeurs Holdings, Wood Empire Lagos, Vava Furniture, Hogg Furniture, DO.II Designs, Bedmate Furniture, Tiffany Amber Interiors, Alveo Bespoke Woodworks, Grandeur Woodcraft, Charis Joinery.
- **Sector C: Bulk Print & Industrial Packaging (12):** iPrints Nigeria, PrintPalash, Printivo, NeoPrint Solutions, Brandit Nigeria, Box & Wrap Nigeria, Yama Pack Nigeria, FastPrint Lagos, Zenith Plastics, Lagos Paper & Board Converters, Elite Pack & Print, PrintDirect NG.
- **Sector D: Heavy Equipment & Plant Hire (11):** Adeyemi & Sons Plant Hire, Bayustik Nigeria, Chezrock Engineering, Mantrac Nigeria (CAT), Mikano International, Stallion Auto Logistics, Rental Express Power, Total Plant Hire, Zircon Marine & Offshore, ProStage Nigeria, EquipLagos Machinery.

---

## 📄 License
MIT License. Built inside Google Antigravity.
