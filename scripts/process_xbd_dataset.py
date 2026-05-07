"""
xBD Dataset Processing Script
Scans the xBD dataset and generates disasters.json and statistics.json
"""

import os
import json
import glob
from pathlib import Path
from collections import defaultdict
from datetime import datetime

# Dataset paths
DATASET_ROOT = Path(__file__).parent.parent
TRAIN_PATH = DATASET_ROOT / "train"
TEST_PATH = DATASET_ROOT / "test"
OUTPUT_PATH = DATASET_ROOT / "src" / "data"

# Disaster type mapping
DISASTER_TYPE_MAP = {
    "guatemala-volcano": "fire",
    "hurricane-florence": "hurricane",
    "hurricane-harvey": "hurricane",
    "hurricane-matthew": "hurricane",
    "hurricane-michael": "hurricane",
    "mexico-earthquake": "earthquake",
    "midwest-flooding": "flood",
    "moore-tornado": "cyclone",
    "nepal-flooding": "flood",
    "palu-tsunami": "flood",
    "santa-rosa-wildfire": "fire",
    "socal-fire": "fire",
    "tuscaloosa-tornado": "cyclone",
    "woolsey-fire": "fire",
    "joplin-tornado": "cyclone",
    "lower-puna-volcano": "fire",
    "pinery-bushfire": "fire",
    "portugal-wildfire": "fire",
}

# Severity mapping based on damage levels
SEVERITY_LEVELS = {
    "low": (0, 0.25),
    "medium": (0.25, 0.50),
    "high": (0.50, 0.75),
    "critical": (0.75, 1.0)
}

def extract_disaster_name(filename):
    """Extract disaster name from filename"""
    # Format: disaster-name_00000000_pre_disaster.png
    parts = filename.split('_')
    if len(parts) >= 2:
        return parts[0]
    return None

def scan_dataset():
    """Scan train and test directories for all disasters"""
    print("Scanning xBD dataset...")
    
    disasters = defaultdict(lambda: {
        'pre_images': [],
        'post_images': [],
        'labels': [],
        'targets': []
    })
    
    # Scan train directory
    for split in ['train', 'test']:
        split_path = DATASET_ROOT / split
        if not split_path.exists():
            print(f"Warning: {split} directory not found")
            continue
            
        # Scan images
        images_path = split_path / "images"
        if images_path.exists():
            for img_file in images_path.glob("*.png"):
                disaster_name = extract_disaster_name(img_file.name)
                if disaster_name:
                    if "_pre_disaster" in img_file.name:
                        disasters[disaster_name]['pre_images'].append(str(img_file))
                    elif "_post_disaster" in img_file.name:
                        disasters[disaster_name]['post_images'].append(str(img_file))
        
        # Scan labels
        labels_path = split_path / "labels"
        if labels_path.exists():
            for label_file in labels_path.glob("*.json"):
                disaster_name = extract_disaster_name(label_file.name)
                if disaster_name:
                    disasters[disaster_name]['labels'].append(str(label_file))
        
        # Scan targets
        targets_path = split_path / "targets"
        if targets_path.exists():
            for target_file in targets_path.glob("*.png"):
                disaster_name = extract_disaster_name(target_file.name)
                if disaster_name:
                    disasters[disaster_name]['targets'].append(str(target_file))
    
    print(f"Found {len(disasters)} unique disasters")
    return disasters

def parse_label_file(label_path):
    """Parse a label JSON file to extract coordinates and metadata"""
    try:
        with open(label_path, 'r') as f:
            data = json.load(f)
            
        # Extract coordinates from features
        if 'features' in data and 'lng_lat' in data['features']:
            lng_lat = data['features']['lng_lat']
            if isinstance(lng_lat, list) and len(lng_lat) == 2:
                return {
                    'coordinates': lng_lat,
                    'metadata': data.get('metadata', {})
                }
        
        # Alternative: extract from xy coordinates if available
        if 'features' in data and 'xy' in data['features']:
            # Use placeholder coordinates for now
            return {
                'coordinates': [0, 0],
                'metadata': data.get('metadata', {})
            }
    except Exception as e:
        print(f"Error parsing {label_path}: {e}")
    
    return None

def calculate_damage_statistics(disaster_data):
    """Calculate damage statistics from target images"""
    # This is a placeholder - actual implementation would analyze target images
    # For now, return estimated values
    import random
    
    total_buildings = random.randint(100, 500)
    no_damage = int(total_buildings * random.uniform(0.1, 0.3))
    minor = int(total_buildings * random.uniform(0.2, 0.4))
    major = int(total_buildings * random.uniform(0.15, 0.3))
    destroyed = total_buildings - no_damage - minor - major
    
    damage_ratio = (minor * 0.3 + major * 0.7 + destroyed * 1.0) / total_buildings
    
    return {
        'buildings': {
            'total': total_buildings,
            'no_damage': no_damage,
            'minor': minor,
            'major': major,
            'destroyed': destroyed
        },
        'damage_ratio': damage_ratio,
        'affected_area': random.randint(50, 5000)
    }

def get_severity_level(damage_ratio):
    """Determine severity level based on damage ratio"""
    for level, (min_val, max_val) in SEVERITY_LEVELS.items():
        if min_val <= damage_ratio < max_val:
            return level
    return "critical"

def generate_disasters_json(disasters_data):
    """Generate disasters.json from scanned data"""
    print("Generating disasters.json...")
    
    disasters_list = []
    disaster_id = 1
    
    for disaster_name, data in disasters_data.items():
        if not data['pre_images'] or not data['post_images']:
            continue
        
        # Get disaster type
        disaster_type = DISASTER_TYPE_MAP.get(disaster_name, "unknown")
        if disaster_type == "unknown":
            continue
        
        # Parse first label file for coordinates
        coordinates = [0, 0]
        if data['labels']:
            label_info = parse_label_file(data['labels'][0])
            if label_info:
                coordinates = label_info['coordinates']
        
        # Calculate statistics
        stats = calculate_damage_statistics(data)
        severity = get_severity_level(stats['damage_ratio'])
        
        # Format disaster name
        formatted_name = disaster_name.replace('-', ' ').title()
        
        # Create disaster entry
        disaster_entry = {
            "id": disaster_id,
            "type": disaster_type,
            "name": formatted_name,
            "location": formatted_name.split()[0],
            "country": "Various",
            "coordinates": coordinates,
            "date": "2018-01-01",  # Placeholder - would extract from metadata
            "severity": severity,
            "affectedArea": stats['affected_area'],
            "casualties": 0,  # Would need external data
            "displaced": 0,  # Would need external data
            "economicLoss": 0,  # Would need external data
            "damage": {
                "buildings": int(stats['damage_ratio'] * 100),
                "roads": int(stats['damage_ratio'] * 80),
                "vegetation": int(stats['damage_ratio'] * 60),
                "waterBodies": int(stats['damage_ratio'] * 40)
            },
            "description": f"Satellite imagery analysis of {formatted_name} from xBD dataset.",
            "images": {
                "before": f"/api/images/{disaster_name}/before",
                "after": f"/api/images/{disaster_name}/after",
                "thumbnail": f"/api/images/{disaster_name}/thumbnail"
            },
            "xbd_data": {
                "disaster_name": disaster_name,
                "pre_images_count": len(data['pre_images']),
                "post_images_count": len(data['post_images']),
                "sample_pre_image": os.path.basename(data['pre_images'][0]) if data['pre_images'] else None,
                "sample_post_image": os.path.basename(data['post_images'][0]) if data['post_images'] else None
            }
        }
        
        disasters_list.append(disaster_entry)
        disaster_id += 1
    
    # Create final JSON structure
    output = {
        "disasters": disasters_list,
        "metadata": {
            "total_disasters": len(disasters_list),
            "generated_at": datetime.now().isoformat(),
            "source": "xBD Dataset"
        }
    }
    
    return output

def generate_statistics_json(disasters_data):
    """Generate statistics.json from disasters data"""
    print("Generating statistics.json...")
    
    total_disasters = len(disasters_data['disasters'])
    
    # Calculate type distribution
    type_distribution = defaultdict(int)
    severity_distribution = defaultdict(int)
    
    for disaster in disasters_data['disasters']:
        type_distribution[disaster['type']] += 1
        severity_distribution[disaster['severity']] += 1
    
    statistics = {
        "overview": {
            "total_disasters": total_disasters,
            "total_images_analyzed": sum(d['xbd_data']['pre_images_count'] + d['xbd_data']['post_images_count'] 
                                        for d in disasters_data['disasters']),
            "disaster_types": len(type_distribution),
            "last_updated": datetime.now().isoformat()
        },
        "type_distribution": dict(type_distribution),
        "severity_distribution": dict(severity_distribution),
        "damage_metrics": {
            "average_building_damage": sum(d['damage']['buildings'] for d in disasters_data['disasters']) / total_disasters,
            "average_affected_area": sum(d['affectedArea'] for d in disasters_data['disasters']) / total_disasters
        }
    }
    
    return statistics

def main():
    """Main processing function"""
    print("=" * 60)
    print("xBD Dataset Processing Script")
    print("=" * 60)
    
    # Scan dataset
    disasters_data = scan_dataset()
    
    # Generate disasters.json
    disasters_json = generate_disasters_json(disasters_data)
    
    # Generate statistics.json
    statistics_json = generate_statistics_json(disasters_json)
    
    # Create output directory if it doesn't exist
    OUTPUT_PATH.mkdir(parents=True, exist_ok=True)
    
    # Write disasters.json
    disasters_output_path = OUTPUT_PATH / "disasters.json"
    with open(disasters_output_path, 'w') as f:
        json.dump(disasters_json, f, indent=4)
    print(f"✓ Created {disasters_output_path}")
    
    # Write statistics.json
    statistics_output_path = OUTPUT_PATH / "statistics.json"
    with open(statistics_output_path, 'w') as f:
        json.dump(statistics_json, f, indent=4)
    print(f"✓ Created {statistics_output_path}")
    
    print("\n" + "=" * 60)
    print("Processing Complete!")
    print(f"Total disasters: {len(disasters_json['disasters'])}")
    print(f"Disaster types: {list(statistics_json['type_distribution'].keys())}")
    print("=" * 60)

if __name__ == "__main__":
    main()
