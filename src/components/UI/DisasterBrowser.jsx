import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronLeft, ChevronRight, Calendar, MapPin, AlertTriangle, Grid3X3, List, Building, Eye } from 'lucide-react';
import { useLocationData } from '../../hooks/useLocationData';

export default function DisasterBrowser({ onDisasterSelect, externalTypeFilter }) {
    const { locations, loading } = useLocationData();
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        type: 'all',
        severity: 'all',
        country: 'all',
    });
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Sync external filter with internal state
    useEffect(() => {
        if (externalTypeFilter) {
            setFilters(prev => ({ ...prev, type: externalTypeFilter }));
            setCurrentPage(1);
        } else {
            setFilters(prev => ({ ...prev, type: 'all' }));
        }
    }, [externalTypeFilter]);

    // Apply filters and search
    const filteredLocations = useMemo(() => {
        let filtered = [...locations];

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(loc =>
                loc.name.toLowerCase().includes(query) ||
                loc.location.toLowerCase().includes(query) ||
                loc.country.toLowerCase().includes(query)
            );
        }

        // Apply filters
        if (filters.type !== 'all') {
            filtered = filtered.filter(loc => loc.type === filters.type);
        }
        if (filters.severity !== 'all') {
            filtered = filtered.filter(loc => loc.severity === filters.severity);
        }
        if (filters.country !== 'all') {
            filtered = filtered.filter(loc => loc.country === filters.country);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aVal, bVal;
            switch (sortBy) {
                case 'date':
                    aVal = new Date(a.date);
                    bVal = new Date(b.date);
                    break;
                case 'name':
                    aVal = a.name;
                    bVal = b.name;
                    break;
                case 'buildingCount':
                    aVal = a.building_count || a.buildingsAnalyzed || 0;
                    bVal = b.building_count || b.buildingsAnalyzed || 0;
                    break;
                default:
                    return 0;
            }

            if (typeof aVal === 'string') {
                return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        });

        return filtered;
    }, [locations, searchQuery, filters, sortBy, sortOrder]);

    // Pagination
    const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
    const paginatedLocations = filteredLocations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filters.type, filters.severity, filters.country, sortBy]);

    // Calculate stats
    const stats = useMemo(() => {
        const totalBuildings = filteredLocations.reduce((sum, loc) => sum + (loc.building_count || loc.buildingsAnalyzed || 0), 0);
        const uniqueDisasters = new Set(filteredLocations.map(loc => loc.disaster_name || loc.xbd_data?.disaster_name || loc.name)).size;
        const uniqueCountries = new Set(filteredLocations.map(loc => loc.country)).size;

        return {
            total: filteredLocations.length,
            totalBuildings,
            uniqueDisasters,
            uniqueCountries
        };
    }, [filteredLocations]);

    // Handle disaster card click - pass complete data for comparison
    const handleDisasterClick = (location) => {
        if (onDisasterSelect) {
            // Ensure xbd_data is properly passed for image loading
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
    };

    const getDisasterIcon = (type) => {
        const icons = {
            flood: '🌊',
            earthquake: '🏚️',
            fire: '🔥',
            hurricane: '🌪️',
        };
        return icons[type] || '📍';
    };

    const getSeverityColor = (severity) => {
        const colors = {
            critical: 'bg-red-500/20 text-red-400 border-red-500/50',
            high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
            medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
            low: 'bg-green-500/20 text-green-400 border-green-500/50'
        };
        return colors[severity] || 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const uniqueTypes = [...new Set(locations.map(d => d.type))];
    const uniqueCountries = [...new Set(locations.map(d => d.country))].sort();
    const severityLevels = ['low', 'medium', 'high', 'critical'];

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400">Loading disaster locations...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Header with search and filters */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Disaster Locations</h2>
                        <p className="text-slate-400">
                            Showing {paginatedLocations.length} of {filteredLocations.length} locations
                            {filteredLocations.length !== locations.length && ` (${locations.length} total)`}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                            className="p-2 glass-dark rounded-lg hover:bg-white/10 transition-colors"
                            title={viewMode === 'grid' ? 'List View' : 'Grid View'}
                        >
                            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-2 glass-dark rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                            {(filters.type !== 'all' || filters.severity !== 'all' || filters.country !== 'all') && (
                                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Search bar */}
                <div className="relative mb-4">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, location, or country..."
                        className="w-full bg-slate-800 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                </div>

                {/* Filter panel */}
                {showFilters && (
                    <motion.div
                        className="glass-dark rounded-xl p-4 mb-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Disaster Type */}
                            <div>
                                <label className="text-sm text-slate-400 mb-2 block">Disaster Type</label>
                                <select
                                    value={filters.type}
                                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                    className="w-full bg-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                >
                                    <option value="all">All Types</option>
                                    {uniqueTypes.map(type => (
                                        <option key={type} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Severity */}
                            <div>
                                <label className="text-sm text-slate-400 mb-2 block">Severity</label>
                                <select
                                    value={filters.severity}
                                    onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                                    className="w-full bg-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                >
                                    <option value="all">All Levels</option>
                                    {severityLevels.map(level => (
                                        <option key={level} value={level}>
                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Country */}
                            <div>
                                <label className="text-sm text-slate-400 mb-2 block">Country</label>
                                <select
                                    value={filters.country}
                                    onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                                    className="w-full bg-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                >
                                    <option value="all">All Countries</option>
                                    {uniqueCountries.map(country => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort */}
                            <div>
                                <label className="text-sm text-slate-400 mb-2 block">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full bg-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                >
                                    <option value="date">Date</option>
                                    <option value="name">Name</option>
                                    <option value="buildingCount">Buildings Analyzed</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                            <button
                                onClick={() => {
                                    setFilters({ type: 'all', severity: 'all', country: 'all' });
                                    setSearchQuery('');
                                    setSortBy('date');
                                    setSortOrder('desc');
                                }}
                                className="text-sm text-cyan-400 hover:text-cyan-300"
                            >
                                Reset All
                            </button>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="text-sm text-slate-400 hover:text-slate-300"
                            >
                                Close Filters
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Quick stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="glass-dark rounded-lg p-4">
                        <div className="text-2xl font-bold text-cyan-400">{stats.total.toLocaleString()}</div>
                        <div className="text-sm text-slate-400">Locations</div>
                    </div>
                    <div className="glass-dark rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-400">{stats.uniqueDisasters}</div>
                        <div className="text-sm text-slate-400">Disasters</div>
                    </div>
                    <div className="glass-dark rounded-lg p-4">
                        <div className="text-2xl font-bold text-orange-400">{stats.uniqueCountries}</div>
                        <div className="text-sm text-slate-400">Countries</div>
                    </div>
                    <div className="glass-dark rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-400">{stats.totalBuildings.toLocaleString()}</div>
                        <div className="text-sm text-slate-400">Buildings</div>
                    </div>
                </div>
            </div>

            {/* Location cards */}
            {filteredLocations.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-xl text-slate-400">No locations found</p>
                    <p className="text-sm text-slate-500 mt-2">Try adjusting your filters or search query</p>
                </div>
            ) : (
                <>
                    <div className={viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        : 'space-y-4'
                    }>
                        {paginatedLocations.map((location, index) => (
                            <motion.div
                                key={location.id}
                                className="glass-dark rounded-xl overflow-hidden hover:bg-white/5 transition-all cursor-pointer group"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                onClick={() => handleDisasterClick(location)}
                                whileHover={{ y: -5 }}
                            >
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{getDisasterIcon(location.type)}</span>
                                            <div>
                                                <h3 className="font-bold text-sm group-hover:text-cyan-400 transition-colors line-clamp-1">
                                                    {location.name}
                                                </h3>
                                                <p className="text-xs text-slate-400">{location.image_id}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(location.severity)}`}>
                                            {location.severity}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-xs mb-3">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <MapPin className="w-3 h-3" />
                                            {location.location}, {location.country}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(location.date)}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Building className="w-3 h-3" />
                                            {location.building_count} buildings analyzed
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500">
                                            Coords: {location.coordinates[0].toFixed(4)}, {location.coordinates[1].toFixed(4)}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="p-2 glass-dark rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex gap-2">
                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-4 py-2 rounded-lg transition-colors ${currentPage === pageNum
                                                ? 'bg-cyan-500 text-white'
                                                : 'glass-dark hover:bg-white/10'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 glass-dark rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    <div className="text-center mt-4 text-sm text-slate-400">
                        Page {currentPage} of {totalPages} • {filteredLocations.length.toLocaleString()} total locations
                    </div>
                </>
            )}
        </div>
    );
}
