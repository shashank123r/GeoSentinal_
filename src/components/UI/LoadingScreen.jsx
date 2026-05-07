import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Initializing satellite systems...');

    useEffect(() => {
        const texts = [
            'Initializing satellite systems...',
            'Connecting to data sources...',
            'Loading AI models...',
            'Preparing analysis tools...',
            'Ready to launch!'
        ];

        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + 2;

                // Update loading text based on progress
                if (newProgress >= 20 && newProgress < 40) setLoadingText(texts[1]);
                else if (newProgress >= 40 && newProgress < 60) setLoadingText(texts[2]);
                else if (newProgress >= 60 && newProgress < 80) setLoadingText(texts[3]);
                else if (newProgress >= 80) setLoadingText(texts[4]);

                if (newProgress >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                return newProgress;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
            {/* Animated background particles */}
            <div className="absolute inset-0">
                {[...Array(100)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -50, 0],
                            opacity: [0.2, 0.8, 0.2],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10">
                {/* Animated Globe */}
                <div className="relative flex items-center justify-center mb-16">
                    <motion.div
                        className="relative w-64 h-64"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        {/* Globe rings */}
                        <div className="absolute inset-0 rounded-full border-4 border-blue-500/30" />
                        <div className="absolute inset-4 rounded-full border-4 border-blue-400/20" />
                        <div className="absolute inset-8 rounded-full border-4 border-blue-300/10" />
                        <div className="absolute inset-12 rounded-full border-2 border-cyan-400/20" />

                        {/* Orbiting satellites */}
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-3 h-3 rounded-full"
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    background: `linear-gradient(135deg, ${i % 2 === 0 ? '#3b82f6' : '#06b6d4'
                                        }, ${i % 2 === 0 ? '#06b6d4' : '#3b82f6'})`,
                                    boxShadow: `0 0 10px ${i % 2 === 0 ? '#3b82f6' : '#06b6d4'}`,
                                }}
                                animate={{
                                    rotate: [i * 45, i * 45 + 360],
                                    scale: [1, 1.3, 1],
                                    opacity: [0.6, 1, 0.6],
                                }}
                                transition={{
                                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 2, repeat: Infinity, delay: i * 0.2 },
                                    opacity: { duration: 2, repeat: Infinity, delay: i * 0.2 },
                                }}
                            />
                        ))}

                        {/* Pulse rings */}
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={`pulse-${i}`}
                                className="absolute inset-0 rounded-full border-2 border-cyan-400/40"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{
                                    scale: [0.8, 1.5, 2],
                                    opacity: [0, 0.5, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: i * 1,
                                }}
                            />
                        ))}
                    </motion.div>

                    {/* Center satellite icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            className="text-7xl filter drop-shadow-lg"
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                scale: { duration: 2, repeat: Infinity },
                                rotate: { duration: 4, repeat: Infinity },
                            }}
                        >
                            🛰️
                        </motion.div>
                    </div>
                </div>

                {/* Loading text and progress */}
                <div className="text-center px-4 max-w-md mx-auto">
                    <motion.h2
                        className="text-6xl font-bold text-white mb-4 font-display bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent"
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        GeoSentinal
                    </motion.h2>

                    <motion.p
                        className="text-blue-300 mb-8 text-lg"
                        key={loadingText}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {loadingText}
                    </motion.p>

                    {/* Progress bar */}
                    <div className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-full"
                            style={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="absolute inset-0 shimmer" />
                        </motion.div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                        <p className="text-slate-400 text-sm font-mono">{progress}%</p>
                        <motion.div
                            className="flex gap-1"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-2 h-2 bg-cyan-400 rounded-full"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </motion.div>
    );
}
