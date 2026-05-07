import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

export default function DisasterSelection({ scrollToSection, onDisasterTypeSelect }) {
    const { setSelectedDisaster } = useApp();

    const disasters = [
        {
            id: 'flood',
            name: 'Flood',
            icon: '🌊',
            description: 'Analyze flooding events and water level changes',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
        },
        {
            id: 'earthquake',
            name: 'Earthquake',
            icon: '🏚️',
            description: 'Assess structural damage and infrastructure impact',
            color: 'from-amber-700 to-orange-600',
            bgColor: 'bg-amber-700/10',
        },
        {
            id: 'landslide',
            name: 'Landslide',
            icon: '⛰️',
            description: 'Track terrain changes and slope failures',
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-500/10',
        },
        {
            id: 'fire',
            name: 'Wildfire',
            icon: '🔥',
            description: 'Detect burn areas and vegetation loss',
            color: 'from-red-500 to-pink-500',
            bgColor: 'bg-red-500/10',
        },
        {
            id: 'cyclone',
            name: 'Cyclone',
            icon: '🌀',
            description: 'Analyze cyclone paths and coastal flooding',
            color: 'from-cyan-500 to-blue-500',
            bgColor: 'bg-cyan-500/10',
        },
        {
            id: 'hurricane',
            name: 'Hurricane',
            icon: '⛈️',
            description: 'Monitor severe weather and storm surge effects',
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-500/10',
        },
    ];

    const handleSelect = (disaster) => {
        setSelectedDisaster(disaster);
        // Call the new handler to filter Browse Disasters section
        if (onDisasterTypeSelect) {
            onDisasterTypeSelect(disaster.id);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="max-w-7xl mx-auto w-full">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-5xl md:text-6xl font-bold mb-4 font-display bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Choose Disaster Type
                    </h2>
                    <p className="text-xl text-slate-300">
                        Select from major natural disasters worldwide
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {disasters.map((disaster, index) => (
                        <motion.div
                            key={disaster.id}
                            className={`relative group cursor-pointer rounded-2xl overflow-hidden ${disaster.bgColor} border border-white/10 hover:border-white/30 transition-all`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -10 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSelect(disaster)}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${disaster.color} opacity-0 group-hover:opacity-20 transition-opacity`} />

                            <div className="relative p-8">
                                <div className="text-6xl mb-4">{disaster.icon}</div>
                                <h3 className="text-2xl font-bold mb-2 font-display">{disaster.name}</h3>
                                <p className="text-slate-300 text-sm">{disaster.description}</p>

                                <div className="mt-6 flex items-center text-cyan-400 font-medium">
                                    <span>Browse Disasters</span>
                                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

