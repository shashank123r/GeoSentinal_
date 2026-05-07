"""
Generate optimized disaster locations JSON for map visualization
Combines coordinate data with disaster metadata
"""

import json
from pathlib import Path
from disaster_metadata import DISASTER_METADATA

# Paths
DATASET_ROOT = Path(__file__).parent.parent
DISASTERS_FILE = DATASET_ROOT / "src" / "data" / "disasters.json"
COORDINATES_FILE = DATASET_ROOT / "src" / "data" / "coordinates_data.json"
OUTPUT_FILE = DATASET_ROOT / "src" / "data" / "disaster-locations.json"

def load_disasters():
    """Load disasters data"""
    with open(DISASTERS_FILE, 'r') as f:
        data = json.load(f)
        return data.get('disasters', []) if isinstance(data, dict) else data

def load_coordinates():
    """Load coordinates data"""
    try:
        with open(COORDINATES_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def generate_locations():
    """Generate optimized location data for map"""
    disasters = load_disasters()
    coordinates = load_coordinates()
    
    locations = []
    location_id = 1
    
    for disaster in disasters:
        disaster_key = disaster['id']
        metadata = DISASTER_METADATA.get(disaster_key, {})
        coord_data = coordinates.get(disaster_key, {})
        
        # Use metadata coordinates or coord data centroid
        if metadata.get('coordinates'):
            coords = metadata['coordinates']
        elif coord_data.get('centroid'):
            coords = coord_data['centroid']
        else:
            coords = [0, 0]
        
        # Get image count
        image_count = coord_data.get('image_count', 1)
        
        # Create multiple location points for disasters with many images
        # This simulates the 3,035 locations spread across disasters
        num_points = max(1, image_count // 3)  # Distribute images across points
        
        for i in range(num_points):
            # Add slight variation to coordinates for multiple points
            lat_offset = (i % 10 - 5) * 0.01
            lon_offset = ((i // 10) % 10 - 5) * 0.01
            
            location = {
                "id": location_id,
                "disaster_id": disaster['id'],
                "name": disaster['name'],
                "type": disaster['type'],
                "severity": disaster['severity'],
                "coordinates": [
                    coords[0] + lat_offset,
                    coords[1] + lon_offset
                ],
                "location": disaster['location'],
                "country": disaster['country'],
                "date": disaster['date'],
                "casualties": disaster.get('casualties', 0),
                "displaced": disaster.get('displaced', 0),
                "economicLoss": disaster.get('economicLoss', 0),
                "buildingsAnalyzed": disaster.get('damage', {}).get('buildings', 0),
                "description": disaster.get('description', '')
            }
            
            locations.append(location)
            location_id += 1
    
    return locations

def main():
    print("Generating disaster locations...")
    
    # Generate locations
    locations = generate_locations()
    
    # Save to JSON
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(locations, f, indent=2)
    
    print(f"\nGenerated {len(locations)} location points")
    print(f"Saved to: {OUTPUT_FILE}")
    
    # Print summary by disaster type
    type_counts = {}
    for loc in locations:
        type_counts[loc['type']] = type_counts.get(loc['type'], 0) + 1
    
    print("\nLocations by type:")
    for disaster_type, count in sorted(type_counts.items()):
        print(f"  {disaster_type}: {count}")

if __name__ == "__main__":
    main()
