import { motion } from 'framer-motion';
import LocationSelector from '../Map/LocationSelector';

export default function InteractiveMapSection({ onDisasterSelect }) {
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
                            Interactive Map
                        </span>
                    </h2>
                    <p className="text-xl text-slate-300 mb-6">
                        Select any disaster location on the map to view satellite imagery
                    </p>
                </motion.div>

                {/* Map */}
                <motion.div
                    className="glass-dark rounded-2xl overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ minHeight: '600px' }}
                >
                    <div className="h-[600px]">
                        <LocationSelector onDisasterSelect={onDisasterSelect} />
                    </div>
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
                            Explore disasters from 15+ countries across all continents
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
                        <div className="text-3xl mb-3">🗺️</div>
                        <h3 className="font-bold text-lg mb-2">Location Search</h3>
                        <p className="text-sm text-slate-400">
                            Search for any location worldwide and filter disasters by type and severity
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
