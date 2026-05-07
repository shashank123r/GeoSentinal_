import { useState } from 'react';
import { motion } from 'framer-motion';
import { Map as MapIcon, Grid3X3 } from 'lucide-react';
import LocationSelector from '../Map/LocationSelector';
import DisasterBrowser from '../UI/DisasterBrowser';

export default function MapSection({ onDisasterSelect }) {
    const [activeView, setActiveView] = useState('map'); // 'map' or 'browser'

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-5xl font-bold font-display mb-4">
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Explore Disasters
                        </span>
                    </h2>
                    <p className="text-xl text-slate-300 mb-6">
                        Select any disaster location to view satellite imagery comparison
                    </p>

                    {/* View toggle */}
                    <div className="inline-flex gap-2 glass-dark rounded-full p-1">
                        <button
                            onClick={() => setActiveView('map')}
                            className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${activeView === 'map'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <MapIcon className="w-4 h-4" />
                            Map View
                        </button>
                        <button
                            onClick={() => setActiveView('browser')}
                            className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${activeView === 'browser'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <Grid3X3 className="w-4 h-4" />
                            Browse All
                        </button>
                    </div>
                </motion.div>

                {/* Content */}
                <motion.div
                    className="glass-dark rounded-2xl overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ minHeight: activeView === 'map' ? '700px' : 'auto' }}
                >
                    {activeView === 'map' ? (
                        <div className="h-[700px] w-full relative">
                            <LocationSelector onDisasterSelect={onDisasterSelect} />
                        </div>
                    ) : (
                        <div className="p-6">
                            <DisasterBrowser onDisasterSelect={onDisasterSelect} />
                        </div>
                    )}
                </motion.div>

                {/* Info cards */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="glass-dark rounded-xl p-6">
                        <div className="text-3xl mb-3">🌍</div>
                        <h3 className="font-bold text-lg mb-2">Global Coverage</h3>
                        <p className="text-sm text-slate-400">
                            Explore disasters from 15+ countries across all continents with real satellite imagery
                        </p>
                    </div>
                    <div className="glass-dark rounded-xl p-6">
                        <div className="text-3xl mb-3">🛰️</div>
                        <h3 className="font-bold text-lg mb-2">Satellite Data</h3>
                        <p className="text-sm text-slate-400">
                            High-resolution imagery from Sentinel-2, Landsat-8, and commercial satellites
                        </p>
                    </div>
                    <div className="glass-dark rounded-xl p-6">
                        <div className="text-3xl mb-3">📊</div>
                        <h3 className="font-bold text-lg mb-2">Detailed Analysis</h3>
                        <p className="text-sm text-slate-400">
                            View comprehensive damage assessments, casualties, and economic impact data
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
