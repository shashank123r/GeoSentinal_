# 🚀 GeoSentinal - Setup & Installation Guide

## ⚠️ Important: Node.js Required

This React application requires **Node.js** to run. You currently don't have Node.js installed.

---

## Step 1: Install Node.js

### Download Node.js

1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version for Windows
3. Run the installer
4. Follow the installation wizard (use default settings)
5. Restart your terminal/PowerShell after installation

### Verify Installation

Open a new PowerShell window and run:

```powershell
node --version
npm --version
```

You should see version numbers like:
```
v20.10.0
10.2.3
```

---

## Step 2: Install Project Dependencies

Navigate to the project directory and install all required packages:

```powershell
cd "c:\Users\shashank r\Documents\major horse shit\major project\geosentinal"
npm install
```

This will install:
- React 18.2
- Vite 5.0
- Tailwind CSS 3.4
- Framer Motion 10.16
- Chart.js 4.4
- React Leaflet 4.2
- TensorFlow.js 4.15
- And all other dependencies

**Installation time**: ~2-3 minutes

---

## Step 3: Start Development Server

Once dependencies are installed, start the development server:

```powershell
npm run dev
```

You should see output like:

```
  VITE v5.0.8  ready in 523 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

---

## Step 4: Open in Browser

The application will automatically open in your default browser at:

**http://localhost:3000**

If it doesn't open automatically, manually navigate to that URL.

---

## 🎯 What You'll See

### 1. Epic Loading Screen (2-3 seconds)
- Animated rotating globe
- Orbiting satellites
- Particle effects
- Progress bar

### 2. Hero Section
- Full-screen landing page
- Animated background with particles
- Statistics counters
- "Explore Analysis" button

### 3. Disaster Selection
- 6 interactive disaster type cards
- Hover effects with scale and glow
- Click any card to proceed

### 4. Comparison Section
- Before/after comparison interface
- "Run AI Analysis" button

### 5. AI Analysis Dashboard
- KPI cards with metrics
- Damage distribution charts
- Key findings

### 6. Interactive Map
- Placeholder for Leaflet map

### 7. Statistics
- Chart placeholders

### 8. About Section
- Technology stack
- Project information
- Footer

---

## 🛠️ Development Commands

### Start Development Server
```powershell
npm run dev
```
- Hot module replacement (HMR)
- Fast refresh
- Runs on http://localhost:3000

### Build for Production
```powershell
npm run build
```
- Creates optimized production build
- Output in `dist/` folder
- Minified and optimized

### Preview Production Build
```powershell
npm run preview
```
- Test production build locally
- Runs on http://localhost:4173

---

## 📁 Project Structure

```
geosentinal/
├── public/                    # Static assets
│   └── assets/
│       ├── disasters/         # Disaster images (to be added)
│       └── model/             # AI model files (to be added)
├── src/
│   ├── components/
│   │   ├── Navigation/
│   │   │   └── Navbar.jsx     ✅ Complete
│   │   ├── Sections/
│   │   │   ├── Hero.jsx       ✅ Complete
│   │   │   ├── DisasterSelection.jsx  ✅ Complete
│   │   │   ├── Comparison.jsx         ✅ Complete
│   │   │   ├── AIAnalysis.jsx         ✅ Complete
│   │   │   ├── InteractiveMap.jsx     ✅ Placeholder
│   │   │   ├── Statistics.jsx         ✅ Placeholder
│   │   │   └── About.jsx              ✅ Complete
│   │   └── UI/
│   │       ├── LoadingScreen.jsx      ✅ Complete
│   │       └── ScrollProgress.jsx     ✅ Complete
│   ├── context/
│   │   └── AppContext.jsx     ✅ Complete
│   ├── App.jsx                ✅ Complete
│   ├── main.jsx               ✅ Complete
│   └── index.css              ✅ Complete
├── index.html                 ✅ Complete
├── package.json               ✅ Complete
├── vite.config.js             ✅ Complete
├── tailwind.config.js         ✅ Complete
├── postcss.config.js          ✅ Complete
└── README.md                  ✅ Complete
```

---

## ✅ Current Status

### Completed ✅
- [x] Project structure setup
- [x] All configuration files
- [x] Epic loading screen with animations
- [x] Navbar with smooth scroll
- [x] Scroll progress indicator
- [x] Hero section with particles
- [x] Disaster selection cards
- [x] Comparison section (placeholder)
- [x] AI Analysis dashboard
- [x] Map section (placeholder)
- [x] Statistics section (placeholder)
- [x] About section
- [x] Context API state management
- [x] Framer Motion animations
- [x] Tailwind CSS styling
- [x] Responsive design

### To Be Implemented 🚧
- [ ] React Compare Slider integration
- [ ] Chart.js charts (pie, line, bar)
- [ ] React Leaflet map with markers
- [ ] TensorFlow.js AI model
- [ ] Disaster images (before/after)
- [ ] Data files (disasters.json, statistics.json)

---

## 🎨 Features Implemented

### 1. **Epic Loading Screen**
- Rotating globe animation
- 8 orbiting satellites
- 100 floating particles
- 3 pulse rings
- Progress bar with stages
- Smooth fade-out

### 2. **Navigation**
- Fixed navbar with blur effect
- Active section tracking
- Smooth scroll to sections
- Mobile hamburger menu
- Responsive design

### 3. **Hero Section**
- Animated gradient background
- 50 floating particles
- Glowing orbs
- Animated statistics
- CTA button with hover effects
- Scroll indicator

### 4. **Disaster Selection**
- 6 disaster type cards
- Hover scale and glow effects
- Click to select
- Auto-scroll to comparison
- Gradient backgrounds

### 5. **AI Analysis**
- 4 KPI cards with icons
- Damage distribution bars
- Animated progress bars
- Key findings list
- Responsive grid layout

---

## 🔧 Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- --port 3001
```

### Module Not Found

If you see "Module not found" errors:

```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Slow Installation

If npm install is slow:

```powershell
# Use npm cache
npm cache clean --force
npm install
```

---

## 📱 Testing Responsive Design

### Desktop
- Open in browser at full width
- Test all sections

### Tablet
- Press F12 to open DevTools
- Click device toolbar icon
- Select iPad or similar

### Mobile
- Select iPhone or Android device
- Test hamburger menu
- Test touch interactions

---

## 🚀 Next Steps

1. **Install Node.js** (if not already installed)
2. **Run `npm install`** in the geosentinal directory
3. **Run `npm run dev`** to start the development server
4. **Open http://localhost:3000** in your browser
5. **Test all sections** by scrolling through the page

---

## 💡 Tips

- **Hot Reload**: Changes to code will automatically update in the browser
- **Console**: Open browser DevTools (F12) to see any errors
- **Performance**: First load may be slow, subsequent loads are fast
- **Mobile**: Test on actual mobile devices for best results

---

## 📞 Need Help?

If you encounter any issues:

1. Check the browser console for errors (F12)
2. Verify Node.js is installed: `node --version`
3. Ensure all dependencies are installed: `npm install`
4. Try clearing cache: `npm cache clean --force`
5. Restart the development server

---

**Ready to launch! 🚀**

Once Node.js is installed, you're just two commands away from seeing your application:

```powershell
npm install
npm run dev
```
