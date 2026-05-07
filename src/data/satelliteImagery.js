// Satellite imagery configuration and URLs
// Using high-quality aerial/satellite imagery from Unsplash as realistic representations

export const satelliteImagery = {
    // Flood disasters
    1: { // Kerala Floods 2023
        before: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&h=1080&fit=crop&q=90',
        after: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=1920&h=1080&fit=crop&q=90',
        thumbnail: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400&h=300&fit=crop&q=80',
        source: 'Sentinel-2',
        resolution: '10m/pixel',
        beforeDate: '2023-08-01',
        afterDate: '2023-08-20',
        cloudCover: 5
    },
    7: { // Pakistan Floods 2022
        before: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&h=1080&fit=crop&q=90',
        after: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1920&h=1080&fit=crop&q=90',
        thumbnail: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop&q=80',
        source: 'Landsat-8',
        resolution: '15m/pixel',
        beforeDate: '2022-08-01',
        afterDate: '2022-09-05',
        cloudCover: 8
    },
    12: { // Libya Floods
        before: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1920&h=1080&fit=crop&q=90',
        after: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop&q=90',
        thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&q=80',
        source: 'Sentinel-2',
        resolution: '10m/pixel',
        beforeDate: '2023-09-01',
        afterDate: '2023-09-12',
        cloudCover: 3
    },

    // Earthquake disasters
    2: { // Turkey-Syria Earthquake
        before: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&h=1080&fit=crop&q=90',
        after: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop&q=90',
        thumbnail: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop&q=80',
        source: 'Maxar WorldView-3',
        resolution: '0.5m/pixel',
        beforeDate: '2023-01-15',
        afterDate: '2023-02-08',
        cloudCover: 2
    },
    8: { // Morocco Earthquake
        before: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=1080&fit=crop&q=90',
        after: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1920&h=1080&fit=crop&q=90',
        thumbnail: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=400&h=300&fit=crop&q=80',
        source: 'Sentinel-2',
        resolution: '10m/pixel',
        beforeDate: '2023-08-25',
        afterDate: '2023-09-10',
        cloudCover: 4
    },
    13: { // Afghanistan Earthquake
        before: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=90',
        after: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop&q=90',
        thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop&q=80',
        source: 'Landsat-8',
        resolution: '15m/pixel',
        beforeDate: '2023-09-20',
        afterDate: '2023-10-09',
        cloudCover: 6
    },

    // Fire disasters
    4: { // Canadian Wildfires
        before: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&q=90',
        after: 'https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?w=1920&h=1080&fit=crop&q=90',
        thumbnail: 'https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?w=400&h=300&fit=crop&q=80',
        source: 'Sentinel-2',
        resolution: '10m/pixel',
        beforeDate: '2023-05-15',
        afterDate: '2023-06-20',
        cloudCover: 7
    },
    9: { // Maui Wildfires
        before: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop&q=90',
        after: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=1920&h=1080&fit=crop&q=90',
        thumbnail: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=400&h=300&fit=crop&q=80',
        source: 'Maxar WorldView-2',
        resolution: '0.5m/pixel',
        beforeDate: '2023-07-25',
        afterDate: '2023-08-10',
        cloudCover: 1
    },
    15: { // Greece Wildfires
        before: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=90',
        after: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop&q=90',
        thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop&q=80',
        source: 'Sentinel-2',
        resolution: '10m/pixel',
        beforeDate: '2023-07-01',
        afterDate: '2023-07-25',
        cloudCover: 4
    },

    // Landslide disasters
    3: { // Papua New Guinea Landslide
        before: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=90',
        after: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop&q=90',
        thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop&q=80',
        source: 'Sentinel-2',
        resolution: '10m/pixel',
        beforeDate: '2024-05-10',
        afterDate: '2024-05-26',
        cloudCover: 9
    },
    10: { // Colombia Landslide
        before: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=90',
        after: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&q=90',
        thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=80',
        source: 'Landsat-8',
        resolution: '15m/pixel',
        beforeDate: '2023-01-25',
        afterDate: '2023-02-09',
        cloudCover: 12
    },

    // Cyclone disasters
    5: { // Cyclone Mocha
        before: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop&q=90',
        after: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=1920&h=1080&fit=crop&q=90',
        thumbnail: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=400&h=300&fit=crop&q=80',
        source: 'Sentinel-2',
        resolution: '10m/pixel',
        beforeDate: '2023-05-01',
        afterDate: '2023-05-16',
        cloudCover: 15
    },
    11: { // Cyclone Freddy
        before: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=90',
        after: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop&q=90',
        thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&q=80',
        source: 'Sentinel-2',
        resolution: '10m/pixel',
        beforeDate: '2023-02-25',
        afterDate: '2023-03-15',
        cloudCover: 18
    },

    // Hurricane disasters
    6: { // Hurricane Ian
        before: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&h=1080&fit=crop&q=90',
        after: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop&q=90',
        thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&q=80',
        source: 'NOAA GOES-16',
        resolution: '2km/pixel',
        beforeDate: '2022-09-20',
        afterDate: '2022-09-30',
        cloudCover: 20
    },
    14: { // Typhoon Hinnamnor
        before: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop&q=90',
        after: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=1920&h=1080&fit=crop&q=90',
        thumbnail: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=400&h=300&fit=crop&q=80',
        source: 'Himawari-8',
        resolution: '2km/pixel',
        beforeDate: '2022-08-28',
        afterDate: '2022-09-07',
        cloudCover: 25
    }
};

/**
 * Get satellite imagery for a disaster
 */
export function getSatelliteImagery(disasterId) {
    return satelliteImagery[disasterId] || null;
}

/**
 * Preload images for better performance
 */
export function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

/**
 * Preload all images for a disaster
 */
export async function preloadDisasterImages(disasterId) {
    const imagery = getSatelliteImagery(disasterId);
    if (!imagery) return false;

    try {
        await Promise.all([
            preloadImage(imagery.before),
            preloadImage(imagery.after),
            preloadImage(imagery.thumbnail)
        ]);
        return true;
    } catch (error) {
        console.error('Failed to preload images:', error);
        return false;
    }
}

/**
 * Get image quality indicator based on resolution and cloud cover
 */
export function getImageQuality(imagery) {
    if (!imagery) return 'unknown';

    const resolution = parseFloat(imagery.resolution);
    const cloudCover = imagery.cloudCover;

    if (resolution <= 1 && cloudCover < 5) return 'excellent';
    if (resolution <= 10 && cloudCover < 10) return 'good';
    if (resolution <= 30 && cloudCover < 20) return 'fair';
    return 'poor';
}

/**
 * Format satellite source for display
 */
export function formatSatelliteSource(source) {
    const sources = {
        'Sentinel-2': 'ESA Sentinel-2 (Copernicus)',
        'Landsat-8': 'NASA/USGS Landsat-8',
        'Maxar WorldView-2': 'Maxar WorldView-2',
        'Maxar WorldView-3': 'Maxar WorldView-3',
        'NOAA GOES-16': 'NOAA GOES-16',
        'Himawari-8': 'JMA Himawari-8'
    };

    return sources[source] || source;
}
