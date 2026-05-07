/**
 * API Client for GeoSentinel Backend
 * Handles all communication with Flask API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all disasters from the API
 */
export const fetchDisasters = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/disasters`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching disasters:', error);
        throw error;
    }
};

/**
 * Fetch a specific disaster by ID
 */
export const fetchDisasterById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/disaster/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching disaster ${id}:`, error);
        throw error;
    }
};

/**
 * Fetch a disaster by xBD name
 */
export const fetchDisasterByName = async (name) => {
    try {
        const response = await fetch(`${API_BASE_URL}/disaster/name/${name}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching disaster ${name}:`, error);
        throw error;
    }
};

/**
 * Get image URL for a disaster
 */
export const getImageUrl = (disasterName, imageType, index = 0) => {
    return `${API_BASE_URL}/images/${disasterName}/${imageType}?index=${index}`;
};

/**
 * Fetch all image pairs for a disaster
 */
export const fetchImagePairs = async (disasterName) => {
    try {
        const response = await fetch(`${API_BASE_URL}/images/${disasterName}/pairs`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching image pairs for ${disasterName}:`, error);
        throw error;
    }
};

/**
 * Run AI analysis on a disaster
 */
export const analyzeDisaster = async (disasterName, index = 0) => {
    try {
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                disaster_name: disasterName,
                index: index
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error analyzing disaster ${disasterName}:`, error);
        throw error;
    }
};

/**
 * Fetch overall statistics
 */
export const fetchStatistics = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/statistics`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching statistics:', error);
        throw error;
    }
};

/**
 * Fetch statistics for a specific disaster
 */
export const fetchDisasterStatistics = async (disasterName) => {
    try {
        const response = await fetch(`${API_BASE_URL}/disaster/${disasterName}/statistics`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching statistics for ${disasterName}:`, error);
        throw error;
    }
};

/**
 * Check API health
 */
export const checkHealth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error checking API health:', error);
        throw error;
    }
};

export default {
    fetchDisasters,
    fetchDisasterById,
    fetchDisasterByName,
    getImageUrl,
    fetchImagePairs,
    analyzeDisaster,
    fetchStatistics,
    fetchDisasterStatistics,
    checkHealth
};
