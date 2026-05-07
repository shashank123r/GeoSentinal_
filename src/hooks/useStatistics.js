/**
 * Hook for loading statistics from pre-computed statistics.json
 * All values are computed from the actual xBD dataset
 */

import { useState, useEffect } from 'react';
import statisticsData from '../data/statistics.json';

export const useStatistics = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        try {
            // Load pre-computed statistics
            setData(statisticsData);
            setLoading(false);
        } catch (err) {
            console.error('Error loading statistics:', err);
            setError(err.message);
            setLoading(false);
        }
    }, []);

    // Return formatted data for components
    const overview = data?.overview || {};
    const disastersByType = data?.byType || [];
    const monthlyData = data?.monthlyTrend || [];
    const severityDistribution = data?.bySeverity || [];
    const topRegions = data?.topAffectedCountries || [];
    const topDeadliest = data?.deadliestDisasters || [];

    return {
        loading,
        error,
        overview,
        disastersByType,
        monthlyData,
        severityDistribution,
        topRegions,
        topDeadliest,
        damageDistribution: {},
        yearlyTrends: [],
        recoveryTimes: {}
    };
};
