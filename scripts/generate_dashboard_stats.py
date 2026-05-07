"""
Generate comprehensive dashboard analytics from xBD dataset
Calculates KPIs, distributions, trends, and statistics
"""

import json
from pathlib import Path
from datetime import datetime
from collections import defaultdict
from disaster_metadata import DISASTER_METADATA

# Paths
DATASET_ROOT = Path(__file__).parent.parent
DISASTERS_FILE = DATASET_ROOT / "src" / "data" / "disasters.json"
LOCATIONS_FILE = DATASET_ROOT / "src" / "data" / "disaster-locations.json"
COORDINATES_FILE = DATASET_ROOT / "src" / "data" / "coordinates_data.json"
OUTPUT_FILE = DATASET_ROOT / "src" / "data" / "dashboard_analytics.json"

def load_data():
    """Load all required data files"""
    with open(DISASTERS_FILE, 'r') as f:
        disasters = json.load(f)
    
    try:
        with open(LOCATIONS_FILE, 'r') as f:
            locations = json.load(f)
    except FileNotFoundError:
        locations = []
    
    try:
        with open(COORDINATES_FILE, 'r') as f:
            coordinates = json.load(f)
    except FileNotFoundError:
        coordinates = {}
    
    return disasters, locations, coordinates

def calculate_kpis(disasters, locations, coordinates):
    """Calculate executive KPIs"""
    total_buildings = sum(coord.get('building_count', 0) for coord in coordinates.values())
    total_casualties = sum(DISASTER_METADATA.get(d['id'], {}).get('casualties', 0) for d in disasters)
    total_displaced = sum(DISASTER_METADATA.get(d['id'], {}).get('displaced', 0) for d in disasters)
    total_economic_loss = sum(DISASTER_METADATA.get(d['id'], {}).get('economic_loss', 0) for d in disasters)
    
    # Calculate average damage rate
    damage_rates = [d.get('damage', {}).get('buildings', 0) for d in disasters]
    avg_damage_rate = sum(damage_rates) / len(damage_rates) if damage_rates else 0
    
    # Find most severe type
    type_severity = defaultdict(int)
    for d in disasters:
        if d['severity'] in ['high', 'critical']:
            type_severity[d['type']] += 1
    most_severe_type = max(type_severity.items(), key=lambda x: x[1])[0] if type_severity else 'flood'
    
    # Count unique countries
    countries = set(DISASTER_METADATA.get(d['id'], {}).get('country', 'Unknown') for d in disasters)
    
    return {
        "total_disasters": len(disasters),
        "total_buildings": total_buildings,
        "total_casualties": total_casualties,
        "total_displaced": total_displaced,
        "total_economic_loss": round(total_economic_loss, 1),
        "avg_damage_rate": round(avg_damage_rate, 1),
        "most_severe_type": most_severe_type.capitalize(),
        "countries_affected": len(countries),
        "total_locations": len(locations),
        "total_images": len(locations)
    }

def calculate_type_distribution(disasters):
    """Calculate disaster type distribution"""
    type_counts = defaultdict(int)
    for d in disasters:
        type_counts[d['type']] += 1
    
    total = len(disasters)
    distribution = {}
    for disaster_type, count in type_counts.items():
        distribution[disaster_type] = {
            "count": count,
            "percentage": round((count / total) * 100, 1)
        }
    
    return distribution

def calculate_temporal_trends(disasters):
    """Calculate temporal trends by year"""
    year_data = defaultdict(lambda: {
        'disasters': 0,
        'casualties': 0,
        'displaced': 0,
        'economic_loss': 0
    })
    
    for d in disasters:
        metadata = DISASTER_METADATA.get(d['id'], {})
        date = metadata.get('date', '2018-01-01')
        year = date.split('-')[0]
        
        year_data[year]['disasters'] += 1
        year_data[year]['casualties'] += metadata.get('casualties', 0)
        year_data[year]['displaced'] += metadata.get('displaced', 0)
        year_data[year]['economic_loss'] += metadata.get('economic_loss', 0)
    
    # Sort by year
    sorted_years = sorted(year_data.keys())
    
    return {
        "years": sorted_years,
        "disaster_counts": [year_data[y]['disasters'] for y in sorted_years],
        "casualties": [year_data[y]['casualties'] for y in sorted_years],
        "displaced": [year_data[y]['displaced'] for y in sorted_years],
        "economic_loss": [round(year_data[y]['economic_loss'], 1) for y in sorted_years]
    }

def calculate_geographic_distribution(disasters):
    """Calculate geographic distribution"""
    continent_counts = defaultdict(int)
    country_counts = defaultdict(int)
    
    # Map countries to continents
    continent_map = {
        'United States': 'North America',
        'Mexico': 'Central America',
        'Guatemala': 'Central America',
        'Indonesia': 'Asia',
        'Nepal': 'Asia',
        'Portugal': 'Europe',
        'Australia': 'Oceania'
    }
    
    for d in disasters:
        metadata = DISASTER_METADATA.get(d['id'], {})
        country = metadata.get('country', 'Unknown')
        continent = continent_map.get(country, 'Other')
        
        country_counts[country] += 1
        continent_counts[continent] += 1
    
    total = len(disasters)
    
    # Calculate percentages for continents
    by_continent = {}
    for continent, count in continent_counts.items():
        by_continent[continent] = {
            "count": count,
            "percentage": round((count / total) * 100, 1)
        }
    
    return {
        "by_continent": by_continent,
        "by_country": dict(country_counts)
    }

def get_top_disasters(disasters):
    """Get top disasters by various metrics"""
    disasters_with_metadata = []
    for d in disasters:
        metadata = DISASTER_METADATA.get(d['id'], {})
        disasters_with_metadata.append({
            'name': d['name'],
            'type': d['type'],
            'casualties': metadata.get('casualties', 0),
            'displaced': metadata.get('displaced', 0),
            'economic_loss': metadata.get('economic_loss', 0),
            'affected_area': d.get('affectedArea', 0)
        })
    
    return {
        "by_casualties": sorted(disasters_with_metadata, key=lambda x: x['casualties'], reverse=True)[:5],
        "by_economic_loss": sorted(disasters_with_metadata, key=lambda x: x['economic_loss'], reverse=True)[:5],
        "by_displaced": sorted(disasters_with_metadata, key=lambda x: x['displaced'], reverse=True)[:5],
        "by_area": sorted(disasters_with_metadata, key=lambda x: x['affected_area'], reverse=True)[:5]
    }

def generate_events_table(disasters):
    """Generate detailed events table data"""
    events = []
    for d in disasters:
        metadata = DISASTER_METADATA.get(d['id'], {})
        events.append({
            "id": d['id'],
            "name": d['name'],
            "type": d['type'],
            "severity": d['severity'],
            "date": metadata.get('date', '2018-01-01'),
            "location": d['location'],
            "country": metadata.get('country', 'Unknown'),
            "buildings_analyzed": d.get('damage', {}).get('buildings', 0),
            "casualties": metadata.get('casualties', 0),
            "displaced": metadata.get('displaced', 0),
            "economic_loss": metadata.get('economic_loss', 0)
        })
    
    return events

def main():
    print("Generating dashboard analytics...")
    
    # Load data
    disasters, locations, coordinates = load_data()
    
    # Calculate all analytics
    analytics = {
        "metadata": {
            "generated_at": datetime.now().isoformat(),
            "disaster_count": len(disasters),
            "location_count": len(locations)
        },
        "kpis": calculate_kpis(disasters, locations, coordinates),
        "type_distribution": calculate_type_distribution(disasters),
        "temporal_trends": calculate_temporal_trends(disasters),
        "geographic_distribution": calculate_geographic_distribution(disasters),
        "top_disasters": get_top_disasters(disasters),
        "events": generate_events_table(disasters)
    }
    
    # Save to JSON
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(analytics, f, indent=2)
    
    print(f"\nGenerated analytics for {len(disasters)} disasters")
    print(f"Saved to: {OUTPUT_FILE}")
    print(f"\nKPIs:")
    for key, value in analytics['kpis'].items():
        print(f"  {key}: {value}")

if __name__ == "__main__":
    main()
