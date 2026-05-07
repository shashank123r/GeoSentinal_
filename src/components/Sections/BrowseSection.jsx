import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import DisasterBrowser from '../UI/DisasterBrowser';

export default function BrowseSection({ onDisasterSelect, disasterTypeFilter, onClearFilter }) {
    const getFilterLabel = (type) => {
        const labels = {
            fire: 'Wildfires',
            hurricane: 'Hurricanes',
            flood: 'Floods',
            earthquake: 'Earthquakes',
            cyclone: 'Cyclones',
            landslide: 'Landslides'
        };
        return labels[type] || type;
    };

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
                            Browse Disasters
                        </span>
                    </h2>
                    <p className="text-xl text-slate-300 mb-6">
                        Explore all disasters with advanced filtering and search
                    </p>

                    {/* Active Filter Indicator */}
                    {disasterTypeFilter && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-full"
                        >
                            <span className="text-cyan-400">
                                Showing: {getFilterLabel(disasterTypeFilter)}
                            </span>
                            <button
                                onClick={onClearFilter}
                                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                title="Clear filter"
                            >
                                <X className="w-4 h-4 text-cyan-400" />
                            </button>
                        </motion.div>
                    )}
                </motion.div>

                {/* Browser */}
                <motion.div
                    className="glass-dark rounded-2xl overflow-hidden p-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <DisasterBrowser
                        onDisasterSelect={onDisasterSelect}
                        externalTypeFilter={disasterTypeFilter}
                    />
                </motion.div>

                {/* Info cards */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="glass-dark rounded-xl p-6">
                        <div className="text-3xl mb-3">🔍</div>
                        <h3 className="font-bold text-lg mb-2">Advanced Search</h3>
                        <p className="text-sm text-slate-400">
                            Search by name, location, or country with real-time filtering
                        </p>
                    </div>
                    <div className="glass-dark rounded-xl p-6">
                        <div className="text-3xl mb-3">📊</div>
                        <h3 className="font-bold text-lg mb-2">Detailed Stats</h3>
                        <p className="text-sm text-slate-400">
                            View comprehensive statistics including casualties, displacement, and economic impact
                        </p>
                    </div>
                    <div className="glass-dark rounded-xl p-6">
                        <div className="text-3xl mb-3">🎯</div>
                        <h3 className="font-bold text-lg mb-2">Smart Filtering</h3>
                        <p className="text-sm text-slate-400">
                            Filter by disaster type, severity, country, and date range
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

