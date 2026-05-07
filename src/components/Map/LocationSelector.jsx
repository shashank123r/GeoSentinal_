/**
 * Enhanced Location Selector with Real xBD Data
 * Displays disaster locations with heatmap, polygons, and advanced filtering
 */

import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Icon } from 'leaflet';
import { useState, useEffect } from 'react';
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';
import 'leaflet/dist/leaflet.css';
import DisasterPopup from './DisasterPopup';
import MapLegend from './MapLegend';
import MapLayerControls from './MapLayerControls';
import MapFilters from './MapFilters';
import ActiveFilters from './ActiveFilters';
import disasterLocationsData from '../../data/disaster-locations.json';
import { useApp } from '../../context/AppContext';

// Component to auto-fit map bounds to filtered markers
function AutoFitBounds({ locations }) {
    const map = useMap();

    useEffect(() => {
        if (locations && locations.length > 0) {
            const bounds = locations.map(loc => loc.coordinates);
            if (bounds.length > 0) {
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
            }
        }
    }, [locations, map]);

    return null;
}

// Fix for default marker icon
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons by disaster type and severity
const createCustomIcon = (type, severity) => {
    const colors = {
        hurricane: '#8b5cf6',
        fire: '#ef4444',
        flood: '#3b82f6',
        earthquake: '#78350f',
        cyclone: '#06b6d4',
        landslide: '#f59e0b'
    };

    const sizes = {
        low: 18,
        medium: 24,
        high: 30,
        critical: 36
    };

    const color = colors[type] || '#64748b';
    const size = sizes[severity] || 24;

    return new Icon({
        iconUrl: `data:image/svg+xml;base64,${btoa(`
            <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/>
            </svg>
        `)}`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2]
    });
};

export default function LocationSelector({ onDisasterSelect }) {
    // Get runAnalysis from context
    const { runAnalysis } = useApp();
    // State for all locations and loading
    const [allLocations, setAllLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Layer controls state
    const [baseLayer, setBaseLayer] = useState('street');
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [showPolygons, setShowPolygons] = useState(false);
    const [showMarkers, setShowMarkers] = useState(true);
    const [enableClustering, setEnableClustering] = useState(true);

    // Filter state
    const [filters, setFilters] = useState({
        types: [],
        countries: [],
        severities: [],
        dateRange: { start: '', end: '' },
        destructionRate: 0,
        search: ''
    });

    // Load locations
    useEffect(() => {
        try {
            setLoading(true);
            console.log('[MAP] Starting to load disaster locations...');
            console.log('[MAP] Data file imported, total locations:', disasterLocationsData.length);

            // Sample the data for better performance - take every 5th location
            const sampledLocations = disasterLocationsData.filter((_, index) => index % 5 === 0);
            console.log('[MAP] Sampled locations:', sampledLocations.length);
            console.log('[MAP] First location sample:', sampledLocations[0]);

            setAllLocations(sampledLocations);
        } catch (error) {
            console.error('[MAP] Error loading locations:', error);
            setAllLocations([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Calculate filter counts
    const typeCounts = {};
    const countryCounts = {};
    const severityCounts = {};
    let dateRange = { min: '', max: '' };

    allLocations.forEach(loc => {
        typeCounts[loc.type] = (typeCounts[loc.type] || 0) + 1;
        countryCounts[loc.country] = (countryCounts[loc.country] || 0) + 1;
        severityCounts[loc.severity] = (severityCounts[loc.severity] || 0) + 1;

        if (!dateRange.min || loc.date < dateRange.min) dateRange.min = loc.date;
        if (!dateRange.max || loc.date > dateRange.max) dateRange.max = loc.date;
    });

    // Apply filters
    const filteredLocations = allLocations.filter(loc => {
        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchesSearch = loc.name.toLowerCase().includes(searchLower) ||
                loc.location.toLowerCase().includes(searchLower) ||
                loc.country.toLowerCase().includes(searchLower);
            if (!matchesSearch) return false;
        }

        // Type filter
        if (filters.types.length > 0 && !filters.types.includes(loc.type)) {
            return false;
        }

        // Country filter
        if (filters.countries.length > 0 && !filters.countries.includes(loc.country)) {
            return false;
        }

        // Severity filter
        if (filters.severities.length > 0 && !filters.severities.includes(loc.severity)) {
            return false;
        }

        // Date range filter
        if (filters.dateRange.start && loc.date < filters.dateRange.start) {
            return false;
        }
        if (filters.dateRange.end && loc.date > filters.dateRange.end) {
            return false;
        }

        // Destruction rate filter
        if (filters.destructionRate > 0 && (loc.destructionRate || 0) < filters.destructionRate) {
            return false;
        }

        return true;
    });

    // Handle filter changes
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    // Handle filter removal
    const handleRemoveFilter = (filterType, value) => {
        if (filterType === 'type') {
            setFilters(prev => ({
                ...prev,
                types: prev.types.filter(t => t !== value)
            }));
        } else if (filterType === 'country') {
            setFilters(prev => ({
                ...prev,
                countries: prev.countries.filter(c => c !== value)
            }));
        } else if (filterType === 'severity') {
            setFilters(prev => ({
                ...prev,
                severities: prev.severities.filter(s => s !== value)
            }));
        } else if (filterType === 'dateRange') {
            setFilters(prev => ({
                ...prev,
                dateRange: { start: '', end: '' }
            }));
        } else if (filterType === 'destructionRate') {
            setFilters(prev => ({
                ...prev,
                destructionRate: 0
            }));
        }
    };

    // Clear all filters
    const handleClearAllFilters = () => {
        setFilters({
            types: [],
            countries: [],
            severities: [],
            dateRange: { start: '', end: '' },
            destructionRate: 0,
            search: ''
        });
    };

    // Navigation handlers for popup buttons
    const handleViewAnalysis = (location) => {
        if (onDisasterSelect) {
            const disasterData = {
                ...location,
                disaster_name: location.disaster_name || location.xbd_data?.disaster_name,
                xbd_data: location.xbd_data || {
                    disaster_name: location.disaster_name,
                    sample_pre_image: location.sample_pre_image,
                    sample_post_image: location.sample_post_image
                }
            };
            onDisasterSelect(disasterData);
        }
        // Scroll to comparison section
        setTimeout(() => {
            const comparisonSection = document.getElementById('comparison-section');
            if (comparisonSection) {
                comparisonSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const handleViewTimeline = () => {
        const statisticsSection = document.getElementById('statistics-section');
        if (statisticsSection) {
            statisticsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Handler for View AI Analytics - runs analysis and navigates to analysis section
    const handleViewAIAnalysis = async (location) => {
        const disasterName = location.disaster_name || location.xbd_data?.disaster_name || 'guatemala-volcano';

        // Extract base image ID if available (remove _post_disaster or _pre_disaster suffix)
        let imageId = null;
        if (location.image_id) {
            imageId = location.image_id.replace('_post_disaster', '').replace('_pre_disaster', '');
        } else if (location.xbd_data?.image_id) {
            imageId = location.xbd_data.image_id.replace('_post_disaster', '').replace('_pre_disaster', '');
        }

        // Run the AI analysis with specific image ID
        await runAnalysis(disasterName, 0, imageId);

        // Navigate to analysis section
        setTimeout(() => {
            const analysisSection = document.getElementById('analysis-section');
            if (analysisSection) {
                analysisSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-slate-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                    <p className="text-slate-300">Loading disaster locations from xBD dataset...</p>
                    <p className="text-slate-500 text-sm mt-2">Processing 7,000+ locations</p>
                </div>
            </div>
        );
    }

    // Determine if we have active filters
    const hasActiveFilters = filters.types.length > 0 ||
        filters.countries.length > 0 ||
        filters.severities.length > 0 ||
        filters.search ||
        filters.dateRange.start ||
        filters.dateRange.end ||
        filters.destructionRate > 0;

    return (
        <div className="relative h-full">
            {/* Filter Panel */}
            <MapFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                typeCounts={typeCounts}
                countryCounts={countryCounts}
                severityCounts={severityCounts}
                dateRange={dateRange}
            />

            {/* Layer Controls */}
            <MapLayerControls
                baseLayer={baseLayer}
                onBaseLayerChange={setBaseLayer}
                showHeatmap={showHeatmap}
                onHeatmapToggle={setShowHeatmap}
                showPolygons={showPolygons}
                onPolygonsToggle={setShowPolygons}
                showMarkers={showMarkers}
                onMarkersToggle={setShowMarkers}
                enableClustering={enableClustering}
                onClusteringToggle={setEnableClustering}
            />

            {/* Map Legend */}
            <MapLegend />

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[999] w-[600px] max-w-[90vw]">
                    <ActiveFilters
                        filters={filters}
                        onRemoveFilter={handleRemoveFilter}
                        onClearAll={handleClearAllFilters}
                        resultCount={filteredLocations.length}
                        totalCount={allLocations.length}
                    />
                </div>
            )}

            {/* Map */}
            <MapContainer
                center={[20, 0]}
                zoom={2}
                style={{ height: '100%', width: '100%' }}
                className="rounded-xl"
            >
                {/* Auto-fit bounds to show filtered locations */}
                <AutoFitBounds locations={filteredLocations} />

                {/* Base Layer - Street or Satellite */}
                {baseLayer === 'street' ? (
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                ) : (
                    <TileLayer
                        attribution='Tiles &copy; Esri'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                )}

                {/* Damage Heatmap Layer */}
                {showHeatmap && filteredLocations.length > 0 && (
                    <HeatmapLayer
                        points={filteredLocations.map(loc => ({
                            lat: loc.coordinates[0],
                            lng: loc.coordinates[1],
                            intensity: (loc.destructionRate || 0) / 100
                        }))}
                        longitudeExtractor={point => point.lng}
                        latitudeExtractor={point => point.lat}
                        intensityExtractor={point => point.intensity}
                        radius={25}
                        blur={20}
                        max={1.0}
                        gradient={{
                            0.0: '#00ff00',
                            0.25: '#ffff00',
                            0.5: '#ff9900',
                            0.75: '#ff0000',
                            1.0: '#800000'
                        }}
                    />
                )}

                {/* Polygon Overlays for Affected Areas */}
                {showPolygons && filteredLocations.map((location) => {
                    if (!location.bounds) return null;

                    const { north, south, east, west } = location.bounds;
                    const polygonPositions = [[north, west], [north, east], [south, east], [south, west]];

                    const severityColors = {
                        low: '#22c55e',
                        medium: '#eab308',
                        high: '#f97316',
                        critical: '#ef4444'
                    };

                    const color = severityColors[location.severity] || '#64748b';

                    return (
                        <Polygon
                            key={`polygon-${location.id}`}
                            positions={polygonPositions}
                            pathOptions={{
                                color: color,
                                weight: 2,
                                opacity: 0.6,
                                fillColor: color,
                                fillOpacity: 0.2
                            }}
                        >
                            <Popup>
                                <div className="text-xs">
                                    <strong>Affected Area</strong><br />
                                    {location.name}<br />
                                    Buildings: {location.buildingsAnalyzed}
                                </div>
                            </Popup>
                        </Polygon>
                    );
                })}

                {/* Disaster Markers with clustering */}
                {showMarkers && (
                    enableClustering ? (
                        <MarkerClusterGroup
                            chunkedLoading
                            maxClusterRadius={30}
                            spiderfyOnMaxZoom={true}
                            showCoverageOnHover={true}
                            disableClusteringAtZoom={8}
                        >
                            {filteredLocations.map((location) => {
                                if (!location.coordinates || location.coordinates.length !== 2) return null;
                                const [lat, lon] = location.coordinates;
                                if (isNaN(lat) || isNaN(lon)) return null;

                                return (
                                    <Marker
                                        key={location.id}
                                        position={location.coordinates}
                                        icon={createCustomIcon(location.type, location.severity)}
                                    >
                                        <Popup maxWidth={400}>
                                            <DisasterPopup
                                                location={location}
                                                onViewAnalysis={handleViewAnalysis}
                                                onViewTimeline={handleViewTimeline}
                                                onViewAIAnalysis={handleViewAIAnalysis}
                                            />
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MarkerClusterGroup>
                    ) : (
                        filteredLocations.map((location) => {
                            if (!location.coordinates || location.coordinates.length !== 2) return null;

                            return (
                                <Marker
                                    key={location.id}
                                    position={location.coordinates}
                                    icon={createCustomIcon(location.type, location.severity)}
                                >
                                    <Popup maxWidth={400}>
                                        <DisasterPopup
                                            location={location}
                                            onViewAnalysis={handleViewAnalysis}
                                            onViewTimeline={handleViewTimeline}
                                            onViewAIAnalysis={handleViewAIAnalysis}
                                        />
                                    </Popup>
                                </Marker>
                            );
                        })
                    )
                )}
            </MapContainer>
        </div>
    );
}
