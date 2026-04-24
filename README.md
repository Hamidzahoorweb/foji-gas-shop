# ⛽ Foji Gas — Shop Management System

A complete, offline-first shop management system for **Foji Gas** built with vanilla HTML, CSS, and JavaScript. No server required — all data is stored in the browser's localStorage.

## Features

| Module | What it does |
|---|---|
| 📊 Dashboard | Live stats: cylinders, gas stock, today's sales, earnings, profit |
| 🛢️ Cylinder Stock | Track 12kg & 45kg cylinders + total gas stock (kg) with history |
| 💰 LPG Sales | Record daily sales, quantities, cost & selling price |
| 🔧 Parts Sales | Track parts & accessories sales separately |
| 📋 Expenses | Log all shop expenses by category |
| 📈 Reports | Monthly & yearly turnover, profit, and breakdown |
| 🗂️ History | Full transaction history (all types) |

## What it Tracks

- ✅ Total 12kg & 45kg cylinder stock
- ✅ Total gas stock in kg
- ✅ Today's LPG sale (kg sold)
- ✅ Today's LPG earning + Other (Parts) earning
- ✅ Today's LPG profit & Parts profit
- ✅ Monthly turnover (LPG + Parts)
- ✅ Yearly turnover
- ✅ Full CRUD on all records

## Deploy to GitHub Pages (Free Hosting)

### Step 1 — Create GitHub Account
Go to [github.com](https://github.com) and sign up (free).

### Step 2 — Create Repository
1. Click **"New"** (green button)
2. Name it: `foji-gas`
3. Set to **Public**
4. Click **"Create repository"**

### Step 3 — Upload Files
1. Click **"Add file" → "Upload files"**
2. Drag and drop ALL files:
   - `index.html`
   - `css/style.css`
   - `js/db.js`
   - `js/app.js`
   - `README.md`
3. Click **"Commit changes"**

### Step 4 — Enable GitHub Pages
1. Go to **Settings** tab
2. Scroll to **"Pages"** in left sidebar
3. Under Source, select **"Deploy from branch"**
4. Branch: **main**, Folder: **/ (root)**
5. Click **Save**

### Step 5 — Your app is live! 🎉
URL will be: `https://YOUR_USERNAME.github.io/foji-gas`

It takes ~2 minutes to go live.

## Data Storage
- All data is stored in your browser's **localStorage**
- Data stays on your device — no internet needed after first load
- To backup: open browser console and run `JSON.stringify(localStorage)` and save

## Usage Tips
- Use on a dedicated device (shop computer/tablet) for best results
- Data persists even after closing the browser
- Clearing browser data will erase records — avoid doing this

---
Built for Foji Gas Shop 🔥
