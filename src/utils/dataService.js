// Data service for loading and filtering disaster data

import disastersData from '../data/disasters.json';
import statisticsData from '../data/statistics.json';

/**
 * Get all disasters
 */
export const getAllDisasters = () => {
    return disastersData.disasters;
};

/**
 * Get disaster by ID
 */
export const getDisasterById = (id) => {
    return disastersData.disasters.find(d => d.id === parseInt(id));
};

/**
 * Get disasters by type
 */
export const getDisastersByType = (type) => {
    return disastersData.disasters.filter(d => d.type === type);
};

/**
 * Get disasters by severity
 */
export const getDisastersBySeverity = (severity) => {
    return disastersData.disasters.filter(d => d.severity === severity);
};

/**
 * Get disasters by country
 */
export const getDisastersByCountry = (country) => {
    return disastersData.disasters.filter(d => d.country === country);
};

/**
 * Get disasters by date range
 */
export const getDisastersByDateRange = (startDate, endDate) => {
    return disastersData.disasters.filter(d => {
        const disasterDate = new Date(d.date);
        return disasterDate >= new Date(startDate) && disasterDate <= new Date(endDate);
    });
};

/**
 * Get recent disasters (last N disasters)
 */
export const getRecentDisasters = (count = 5) => {
    return disastersData.disasters
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, count);
};

/**
 * Get statistics overview
 */
export const getStatisticsOverview = () => {
    return statisticsData.overview;
};

/**
 * Get disasters by type statistics
 */
export const getDisastersByTypeStats = () => {
    return statisticsData.byType;
};

/**
 * Get disasters by severity statistics
 */
export const getDisastersBySeverityStats = () => {
    return statisticsData.bySeverity;
};

/**
 * Get monthly trend data
 */
export const getMonthlyTrend = () => {
    return statisticsData.monthlyTrend;
};

/**
 * Get top affected countries
 */
export const getTopAffectedCountries = () => {
    return statisticsData.topAffectedCountries;
};

/**
 * Get average damage by disaster type
 */
export const getAverageDamage = (type = null) => {
    if (type) {
        return statisticsData.averageDamage[type];
    }
    return statisticsData.averageDamage;
};

/**
 * Get recovery timeline
 */
export const getRecoveryTimeline = (type = null) => {
    if (type) {
        return statisticsData.recoveryTimeline[type];
    }
    return statisticsData.recoveryTimeline;
};

/**
 * Get AI model performance metrics
 */
export const getAIModelPerformance = () => {
    return statisticsData.aiModelPerformance;
};

/**
 * Get yearly comparison data
 */
export const getYearlyComparison = () => {
    return statisticsData.yearlyComparison;
};

/**
 * Get regional distribution
 */
export const getRegionalDistribution = () => {
    return statisticsData.regionalDistribution;
};

/**
 * Get deadliest disasters
 */
export const getDeadliestDisasters = () => {
    return statisticsData.deadliestDisasters;
};

/**
 * Search disasters by keyword
 */
export const searchDisasters = (keyword) => {
    const lowerKeyword = keyword.toLowerCase();
    return disastersData.disasters.filter(d =>
        d.name.toLowerCase().includes(lowerKeyword) ||
        d.location.toLowerCase().includes(lowerKeyword) ||
        d.country.toLowerCase().includes(lowerKeyword) ||
        d.description.toLowerCase().includes(lowerKeyword)
    );
};

/**
 * Get disaster color by type
 */
export const getDisasterColor = (type) => {
    const colors = {
        flood: '#2196F3',
        earthquake: '#795548',
        landslide: '#FF9800',
        fire: '#F44336',
        cyclone: '#00BCD4',
        hurricane: '#9C27B0',
    };
    return colors[type] || '#3498db';
};

/**
 * Get severity color
 */
export const getSeverityColor = (severity) => {
    const colors = {
        low: '#4CAF50',
        medium: '#FF9800',
        high: '#FF5722',
        critical: '#F44336',
    };
    return colors[severity?.toLowerCase()] || '#3498db';
};

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format date
 */
export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};
