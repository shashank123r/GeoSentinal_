"""
Enhanced xBD Dataset Location Extractor
Extracts ALL disaster locations from xBD dataset label files with comprehensive metadata
Creates detailed disaster-locations.json with coordinates, damage stats, and boundaries
"""

import os
import json
from pathlib import Path
from collections import defaultdict
import numpy as np
from datetime import datetime
from disaster_metadata import DISASTER_METADATA

# Dataset paths
DATASET_ROOT = Path(__file__).parent.parent
TRAIN_PATH = DATASET_ROOT / "train"
TEST_PATH = DATASET_ROOT / "test"
OUTPUT_PATH = DATASET_ROOT / "src" / "data"
DISASTERS_FILE = OUTPUT_PATH / "disasters.json"

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

def extract_disaster_name(filename):
    """Extract disaster name from filename"""
    parts = filename.split('_')
    if len(parts) >= 2:
        return parts[0]
    return None

def parse_label_file(label_path):
    """Parse a label JSON file and extract coordinates and building data"""
    try:
        with open(label_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        result = {
            'coordinates': None,
            'building_count': 0,
            'buildings': [],
            'damage_counts': {
                'no-damage': 0,
                'minor-damage': 0,
                'major-damage': 0,
                'destroyed': 0
            },
            'metadata': data.get('metadata', {})
        }
        
        # Extract coordinates from lng_lat field
        features = data.get('features', {})
        lng_lat_features = features.get('lng_lat', [])
        
        if lng_lat_features and len(lng_lat_features) > 0:
            # Use first building's coordinates or calculate centroid
            all_coords = []
            
            for feature in lng_lat_features:
                wkt = feature.get('wkt', '')
                if 'POLYGON' in wkt:
                    # Extract coordinates from WKT POLYGON format
                    coords_str = wkt.replace('POLYGON ((', '').replace('))', '')
                    coord_pairs = coords_str.split(', ')
                    for pair in coord_pairs:
                        try:
                            lon, lat = map(float, pair.split())
                            all_coords.append([lat, lon])
                        except:
                            continue
                
                # Count building damage types
                subtype = feature.get('properties', {}).get('subtype', 'no-damage')
                if subtype in result['damage_counts']:
                    result['damage_counts'][subtype] += 1
                
                result['buildings'].append({
                    'uid': feature.get('properties', {}).get('uid'),
                    'subtype': subtype
                })
            
            # Calculate centroid from all coordinates
            if all_coords:
                lats = [c[0] for c in all_coords]
                lons = [c[1] for c in all_coords]
                result['coordinates'] = [np.mean(lats), np.mean(lons)]
                result['building_count'] = len(lng_lat_features)
                result['bounds'] = {
                    'north': max(lats),
                    'south': min(lats),
                    'east': max(lons),
                    'west': min(lons)
                }
        
        return result
        
    except Exception as e:
        print(f"Error parsing {label_path}: {e}")
        return None

def calculate_severity(damage_counts, total_buildings):
    """Calculate severity level based on damage distribution"""
    if total_buildings == 0:
        return "low"
    
    # Weight damage types: minor=0.25, major=0.5, destroyed=1.0
    weighted_damage = (
        damage_counts['minor-damage'] * 0.25 +
        damage_counts['major-damage'] * 0.5 +
        damage_counts['destroyed'] * 1.0
    )
    
    destruction_rate = weighted_damage / total_buildings
    
    if destruction_rate >= 0.75:
        return "critical"
    elif destruction_rate >= 0.50:
        return "high"
    elif destruction_rate >= 0.25:
        return "medium"
    else:
        return "low"

def extract_all_locations():
    """Extract all disaster locations from xBD dataset"""
    print("=" * 70)
    print("xBD Dataset: Extracting ALL Disaster Locations")
    print("=" * 70)
    
    # Load existing disasters.json for metadata
    disasters_metadata = {}
    if DISASTERS_FILE.exists():
        with open(DISASTERS_FILE, 'r') as f:
            disasters_data = json.load(f)
            for disaster in disasters_data.get('disasters', []):
                disaster_name = disaster.get('xbd_data', {}).get('disaster_name')
                if disaster_name:
                    disasters_metadata[disaster_name] = disaster
    
    # Scan both train and test directories
    all_locations = []
    location_id = 1
    disaster_stats = defaultdict(lambda: {
        'total_images': 0,
        'total_buildings': 0,
        'locations': []
    })
    
    for split in ['train', 'test']:
        labels_path = DATASET_ROOT / split / "labels"
        if not labels_path.exists():
            print(f"Warning: {labels_path} not found, skipping...")
            continue
        
        print(f"\nScanning {split}/labels/...")
        label_files = list(labels_path.glob("*.json"))
        print(f"Found {len(label_files)} label files")
        
        for idx, label_file in enumerate(label_files, 1):
            if idx % 100 == 0:
                print(f"  Processed {idx}/{len(label_files)} files...")
            
            # Extract disaster name
            disaster_name = extract_disaster_name(label_file.stem)
            if not disaster_name or disaster_name not in DISASTER_TYPE_MAP:
                continue
            
            # Parse label file
            label_data = parse_label_file(label_file)
            if not label_data or not label_data['coordinates']:
                continue
            
            # Get disaster metadata
            disaster_meta = disasters_metadata.get(disaster_name, {})
            metadata_fallback = DISASTER_METADATA.get(disaster_meta.get('id', 0), {})
            
            # Calculate damage statistics
            total_buildings = label_data['building_count']
            damage_counts = label_data['damage_counts']
            severity = calculate_severity(damage_counts, total_buildings)
            destruction_rate = 0
            if total_buildings > 0:
                weighted_damage = (
                    damage_counts['minor-damage'] * 0.25 +
                    damage_counts['major-damage'] * 0.5 +
                    damage_counts['destroyed'] * 1.0
                )
                destruction_rate = (weighted_damage / total_buildings) * 100
            
            # Create location entry
            location = {
                "id": location_id,
                "disaster_id": disaster_meta.get('id', 0),
                "image_id": label_file.stem,
                "name": disaster_meta.get('name') or metadata_fallback.get('name', disaster_name.replace('-', ' ').title()),
                "type": DISASTER_TYPE_MAP.get(disaster_name, 'unknown'),
                "severity": severity,
                "coordinates": label_data['coordinates'],
                "location": disaster_meta.get('location') or metadata_fallback.get('location', 'Unknown'),
                "country": disaster_meta.get('country') or metadata_fallback.get('country', 'Unknown'),
                "date": disaster_meta.get('date') or metadata_fallback.get('date', '2018-01-01'),
                "buildingsAnalyzed": total_buildings,
                "damageBreakdown": {
                    "noDamage": damage_counts['no-damage'],
                    "minorDamage": damage_counts['minor-damage'],
                    "majorDamage": damage_counts['major-damage'],
                    "destroyed": damage_counts['destroyed']
                },
                "destructionRate": round(destruction_rate, 2),
                "casualties": disaster_meta.get('casualties', 0),
                "displaced": disaster_meta.get('displaced', 0),
                "economicLoss": disaster_meta.get('economicLoss', 0),
                "description": disaster_meta.get('description', f'Satellite imagery analysis for {disaster_name}'),
                "bounds": label_data.get('bounds'),
                "disaster_name": disaster_name,
                "xbd_data": {
                    "disaster_name": disaster_name,
                    "image_id": label_file.stem,
                    "sample_pre_image": f"{label_file.stem.replace('_post_disaster', '_pre_disaster')}.png",
                    "sample_post_image": f"{label_file.stem}.png" if '_post_' in label_file.stem else f"{label_file.stem.replace('_pre_disaster', '_post_disaster')}.png",
                    "metadata": label_data['metadata']
                }
            }
            
            all_locations.append(location)
            disaster_stats[disaster_name]['total_images'] += 1
            disaster_stats[disaster_name]['total_buildings'] += total_buildings
            disaster_stats[disaster_name]['locations'].append(location)
            location_id += 1
    
    # Calculate disaster-level centroids and bounds
    disaster_summaries = []
    for disaster_name, stats in disaster_stats.items():
        if stats['locations']:
            # Calculate centroid from all locations
            all_lats = [loc['coordinates'][0] for loc in stats['locations']]
            all_lons = [loc['coordinates'][1] for loc in stats['locations']]
            
            disaster_summaries.append({
                'disaster_name': disaster_name,
                'centroid': [np.mean(all_lats), np.mean(all_lons)],
                'bounds': {
                    'north': max(all_lats),
                    'south': min(all_lats),
                    'east': max(all_lons),
                    'west': min(all_lons)
                },
                'total_images': stats['total_images'],
                'total_buildings': stats['total_buildings']
            })
    
    print("\n" + "=" * 70)
    print("Extraction Complete!")
    print("=" * 70)
    print(f"\nTotal locations extracted: {len(all_locations)}")
    print(f"Unique disasters: {len(disaster_stats)}")
    print(f"\nLocations per disaster:")
    for disaster_name, stats in sorted(disaster_stats.items()):
        print(f"  {disaster_name}: {stats['total_images']} locations, {stats['total_buildings']} buildings")
    
    return all_locations, disaster_summaries

def save_locations(locations, summaries):
    """Save locations to JSON files"""
    # Save full locations
    OUTPUT_PATH.mkdir(parents=True, exist_ok=True)
    
    locations_file = OUTPUT_PATH / "disaster-locations.json"
    with open(locations_file, 'w') as f:
        json.dump(locations, f, indent=2)
    print(f"\n✓ Saved {len(locations)} locations to {locations_file}")
    
    # Save disaster summaries
    summaries_file = OUTPUT_PATH / "disaster-summaries.json"
    with open(summaries_file, 'w') as f:
        json.dump(summaries, f, indent=2)
    print(f"✓ Saved {len(summaries)} disaster summaries to {summaries_file}")

def main():
    """Main execution"""
    locations, summaries = extract_all_locations()
    save_locations(locations, summaries)
    print("\n" + "=" * 70)
    print("Data extraction complete! Ready for map visualization.")
    print("=" * 70)

if __name__ == "__main__":
    main()
