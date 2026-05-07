import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Layers, Filter, X, MapPin, Loader2 } from 'lucide-react';
import { getAllDisasters, getDisasterColor, getSeverityColor, formatDate } from '../../utils/dataService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon creator
const createCustomIcon = (type, severity) => {
    const color = getDisasterColor(type);
    const severityColor = getSeverityColor(severity);

    return L.divIcon({
        className: 'custom-marker',
        html: `
      <div style="
        background: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid ${severityColor};
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="transform: rotate(45deg); font-size: 16px;">
          ${getDisasterEmoji(type)}
        </div>
      </div>
    `,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });
};

const getDisasterEmoji = (type) => {
    const emojis = {
        flood: '🌊',
        earthquake: '🏚️',
        landslide: '⛰️',
        fire: '🔥',
        cyclone: '🌀',
        hurricane: '⛈️',
    };
    return emojis[type] || '📍';
};

// Component to handle map flying to location
function FlyToLocation({ location }) {
    const map = useMap();

    useEffect(() => {
        if (location) {
            map.flyTo(location.coordinates, location.zoom || 10, {
                duration: 2,
            });
        }
    }, [location, map]);

    return null;
}

// Map controls component
function MapControls({ filters, setFilters, onSearch }) {
    const [isOpen, setIsOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');

    const disasterTypes = ['flood', 'earthquake', 'landslide', 'fire', 'cyclone', 'hurricane'];
    const severityLevels = ['low', 'medium', 'high', 'critical'];

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setSearchError('');

        try {
            // Use Nominatim geocoding API (OpenStreetMap)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const result = data[0];
                onSearch({
                    coordinates: [parseFloat(result.lat), parseFloat(result.lon)],
                    zoom: 12,
                    name: result.display_name,
                });
                setSearchError('');
            } else {
                setSearchError('Location not found. Try a different search.');
            }
        } catch (error) {
            console.error('Search error:', error);
            setSearchError('Search failed. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <motion.div
            className="absolute top-4 left-4 z-[1000] max-w-sm"
            initial={{ x: -300 }}
            animate={{ x: isOpen ? 0 : -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <div className="glass-dark rounded-xl shadow-xl overflow-hidden">
                {/* Toggle button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute -right-10 top-4 bg-slate-800 p-2 rounded-r-lg hover:bg-slate-700 transition-colors"
                >
                    {isOpen ? <X className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                </button>

                {/* Controls content */}
                <div className="p-4 space-y-4">
                    {/* Search */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            Search Location
                        </h3>
                        <form onSubmit={handleSearch} className="space-y-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Enter location (e.g., Paris, Tokyo)..."
                                    className="w-full px-3 py-2 bg-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    disabled={isSearching}
                                />
                                {isSearching && (
                                    <Loader2 className="absolute right-3 top-2.5 w-4 h-4 animate-spin text-cyan-400" />
                                )}
                            </div>
                            {searchError && (
                                <p className="text-xs text-red-400">{searchError}</p>
                            )}
                        </form>
                    </div>

                    {/* Layer toggles */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Layers className="w-4 h-4" />
                            Map Layers
                        </h3>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.showMarkers}
                                    onChange={(e) => setFilters({ ...filters, showMarkers: e.target.checked })}
                                    className="rounded"
                                />
                                <span>Disaster Markers</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.showAffectedAreas}
                                    onChange={(e) => setFilters({ ...filters, showAffectedAreas: e.target.checked })}
                                    className="rounded"
                                />
                                <span>Affected Areas</span>
                            </label>
                        </div>
                    </div>

                    {/* Disaster type filters */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Disaster Types
                        </h3>
                        <div className="space-y-2">
                            {disasterTypes.map((type) => (
                                <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.types.includes(type)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFilters({ ...filters, types: [...filters.types, type] });
                                            } else {
                                                setFilters({ ...filters, types: filters.types.filter(t => t !== type) });
                                            }
                                        }}
                                        className="rounded"
                                    />
                                    <span className="capitalize">{getDisasterEmoji(type)} {type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Severity filters */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Severity Levels</h3>
                        <div className="space-y-2">
                            {severityLevels.map((severity) => (
                                <label key={severity} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.severities.includes(severity)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFilters({ ...filters, severities: [...filters.severities, severity] });
                                            } else {
                                                setFilters({ ...filters, severities: filters.severities.filter(s => s !== severity) });
                                            }
                                        }}
                                        className="rounded"
                                    />
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: getSeverityColor(severity) }}
                                        />
                                        <span className="capitalize">{severity}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Map legend component
function MapLegend() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <motion.div
            className="absolute bottom-4 right-4 z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="glass-dark rounded-xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Legend</h3>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-xs text-slate-400 hover:text-white"
                    >
                        {isOpen ? 'Hide' : 'Show'}
                    </button>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-3"
                        >
                            {/* Severity levels */}
                            <div>
                                <p className="text-xs text-slate-400 mb-2">Severity</p>
                                <div className="space-y-1">
                                    {['low', 'medium', 'high', 'critical'].map((severity) => (
                                        <div key={severity} className="flex items-center gap-2 text-xs">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: getSeverityColor(severity) }}
                                            />
                                            <span className="capitalize">{severity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Disaster types */}
                            <div>
                                <p className="text-xs text-slate-400 mb-2">Disaster Types</p>
                                <div className="grid grid-cols-2 gap-1">
                                    {['flood', 'earthquake', 'landslide', 'fire', 'cyclone', 'hurricane'].map((type) => (
                                        <div key={type} className="flex items-center gap-1 text-xs">
                                            <span>{getDisasterEmoji(type)}</span>
                                            <span className="capitalize text-xs">{type}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// Main map component
export default function InteractiveMap() {
    const [disasters, setDisasters] = useState([]);
    const [searchLocation, setSearchLocation] = useState(null);
    const [filters, setFilters] = useState({
        showMarkers: true,
        showAffectedAreas: true,
        types: ['flood', 'earthquake', 'landslide', 'fire', 'cyclone', 'hurricane'],
        severities: ['low', 'medium', 'high', 'critical'],
    });

    useEffect(() => {
        const allDisasters = getAllDisasters();
        setDisasters(allDisasters);
    }, []);

    const filteredDisasters = disasters.filter(disaster =>
        filters.types.includes(disaster.type) &&
        filters.severities.includes(disaster.severity)
    );

    const handleSearch = (location) => {
        setSearchLocation(location);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="max-w-7xl mx-auto w-full">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-5xl font-bold mb-4 font-display bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Global Disaster Map
                    </h2>
                    <p className="text-xl text-slate-300">
                        Interactive visualization of {disasters.length} disaster zones worldwide
                    </p>
                </motion.div>

                <motion.div
                    className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <MapContainer
                        center={[20, 0]}
                        zoom={2}
                        className="h-full w-full"
                        zoomControl={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Fly to searched location */}
                        <FlyToLocation location={searchLocation} />

                        {/* Disaster markers */}
                        {filters.showMarkers && filteredDisasters.map((disaster) => (
                            <Marker
                                key={disaster.id}
                                position={disaster.coordinates}
                                icon={createCustomIcon(disaster.type, disaster.severity)}
                            >
                                <Popup className="custom-popup">
                                    <div className="p-2 min-w-[200px]">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-bold text-sm">{disaster.name}</h3>
                                            <span className="text-2xl">{getDisasterEmoji(disaster.type)}</span>
                                        </div>
                                        <div className="space-y-1 text-xs text-slate-600">
                                            <p><strong>Location:</strong> {disaster.location}, {disaster.country}</p>
                                            <p><strong>Date:</strong> {formatDate(disaster.date)}</p>
                                            <p><strong>Severity:</strong> <span className="capitalize font-semibold" style={{ color: getSeverityColor(disaster.severity) }}>{disaster.severity}</span></p>
                                            <p><strong>Affected Area:</strong> {disaster.affectedArea.toLocaleString()} km²</p>
                                            {disaster.casualties > 0 && (
                                                <p><strong>Casualties:</strong> {disaster.casualties.toLocaleString()}</p>
                                            )}
                                        </div>
                                        <button className="mt-2 w-full px-3 py-1 bg-cyan-500 text-white rounded text-xs hover:bg-cyan-600 transition-colors">
                                            View Analysis
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {/* Affected area circles */}
                        {filters.showAffectedAreas && filteredDisasters.map((disaster) => (
                            <Circle
                                key={`circle-${disaster.id}`}
                                center={disaster.coordinates}
                                radius={Math.sqrt(disaster.affectedArea) * 1000}
                                pathOptions={{
                                    color: getSeverityColor(disaster.severity),
                                    fillColor: getSeverityColor(disaster.severity),
                                    fillOpacity: 0.2,
                                    weight: 2,
                                }}
                            />
                        ))}
                    </MapContainer>

                    {/* Map controls */}
                    <MapControls filters={filters} setFilters={setFilters} onSearch={handleSearch} />

                    {/* Map legend */}
                    <MapLegend />
                </motion.div>
            </div>
        </div>
    );
}
