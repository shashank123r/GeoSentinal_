"""
Location API Routes
Endpoints for disaster location data, filtering, and search
"""

from flask import jsonify, request
import json
from pathlib import Path

# Data file path
DATA_DIR = Path(__file__).parent.parent / "src" / "data"
LOCATIONS_FILE = DATA_DIR / "disaster-locations.json"

def load_locations():
    """Load disaster locations from JSON file"""
    try:
        with open(LOCATIONS_FILE, 'r') as f:
            data = json.load(f)
            # Extract locations array from wrapped structure
            return data.get('locations', []) if isinstance(data, dict) else data
    except FileNotFoundError:
        return []

def register_location_routes(app, data_processor=None):
    """Register location-related routes"""
    
    @app.route('/api/locations', methods=['GET'])
    def get_locations():
        """Get all disaster locations"""
        locations = load_locations()
        return jsonify(locations)
    
    @app.route('/api/locations/filter', methods=['GET'])
    def filter_locations():
        """Filter locations by type and severity"""
        locations = load_locations()
        
        # Get filter parameters
        disaster_type = request.args.get('type')
        severity = request.args.get('severity')
        country = request.args.get('country')
        
        # Apply filters
        filtered = locations
        if disaster_type:
            filtered = [l for l in filtered if l['type'] == disaster_type]
        if severity:
            filtered = [l for l in filtered if l['severity'] == severity]
        if country:
            filtered = [l for l in filtered if l['country'] == country]
        
        return jsonify(filtered)
    
    @app.route('/api/locations/search', methods=['GET'])
    def search_locations():
        """Search locations by name"""
        locations = load_locations()
        query = request.args.get('q', '').lower()
        
        if not query:
            return jsonify(locations)
        
        # Search in name and location fields
        results = [
            l for l in locations
            if query in l['name'].lower() or query in l['location'].lower()
        ]
        
        return jsonify(results)
    
    @app.route('/api/locations/bounds', methods=['GET'])
    def get_bounds():
        """Calculate map bounds for all locations"""
        locations = load_locations()
        
        if not locations:
            return jsonify({
                'north': 90,
                'south': -90,
                'east': 180,
                'west': -180
            })
        
        lats = [l['coordinates'][0] for l in locations]
        lons = [l['coordinates'][1] for l in locations]
        
        return jsonify({
            'north': max(lats),
            'south': min(lats),
            'east': max(lons),
            'west': min(lons)
        })
    
    @app.route('/api/locations/heatmap', methods=['GET'])
    def get_heatmap_data():
        """Get heatmap data for visualization"""
        locations = load_locations()
        
        # Format for heatmap: [lat, lon, intensity]
        heatmap_data = [
            [l['coordinates'][0], l['coordinates'][1], l.get('casualties', 1)]
            for l in locations
        ]
        
        return jsonify(heatmap_data)
