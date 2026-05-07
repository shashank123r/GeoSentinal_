// Location and disaster search utilities

/**
 * Search disasters by name, location, or country
 */
export function searchDisasters(disasters, query) {
    if (!query || query.trim() === '') return disasters;

    const searchTerm = query.toLowerCase().trim();

    return disasters.filter(disaster =>
        disaster.name.toLowerCase().includes(searchTerm) ||
        disaster.location.toLowerCase().includes(searchTerm) ||
        disaster.country.toLowerCase().includes(searchTerm) ||
        disaster.type.toLowerCase().includes(searchTerm)
    );
}

/**
 * Filter disasters by multiple criteria
 */
export function filterDisasters(disasters, filters = {}) {
    let filtered = [...disasters];

    // Filter by type
    if (filters.type && filters.type !== 'all') {
        filtered = filtered.filter(d => d.type === filters.type);
    }

    // Filter by severity
    if (filters.severity && filters.severity !== 'all') {
        filtered = filtered.filter(d => d.severity === filters.severity);
    }

    // Filter by date range
    if (filters.startDate || filters.endDate) {
        filtered = filtered.filter(d => {
            const disasterDate = new Date(d.date);
            const start = filters.startDate ? new Date(filters.startDate) : new Date('1900-01-01');
            const end = filters.endDate ? new Date(filters.endDate) : new Date();
            return disasterDate >= start && disasterDate <= end;
        });
    }

    // Filter by country
    if (filters.country && filters.country !== 'all') {
        filtered = filtered.filter(d => d.country === filters.country);
    }

    // Filter by minimum casualties
    if (filters.minCasualties) {
        filtered = filtered.filter(d => d.casualties >= filters.minCasualties);
    }

    return filtered;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Find disasters near a specific location
 */
export function getDisastersByLocation(disasters, lat, lng, radiusKm = 500) {
    return disasters
        .map(disaster => ({
            ...disaster,
            distance: calculateDistance(lat, lng, disaster.coordinates[0], disaster.coordinates[1])
        }))
        .filter(disaster => disaster.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);
}

/**
 * Get disasters within a date range
 */
export function getDisastersByDateRange(disasters, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return disasters.filter(disaster => {
        const disasterDate = new Date(disaster.date);
        return disasterDate >= start && disasterDate <= end;
    });
}

/**
 * Get recent disasters (last N days)
 */
export function getRecentDisasters(disasters, days = 365) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return disasters
        .filter(disaster => new Date(disaster.date) >= cutoffDate)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(lat, lng, precision = 4) {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';

    return `${Math.abs(lat).toFixed(precision)}°${latDir}, ${Math.abs(lng).toFixed(precision)}°${lngDir}`;
}

/**
 * Get unique values for filtering
 */
export function getUniqueDisasterTypes(disasters) {
    return [...new Set(disasters.map(d => d.type))].sort();
}

export function getUniqueCountries(disasters) {
    return [...new Set(disasters.map(d => d.country))].sort();
}

export function getUniqueSeverityLevels(disasters) {
    return [...new Set(disasters.map(d => d.severity))].sort();
}

/**
 * Sort disasters by various criteria
 */
export function sortDisasters(disasters, sortBy = 'date', order = 'desc') {
    const sorted = [...disasters];

    sorted.sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'date':
                comparison = new Date(a.date) - new Date(b.date);
                break;
            case 'casualties':
                comparison = a.casualties - b.casualties;
                break;
            case 'displaced':
                comparison = a.displaced - b.displaced;
                break;
            case 'economicLoss':
                comparison = a.economicLoss - b.economicLoss;
                break;
            case 'affectedArea':
                comparison = a.affectedArea - b.affectedArea;
                break;
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            default:
                comparison = 0;
        }

        return order === 'desc' ? -comparison : comparison;
    });

    return sorted;
}

/**
 * Get disaster statistics
 */
export function getDisasterStats(disasters) {
    return {
        total: disasters.length,
        totalCasualties: disasters.reduce((sum, d) => sum + d.casualties, 0),
        totalDisplaced: disasters.reduce((sum, d) => sum + d.displaced, 0),
        totalEconomicLoss: disasters.reduce((sum, d) => sum + d.economicLoss, 0),
        totalAffectedArea: disasters.reduce((sum, d) => sum + d.affectedArea, 0),
        byType: disasters.reduce((acc, d) => {
            acc[d.type] = (acc[d.type] || 0) + 1;
            return acc;
        }, {}),
        bySeverity: disasters.reduce((acc, d) => {
            acc[d.severity] = (acc[d.severity] || 0) + 1;
            return acc;
        }, {}),
        byCountry: disasters.reduce((acc, d) => {
            acc[d.country] = (acc[d.country] || 0) + 1;
            return acc;
        }, {})
    };
}
