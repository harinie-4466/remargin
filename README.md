<div align="center">

# ♻ ReMargin

### *Track waste. Save money. Stay compliant.*

**A zero-hardware energy intelligence platform for CNC MSME factories in India**

[![Demo Video](https://img.shields.io/badge/▶_Watch_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/demo-remargin-hackfinix)

> *"Energy wasted, but never measured — that's making sustainable manufacturing impossible."*
</div>

---

## What problem are we actually solving?

Picture this: a 12-machine CNC shop in Coimbatore. The owner has been running this factory for 15 years. He knows every machine by sound. But ask him how much energy Machine 3 wasted last Tuesday, and he'll shrug — because nobody measured it.

That's not unusual. It's the norm across **1,00,000+ CNC factories in India**.

These factories waste **20–30% of their energy** — silently, invisibly, every single shift. Translated into money, that's ₹8–15 lakh per factory per year just evaporating. Translated into carbon, that's **110 tonnes of CO₂ per factory annually** — the same as burning 75 tonnes of coal, or driving 20 cars for a year.

And the problem is getting worse. Three deadlines are converging:

| The Gap | What's at stake |
|---|---|
| **70,000+ factories** risk failing OEM ESG audits (Maruti, Tata, Bosch) | Loss of export contracts |
| **Most tools are ignored** because they report kWh, not ₹ | No behavioral change |
| **EU's CBAM law kicks in 2026** — carbon declarations on every shipment | Export eligibility at risk |

The tools that exist — IoT sensors, ERP systems, energy consultants — all require hardware investment, IT teams, or trained staff that a 12-machine shop simply doesn't have.

**ReMargin fixes this.** No hardware. No IT team. No jargon.

---

## The solution

ReMargin is a web platform that does three things extremely well:

**1. Translates energy data into money** — A worker photographs the electric meter at the start and end of each shift. That's it. ReMargin extracts the readings via OCR, compares them to industry benchmarks, and tells the owner: *"Machine 3 cost you ₹640 more than it should have today. A coolant check usually fixes this."*

**2. Generates compliance documents automatically** — As data accumulates, ReMargin silently builds ESG/BRSR reports, EU CBAM carbon declarations, and green loan proposals in the background. When an OEM auditor asks for it, the factory owner downloads a PDF and emails it. Zero extra work.

**3. Works for the person who has 8 minutes in the morning** — No dashboards that look like spreadsheets. No KPIs that require an MBA to interpret. Just: *how much did I lose, what caused it, and what do I do next.*

---

## Features

### Core (built in the prototype)

| Feature | What it does |
|---|---|
| **Photo-first Data Capture** | Workers photograph the electric meter — OCR extracts the readings automatically |
| **Loss Alerts** | Every energy inefficiency is converted to a rupee loss: *"₹640 lost this shift"* |
| **Scrap Tracker** | Logs production scrap and shows both the loss and the resale value in ₹ |
| **Fix Tracker** | Logs corrective actions, monitors the next 3 shifts, and shows whether it worked |
| **Auto ESG Report Generator** | Generates BRSR/GHG-compliant PDF reports from accumulated factory data |
| **EU CBAM Export Passport** | Produces Scope 1 & 2 carbon declarations formatted for EU shipment compliance |
| **Green Loan Proposal** | Generates ready-to-submit proposals for SIDBI/IREDA using verified savings data |
| **Solar Feasibility Report** | Calculates optimal solar investment using rooftop area and actual usage patterns |
| **Maintenance Alerts** | Links machine overdue days directly to energy cost impact (₹X/day accumulating) |

---

### Frontend stack
```
React 18  ·  Recharts  ·  Google Fonts (Syne + DM Sans)
Pure HTML/CSS/JS — no build step, no Node.js required
Open ReMargin.html in any browser and it works
```

### Backend stack (reference implementation)
```
FastAPI (Python)     ·  Pydantic (validation)
Celery               ·  APScheduler (cron jobs / report generation)
Pillow               ·  Google Cloud Vision API (OCR)
ReportLab            ·  jsPDF (PDF generation)
PostgreSQL + Redis   ·  SQLite (prototype)
Railway.app (BE)     ·  Render (FE deployment)
```

### Data sources
- **BEE MSME Energy Studies** — industry benchmarks (2.6 kWh/part, 8% scrap rate, 30-day maintenance)
- **CEA grid emission factor** — 0.82 kg CO₂e/kWh (Tamil Nadu / Maharashtra grid)
- **PM Surya Ghar** — 40% solar subsidy data

---

## Pages & Navigation

| Page | Route | Purpose |
|---|---|---|
| **Login** | `/` | Split-screen landing with animated stat pills |
| **Dashboard** | `/dashboard` | The nerve centre — money lost, alerts, heatmap, charts |
| **Energy Upload** | `/upload` | Worker-facing shift meter entry with OCR |
| **Scrap Tracker** | `/scrap` | Scrap logging with ₹ loss + resale calculation |
| **Maintenance** | `/maintenance` | Machine health cards + fix tracker timeline |
| **Reports Hub** | `/reports` | ESG, CBAM, Green Loan, Solar — one-click PDFs |
| **Settings** | `/settings` | Factory config, benchmarks, data export |

All 8 pages are fully connected — every alert links to maintenance, every report shows data completeness, every quick action button goes to the right page.

---

**Demo credentials** (pre-filled on the login screen):
```
Email:    owner@sakthiprecision.com
Password: (any)
```

---

**Factory-level impact (first 6 months):**
- Energy bills reduced by **15–25%**
- OEM ESG audits (Maruti, Tata, Bosch) — **passed automatically**
- EU CBAM deadline — **met with zero extra work**
- SIDBI/IREDA green loans — **unlocked with 6-month data trail**

---


## Team

<div align="center">

| Name | Role |
|:---:|:---:|
| **C.B. Harinie** | Team Lead · Full-stack + Product |
| **Pon Gopika P** | Frontend + UI/UX |

**Amrita Vishwa Vidyapeetham, Coimbatore**
`sviharinie@gmail.com`

</div>
