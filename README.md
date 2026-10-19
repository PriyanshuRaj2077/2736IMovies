# iMovies — Online Movie Ticket Booking Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19-lightgrey.svg)](https://expressjs.com/)
[![Design System](https://img.shields.io/badge/Theme-Ticketnew%20Light-black.svg)]()

> A full-stack online movie ticket discovery and booking platform featuring real-time showtime scheduling, tier-based cinema hall seat selection, atomic race-condition-free reservations, and administrative management.

---

## 🌟 Key Features

- **Movie Discovery & Catalog**: Explore trending blockbusters, search by titles, and filter by genres (Sci-Fi, Action, Drama, Animation, etc.).
- **Cinema & Showtime Scheduling**: Browse partner cinema venues (IMAX, Dolby Atmos) and select showtimes for any active screening.
- **Interactive Tiered Cinema Hall**:
  - **Balcony Tier** (Premium Rows)
  - **Middle Tier** (Executive Rows)
  - **Lower Tier** (Standard Rows)
  - Real-time seat status indicators (Available, Selected, Booked).
- **Atomic Concurrency Booking**: Database-level conditional update logic preventing double-booking of identical seats under concurrent loads.
- **Digital Perforated Ticket**: Generates instant printable digital ticket slips with reference codes (e.g., `IMV-XXXXXX`) and show details.
- **User Watchlist & Bookings**: Save favorite films, view active and past ticket bookings, and cancel reservations with live seat release.
- **Admin Management Portal**: Platform KPI dashboard (gross revenue, tickets sold, active shows), movie publisher, and hall showtime collision-free scheduler.
- **Ticketnew Light UI**: Clean, utilitarian light design system using **Be Vietnam Pro** typography, white surfaces (`#FFFFFF`), soft structural borders (`#E5E7EB`), and pill-shaped controls (`9999px` radius).

---

## 📂 Repository Structure

```
d:/agent2/MovieTicket/
├── docs/
│   ├── iMovies_Project_Plan.pdf         # 22-page master project plan & architecture specification
│   ├── iMovies_Project_Plan.md          # Complete 18-section technical specification
│   ├── iMovies_Evaluation_Checklist.md  # 100-point rubric & quality evaluation checklist
│   ├── iMovies_Task_Tracker.csv         # 40-task machine-readable tracker
│   ├── iMovies_Project_Plan.html        # Styled HTML document for PDF generation
│   └── build_pdf.py                     # Python script to compile PDF
├── public/
│   ├── index.html                       # Frontend structure
│   ├── css/
│   │   └── style.css                    # Ticketnew Light design system tokens
│   └── js/
│       └── app.js                       # Frontend client logic & REST API integration
├── server.js                            # Express backend REST API & server entry
├── package.json                         # Dependencies and start scripts
└── .gitignore                           # Excluded files (node_modules, etc.)
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/PriyanshuRaj2077/2736IMovies.git
cd 2736IMovies

# Install dependencies
npm install
```

### 3. Launch the Application
```bash
# Start local server
npm start
# or
npm run dev
```

Visit the application at: **`http://localhost:5000`**

---

## 📑 Documentation & Specifications

- [Master Project Plan (PDF)](docs/iMovies_Project_Plan.pdf)
- [Master Project Plan (Markdown)](docs/iMovies_Project_Plan.md)
- [Evaluation Checklist & 100-Point Rubric](docs/iMovies_Evaluation_Checklist.md)
- [Task Tracker (CSV)](docs/iMovies_Task_Tracker.csv)

---

## 📄 License
This project is licensed under the MIT License.
