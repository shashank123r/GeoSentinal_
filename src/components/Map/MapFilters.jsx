/**
 * MapFilters Component
 * Comprehensive filter panel for disaster map
 */

import { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MapFilters({
    filters,
    onFilterChange,
    typeCounts,
    countryCounts,
    severityCounts,
    dateRange
}) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [countrySearch, setCountrySearch] = useState('');

    const disasterTypes = [
        { value: 'hurricane', label: 'Hurricanes', icon: '🌀' },
        { value: 'earthquake', label: 'Earthquakes', icon: '🏚️' },
        { value: 'flood', label: 'Floods', icon: '🌊' },
        { value: 'fire', label: 'Fires', icon: '🔥' },
        { value: 'cyclone', label: 'Cyclones', icon: '💨' },
        { value: 'landslide', label: 'Landslides', icon: '⛰️' }
    ];

    const severityLevels = [
        { value: 'low', label: 'Low', color: 'text-green-400' },
        { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
        { value: 'high', label: 'High', color: 'text-orange-400' },
        { value: 'critical', label: 'Critical', color: 'text-red-400' }
    ];

    const filteredCountries = Object.entries(countryCounts)
        .filter(([country]) => country.toLowerCase().includes(countrySearch.toLowerCase()))
        .sort((a, b) => b[1] - a[1]);

    const handleTypeToggle = (type) => {
        const newTypes = filters.types.includes(type)
            ? filters.types.filter(t => t !== type)
            : [...filters.types, type];
        onFilterChange('types', newTypes);
    };

    const handleCountryToggle = (country) => {
        const newCountries = filters.countries.includes(country)
            ? filters.countries.filter(c => c !== country)
            : [...filters.countries, country];
        onFilterChange('countries', newCountries);
    };

    const handleSeverityToggle = (severity) => {
        const newSeverities = filters.severities.includes(severity)
            ? filters.severities.filter(s => s !== severity)
            : [...filters.severities, severity];
        onFilterChange('severities', newSeverities);
    };

    return (
        <div className="absolute top-4 left-4 z-[1000] w-80 max-h-[calc(100vh-2rem)] overflow-hidden">
            <motion.div
                className="glass-dark rounded-xl border border-slate-700 overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                {/* Header */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-cyan-400" />
                        <span className="font-semibold text-white text-sm">Filter Disasters</span>
                    </div>
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </motion.div>
                </button>

                {/* Filter Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="border-t border-slate-700 overflow-auto max-h-[calc(100vh-8rem)]"
                        >
                            <div className="p-4 space-y-6">
                                {/* Search */}
                                <div>
                                    <label className="block text-xs text-slate-400 mb-2">Search</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                onFilterChange('search', e.target.value);
                                            }}
                                            placeholder="Search disasters..."
                                            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        />
                                        {searchTerm && (
                                            <button
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    onFilterChange('search', '');
                                                }}
                                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                            >
                                                <X className="w-4 h-4 text-slate-400 hover:text-white" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Disaster Type */}
                                <div>
                                    <label className="block text-xs text-slate-400 mb-2">Disaster Type</label>
                                    <div className="space-y-2">
                                        {disasterTypes.map(type => (
                                            <label
                                                key={type.value}
                                                className="flex items-center justify-between cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.types.includes(type.value)}
                                                        onChange={() => handleTypeToggle(type.value)}
                                                        className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-800"
                                                    />
                                                    <span className="text-lg">{type.icon}</span>
                                                    <span className="text-sm text-white">{type.label}</span>
                                                </div>
                                                <span className="text-xs text-slate-400">
                                                    {typeCounts[type.value] || 0}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Country Filter */}
                                <div>
                                    <label className="block text-xs text-slate-400 mb-2">Country</label>
                                    <div className="relative mb-2">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                        <input
                                            type="text"
                                            value={countrySearch}
                                            onChange={(e) => setCountrySearch(e.target.value)}
                                            placeholder="Search countries..."
                                            className="w-full pl-9 pr-4 py-1.5 bg-slate-700/50 border border-slate-600 rounded text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                                        />
                                    </div>
                                    <div className="max-h-40 overflow-y-auto space-y-1">
                                        {filteredCountries.map(([country, count]) => (
                                            <label
                                                key={country}
                                                className="flex items-center justify-between cursor-pointer group hover:bg-white/5 p-2 rounded transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.countries.includes(country)}
                                                        onChange={() => handleCountryToggle(country)}
                                                        className="w-3 h-3 rounded border-slate-600 text-cyan-500 focus:ring-cyan-400"
                                                    />
                                                    <span className="text-xs text-white">{country}</span>
                                                </div>
                                                <span className="text-xs text-slate-400">({count})</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Severity */}
                                <div>
                                    <label className="block text-xs text-slate-400 mb-2">Severity</label>
                                    <div className="space-y-2">
                                        {severityLevels.map(severity => (
                                            <label
                                                key={severity.value}
                                                className="flex items-center justify-between cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.severities.includes(severity.value)}
                                                        onChange={() => handleSeverityToggle(severity.value)}
                                                        className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-400"
                                                    />
                                                    <span className={`text-sm font-medium ${severity.color}`}>
                                                        {severity.label}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-400">
                                                    {severityCounts[severity.value] || 0}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Date Range */}
                                {dateRange && (
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-2">Date Range</label>
                                        <div className="space-y-2">
                                            <input
                                                type="date"
                                                value={filters.dateRange?.start || ''}
                                                onChange={(e) => onFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                                                min={dateRange.min}
                                                max={dateRange.max}
                                                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                            />
                                            <input
                                                type="date"
                                                value={filters.dateRange?.end || ''}
                                                onChange={(e) => onFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                                                min={dateRange.min}
                                                max={dateRange.max}
                                                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Destruction Rate */}
                                <div>
                                    <label className="block text-xs text-slate-400 mb-2">
                                        Min Destruction Rate: {filters.destructionRate}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={filters.destructionRate}
                                        onChange={(e) => onFilterChange('destructionRate', parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                    />
                                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                                        <span>0%</span>
                                        <span>50%</span>
                                        <span>100%</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
