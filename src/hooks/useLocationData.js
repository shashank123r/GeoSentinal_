/**
 * Custom hook to load location data
 * Loads all individual image locations from coordinates_data.json (3,000+ locations)
 * Enriched with disaster-level statistics from disasters.json
 */

import { useState, useEffect } from 'react';
import disastersJson from '../data/disasters.json';
import coordinatesData from '../data/coordinates_data.json';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a map of disaster names to their full data from disasters.json
const disasterDataMap = {};
for (const disaster of disastersJson.disasters) {
    const disasterName = disaster.xbd_data?.disaster_name;
    if (disasterName) {
        disasterDataMap[disasterName] = disaster;
    }
}

// Fallback metadata for enriching location data
const disasterMetadata = {
    'guatemala-volcano': { type: 'fire', severity: 'high', name: 'Fuego Volcano Eruption', location: 'Escuintla Department', country: 'Guatemala', date: '2018-06-03' },
    'hurricane-florence': { type: 'hurricane', severity: 'medium', name: 'Hurricane Florence', location: 'North Carolina Coast', country: 'United States', date: '2018-09-14' },
    'hurricane-harvey': { type: 'hurricane', severity: 'high', name: 'Hurricane Harvey', location: 'Houston Metropolitan Area', country: 'United States', date: '2017-08-25' },
    'hurricane-matthew': { type: 'hurricane', severity: 'medium', name: 'Hurricane Matthew', location: 'Southeastern United States', country: 'United States', date: '2016-10-07' },
    'hurricane-michael': { type: 'hurricane', severity: 'high', name: 'Hurricane Michael', location: 'Florida Panhandle', country: 'United States', date: '2018-10-10' },
    'mexico-earthquake': { type: 'earthquake', severity: 'high', name: 'Puebla Earthquake', location: 'Mexico City', country: 'Mexico', date: '2017-09-19' },
    'midwest-flooding': { type: 'flood', severity: 'high', name: 'Midwest Floods', location: 'Nebraska and Iowa', country: 'United States', date: '2019-03-15' },
    'palu-tsunami': { type: 'flood', severity: 'medium', name: 'Sulawesi Earthquake and Tsunami', location: 'Palu, Central Sulawesi', country: 'Indonesia', date: '2018-09-28' },
    'santa-rosa-wildfire': { type: 'fire', severity: 'medium', name: 'Tubbs Fire', location: 'Santa Rosa, California', country: 'United States', date: '2017-10-09' },
    'socal-fire': { type: 'fire', severity: 'high', name: 'Southern California Wildfires', location: 'Los Angeles County', country: 'United States', date: '2017-12-04' }
};

export function useLocationData() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadLocations();
    }, []);

    const loadLocations = async () => {
        try {
            setLoading(true);

            // Build all locations from coordinates_data.json
            const allLocations = [];
            let id = 1;

            for (const [disasterName, data] of Object.entries(coordinatesData)) {
                // Get full disaster data from disasters.json
                const fullDisasterData = disasterDataMap[disasterName];
                const metadata = disasterMetadata[disasterName] || {
                    type: 'unknown',
                    severity: 'medium',
                    name: disasterName,
                    location: 'Unknown',
                    country: 'Unknown',
                    date: '2018-01-01'
                };

                // Add each image location with full disaster statistics
                if (data.image_locations) {
                    for (const imgLoc of data.image_locations) {
                        allLocations.push({
                            id: id++,
                            image_id: imgLoc.image_id,
                            // coordinates_data has [lon, lat], we need [lat, lon] for Leaflet
                            coordinates: [imgLoc.coordinates[1], imgLoc.coordinates[0]],
                            building_count: imgLoc.building_count || 0,
                            disaster_name: disasterName,
                            // Basic metadata
                            type: fullDisasterData?.type || metadata.type,
                            severity: fullDisasterData?.severity || metadata.severity,
                            name: fullDisasterData?.name || metadata.name,
                            location: fullDisasterData?.location || metadata.location,
                            country: fullDisasterData?.country || metadata.country,
                            date: fullDisasterData?.date || metadata.date,
                            // Disaster-level statistics (from disasters.json)
                            casualties: fullDisasterData?.casualties || 0,
                            displaced: fullDisasterData?.displaced || 0,
                            economicLoss: fullDisasterData?.economicLoss || 0,
                            affectedArea: fullDisasterData?.affectedArea || 0,
                            description: fullDisasterData?.description || `Satellite imagery analysis for ${metadata.name}`,
                            damage: fullDisasterData?.damage || { buildings: 0, roads: 0, vegetation: 0, waterBodies: 0 },
                            // xBD data for image loading
                            xbd_data: {
                                disaster_name: disasterName,
                                image_id: imgLoc.image_id,
                                pre_images_count: fullDisasterData?.xbd_data?.pre_images_count || 0,
                                post_images_count: fullDisasterData?.xbd_data?.post_images_count || 0
                            }
                        });
                    }
                }
            }

            setLocations(allLocations);
        } catch (err) {
            console.error('Error loading locations:', err);
            setError(err.message);
            setLocations([]);
        } finally {
            setLoading(false);
        }
    };

    return { locations, loading, error, reload: loadLocations };
}

export function useDisasterData() {
    const [disasters, setDisasters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load directly from disasters.json for complete disaster data
        const disastersArray = disastersJson.disasters || [];
        setDisasters(disastersArray);
        setLoading(false);
    }, []);

    return { disasters, loading };
}

export function useHeatmapData() {
    const [heatmapData, setHeatmapData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHeatmapData();
    }, []);

    const loadHeatmapData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/locations/heatmap`);
            if (response.ok) {
                const data = await response.json();
                setHeatmapData(data);
            }
        } catch (err) {
            console.error('Error loading heatmap data:', err);
        } finally {
            setLoading(false);
        }
    };

    return { heatmapData, loading };
}
