# GeoSentinel - xBD Dataset Integration

## Quick Start Guide

### 1. Generate Dataset Metadata

First, process the xBD dataset to generate disasters.json and statistics.json:

```bash
python scripts/process_xbd_dataset.py
```

This will scan the `train/` and `test/` directories and create:
- `src/data/disasters.json` - Real disaster metadata from xBD
- `src/data/statistics.json` - Aggregated statistics

### 2. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Start the Backend API

```bash
cd backend
python app.py
```

The API will start on `http://localhost:5000`

### 4. Start the Frontend

In a new terminal:

```bash
npm install
npm run dev
```

The React app will start on `http://localhost:5173`

## API Endpoints

- `GET /api/disasters` - List all disasters
- `GET /api/disaster/<id>` - Get disaster by ID
- `GET /api/disaster/name/<name>` - Get disaster by xBD name
- `GET /api/images/<disaster_name>/<type>` - Get image (before/after/thumbnail)
- `POST /api/analyze` - Run AI analysis on disaster
- `GET /api/statistics` - Get overall statistics

## Features

✅ Real xBD dataset integration
✅ Flask API serving images and AI inference
✅ SiamUnet model for damage detection
✅ Before/after satellite image comparison
✅ Real-time AI damage analysis
✅ Interactive disaster browser
✅ Statistics from actual dataset

## Dataset Structure

```
geosentinal/
├── train/
│   ├── images/     # Before/after disaster images
│   ├── labels/     # JSON metadata files
│   └── targets/    # Damage masks
├── test/
│   ├── images/
│   ├── labels/
│   └── targets/
├── backend/
│   ├── app.py              # Flask API server
│   ├── model_inference.py  # AI model integration
│   ├── data_processor.py   # Dataset operations
│   └── requirements.txt
├── scripts/
│   └── process_xbd_dataset.py  # Data processing script
└── src/
    ├── data/
    │   ├── disasters.json      # Generated from xBD
    │   └── statistics.json     # Generated statistics
    └── utils/
        └── api.js              # Frontend API client
```

## Troubleshooting

### Backend Issues

**Model not found:**
- The app will create a new model if `siamunet_model.pth` is not found
- For best results, ensure the trained model is in the root directory

**Images not loading:**
- Check that train/test directories exist
- Verify image paths in disasters.json
- Check CORS settings in backend/.env

### Frontend Issues

**API connection failed:**
- Ensure backend is running on port 5000
- Check VITE_API_URL in .env (if using custom URL)
- Verify CORS origins in backend/.env

**Disasters not showing:**
- Run `python scripts/process_xbd_dataset.py` to generate disasters.json
- Check that src/data/disasters.json exists and has data

## Development

### Adding New Disasters

1. Add images to `train/images/` or `test/images/`
2. Add corresponding labels to `train/labels/` or `test/labels/`
3. Run `python scripts/process_xbd_dataset.py` to regenerate metadata
4. Restart the backend server

### Modifying AI Model

Edit `backend/model_inference.py` to:
- Change model architecture
- Adjust preprocessing
- Modify damage classification
- Update heatmap generation

## Production Deployment

1. Build frontend: `npm run build`
2. Set `FLASK_ENV=production` in backend/.env
3. Use a production WSGI server (gunicorn, uwsgi)
4. Configure reverse proxy (nginx, apache)
5. Set up SSL certificates

## License

MIT License - See LICENSE file for details
