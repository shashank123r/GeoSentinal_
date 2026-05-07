import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { ZoomIn, ZoomOut, RotateCcw, Loader2, SplitSquareHorizontal, Grid2X2, MapPin, Calendar, AlertTriangle, Users, DollarSign, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getDisasterColor, formatDate } from '../../utils/dataService';
import { getSatelliteImagery, formatSatelliteSource, getImageQuality } from '../../data/satelliteImagery';
import { formatCoordinates } from '../../utils/locationService';
import { getImageUrl, analyzeDisaster } from '../../utils/api';
import disastersData from '../../data/disasters.json';

export default function Comparison({ scrollToSection, selectedDisasterData }) {
    const { selectedDisaster, runAnalysis, isAnalyzing, analysisResults } = useApp();
    const [zoom, setZoom] = useState(1);
    const [viewMode, setViewMode] = useState('slider'); // 'slider' or 'sidebyside'
    const [showInfo, setShowInfo] = useState(true);
    const containerRef = useRef(null);

    // Handle both location data (from Browse) and disaster data (from DisasterSelection)
    const isLocationData = selectedDisasterData?.disaster_name !== undefined;

    // Get the full disaster data or use location data
    let disaster;
    if (isLocationData) {
        // Location data from Browse section - use the enriched data directly
        disaster = {
            ...selectedDisasterData,
            name: selectedDisasterData.name,
            type: selectedDisasterData.type,
            severity: selectedDisasterData.severity,
            location: selectedDisasterData.location,
            country: selectedDisasterData.country,
            date: selectedDisasterData.date,
            coordinates: selectedDisasterData.coordinates,
            // Use actual values from the enriched location data
            casualties: selectedDisasterData.casualties || 0,
            displaced: selectedDisasterData.displaced || 0,
            economicLoss: selectedDisasterData.economicLoss || 0,
            affectedArea: selectedDisasterData.affectedArea || 0,
            damage: selectedDisasterData.damage || { buildings: 0, roads: 0, vegetation: 0, waterBodies: 0 },
            description: selectedDisasterData.description || `Satellite imagery analysis for ${selectedDisasterData.name}`,
            xbd_data: selectedDisasterData.xbd_data || {
                disaster_name: selectedDisasterData.disaster_name,
                image_id: selectedDisasterData.image_id
            }
        };
    } else {
        // Regular disaster data from DisasterSelection
        disaster = selectedDisasterData || disastersData.disasters.find(d => d.type === selectedDisaster?.id);
    }

    if (!selectedDisaster || !disaster) {
        return null;
    }

    // Get disaster name and image ID from xBD data
    const disasterName = disaster.xbd_data?.disaster_name || disaster.disaster_name || 'guatemala-volcano';
    const imageId = disaster.xbd_data?.image_id || disaster.image_id;

    // Use API endpoints for images - use specific image if image_id is available
    const beforeImage = imageId
        ? `http://localhost:5000/api/images/${disasterName}/before?image_id=${imageId}`
        : getImageUrl(disasterName, 'before');
    const afterImage = imageId
        ? `http://localhost:5000/api/images/${disasterName}/after?image_id=${imageId}`
        : getImageUrl(disasterName, 'after');

    const imagery = getSatelliteImagery(disaster.id);
    const disasterColor = getDisasterColor(disaster.type);
    const imageQuality = getImageQuality(imagery);

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.2, 3));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.2, 1));
    };

    const handleResetZoom = () => {
        setZoom(1);
    };

    const handleRunAnalysis = async () => {
        // Use the new runAnalysis from context
        await runAnalysis(disasterName, 0);
        // Navigate to analysis section after completion
        setTimeout(() => scrollToSection('analysis'), 300);
    };

    const handleViewFullAnalytics = () => {
        scrollToSection('analysis');
    };

    const getSeverityColor = (severity) => {
        const colors = {
            critical: 'text-red-500',
            high: 'text-orange-500',
            medium: 'text-yellow-500',
            low: 'text-green-500'
        };
        return colors[severity] || 'text-slate-400';
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="max-w-7xl mx-auto w-full">
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                            style={{ backgroundColor: `${disasterColor}20`, border: `2px solid ${disasterColor}` }}
                        >
                            {selectedDisaster.icon}
                        </div>
                        <h2 className="text-5xl font-bold font-display">
                            Before/After Comparison
                        </h2>
                    </div>
                    <p className="text-xl text-slate-300">
                        {disaster.name} - Satellite Imagery Analysis
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Main comparison viewer */}
                    <motion.div
                        className={`glass-dark rounded-2xl p-6 ${showInfo ? 'lg:col-span-2' : 'lg:col-span-3'}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="flex flex-wrap items-center justify-between mb-4 pb-4 border-b border-white/10 gap-4">
                            <div className="flex items-center gap-6 text-sm flex-wrap">
                                <div>
                                    <span className="text-slate-400">Location:</span>
                                    <span className="ml-2 font-semibold">{disaster.location}, {disaster.country}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">Date:</span>
                                    <span className="ml-2 font-semibold">{formatDate(disaster.date)}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">Resolution:</span>
                                    <span className="ml-2 font-semibold">{imagery?.resolution || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* View mode toggle */}
                                <button
                                    onClick={() => setViewMode(viewMode === 'slider' ? 'sidebyside' : 'slider')}
                                    className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                                    title={viewMode === 'slider' ? 'Side by Side View' : 'Slider View'}
                                >
                                    {viewMode === 'slider' ? <Grid2X2 className="w-4 h-4" /> : <SplitSquareHorizontal className="w-4 h-4" />}
                                </button>

                                {/* Zoom controls */}
                                <button
                                    onClick={handleZoomOut}
                                    disabled={zoom <= 1}
                                    className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Zoom Out"
                                >
                                    <ZoomOut className="w-4 h-4" />
                                </button>
                                <span className="text-sm font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
                                <button
                                    onClick={handleZoomIn}
                                    disabled={zoom >= 3}
                                    className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Zoom In"
                                >
                                    <ZoomIn className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleResetZoom}
                                    className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                                    title="Reset Zoom"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Image comparison */}
                        <div
                            ref={containerRef}
                            className="relative rounded-xl overflow-hidden bg-slate-800"
                            style={{
                                height: '500px',
                                transform: `scale(${zoom})`,
                                transformOrigin: 'center',
                                transition: 'transform 0.3s ease',
                            }}
                        >
                            {viewMode === 'slider' ? (
                                <ReactCompareSlider
                                    itemOne={
                                        <ReactCompareSliderImage
                                            src={beforeImage || imagery?.before || ''}
                                            alt="Before disaster"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    }
                                    itemTwo={
                                        <ReactCompareSliderImage
                                            src={afterImage || imagery?.after || ''}
                                            alt="After disaster"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    }
                                    position={50}
                                    style={{ height: '100%', width: '100%' }}
                                />
                            ) : (
                                <div className="grid grid-cols-2 h-full">
                                    <div className="relative">
                                        <img src={beforeImage || imagery?.before} alt="Before" className="w-full h-full object-cover" />
                                        <div className="absolute top-4 left-4 bg-blue-500/90 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold">
                                            BEFORE
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <img src={afterImage || imagery?.after} alt="After" className="w-full h-full object-cover" />
                                        <div className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold">
                                            AFTER
                                        </div>
                                    </div>
                                </div>
                            )}

                            {viewMode === 'slider' && (
                                <>
                                    <div className="absolute top-4 left-4 bg-blue-500/90 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold">
                                        BEFORE
                                    </div>
                                    <div className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold">
                                        AFTER
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Satellite metadata */}
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="glass rounded-lg p-3">
                                <div className="text-slate-400 mb-1">Source</div>
                                <div className="font-semibold text-xs">{formatSatelliteSource(imagery?.source || 'Unknown')}</div>
                            </div>
                            <div className="glass rounded-lg p-3">
                                <div className="text-slate-400 mb-1">Coordinates</div>
                                <div className="font-semibold font-mono text-xs">
                                    {formatCoordinates(disaster.coordinates[0], disaster.coordinates[1])}
                                </div>
                            </div>
                            <div className="glass rounded-lg p-3">
                                <div className="text-slate-400 mb-1">Cloud Cover</div>
                                <div className="font-semibold">{imagery?.cloudCover || 0}%</div>
                            </div>
                            <div className="glass rounded-lg p-3">
                                <div className="text-slate-400 mb-1">Image Quality</div>
                                <div className={`font-semibold capitalize ${imageQuality === 'excellent' ? 'text-green-400' :
                                    imageQuality === 'good' ? 'text-cyan-400' :
                                        imageQuality === 'fair' ? 'text-yellow-400' : 'text-orange-400'
                                    }`}>
                                    {imageQuality}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Disaster information panel */}
                    <AnimatePresence>
                        {showInfo && (
                            <motion.div
                                className="glass-dark rounded-2xl p-6 lg:col-span-1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold">Disaster Details</h3>
                                    <button
                                        onClick={() => setShowInfo(false)}
                                        className="lg:hidden p-1 hover:bg-white/10 rounded"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* Severity */}
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className={`w-5 h-5 mt-0.5 ${getSeverityColor(disaster.severity)}`} />
                                        <div className="flex-1">
                                            <div className="text-sm text-slate-400">Severity</div>
                                            <div className={`font-semibold capitalize ${getSeverityColor(disaster.severity)}`}>
                                                {disaster.severity}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Casualties */}
                                    <div className="flex items-start gap-3">
                                        <Users className="w-5 h-5 mt-0.5 text-red-400" />
                                        <div className="flex-1">
                                            <div className="text-sm text-slate-400">Casualties</div>
                                            <div className="font-semibold">{disaster.casualties.toLocaleString()}</div>
                                        </div>
                                    </div>

                                    {/* Displaced */}
                                    <div className="flex items-start gap-3">
                                        <Users className="w-5 h-5 mt-0.5 text-orange-400" />
                                        <div className="flex-1">
                                            <div className="text-sm text-slate-400">Displaced</div>
                                            <div className="font-semibold">{disaster.displaced.toLocaleString()}</div>
                                        </div>
                                    </div>

                                    {/* Economic Loss */}
                                    <div className="flex items-start gap-3">
                                        <DollarSign className="w-5 h-5 mt-0.5 text-green-400" />
                                        <div className="flex-1">
                                            <div className="text-sm text-slate-400">Economic Loss</div>
                                            <div className="font-semibold">${disaster.economicLoss}B USD</div>
                                        </div>
                                    </div>

                                    {/* Affected Area */}
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 mt-0.5 text-cyan-400" />
                                        <div className="flex-1">
                                            <div className="text-sm text-slate-400">Affected Area</div>
                                            <div className="font-semibold">{disaster.affectedArea.toLocaleString()} km²</div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="pt-4 border-t border-white/10">
                                        <div className="text-sm text-slate-400 mb-2">Description</div>
                                        <p className="text-sm text-slate-300 leading-relaxed">
                                            {disaster.description}
                                        </p>
                                    </div>

                                    {/* Damage breakdown */}
                                    <div className="pt-4 border-t border-white/10">
                                        <div className="text-sm text-slate-400 mb-3">Damage Assessment</div>
                                        <div className="space-y-2">
                                            {Object.entries(disaster.damage).map(([key, value]) => (
                                                <div key={key}>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="capitalize">{key}</span>
                                                        <span className="font-semibold">{value}%</span>
                                                    </div>
                                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                                            style={{ width: `${value}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Action buttons */}
                <div className="flex justify-center gap-4">
                    {!showInfo && (
                        <motion.button
                            onClick={() => setShowInfo(true)}
                            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-full text-white font-semibold transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Show Details
                        </motion.button>
                    )}

                    <motion.button
                        onClick={handleRunAnalysis}
                        disabled={isAnalyzing}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white font-semibold text-lg shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                        whileHover={{ scale: isAnalyzing ? 1 : 1.05 }}
                        whileTap={{ scale: isAnalyzing ? 1 : 0.95 }}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                🤖 Run AI Analysis (SiamUnet)
                            </>
                        )}
                    </motion.button>

                    {analysisResults && (
                        <motion.button
                            onClick={handleViewFullAnalytics}
                            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold text-lg shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 transition-all flex items-center gap-3"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            📊 View Full Analytics
                        </motion.button>
                    )}
                </div>

                {isAnalyzing && (
                    <motion.div
                        className="mt-6 glass-dark rounded-xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="text-center">
                            <div className="mb-4">
                                <Loader2 className="w-12 h-12 animate-spin mx-auto text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Processing Satellite Imagery</h3>
                            <p className="text-slate-400 mb-4">AI model is analyzing changes...</p>

                            <div className="max-w-md mx-auto">
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                        initial={{ width: '0%' }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 3 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    className="mt-8 text-center text-sm text-slate-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <p>💡 {viewMode === 'slider' ? 'Drag the slider to compare before and after images' : 'Compare images side by side'}</p>
                    <p className="mt-1">Use zoom controls for detailed inspection</p>
                </motion.div>
            </div>
        </div >
    );
}
