"""
Flask API Server for GeoSentinel
Serves xBD dataset images and AI model inference
"""

from flask import Flask, jsonify, send_file, request
from flask_cors import CORS
from pathlib import Path
import os
from dotenv import load_dotenv
import io
from PIL import Image
import numpy as np
import base64

from data_processor import XBDDataProcessor
from model_inference import ModelInference
from location_routes import register_location_routes
from analytics_routes import register_analytics_routes

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(',')
    }
})

# Initialize processors
DATASET_PATH = Path(os.getenv('DATASET_PATH', '../'))
data_processor = XBDDataProcessor(DATASET_PATH)
model_inference = ModelInference(os.getenv('MODEL_PATH'))

# Register location routes
register_location_routes(app, data_processor)

# Register analytics routes
register_analytics_routes(app, data_processor)

# Cache for model
model_loaded = False


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'GeoSentinel API is running'
    })


@app.route('/api/disasters', methods=['GET'])
def get_disasters():
    """Get all disasters from xBD dataset"""
    try:
        disasters_data = data_processor.load_disasters_metadata()
        return jsonify(disasters_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/disaster/<int:disaster_id>', methods=['GET'])
def get_disaster(disaster_id):
    """Get specific disaster by ID"""
    try:
        disaster = data_processor.get_disaster_by_id(disaster_id)
        if disaster:
            return jsonify(disaster)
        return jsonify({'error': 'Disaster not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/disaster/name/<disaster_name>', methods=['GET'])
def get_disaster_by_name(disaster_name):
    """Get disaster by xBD name"""
    try:
        disaster = data_processor.get_disaster_by_name(disaster_name)
        if disaster:
            # Add image pairs info
            pairs = data_processor.get_all_image_pairs(disaster_name)
            disaster['image_pairs'] = len(pairs)
            return jsonify(disaster)
        return jsonify({'error': 'Disaster not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/images/<disaster_name>/<image_type>', methods=['GET'])
def get_image(disaster_name, image_type):
    """Serve disaster image (before/after/thumbnail)"""
    try:
        # Check if image_id is provided (specific image request)
        image_id = request.args.get('image_id')
        index = int(request.args.get('index', 0))
        
        if image_type == 'thumbnail':
            # Get before image and create thumbnail
            if image_id:
                image_path = data_processor.get_image_path_by_id(disaster_name, 'before', image_id)
            else:
                image_path = data_processor.get_image_path(disaster_name, 'before', index)
            
            if image_path and image_path.exists():
                thumbnail = data_processor.create_thumbnail(image_path)
                if thumbnail:
                    img_io = io.BytesIO()
                    thumbnail.save(img_io, 'PNG')
                    img_io.seek(0)
                    return send_file(img_io, mimetype='image/png')
        else:
            # Get actual image - use image_id if provided, otherwise use index
            if image_id:
                image_path = data_processor.get_image_path_by_id(disaster_name, image_type, image_id)
            else:
                image_path = data_processor.get_image_path(disaster_name, image_type, index)
            
            if image_path and image_path.exists():
                return send_file(image_path, mimetype='image/png')
        
        return jsonify({'error': 'Image not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/images/<disaster_name>/pairs', methods=['GET'])
def get_image_pairs(disaster_name):
    """Get all image pairs for a disaster"""
    try:
        pairs = data_processor.get_all_image_pairs(disaster_name)
        # Convert paths to API endpoints
        api_pairs = []
        for i, pair in enumerate(pairs):
            api_pairs.append({
                'index': i,
                'before': f'/api/images/{disaster_name}/before?index={i}',
                'after': f'/api/images/{disaster_name}/after?index={i}',
                'id': pair['id']
            })
        return jsonify({'pairs': api_pairs, 'total': len(api_pairs)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/analyze', methods=['POST'])
def analyze_disaster():
    """Run AI analysis on disaster images"""
    global model_loaded
    
    try:
        data = request.get_json()
        disaster_name = data.get('disaster_name')
        index = data.get('index', 0)
        image_id = data.get('image_id')
        
        if not disaster_name:
            return jsonify({'error': 'disaster_name is required'}), 400
        
        # Get image paths
        if image_id:
            pre_image = data_processor.get_image_path_by_id(disaster_name, 'before', image_id)
            post_image = data_processor.get_image_path_by_id(disaster_name, 'after', image_id)
        else:
            pre_image = data_processor.get_image_path(disaster_name, 'before', index)
            post_image = data_processor.get_image_path(disaster_name, 'after', index)
        
        if not pre_image or not post_image:
            return jsonify({'error': 'Images not found'}), 404
        
        # Load model if not loaded
        if not model_loaded:
            print("Loading AI model...")
            model_inference.load_model()
            model_loaded = True
        
        # Run analysis
        print(f"Analyzing {disaster_name}...")
        results = model_inference.analyze_disaster(str(pre_image), str(post_image))
        
        # Convert numpy arrays to base64 for transmission
        def array_to_base64(arr):
            if isinstance(arr, list):
                arr = np.array(arr, dtype=np.uint8)
            img = Image.fromarray(arr.astype(np.uint8))
            buffered = io.BytesIO()
            img.save(buffered, format="PNG")
            return base64.b64encode(buffered.getvalue()).decode()
        
        # Prepare response
        response = {
            'disaster_name': disaster_name,
            'index': index,
            'statistics': results['statistics'],
            'severity_level': results['severity_level'],
            'heatmap': array_to_base64(results['heatmap']),
            'overlay': array_to_base64(results['overlay'])
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Error in analysis: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get overall statistics"""
    try:
        # Load statistics.json if it exists
        stats_path = DATASET_PATH / "src" / "data" / "statistics.json"
        if stats_path.exists():
            import json
            with open(stats_path, 'r') as f:
                stats = json.load(f)
            return jsonify(stats)
        
        # Otherwise generate basic stats
        disasters_data = data_processor.load_disasters_metadata()
        disasters = disasters_data.get('disasters', [])
        
        stats = {
            'overview': {
                'total_disasters': len(disasters),
                'disaster_types': len(set(d['type'] for d in disasters)),
            },
            'type_distribution': {},
            'severity_distribution': {}
        }
        
        # Calculate distributions
        for disaster in disasters:
            dtype = disaster.get('type', 'unknown')
            severity = disaster.get('severity', 'unknown')
            stats['type_distribution'][dtype] = stats['type_distribution'].get(dtype, 0) + 1
            stats['severity_distribution'][severity] = stats['severity_distribution'].get(severity, 0) + 1
        
        return jsonify(stats)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/disaster/<disaster_name>/statistics', methods=['GET'])
def get_disaster_statistics(disaster_name):
    """Get statistics for specific disaster"""
    try:
        stats = data_processor.get_disaster_statistics(disaster_name)
        if stats:
            return jsonify(stats)
        return jsonify({'error': 'Disaster not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    print("=" * 60)
    print("GeoSentinel API Server")
    print("=" * 60)
    print(f"Dataset path: {DATASET_PATH}")
    print(f"Model path: {os.getenv('MODEL_PATH')}")
    print(f"Running on: http://localhost:{port}")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=port, debug=debug)
