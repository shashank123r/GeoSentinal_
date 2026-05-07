import { motion } from 'framer-motion';
import { ChevronDown, Zap, Globe, BarChart3, Map } from 'lucide-react';

export default function Hero({ scrollToSection }) {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
                {/* Animated grid */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                    }} />
                </div>

                {/* Floating particles */}
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 0.8, 0.3],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}

                {/* Glowing orbs */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Main heading */}
                    <motion.h1
                        className="text-7xl md:text-8xl lg:text-9xl font-bold mb-6 font-display"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                            GeoSentinal
                        </span>
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p
                        className="text-2xl md:text-3xl lg:text-4xl text-blue-200 mb-4 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        AI-Powered Satellite Analysis for Natural Disasters
                    </motion.p>

                    {/* Subtitle */}
                    <motion.p
                        className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Compare before and after. Detect damage instantly. Visualize global impact.
                    </motion.p>

                    {/* CTA Button */}
                    <motion.button
                        onClick={() => scrollToSection('disasters')}
                        className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white font-semibold text-lg shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70 transition-all inline-flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <Zap className="w-5 h-5" />
                        Explore Analysis
                        <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                    </motion.button>

                    {/* Statistics and Features - Unified Grid */}
                    <motion.div
                        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                    >
                        {[
                            {
                                icon: Globe,
                                label: '6 Disaster Types',
                                color: 'text-blue-400',
                                stat: '247+',
                                statLabel: 'Disasters Analyzed'
                            },
                            {
                                icon: Zap,
                                label: 'AI Analysis',
                                color: 'text-cyan-400',
                                stat: '45',
                                statLabel: 'Countries Covered'
                            },
                            {
                                icon: BarChart3,
                                label: 'Real-time Stats',
                                color: 'text-purple-400',
                                stat: '94.7%',
                                statLabel: 'AI Accuracy'
                            },
                            {
                                icon: Map,
                                label: 'Interactive Maps',
                                color: 'text-pink-400',
                                stat: '12.4K',
                                statLabel: 'Images Processed'
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className="flex flex-col items-center gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 + (i * 0.1) }}
                            >
                                {/* Statistic */}
                                <motion.div
                                    className="text-center"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <div className="text-3xl md:text-4xl font-bold text-cyan-400 font-display">
                                        {item.stat}
                                    </div>
                                    <div className="text-xs md:text-sm text-slate-400 mt-1">
                                        {item.statLabel}
                                    </div>
                                </motion.div>

                                {/* Feature Card */}
                                <motion.div
                                    className="glass-dark rounded-xl p-4 hover:bg-white/10 transition-colors w-full"
                                    whileHover={{ y: -5 }}
                                >
                                    <item.icon className={`w-8 h-8 ${item.color} mx-auto mb-2`} />
                                    <p className="text-sm text-slate-300 text-center">{item.label}</p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                onClick={() => scrollToSection('disasters')}
            >
                <ChevronDown className="w-8 h-8 text-blue-400" />
            </motion.div>
        </div>
    );
}
