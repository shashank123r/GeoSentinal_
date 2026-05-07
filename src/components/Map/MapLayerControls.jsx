/**
 * Map Layer Controls Component
 * Toggle switches for base layer, heatmap, polygons, markers, and clustering
 */

import { useState } from 'react';
import { Layers, Map, Flame, Box, Maximize2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MapLayerControls({
    baseLayer,
    onBaseLayerChange,
    showHeatmap,
    onHeatmapToggle,
    showPolygons,
    onPolygonsToggle,
    showMarkers,
    onMarkersToggle,
    enableClustering,
    onClusteringToggle
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="absolute top-4 right-4 z-[1000]">
            <motion.div
                className="glass-dark rounded-xl overflow-hidden border border-slate-700"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                {/* Header */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        <span className="font-semibold text-white text-sm">Map Layers</span>
                    </div>
                    {isCollapsed ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                    )}
                </button>

                {/* Controls */}
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-slate-700"
                        >
                            <div className="p-4 space-y-3">
                                {/* Base Layer */}
                                <div>
                                    <label className="block text-xs text-slate-400 mb-2">Base Map</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onBaseLayerChange('street')}
                                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${baseLayer === 'street'
                                                    ? 'bg-cyan-500 text-white'
                                                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                                                }`}
                                        >
                                            <Map className="w-3 h-3 mx-auto mb-1" />
                                            Street
                                        </button>
                                        <button
                                            onClick={() => onBaseLayerChange('satellite')}
                                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${baseLayer === 'satellite'
                                                    ? 'bg-cyan-500 text-white'
                                                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                                                }`}
                                        >
                                            <Maximize2 className="w-3 h-3 mx-auto mb-1" />
                                            Satellite
                                        </button>
                                    </div>
                                </div>

                                {/* Feature Toggles */}
                                <div className="space-y-2">
                                    <ToggleSwitch
                                        icon={<Flame className="w-3 h-3" />}
                                        label="Damage Heatmap"
                                        checked={showHeatmap}
                                        onChange={onHeatmapToggle}
                                    />
                                    <ToggleSwitch
                                        icon={<Box className="w-3 h-3" />}
                                        label="Affected Areas"
                                        checked={showPolygons}
                                        onChange={onPolygonsToggle}
                                    />
                                    <ToggleSwitch
                                        icon={<Map className="w-3 h-3" />}
                                        label="Disaster Markers"
                                        checked={showMarkers}
                                        onChange={onMarkersToggle}
                                    />
                                    <ToggleSwitch
                                        icon={<Layers className="w-3 h-3" />}
                                        label="Marker Clustering"
                                        checked={enableClustering}
                                        onChange={onClusteringToggle}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

function ToggleSwitch({ icon, label, checked, onChange }) {
    return (
        <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-2">
                <span className="text-slate-400 group-hover:text-cyan-400 transition-colors">
                    {icon}
                </span>
                <span className="text-xs text-white">{label}</span>
            </div>
            <div
                onClick={(e) => {
                    e.preventDefault();
                    onChange(!checked);
                }}
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${checked ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
            >
                <motion.div
                    className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full"
                    animate={{ x: checked ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            </div>
        </label>
    );
}
