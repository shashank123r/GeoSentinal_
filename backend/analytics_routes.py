"""
Analytics API Routes
Endpoints for dashboard analytics and statistics
"""

from flask import jsonify, request
import json
from pathlib import Path

# Data file path
DATA_DIR = Path(__file__).parent.parent / "src" / "data"
ANALYTICS_FILE = DATA_DIR / "dashboard_analytics.json"

def load_analytics():
    """Load analytics data from JSON file"""
    try:
        with open(ANALYTICS_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def register_analytics_routes(app, data_processor=None):
    """Register analytics-related routes"""
    
    @app.route('/api/analytics/kpis', methods=['GET'])
    def get_kpis():
        """Get executive KPI metrics"""
        analytics = load_analytics()
        return jsonify(analytics.get('kpis', {}))
    
    @app.route('/api/analytics/type-distribution', methods=['GET'])
    def get_type_distribution():
        """Get disaster type distribution"""
        analytics = load_analytics()
        return jsonify(analytics.get('type_distribution', {}))
    
    @app.route('/api/analytics/damage-breakdown', methods=['GET'])
    def get_damage_breakdown():
        """Get damage breakdown by type"""
        analytics = load_analytics()
        disaster_type = request.args.get('type')
        
        # Return type distribution for now
        return jsonify(analytics.get('type_distribution', {}))
    
    @app.route('/api/analytics/timeline', methods=['GET'])
    def get_timeline():
        """Get temporal trends"""
        analytics = load_analytics()
        return jsonify(analytics.get('temporal_trends', {}))
    
    @app.route('/api/analytics/geographic', methods=['GET'])
    def get_geographic():
        """Get geographic distribution"""
        analytics = load_analytics()
        return jsonify(analytics.get('geographic_distribution', {}))
    
    @app.route('/api/analytics/top-disasters', methods=['GET'])
    def get_top_disasters():
        """Get top disasters by metric"""
        analytics = load_analytics()
        metric = request.args.get('metric', 'casualties')
        
        top_disasters = analytics.get('top_disasters', {})
        
        if metric == 'casualties':
            return jsonify(top_disasters.get('by_casualties', []))
        elif metric == 'economic_loss':
            return jsonify(top_disasters.get('by_economic_loss', []))
        elif metric == 'displaced':
            return jsonify(top_disasters.get('by_displaced', []))
        elif metric == 'area':
            return jsonify(top_disasters.get('by_area', []))
        else:
            return jsonify(top_disasters.get('by_casualties', []))
    
    @app.route('/api/analytics/regional', methods=['GET'])
    def get_regional():
        """Get regional analysis"""
        analytics = load_analytics()
        return jsonify(analytics.get('geographic_distribution', {}))
    
    @app.route('/api/analytics/events', methods=['GET'])
    def get_events():
        """Get detailed events with filtering"""
        analytics = load_analytics()
        events = analytics.get('events', [])
        
        # Get filter parameters
        disaster_type = request.args.get('type')
        severity = request.args.get('severity')
        year = request.args.get('year')
        country = request.args.get('country')
        
        # Apply filters
        filtered = events
        if disaster_type:
            filtered = [e for e in filtered if e['type'] == disaster_type]
        if severity:
            filtered = [e for e in filtered if e['severity'] == severity]
        if year:
            filtered = [e for e in filtered if e['date'].startswith(year)]
        if country:
            filtered = [e for e in filtered if e['country'] == country]
        
        return jsonify({
            'events': filtered,
            'total': len(filtered)
        })
    
    @app.route('/api/analytics/summary', methods=['GET'])
    def get_summary():
        """Get complete analytics summary"""
        analytics = load_analytics()
        return jsonify({
            'metadata': analytics.get('metadata', {}),
            'kpis': analytics.get('kpis', {}),
            'type_distribution': analytics.get('type_distribution', {}),
            'temporal_trends': analytics.get('temporal_trends', {}),
            'geographic_distribution': analytics.get('geographic_distribution', {})
        })
