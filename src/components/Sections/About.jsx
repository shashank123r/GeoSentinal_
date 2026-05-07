import { motion } from 'framer-motion';
import { Github, Mail, Globe } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-[50vh] flex items-center justify-center px-4 py-20 bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="max-w-6xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* About */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-6 font-display">About GeoSentinal</h2>
                        <p className="text-slate-300 mb-6">
                            Advanced disaster analysis platform using cutting-edge AI and satellite imagery
                            to provide rapid, accurate damage assessment for emergency response teams worldwide.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                                <span className="text-slate-300">AI-Powered Analysis</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                                <span className="text-slate-300">Real-time Satellite Data</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                                <span className="text-slate-300">No API Keys Required</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Technology Stack */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-6 font-display">Technology Stack</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                'React 18',
                                'Vite',
                                'Tailwind CSS',
                                'Framer Motion',
                                'Chart.js',
                                'Leaflet.js',
                                'TensorFlow.js',
                                'Lucide Icons',
                            ].map((tech, i) => (
                                <div
                                    key={i}
                                    className="glass-dark rounded-lg p-3 text-center text-sm hover:bg-white/10 transition-colors"
                                >
                                    {tech}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Footer */}
                <motion.div
                    className="mt-16 pt-8 border-t border-white/10 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="flex justify-center gap-6 mb-6">
                        <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                            <Github className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                            <Mail className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                            <Globe className="w-6 h-6" />
                        </a>
                    </div>
                    <p className="text-slate-400 text-sm">
                        © 2024 GeoSentinal. Built with ❤️ for disaster response and humanitarian aid.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
