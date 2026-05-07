import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AppProvider({ children }) {
    const [selectedDisaster, setSelectedDisaster] = useState(null);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState(null);

    // Run AI analysis on a disaster
    const runAnalysis = useCallback(async (disasterName, index = 0, imageId = null) => {
        if (!disasterName) {
            setAnalysisError('Disaster name is required');
            return null;
        }

        setIsAnalyzing(true);
        setAnalysisError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    disaster_name: disasterName,
                    index: index,
                    image_id: imageId
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Transform API response for frontend display
            const results = {
                disasterName: data.disaster_name,
                index: data.index,
                severityLevel: data.severity_level,
                heatmapImage: data.heatmap ? `data:image/png;base64,${data.heatmap}` : null,
                overlayImage: data.overlay ? `data:image/png;base64,${data.overlay}` : null,
                statistics: data.statistics,
                // Transform for UI components
                damage: {
                    buildings: Math.round((data.statistics?.percentages?.destroyed || 0) + (data.statistics?.percentages?.major_damage || 0)),
                    roads: Math.round(data.statistics?.percentages?.major_damage || 0),
                    vegetation: Math.round((data.statistics?.percentages?.minor_damage || 0) * 0.5),
                    waterBodies: Math.round((data.statistics?.percentages?.no_damage || 0) * 0.1),
                },
                affectedArea: Math.round((data.statistics?.total_pixels || 0) * 0.0001 * 10) / 10,
                severity: data.severity_level?.charAt(0).toUpperCase() + data.severity_level?.slice(1) || 'Unknown',
                infrastructureDamage: Math.round((data.statistics?.percentages?.destroyed || 0) + (data.statistics?.percentages?.major_damage || 0)),
                populationImpact: Math.round(((data.statistics?.percentages?.destroyed || 0) + (data.statistics?.percentages?.major_damage || 0)) * 1000),
            };

            setAnalysisResults(results);
            return results;

        } catch (err) {
            console.error('AI Analysis error:', err);
            setAnalysisError(err.message);

            // Generate mock data for demo purposes
            const mockResults = generateMockResults(disasterName, index);
            setAnalysisResults(mockResults);
            return mockResults;
        } finally {
            setIsAnalyzing(false);
        }
    }, []);

    const clearAnalysis = useCallback(() => {
        setAnalysisResults(null);
        setAnalysisError(null);
    }, []);

    const value = {
        selectedDisaster,
        setSelectedDisaster,
        analysisResults,
        setAnalysisResults,
        isAnalyzing,
        setIsAnalyzing,
        analysisError,
        runAnalysis,
        clearAnalysis,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Generate mock results for demo when API is unavailable
function generateMockResults(disasterName, index) {
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
        heatmapImage: null,
        overlayImage: null,
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

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}
