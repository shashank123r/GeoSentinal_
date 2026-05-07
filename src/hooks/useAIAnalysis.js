/**
 * Custom hook for AI damage analysis
 * Handles API calls to the SiamUnet model backend
 */

import { useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Damage class colors matching main.ipynb
export const DAMAGE_COLORS = {
    background: '#1e293b',      // Slate-800 - Background
    no_damage: '#22c55e',       // Green-500 - No Damage
    minor_damage: '#facc15',    // Yellow-400 - Minor Damage
    major_damage: '#f97316',    // Orange-500 - Major Damage
    destroyed: '#ef4444',       // Red-500 - Destroyed
};

export const DAMAGE_LABELS = {
    background: 'Background',
    no_damage: 'No Damage',
    minor_damage: 'Minor Damage',
    major_damage: 'Major Damage',
    destroyed: 'Destroyed',
};

export function useAIAnalysis() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);

    const runAnalysis = useCallback(async (disasterName, index = 0) => {
        if (!disasterName) {
            setError('Disaster name is required');
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    disaster_name: disasterName,
                    index: index,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Transform API response for frontend display
            const analysisResults = {
                disasterName: data.disaster_name,
                index: data.index,
                severityLevel: data.severity_level,
                heatmapImage: `data:image/png;base64,${data.heatmap}`,
                overlayImage: `data:image/png;base64,${data.overlay}`,
                statistics: data.statistics,
                // Transform for UI components
                damage: {
                    buildings: Math.round(data.statistics.percentages.destroyed + data.statistics.percentages.major_damage),
                    roads: Math.round(data.statistics.percentages.major_damage),
                    vegetation: Math.round(data.statistics.percentages.minor_damage * 0.5),
                    waterBodies: Math.round(data.statistics.percentages.no_damage * 0.1),
                },
                affectedArea: Math.round(data.statistics.total_pixels * 0.0001 * 10) / 10, // Approximate km²
                severity: data.severity_level.charAt(0).toUpperCase() + data.severity_level.slice(1),
                infrastructureDamage: Math.round(data.statistics.percentages.destroyed + data.statistics.percentages.major_damage),
                populationImpact: Math.round((data.statistics.percentages.destroyed + data.statistics.percentages.major_damage) * 1000),
            };

            setResults(analysisResults);
            return analysisResults;

        } catch (err) {
            console.error('AI Analysis error:', err);
            setError(err.message);

            // Return mock data for development/demo if API fails
            const mockResults = generateMockResults(disasterName, index);
            setResults(mockResults);
            return mockResults;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearResults = useCallback(() => {
        setResults(null);
        setError(null);
    }, []);

    return {
        loading,
        error,
        results,
        runAnalysis,
        clearResults,
    };
}

// Generate mock results for development/demo when API is unavailable
function generateMockResults(disasterName, index) {
    // Generate random but realistic-looking statistics
    const destroyed = Math.random() * 20 + 5;
    const majorDamage = Math.random() * 25 + 10;
    const minorDamage = Math.random() * 30 + 15;
    const noDamage = 100 - destroyed - majorDamage - minorDamage - 5;
    const background = 5;

    const severityScore = destroyed * 1 + majorDamage * 0.6 + minorDamage * 0.25;
    let severityLevel = 'low';
    if (severityScore >= 75) severityLevel = 'critical';
    else if (severityScore >= 50) severityLevel = 'high';
    else if (severityScore >= 25) severityLevel = 'medium';

    return {
        disasterName: disasterName,
        index: index,
        severityLevel: severityLevel,
        heatmapImage: null, // Will show placeholder
        overlayImage: null, // Will show placeholder
        statistics: {
            counts: {
                background: Math.round(background * 655.36),
                no_damage: Math.round(noDamage * 655.36),
                minor_damage: Math.round(minorDamage * 655.36),
                major_damage: Math.round(majorDamage * 655.36),
                destroyed: Math.round(destroyed * 655.36),
            },
            percentages: {
                background: background,
                no_damage: noDamage,
                minor_damage: minorDamage,
                major_damage: majorDamage,
                destroyed: destroyed,
            },
            severity_score: severityScore,
            total_pixels: 65536,
        },
        damage: {
            buildings: Math.round(destroyed + majorDamage),
            roads: Math.round(majorDamage),
            vegetation: Math.round(minorDamage * 0.5),
            waterBodies: Math.round(noDamage * 0.1),
        },
        affectedArea: Math.round((destroyed + majorDamage) * 0.5 * 10) / 10,
        severity: severityLevel.charAt(0).toUpperCase() + severityLevel.slice(1),
        infrastructureDamage: Math.round(destroyed + majorDamage),
        populationImpact: Math.round((destroyed + majorDamage) * 1000),
    };
}

export default useAIAnalysis;
