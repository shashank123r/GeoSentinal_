/**
 * Active Filters Display Component
 * Shows removable filter tags and result count
 */

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ActiveFilters({
    filters,
    onRemoveFilter,
    onClearAll,
    resultCount,
    totalCount
}) {
    const activeFilters = [];

    // Disaster types
    if (filters.types && filters.types.length > 0 && filters.types.length < 6) {
        filters.types.forEach(type => {
            activeFilters.push({
                id: `type-${type}`,
                label: getTypeLabel(type),
                icon: getTypeIcon(type),
                onRemove: () => onRemoveFilter('type', type)
            });
        });
    }

    // Countries
    if (filters.countries && filters.countries.length > 0) {
        filters.countries.forEach(country => {
            activeFilters.push({
                id: `country-${country}`,
                label: country,
                icon: '🌍',
                onRemove: () => onRemoveFilter('country', country)
            });
        });
    }

    // Severities
    if (filters.severities && filters.severities.length > 0 && filters.severities.length < 4) {
        filters.severities.forEach(severity => {
            activeFilters.push({
                id: `severity-${severity}`,
                label: getSeverityLabel(severity),
                icon: getSeverityIcon(severity),
                onRemove: () => onRemoveFilter('severity', severity)
            });
        });
    }

    // Date range
    if (filters.dateRange && (filters.dateRange.start || filters.dateRange.end)) {
        activeFilters.push({
            id: 'dateRange',
            label: `${filters.dateRange.start || '...'} to ${filters.dateRange.end || '...'}`,
            icon: '📅',
            onRemove: () => onRemoveFilter('dateRange')
        });
    }

    // Destruction rate
    if (filters.destructionRate && filters.destructionRate > 0) {
        activeFilters.push({
            id: 'destructionRate',
            label: `>${filters.destructionRate}% destroyed`,
            icon: '💥',
            onRemove: () => onRemoveFilter('destructionRate')
        });
    }

    if (activeFilters.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
        >
            <div className="glass-dark rounded-xl p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">
                        Showing {resultCount.toLocaleString()} of {totalCount.toLocaleString()} disasters
                    </span>
                    <button
                        onClick={onClearAll}
                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                        Clear All Filters
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                        {activeFilters.map((filter) => (
                            <motion.div
                                key={filter.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded-full text-sm text-white border border-slate-600 hover:border-cyan-400 transition-colors"
                            >
                                <span>{filter.icon}</span>
                                <span>{filter.label}</span>
                                <button
                                    onClick={filter.onRemove}
                                    className="hover:text-red-400 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

function getTypeLabel(type) {
    const labels = {
        hurricane: 'Hurricanes',
        earthquake: 'Earthquakes',
        flood: 'Floods',
        fire: 'Fires',
        cyclone: 'Cyclones',
        landslide: 'Landslides'
    };
    return labels[type] || type;
}

function getTypeIcon(type) {
    const icons = {
        hurricane: '🌀',
        earthquake: '🏚️',
        flood: '🌊',
        fire: '🔥',
        cyclone: '💨',
        landslide: '⛰️'
    };
    return icons[type] || '📍';
}

function getSeverityLabel(severity) {
    const labels = {
        low: 'Low Severity',
        medium: 'Medium Severity',
        high: 'High Severity',
        critical: 'Critical Severity'
    };
    return labels[severity] || severity;
}

function getSeverityIcon(severity) {
    const icons = {
        low: '🟢',
        medium: '🟡',
        high: '🟠',
        critical: '🔴'
    };
    return icons[severity] || '⚪';
}
