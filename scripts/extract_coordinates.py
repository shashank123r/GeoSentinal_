"""
Extract geographic coordinates from xBD dataset label files
Parses JSON label files to extract building coordinates and calculate disaster centroids
"""

import json
import os
from pathlib import Path
from collections import defaultdict
import numpy as np

# Dataset paths
DATASET_ROOT = Path(__file__).parent.parent
XBD_PATH = DATASET_ROOT / "xBD"
OUTPUT_FILE = DATASET_ROOT / "src" / "data" / "coordinates_data.json"

def parse_label_file(label_path):
    """Parse a single label file and extract coordinates"""
    try:
        with open(label_path, 'r') as f:
            data = json.load(f)
        
        # Extract coordinates from WKT polygon format
        features = data.get('features', {}).get('xy', [])
        if not features:
            return None
        
        coordinates = []
        for feature in features:
            wkt = feature.get('wkt', '')
            if 'POLYGON' in wkt:
                # Extract coordinates from WKT POLYGON format
                coords_str = wkt.replace('POLYGON ((', '').replace('))', '')
                coord_pairs = coords_str.split(', ')
                for pair in coord_pairs:
                    try:
                        x, y = map(float, pair.split())
                        coordinates.append([y, x])  # [lat, lon]
                    except:
                        continue
        
        if coordinates:
            # Calculate centroid
            lats = [c[0] for c in coordinates]
            lons = [c[1] for c in coordinates]
            centroid = [np.mean(lats), np.mean(lons)]
            
            return {
                'coordinates': coordinates,
                'centroid': centroid,
                'bounds': {
                    'north': max(lats),
                    'south': min(lats),
                    'east': max(lons),
                    'west': min(lons)
                }
            }
    except Exception as e:
        print(f"Error parsing {label_path}: {e}")
    
    return None

def extract_all_coordinates():
    """Extract coordinates from all label files in the dataset"""
    disaster_data = defaultdict(lambda: {
        'images': [],
        'all_coordinates': [],
        'centroids': []
    })
    
    # Process both train and test folders
    for split in ['train', 'test']:
        labels_dir = XBD_PATH / split / 'labels'
        if not labels_dir.exists():
            print(f"Warning: {labels_dir} does not exist")
            continue
        
        # Iterate through all label files
        for label_file in labels_dir.glob('*.json'):
            # Extract disaster name from filename
            filename = label_file.stem
            parts = filename.split('_')
            if len(parts) >= 2:
                disaster_name = parts[0]
            else:
                continue
            
            # Parse label file
            label_info = parse_label_file(label_file)
            if label_info:
                disaster_data[disaster_name]['images'].append(str(label_file))
                disaster_data[disaster_name]['all_coordinates'].extend(label_info['coordinates'])
                disaster_data[disaster_name]['centroids'].append(label_info['centroid'])
    
    # Calculate overall centroids for each disaster
    result = {}
    for disaster_name, data in disaster_data.items():
        if data['centroids']:
            # Calculate average centroid
            all_lats = [c[0] for c in data['centroids']]
            all_lons = [c[1] for c in data['centroids']]
            overall_centroid = [np.mean(all_lats), np.mean(all_lons)]
            
            result[disaster_name] = {
                'centroid': overall_centroid,
                'image_count': len(data['images']),
                'building_count': len(data['all_coordinates']),
                'bounds': {
                    'north': max(all_lats),
                    'south': min(all_lats),
                    'east': max(all_lons),
                    'west': min(all_lons)
                }
            }
    
    return result

def main():
    print("Extracting coordinates from xBD dataset...")
    
    # Extract coordinates
    coordinates_data = extract_all_coordinates()
    
    # Save to JSON file
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(coordinates_data, f, indent=2)
    
    print(f"\nExtracted coordinates for {len(coordinates_data)} disasters")
    print(f"Saved to: {OUTPUT_FILE}")
    
    # Print summary
    total_images = sum(d['image_count'] for d in coordinates_data.values())
    total_buildings = sum(d['building_count'] for d in coordinates_data.values())
    print(f"Total images: {total_images}")
    print(f"Total buildings: {total_buildings}")

if __name__ == "__main__":
    main()
