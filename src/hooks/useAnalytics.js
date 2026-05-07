/**
 * Custom hooks to load analytics data
 */

import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function useAnalytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/analytics/summary`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const analyticsData = await response.json();
            setData(analyticsData);
        } catch (err) {
            console.error('Error loading analytics:', err);
            setError(err.message);

            // Fallback to local data
            try {
                const localData = await import('../data/dashboard_analytics.json');
                setData(localData.default || localData);
            } catch (localErr) {
                console.error('Error loading local analytics:', localErr);
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        kpis: data?.kpis || {},
        typeDistribution: data?.type_distribution || {},
        temporalTrends: data?.temporal_trends || {},
        geographicDistribution: data?.geographic_distribution || {},
        topDisasters: data?.top_disasters || {},
        reload: loadAnalytics
    };
}

export function useTopDisasters(metric = 'casualties') {
    const [disasters, setDisasters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTopDisasters();
    }, [metric]);

    const loadTopDisasters = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/analytics/top-disasters?metric=${metric}`);
            if (response.ok) {
                const data = await response.json();
                setDisasters(data);
            }
        } catch (err) {
            console.error('Error loading top disasters:', err);
        } finally {
            setLoading(false);
        }
    };

    return { disasters, loading };
}

export function useEventsTable(filters = {}) {
    const [events, setEvents] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, [filters]);

    const loadEvents = async () => {
        try {
            const params = new URLSearchParams(filters);
            const response = await fetch(`${API_BASE_URL}/analytics/events?${params}`);

            if (response.ok) {
                const data = await response.json();
                setEvents(data.events || []);
                setTotal(data.total || 0);
            }
        } catch (err) {
            console.error('Error loading events:', err);
        } finally {
            setLoading(false);
        }
    };

    return { events, total, loading, reload: loadEvents };
}
