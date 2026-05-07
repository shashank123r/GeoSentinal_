# Quick Start Guide - xBD Integration

## Prerequisites Check

Before starting, ensure you have:
- ✅ Python 3.8+ installed
- ✅ Node.js 16+ installed
- ✅ xBD dataset in `train/` and `test/` folders

## Step 1: Generate Dataset Metadata

```bash
cd geosentinal
python scripts/process_xbd_dataset.py
```

**Expected Output:**
```
Found 10 unique disasters
✓ Created src/data/disasters.json
✓ Created src/data/statistics.json
```

## Step 2: Install Backend Dependencies

> **Note**: PyTorch installation can take 5-10 minutes

```bash
cd backend
pip install -r requirements.txt
```

**If PyTorch installation fails**, install it separately:
```bash
# For CPU-only (faster download):
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Then install other requirements:
pip install flask flask-cors pillow numpy opencv-python scikit-learn python-dotenv
```

## Step 3: Start Backend API

```bash
python app.py
```

**Expected Output:**
```
============================================================
GeoSentinel API Server
============================================================
Running on: http://localhost:5000
```

**Test the API:**
Open browser to: `http://localhost:5000/api/health`

Should see: `{"status": "healthy", "message": "GeoSentinel API is running"}`

## Step 4: Start Frontend (New Terminal)

```bash
cd geosentinal
npm run dev
```

**Expected Output:**
```
VITE v5.0.8  ready in 500 ms
➜  Local:   http://localhost:5173/
```

## Step 5: Test the Integration

1. Open `http://localhost:5173` in your browser
2. Click "Browse Disasters" section
3. You should see real disasters: Guatemala Volcano, Hurricane Florence, etc.
4. Click on a disaster to view before/after images
5. Click "Run AI Analysis" to test the model

## Troubleshooting

### Backend won't start

**Error: "No module named 'torch'"**
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

**Error: "Model file not found"**
- This is OK! The app will create a new model automatically
- For best results, place your trained `siamunet_model.pth` in the root directory

### Images not loading

**Check backend is running:**
```bash
curl http://localhost:5000/api/disasters
```

**Verify image paths:**
- Ensure `train/images/` and `test/images/` folders exist
- Check that disasters.json was generated successfully

### Frontend not connecting to backend

**Update API URL** (if needed):
Create `.env` file in `geosentinal/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

## Quick Test Commands

```bash
# Test data generation
python scripts/process_xbd_dataset.py

# Test backend API
curl http://localhost:5000/api/disasters

# Test image serving
curl http://localhost:5000/api/images/guatemala-volcano/before --output test.png

# Check if frontend is running
curl http://localhost:5173
```

## What You Should See

✅ **Disaster Browser**: 10+ real disasters from xBD
✅ **Real Images**: Actual satellite imagery from train/test folders
✅ **AI Analysis**: Model processes images (may be slow first time)
✅ **Statistics**: Charts showing real damage metrics

## File Structure

```
geosentinal/
├── backend/
│   ├── app.py              # ← Flask API server
│   ├── model_inference.py  # ← AI model
│   ├── data_processor.py   # ← Dataset handler
│   └── requirements.txt    # ← Dependencies
├── scripts/
│   └── process_xbd_dataset.py  # ← Data generator
├── src/data/
│   ├── disasters.json      # ← Generated metadata
│   └── statistics.json     # ← Generated stats
├── train/                  # ← Your xBD data
└── test/                   # ← Your xBD data
```

## Next Steps

Once everything is running:
1. Browse through the disasters
2. Compare before/after images
3. Run AI analysis on different disasters
4. Check the statistics section for real metrics

For detailed documentation, see `XBD_INTEGRATION_README.md`
